<template>
  <div>
    <div class="m-chat-msg-time" v-if="data.time">{{ data.time }}</div>
    <template v-if="isCancel">
      <div class="m-chat-back-msg">你撤回了一条消息</div>
    </template>
    <div
      v-else
      class="chat-message"
      :class="[data.self ? 'box-self' : 'box-people']"
    >
      <div class="chat-message-avatar">
        <van-image
          :src="data.avatar || defaultAvatar"
          @click="avatarClick"
          round
          width="10vw"
          height="10vw"
        />
      </div>
      <div class="chat-message-main">
        <div class="chat-message-name">{{ data.name }}</div>
        <div class="chat-message-content_wrap">
          <div
            class="chat-msg-event_wrap"
            ref="msgEvent"
            @click.self="msgEventClick"
            @touchstart="msgEventTouchStart"
            @touchmove="msgEventTouchMove"
            @touchend="msgEventTouchEnd"
          >
            <!-- {{ data.type }} -->
            <!-- 音频内容 -->
            <template v-if="data.type == 'audio'">
              <div
                class="chat-message-content arrow contentWrap"
                :class="[
                  isPress && 'press-class',
                  data.self ? 'row-start' : 'row-reverse',
                ]"
              >
                <span v-if="data.content.duration"
                  >{{ data.content.duration }} "</span
                >
                <van-icon
                  :name="mediaIcon"
                  style="margin: 0vw 2vw"
                  size="7vw"
                ></van-icon>
                <vue-lottie
                  :options="animOptions"
                  @animCreated="animCreated"
                  :className="data.self ? 'audio-right' : 'audio-left'"
                  :width="'7vw'"
                  :height="'7vw'"
                ></vue-lottie>
              </div>
            </template>
            <!-- 图片内容 -->
            <template v-else-if="data.type == 'image'">
              <div
                class="chat-message-image contentWrap"
                :class="[isPress && 'press-img-class']"
              >
                <van-image
                  class="chat-image"
                  :src="data.content.imageUrl"
                  @click.self="imagePreview"
                  @load="imageLoad"
                  :radius="5"
                ></van-image>
              </div>
            </template>
            <!-- 视频内容 -->
            <template v-else-if="data.type == 'video'">
              <div
                class="chat-message-content arrow contentWrap"
                :class="[
                  isPress && 'press-class',
                  data.self ? 'row-start' : 'row-reverse',
                ]"
              >
                <!-- <van-icon name="video-o" size="8vw" @click.stop="itemClick" /> -->
                <div class="chat-msg-video-wrapper">
                  <van-image
                    :src="videoImg"
                    width="8vw"
                    height="8vw"
                  ></van-image>
                </div>
              </div>
            </template>
            <template v-else-if="data.type == 'file'">
              <div
                class="chat-message-content arrow contentWrap"
                :class="[
                  isPress && 'press-class',
                  data.self ? 'row-start' : 'row-reverse',
                ]"
              >
                <div class="chat-msg-file-wrapper">
                  <!-- <van-image
                    :src="fileImg"
                    width="12vw"
                    height="12vw"
                  ></van-image> -->
                  <div class="chat-msg-file-thumb">
                    {{ data.content.fileExt }}
                  </div>
                  <div class="chat-msg-file-right">
                    <!-- :href="data.content.fileUrl"
                      :download="data.content.fileName" -->
                    <div class="chat-msg-file_name" @click="downloadFile">
                      {{ data.content.fileName }}
                    </div>
                    <span class="chat-msg-file_size">
                      {{ data.content.fileSize }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
            <!-- 普通文字 -->
            <template v-else>
              <div
                class="chat-message-content arrow contentWrap"
                :class="[isPress && 'press-class']"
                v-html="resloveContent(data.content.text)"
              ></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import VueLottie from "./VueLottie.vue";

import { ImagePreview, Image, Icon } from "vant";

import Hammer from "hammerjs";

import { isOutEl, dowanload, isWeixin, urlencode } from "./utils";

let startTime = 0;
let pressInterval = null;
export default {
  components: {
    [Image.name]: Image,
    VueLottie,
    [Icon.name]: Icon,
  },
  props: {
    isCancel: Boolean,
    data: {
      type: Object,
      default: function () {
        return {
          id: null, // 唯一id
          name: "", // 姓名
          avatar: "", // 头像地址
          self: false, // 是否是自己
          audio: "", // 音频地址
          duration: "", // 音频时长
          content: "", // 文本内容
          image: "", // 图片地址
          video: "", // 视频地址
          type: "text", // 文件类型 text|image|audio|video|file
          time: "", // 消息发送时间
          content: {
            text: "", // 文本
            duration: "", // 时长
            imageUrl: "", // 图片地址
            videoUrl: "", // 视频地址
            audioUrl: "", // 音频地址
            fileUrl: "", // 文件地址
            fileName: "", // 名称
            fileSize: "", // 大小
            fileExt: "", // 扩展名
          },
        };
      },
    },
    audioAnim: Boolean, // 是否播放音频动画
    defaultAvatar: {
      type: String,
      default: require("./svg/default.svg"),
    },
    isPress: Boolean,
    isPlayMedia: Boolean,
    leadPage: String,
  },
  data() {
    return {
      videoImg: require("./svg/video.svg"),
      fileImg: require("./svg/file.svg"),
      // defaultAvatar: require("./svg/default.svg"),
      animOptions: {
        animationData: require("./json/wifi.json"),
        autoplay: false,
      },
      isImgError: false,
      anim: null,
      // isPress: false,
      mediaStatus: 0, // 0 未开始播放 1播放中 2暂停 3播放完成
    };
  },
  computed: {
    mediaIcon() {
      return this.audioAnim ? "pause-circle-o" : "play-circle-o";
      let icon = "play-circle-o";
      switch (this.mediaStatus) {
        case 0:
          icon = "play-circle-o";
          break;
        case 1:
          icon = "pause-circle-o";
          break;
        case 2:
          icon = "play-circle-o";
          break;
        case 3:
          icon = "play-circle-o";
          break;
        default:
          break;
      }
      return icon;
    },
  },
  watch: {
    // 控制音频动画
    audioAnim: {
      handler(val) {
        if (this.anim) {
          if (val) {
            this.anim.play();
          } else {
            this.anim.stop();
          }
        }
      },
      immediate: false,
    },
    // isBack(val) {
    //   if (val) {

    //   }  this.$parent.$emit("c_initScoller");
    // },
  },
  created() {},
  mounted() {
    if (!this.$refs.msgEvent) return;
    var hammer = new Hammer(this.$refs.msgEvent, {
      // domEvents: true,
      // enable: true,
    });
    hammer.on("tap", (e) => {
      this.itemClick();
    });
    // 非文本非自己发送不触发长按事件（触发气泡框）
    if (this.data.type && this.data.type != "text" && !this.data.self) return;
    hammer.on("press", (e) => {
      // this.isPress = true;
      console.log("You're pressing me!");

      // console.log("data:::", this.data);
      this.$emit("press", {
        e: e,
        data: this.data,
      });
    });
    hammer.on("pressup", (e) => {
      console.log("You're pressup me!", e);
      // this.isPress = false;
      this.$emit("pressup", {
        e: e,
        data: this.data,
      });
    });
  },
  beforeDestroy() {},
  methods: {
    msgEventClick(e) {
      // this.itemClick();
    },
    msgEventTouchStart(e) {
      // console.log("msgEventTouchStart", e);
      // e.preventDefault();
      // if (!this.data.self) return;
      // if (pressInterval) {
      //   clearTimeout(pressInterval);
      //   pressInterval = null;
      // }
      // pressInterval = setTimeout(() => {
      //   clearTimeout(pressInterval);
      //   pressInterval = null;
      //   this.$emit("press", {
      //     e: e,
      //     data: this.data,
      //   });
      // }, 300);
    },
    msgEventTouchMove(e) {
      // console.log("msgEventTouchMove", e);
    },
    msgEventTouchEnd(e) {
      // console.log("msgEventTouchEnd", e);
      // if (!this.data.self) return;
      // e.preventDefault();
      // this.$emit("pressup", {
      //   e: e,
      //   data: this.data,
      // });
    },
    downloadFile(e) {
      if (isWeixin() && this.leadPage) {
        const url = `${this.leadPage}?url=${urlencode(
          this.data.content.fileUrl
        )}&name=${urlencode(this.data.content.fileName)}`;
        console.log(url);
        window.location.href = url;
      } else {
        dowanload(this.data.content.fileUrl, this.data.content.fileName);
      }
    },
    setMediaStatus(status) {
      this.mediaStatus = status;
    },
    resloveContent(content) {
      // console.log("content", content);
      if (!content) return "";
      // 给文本http或者https的链接添加a标签
      var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
      return content.replace(reg, "<a href='$1$2'>$1$2</a>");
    },
    avatarClick() {
      this.$emit("avatarClick", this.data);
    },
    imagePreview() {
      this.itemClick();
      ImagePreview([this.data.content.imageUrl]);
    },
    onImgError() {
      this.isImgError = true;
    },
    itemClick() {
      if (this.data.type == "image") {
        ImagePreview([this.data.content.imageUrl]);
      }
      this.$emit("itemClick", {
        data: this.data,
      });
    },
    animCreated(anim) {
      this.anim = anim;
    },
    imageLoad() {
      this.$emit("imageLoad");
    },
  },
};
</script>

<style scoped lang="less">
@import "./css/animate.css";
.chat-message {
  display: flex;
  flex-flow: row nowrap;
  padding: 2.666vw;
  overflow: hidden;
  .chat-message-avatar {
    // width: 10vw;
    // height: 10vw;
    // border-radius: 50%;
    // background-color: #f2f6fb;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .chat-message-main {
    flex: 1;
    display: flex;
    flex-direction: column;

    padding: 0px 4vw;
    .chat-message-name {
      font-size: 3.5vw;
      color: #9d9d9d;
    }
    .chat-message-image {
      display: inline-flex;
      align-items: center;
      background-color: transparent;
      // margin-top: 1.06667vw;
      // padding: 1.73333vw 2.66667vw;
      max-width: 25vw;
      height: auto;
      margin-top: 2vw;
      // background-color: transparent;
    }
    .chat-message-content {
      min-width: 2vw;
      min-height: 7vw;
      display: inline-flex;
      align-items: center;
      position: relative;
      margin-top: 1.06667vw;
      padding: 1.73333vw 2.66667vw;
      line-height: 6vw;
      border-radius: 1.33333vw;
      font-size: 3.73333vw;
      box-shadow: #f2f6fb 0px 0px 1.06667vw;
      word-break: break-all;
      flex-wrap: wrap;
      border: 1px solid transparent;
      user-select: text;
    }
    .chat-message-content_wrap {
      display: inline-flex;
    }
  }
}
.chat-image {
  max-width: 30vw;
  height: auto;
  max-height: 40vw;
  border: 1px solid #ebedf0;
}

.row-start {
  flex-direction: row;
}
.row-reverse {
  flex-direction: row-reverse;
}

.box-self {
  padding-right: 5.3333vw;
  flex-direction: row-reverse;
  .arrow::before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 3vw;
    right: 0;
    // width: 0px;
    // height: 0px;
    border-width: 0.1vw 0.1vw 0 0;
    border-style: solid;
    // border-color: transparent inherit inherit transparent;
    border-color: inherit;
    // transform: translate(100%, 0%);
    background-color: inherit;
    transform: translate(50%, 0%) rotate(45deg);
    width: 3vw;
    height: 3vw;
  }
  .chat-message-name {
    text-align: right;
  }
  .chat-message-content_wrap {
    flex-flow: row-reverse;
  }
  .chat-message-content {
    background-color: #9eea6a;
  }
}
.box-people {
  padding-right: 5.3333vw;
  flex-direction: row;

  .arrow::before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 3vw;
    left: 0px;
    width: 0px;
    height: 0px;
    // border-width: 2vw;
    // border-style: solid;
    // border-color: transparent inherit transparent transparent;
    // transform: translate(-100%, 0%);
    // background-color: red;
    border-width: 0 0 0.1vw 0.1vw;
    border-style: solid;
    border-color: inherit;
    background-color: inherit;
    transform: translate(-50%, 0%) rotate(45deg);
    width: 3vw;
    height: 3vw;
  }
  .chat-message-content_wrap {
    flex-flow: row;
  }
  .chat-message-content {
    background-color: #f2f6fb;
  }
}

