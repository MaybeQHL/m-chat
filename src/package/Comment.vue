<template>
  <div class="m-chat-comment" ref="mChatComment">
    <div class="m-chat-comment-wrap">
      <div class="m-chat-comment-main">
        <div class="m-chat-main-left">
          <!-- <slot name="left"></slot> -->
          <van-icon class-prefix="my-icon" name="yuyin" class="c-icon comment-icon" @click="togglePanel('audio')"
            v-if="currentType == 'text' && includes(openBases, 'audio')" />
          <van-icon class-prefix="my-icon" name="jianpan" class="c-icon comment-icon" @click="togglePanel('text')"
            v-if="currentType == 'audio' && includes(openBases, 'text')" />
        </div>
        <div class="m-chat-record" v-show="currentType == 'audio'" ref="mChatRecord">
          <span v-if="recordStatus == 0">按住开始录音</span>
          <span v-if="recordStatus == 1">松开 发送</span>
          <span v-if="recordStatus == 2">松开 取消</span>
        </div>
        <form class="m-chat-form" v-show="currentType == 'text'" @submit.prevent="submit">
          <input ref="mChatInput" class="m-chat-input" @focus="onFocus" @blur="onBlur" v-model="content" @input="onChange"
            type="text" :placeholder="placeholder" />
        </form>
        <div class="m-chat-input-options comment-icon">
          <van-icon size="8vw" class="c-icon" name="smile-o" v-if="includes(openBases, 'emoji')" @click="emojiClick" />
          <!-- <van-icon class="c-icon" size="8vw" name="photo-o" /> -->
          <slot name="right"></slot>
          <van-icon class="c-icon" size="8vw" name="add-o" @click="toggleExtend"
            v-if="!isSubmitBtn && mOpenExtends.length > 0" />
          <transition name="move">
            <button v-if="isSubmitBtn" @click="submit" class="submit-btn">
              发送
            </button>
          </transition>
        </div>
      </div>
      <div class="m-chat-comment-extend" ref="mChatCommnetExtend" v-show="isExtend">
        <div class="m-chat-emoji" v-if="isEmoji">
          <div class="m-chat-emoji-item" v-for="(item, index) in emojiList" :key="index"
            @click="emojiItemClick($event, item)">
            {{ item.char }}
          </div>
        </div>
        <div class="m-chat-grid" v-else>
          <slot name="extend" v-if="$slots.extend"></slot>
          <template v-else>
            <div class="m-chat-grid-item" v-for="(item, index) in mExtendList" :key="index"
              v-if="includes(mOpenExtends, item.type)">
              <div class="m-chat-grid_item_icon comment-extend-icon" @click="itemClick(item)">
                <van-icon :name="item.icon" :class-prefix="item.classPrefix" />
              </div>
              <div class="m-chat-grid_item_text comment-extend-text-color">
                {{ item.text }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="record-overlay" v-if="recordStatus != 0">
      <div class="record-1 record-item" v-if="recordStatus == 1">
        <vue-lottie :options="animOptions" width="20vw" height="20vw"></vue-lottie>
        <p>手指上划,取消发送</p>
      </div>
      <div class="record-2 record-item" v-if="recordStatus == 2">
        <img class="close-img" src=".//svg/close.svg" />
        <p class="text">松开取消发送录音</p>
      </div>
    </div>
    <van-uploader v-if="includes(mOpenExtends, 'image')" ref="mChatImgUploader" :after-read="imgAfterRead"
      :accept="joinAcceptArr(mConfig.image.accept)" :max-size="(mConfig.image.maxSize || imgMaxSize) * 1024"
      @oversize="onImgOversize" style="display: none" />
    <van-uploader v-if="includes(mOpenExtends, 'file')" ref="mChatFileUploader" :after-read="fileAfterRead"
      :max-size="(mConfig.file.maxSize || fileMaxSize) * 1024" @oversize="onFileOversize" style="display: none"
      :accept="joinAcceptArr(mConfig.file.accept)" />
    <van-uploader v-if="includes(mOpenExtends, 'video')" ref="mChatVideoUploader" :after-read="videoAfterRead"
      :max-size="(mConfig.video.maxSize || videoMaxSize) * 1024" @oversize="onVideoOversize" style="display: none"
      :accept="joinAcceptArr(mConfig.video.accept)" />
  </div>
</template>

<script>
import { Icon, Toast } from "vant";
import { Grid, GridItem, Uploader } from "vant";
import { isOutEl } from "./utils";
import VueLottie from "./VueLottie.vue";

//必须引入的核心，换成require也是一样的。注意：recorder-core会自动往window下挂载名称为Recorder对象，全局可调用window.Recorder，也许可自行调整相关源码清除全局污染
import Recorder from "recorder-core";

//需要使用到的音频格式编码引擎的js文件统统加载进来
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";

import merge from "lodash/merge";

export default {
  components: {
    [Icon.name]: Icon,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    VueLottie,
    [Uploader.name]: Uploader,
  },
  props: {
    config: {
      type: Object,
    },
    customRecord: Boolean,
    openExtends: {
      type: Array,
      default: function () {
        return ["image", "file", "video"];
      },
    },
    openBases: {
      type: Array,
      default: function () {
        return ["audio", "text", "emoji"];
      },
    },
    imgMaxSize: {
      type: Number,
      default: 500,
    },
    videoMaxSize: {
      type: Number,
      default: 500,
    },
    fileMaxSize: {
      type: Number,
      default: 500,
    },
    placeholder: {
      type: String
    }
  },
  data() {
    return {
      content: "",
      isExtend: false,
      currentType: "text",
      showAudio: false,
      recordStatus: 0, // 0 未录音 1 录音中 2 取消录音中
      animOptions: {
        animationData: require("./json/recording.json"),
        autoplay: true,
      },
      /**@type {Recorder} */
      rec: null,
      extendList: [
        {
          type: "image",
          text: "图片",
          icon: "photo-o",
        },
        {
          type: "video",
          text: "视频",
          icon: "video-o",
        },
        {
          type: "file",
          text: "文件",
          icon: "description",
        }
      ],
      emojiList: require("./json/emoji.json"),
      isEmoji: false,
      isSubmitBtn: false,
    };
  },
  computed: {
    mOpenExtends() {
      return [...this.openExtends, ...this.mConfig.openExtends]
    },
    mExtendList() {
      return [...this.extendList, ...this.mConfig.extendArr]
    },
    mConfig() {
      const baseConfig = {
        /**
         * 图片上传
         */
        image: {
          /**
           * 上传大小最大值(kb)
           */
          maxSize: 500,
          /**
           * 允许的文件类型
           */
          accept: ["image/*"],
        },
        /**
         * 文件上传
         */
        file: {
          maxSize: 500,
          accept: ["*"],
        },
        /**
         * 视频上传
         */
        video: {
          maxSize: 500,
          accept: ['video/*']
        },
        /**
         * 需显示的扩展面板item
         */
        openExtends: [],
        /**
         * 扩展面板定制额外的item
         * 注：需要在openExtends中配置type,例如type=custom openExtends=['custom']
         */
        extendArr: [],
      };
      const rconfig = merge(baseConfig, this.config);

      return rconfig;
    },
  },
  watch: {
    isExtend: {
      handler: function (val) {
        if (val) {
          // this.$refs.mChatComment.style.height = "26vh";
          // this.$refs.mChatComment.classList.add("position-relative");
        } else {
          // this.$refs.mChatComment.style.height = "8vh";
          // this.$refs.mChatComment.classList.remove("position-relative");
        }
        this.$parent.$emit("isExtend_initScoller", val);
      },
    },
    openBases: {
      handler: function () {
        if (
          !this.openBases.includes("text") &&
          this.openBases.includes("audio")
        ) {
          this.currentType = "audio";
        }
      },
      immediate: true,
    },
  },
  mounted() {
    // if (this.$refs.mChatRecord) {
    //   var hammer = new Hammer(this.$refs.mChatRecord);
    //   hammer.on("press", (e) => {
    //     console.log("You're pressing me!");
    //     console.log(e);
    //     this.recordStatus = 1;
    //   });
    //   hammer.on("pressup", (e) => {
    //     console.log("You're pressup me!");
    //     console.log(e);
    //     this.recordStatus = 0;
    //   });
    // }
    if (this.$refs.mChatRecord) {
      this.$refs.mChatRecord.addEventListener("touchstart", this.touchstart);
      this.$refs.mChatRecord.addEventListener("touchmove", this.touchmove);
      this.$refs.mChatRecord.addEventListener("touchend", this.touchend);
    }
  },
  beforeDestroy() {

    if (this.$refs.mChatRecord) {
      this.$refs.mChatRecord.removeEventListener("touchstart", this.touchstart);
      this.$refs.mChatRecord.removeEventListener("touchmove", this.touchmove);
      this.$refs.mChatRecord.removeEventListener("touchend", this.touchend);
    }

  },
  methods: {
    joinAcceptArr(arr) {
      return arr.join(",");
    },
    behindWord(event) {
      console.log(event);
      var e = event.srcElement;
      if (!e.createTextRange) return;
      var r = e.createTextRange();
      r.moveStart("character", e.value.length);
      r.collapse(true);
      r.select();
    },
    emojiItemClick($event, item) {
      this.content += item.char + " ";
      this.$refs.mChatInput.focus();
      this.isSubmitBtn = true;
    },
    onImgOversize(file) {
      console.log(file);
      Toast(`图片大小不能超过 ${this.imgMaxSize}kb`);
    },
    onVideoOversize(file) {
      console.log(file);
      Toast(`视频大小不能超过 ${this.videoMaxSize}kb`);
    },
    onFileOversize(file) {
      console.log(file);
      Toast(`文件大小不能超过 ${this.fileMaxSize}kb`);
    },
    togglePanel(type) {
      if (!this.openBases.includes(type)) return;
      switch (type) {
        case "text":
          this.currentType = type;
          break;
        case "audio":
          if (this.customRecord) {
            this.currentType = type;
          } else {
            this.recOpen(() => {
              this.currentType = type;
            });
          }
          break;
        default:
          break;
      }
      this.$emit("togglePanel", type);
    },
    includes(arr, item) {
      return arr.includes(item);
    },
    itemClick(item) {
      if (item.type == "image") {
        this.$refs.mChatImgUploader.chooseFile();
      }
      if (item.type == "file") {
        this.$refs.mChatFileUploader.chooseFile();
      }
      if (item.type == "video") {
        this.$refs.mChatVideoUploader.chooseFile();
      }
      this.$emit('extendItemClick', item)
    },
    imgAfterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);

      const acceptType = this.mConfig.image.accept;
      if (
        acceptType.includes("image/*") &&
        !file.file.type.includes("image/") &&
        !acceptType.includes(file.file.type)
      ) {
        Toast.fail("图片格式不支持上传");
        return;
      }

      this.$emit("imgAfterRead", file);
      this.$emit("submit", {
        type: "image",
        content: file,
      });
    },
    fileAfterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);

      const acceptType = this.mConfig.file.accept;
      if (!acceptType.includes("*") && !acceptType.includes(file.file.type)) {
        Toast.fail("文件格式不支持上传");
        return;
      }

      this.$emit("fileAfterRead", file);
      this.$emit("submit", {
        type: "file",
        content: file,
      });
    },
    videoAfterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
      const acceptType = this.mConfig.video.accept;
      if (
        acceptType.includes("video/*") &&
        !file.file.type.includes("video/") &&
        !acceptType.includes(file.file.type)
      ) {
        Toast.fail("视频格式不支持上传");
        return;
      }
      this.$emit("videoAfterRead", file);
      this.$emit("submit", {
        type: "video",
        content: file,
      });
    },
    recOpen(success) {
      this.rec = Recorder({
        type: "mp3",
        sampleRate: 16000,
        bitRate: 16, //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
        onProcess: function (
          buffers,
          powerLevel,
          bufferDuration,
          bufferSampleRate,
          newBufferIdx,
          asyncEnd
        ) {
          //录音实时回调，大约1秒调用12次本回调
          //可利用extensions/waveview.js扩展实时绘制波形
          //可利用extensions/sonic.js扩展实时变速变调，此扩展计算量巨大，onProcess需要返回true开启异步模式
        },
      });

      //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
      this.rec.open(
        function () {
          //打开麦克风授权获得相关资源
          //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
          //rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程

          success && success();
        },
        function (msg, isUserNotAllow) {
          //用户拒绝未授权或不支持
          //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
          let info =
            (isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg;
          Toast.fail(info);
          console.log(info);
        }
      );
    },
    touchstart(e) {
      e.preventDefault();
      // console.log("touchstart", e);
      this.recordStatus = 1;
      if (this.customRecord) {
        this.$emit("recordStart");
        console.log("recordStart", e);
      } else {
        this.recStart();
      }
    },
    touchmove(e) {
      e.preventDefault();
      // console.log("touchmove", e);
      if (isOutEl(e.changedTouches[0], this.$refs.mChatRecord)) {
        this.recordStatus = 2;
      } else {
        this.recordStatus = 1;
      }
    },
    touchend(e) {
      e.preventDefault();
      // 取消录音
      if (this.recordStatus == 2) {
        this.recordStatus = 0;
        if (this.customRecord) {
          this.$emit("recordCancel");
          console.log("recordCancel", e);
          return;
        }

        // 关闭录音，释放资源
        this.rec.close();
      }
      //  正常结束录音
      if (this.recordStatus == 1) {
        this.recordStatus = 0;
        if (this.customRecord) {
          this.$emit("recordStop");
          console.log("recordStop", e);
          return;
        }

        // 录音结束
        this.recStop();
      }
    },
    onFocus(event) {
      this.behindWord(event);
      if (!this.isEmoji) {
        this.isExtend = false;
      }
      // this.$refs.mChatComment &&
      //   this.$refs.mChatComment.classList.add("position-fixed");
      this.$emit("focus");
    },
    onBlur() {
      this.$refs.mChatComment &&
        this.$refs.mChatComment.classList.remove("position-fixed");
    },
    onChange() {
      // console.log(this.content);
      if (this.content) {
        this.isSubmitBtn = true;
      } else {
        this.isSubmitBtn = false;
      }
    },
    emojiClick() {
      // this.$emit("emojiClick");
      this.togglePanel("text");
      if (this.isExtend && !this.isEmoji) {
        this.isEmoji = true;
        return;
      }
      this.isEmoji = true;
      this.isExtend = !this.isExtend;
    },
    toggleExtend(flag) {
      // 自定义关闭扩展面板
      if (typeof flag == "boolean" && (flag != undefined || flag != null)) {
        this.isExtend = flag;
        return;
      }
      //  已经打开扩展面板情况下
      if (this.isExtend && this.isEmoji) {
        this.isEmoji = false;
        return;
      }
      this.isEmoji = false;
      this.isExtend = !this.isExtend;
      this.$emit("toggleExtend", flag);
    },
    onInput($e) {
      this.$emit("update:content", $e.target.value);
    },
    submit() {
      this.$emit("submit", {
        type: "text",
        content: this.content,
      });
      this.content = "";
      this.isExtend = false;
      this.isSubmitBtn = false;
      this.$refs.mChatInput.blur();
    },
    chooseEmjoy(item) {
      console.log(item);
      this.content += `[${item.name}]`;
    },
    changeRecord() {
      if (this.customRecord) {
        this.showAudio = true;
      } else {
        this.recOpen(() => {
          this.showAudio = true;
        });
      }
    },
    /**开始录音**/
    recStart() {
      this.rec.open(() => {
        //打开了录音后才能进行start、stop调用
        this.rec.start();
      });
    },
    /**结束录音**/
    recStop() {
      const self = this;
      this.rec.stop(
        function (blob, duration) {
          self.rec.close(); //释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
          // self.$emit("recordStop", { blob, duration, rec: self.rec });
          self.$emit("submit", {
            type: "audio",
            content: { blob, duration, rec: self.rec },
          });
          console.log(blob, duration, self.rec);
          // self.rec = null;
        },
        function (msg) {
          console.log("录音失败:" + msg, 1);
          self.rec.close(); //可以通过stop方法的第3个参数来自动调用close
          // self.rec = null;
        }
      );
    },
    toggleRecordStatus(status) {
      this.recordStatus = status;
    },
  },
};
</script>

