<template>
  <div class="m-chat-comment" ref="mChatComment">
    <div class="m-chat-comment-wrap">
      <div class="m-chat-comment-main">
        <div class="m-chat-main-left">
          <!-- <slot name="left"></slot> -->
          <img
            src="~@/package/svg/yuyin.svg"
            @click="changeRecord"
            v-if="!showAudio"
            class="c-icon"
          />
          <img
            src="~@/package/svg/jianpan.svg"
            @click="showAudio = false"
            v-else
            class="c-icon"
          />
        </div>
        <div class="m-chat-record" v-show="showAudio" ref="mChatRecord">
          <span v-if="recordStatus == 0">按住开始录音</span>
          <span v-if="recordStatus == 1">松开 发送</span>
          <span v-if="recordStatus == 2">松开 取消</span>
        </div>
        <form class="m-chat-form" v-show="!showAudio" @submit.prevent="submit">
          <input
            ref="mChatInput"
            class="m-chat-input"
            @focus="onFocus"
            @blur="onBlur"
            v-model="content"
            @change="onChange"
            type="text"
          />
        </form>
        <div class="m-chat-input-options">
          <!-- <div class="m-chat-comment-icon c-icon">
            <van-icon size="8vw" name="smile-o" @click="emojiClick" />
          </div> -->
          <!-- <van-icon class="c-icon" size="8vw" name="photo-o" /> -->
          <slot name="right"></slot>
          <van-icon
            class="c-icon"
            size="8vw"
            name="add-o"
            @click="toggleExtend"
          />
        </div>
      </div>
      <div
        class="m-chat-comment-extend"
        ref="mChatCommnetExtend"
        v-show="isExtend"
      >
        <!-- <emoji @chooseEmjoy="chooseEmjoy" v-if="isEmoji" />
        <slot name="extend" v-else></slot> -->
        <slot name="extend"></slot>
      </div>
    </div>
    <div class="record-overlay" v-if="recordStatus != 0">
      <div class="record-1 record-item" v-if="recordStatus == 1">
        <vue-lottie
          :options="animOptions"
          width="20vw"
          height="20vw"
        ></vue-lottie>
        <p>手指上划,取消发送</p>
      </div>
      <div class="record-2 record-item" v-if="recordStatus == 2">
        <img class="close-img" src="~@/package/svg/close.svg" />
        <p class="text">松开取消发送录音</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Toast } from "vant";
import { Grid, GridItem } from "vant";
import { isOutEl } from "./utils";
import VueLottie from "./VueLottie.vue";

//必须引入的核心，换成require也是一样的。注意：recorder-core会自动往window下挂载名称为Recorder对象，全局可调用window.Recorder，也许可自行调整相关源码清除全局污染
import Recorder from "recorder-core";

//需要使用到的音频格式编码引擎的js文件统统加载进来
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";

export default {
  components: {
    [Icon.name]: Icon,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    VueLottie,
  },
  props: {
    customRecord: Boolean,
  },
  data() {
    return {
      content: "",
      isExtend: false,
      showAudio: false,
      recordStatus: 0, // 0 未录音 1 录音中 2 取消录音中
      animOptions: {
        animationData: require("./json/recording.json"),
        autoplay: true,
      },
      /**@type {Recorder} */
      rec: null,
    };
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
        this.$parent.$emit("main_initScoller", val);
      },
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
    this.$refs.mChatRecord.addEventListener("touchstart", this.touchstart);
    this.$refs.mChatRecord.addEventListener("touchmove", this.touchmove);
    this.$refs.mChatRecord.addEventListener("touchend", this.touchend);
  },
  beforeDestroy() {
    this.$refs.mChatRecord.removeEventListener("touchstart", this.touchstart);
    this.$refs.mChatRecord.removeEventListener("touchmove", this.touchmove);
    this.$refs.mChatRecord.removeEventListener("touchend", this.touchend);
  },
  methods: {
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
      // console.log("touchstart", e);
      this.recordStatus = 1;
      if (this.customRecord) {
        this.$emit("recordStart");
      } else {
        this.recStart();
      }
    },
    touchmove(e) {
      // console.log("touchmove", e);
      if (isOutEl(e.changedTouches[0], this.$refs.mChatRecord)) {
        this.recordStatus = 2;
      } else {
        this.recordStatus = 1;
      }
    },
    touchend(e) {
      // 取消录音
      if (this.recordStatus == 2) {
        this.recordStatus = 0;
        if (this.customRecord) {
          this.$emit("recordCancel");
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
          return;
        }

        // 录音结束
        this.recStop();
      }
    },
    onFocus() {
      this.isExtend = false;
      // this.$refs.mChatComment &&
      //   this.$refs.mChatComment.classList.add("position-fixed");
      this.$emit("focus");
    },
    onBlur() {
      this.$refs.mChatComment &&
        this.$refs.mChatComment.classList.remove("position-fixed");
    },
    onChange() {},
    emojiClick() {
      // this.$emit("emojiClick");
      this.isExtend = !this.isExtend;
      this.isEmoji = true;
    },
    toggleExtend(flag) {
      // 自定义关闭扩展面板
      if (typeof flag == "boolean" && (flag != undefined || flag != null)) {
        this.isExtend = flag;
        return;
      }
      // this.isEmoji = false;
      this.isExtend = !this.isExtend;
      this.$emit("toggleExtend", flag);
    },
    onInput($e) {
      this.$emit("update:content", $e.target.value);
    },
    submit() {
      this.$emit("submit", this.content);
      this.content = "";
      this.isExtend = false;
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
          self.$emit("recordStop", { blob, duration, rec: self.rec });
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
  },
};
</script>

<style lang="scss" scoped>
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
  // height: 8vh;
  .m-chat-comment-wrap {
    overflow: hidden;
    .m-chat-comment-main {
      display: flex;
      padding: 3vw 3vw;
    }
    .m-chat-form {
      flex: 1;
      display: flex;
      background-color: #fff;
    }
    .m-chat-input {
      flex: 1;
      border: none;
      // -webkit-appearance: none; /*去除阴影边框*/
      //   -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /*点击高亮的颜色*/
      outline: none;
      border-radius: 2vw;
      caret-color: #9eea6a;
      background-color: transparent;
      padding: 1vw 0px;
      margin: 0px 2vw;
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
}
.c-icon {
  width: 8vw;
  height: 8vw;
  // padding: 0px 1.1vw;
  color: inherit;
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
.lottie {
}
</style>