.img-error {
  font-size: 7vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.audio-left {
}
.audio-right {
  transform: rotateY(180deg);
}
.audio-play {
  animation: anim-audio-play 1s infinite;
}
.audio-stop {
  animation-play-state: paused;
}
@keyframes anim-audio-play {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.2);
  }
  100% {
    transform: scaleX(1.8);
  }
}
.m-chat-video {
  position: relative;

  video {
    width: 20vw;
  }
  .play-btn {
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
  }
}
.m-chat-back-msg {
  text-align: center;
  margin: 2vw 0vw;
  font-size: 3.7vw;
  color: #6d6d6d;
}
.m-chat-msg-time {
  text-align: center;
  font-size: 3.5vw;
  margin: 3vw 0px;
  color: #b0b0b0;
}
.press-class {
  // border: 1px solid #8cda57 !important;
  background-color: #91da5f !important;
}
.press-img-class {
  opacity: 0.8;
}
.chat-msg-file-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  .chat-msg-file-thumb {
    width: 13vw;
    height: 13vw;
    border-radius: 1vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    color: #fff;
    font-size: 4.5vw;
    font-weight: bold;
  }
  .chat-msg-file-right {
    margin-left: 3vw;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .chat-msg-file_name {
      display: inline-block;
      color: #098be2;
      max-width: 25vw;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: normal;
    }
    .chat-msg-file_size {
      color: #777;
    }
  }
}
.chat-msg-video-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>