<style lang="less" scoped>
.m-chat-comment {
  // position: fixed;
  // left: 0px;
  // bottom: 0px;
  // ....
  width: 100%;
  // display: flex;
  // flex-direction: column;
  background-color: #f7f7f7;
  box-sizing: content-box;
  // 避免ios出现uibug 加上相对定位
  position: relative;

  // height: 8vh;
  // padding: 2vw 0vw;
  .m-chat-comment-wrap {
    overflow: hidden;

    .m-chat-comment-main {
      display: flex;
      padding: 3vw 3vw;
      flex-flow: row nowrap;
      align-items: center;
      height: 8vw;
      box-sizing: content-box;
    }

    .m-chat-form {
      // height: 100%;
      flex: 1;
      display: flex;
      background-color: #fff;
    }

    .m-chat-input {
      width: 100%;
      // height: 5vw;
      border: none;
      // -webkit-appearance: none; /*去除阴影边框*/
      //   -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /*点击高亮的颜色*/
      outline: none;
      border-radius: 2vw;
      caret-color: #9eea6a;
      background-color: transparent;
      padding: 1.5vw 0px;
      margin: 0px 2vw;
      font-size: 4vw;
      height: 5vw;
      box-sizing: content-box;
    }

    .m-chat-comment-icon {
      // margin: 0px 1vw;
    }

    .m-chat-main-left,
    .m-chat-input-options {
      display: flex;
      align-items: center;
      padding: 0px 2vw;
    }
  }
}

.m-chat-div_input {
  flex: 1;
  background-color: #fff;
}

.m-chat-comment-extend {
  // height: 18vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4vw 3vw;
  height: 40vw;
}

.c-icon {
  width: 8vw;
  height: 8vw;
  margin: 0vw 0.8vw;
  color: inherit;
  font-size: 8vw;
}

.position-relative {
  position: relative;
}

.position-fixed {
  position: fixed;
  bottom: 0px;
  left: 0px;
}

.m-chat-record {
  flex: 1;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-size: 4vw;
  height: 100%;
}

.record-overlay {
  position: fixed;
  top: 49.5%;
  left: 49.5%;
  padding: 3vw;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 99;
  color: #fff;
  text-align: center;
  transform: translate(-50%, -50%);
  width: 40vw;
  font-size: 4vw;

  .record-item {
    position: relative;
    height: 25vw;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    .icon {
      position: absolute;
      top: 49.5%;
      left: 49.5%;
      transform: translate(-50%, -50%);
    }

    .text {
      margin-top: 3vw;
    }
  }
}

.close-img {
  width: 10vw;
  height: 10vw;
}

.lottie {}

.my-grid-item {
  /deep/.van-grid-item__content {
    background-color: transparent;
  }

  /deep/ .van-grid-item__text {
    font-size: 3.1vw;
  }
}

.m-chat-grid {
  display: flex;
  flex-flow: row wrap;

  .m-chat-grid-item {
    box-sizing: content-box;
    // margin: 1vw;
    flex-basis: 25%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    .m-chat-grid_item_icon {
      display: flex;
      align-items: center;
      justify-content: center;
      // background-color: #fff;
      font-size: 10vw;
      width: 16vw;
      height: 16vw;
      border-radius: 10px;
    }

    .m-chat-grid_item_text {
      font-size: 3.1vw;
      margin: 2vw 0vw;
    }
  }
}

.m-chat-emoji {
  display: flex;
  flex-flow: row wrap;
  height: 100%;
  overflow-y: auto;

  .m-chat-emoji-item {
    flex-basis: 15%;
    margin: 1.5vw 2vw;
    font-size: 6vw;
    user-select: none;
    text-align: center;
    box-sizing: content-box;
  }
}

.submit-btn {
  display: block;
  font-size: 4vw;
  margin-left: 2vw;
  padding: 2vw 4vw;
  // width: 20vw;
  // height: 6vw;
  // height: 100%;
  background-color: #0bbe62;
  color: #fff;
  border-radius: 1vw;
  outline: none;
  border: none;
  box-sizing: content-box;

  &:active,
  :hover {
    opacity: 0.6;
  }
}

// 动画
.move-enter-active {
  transition: all 0.3s ease;
}

.move-leave-active {
  transition: all 0.3s ease;
}

.move-enter,
.move-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
  {
  transform: translateX(10px);
  opacity: 0;
}
</style>