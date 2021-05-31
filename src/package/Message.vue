<template>
  <div class="chat-message" :class="[data.self ? 'box-self' : 'box-people']">
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
        <div class="chat-msg-event_wrap" ref="msgEvent">
          <!-- 音频内容 -->
          <template v-if="data.type == 'audio'">
            <div
              class="chat-message-content arrow"
              :class="data.self ? 'row-start' : 'row-reverse'"
            >
              <span>{{ data.duration }}</span>
              <vue-lottie
                :options="animOptions"
                @animCreated="animCreated"
                :className="data.self ? 'audio-right' : 'audio-left'"
                :width="'7vw'"
                :height="'7vw'"
                @click="itemClick"
              ></vue-lottie>
            </div>
          </template>
          <!-- 图片内容 -->
          <template v-else-if="data.type == 'image'">
            <div class="chat-message-content arrow">
              <van-image
                class="image"
                :src="data.image"
                @click="imagePreview"
                @load="imageLoad"
              ></van-image>
            </div>
          </template>
          <!-- 视频内容 -->
          <template v-else-if="data.type == 'video'">
            <div class="chat-message-content arrow">
              <!-- <van-icon name="video-o" size="8vw" @click.stop="itemClick" /> -->
              <van-image
                :src="videoImg"
                width="8vw"
                height="8vw"
                @click="itemClick"
              ></van-image>
              <!-- <video-poster :videoSrc="data.video"></video-poster> -->
            </div>
          </template>
          <!-- 普通文字 -->
          <template v-else>
            <div class="chat-message-content arrow" v-html="data.content"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import VueLottie from "./VueLottie.vue";
import VideoPoster from "./VideoPoster.vue";

import { ImagePreview, Image, Icon } from "vant";
export default {
  components: {
    [Image.name]: Image,
    VueLottie,
    [Icon.name]: Icon,
    VideoPoster,
  },
  props: {
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
          type: "text", // 文件类型 text|image|audio|video
        };
      },
    },
    audioAnim: Boolean, // 是否播放音频动画
    defaultAvatar: {
      type: String,
      default: require("./svg/default.svg"),
    },
  },
  data() {
    return {
      videoImg: require("./svg/video.svg"),
      // defaultAvatar: require("./svg/default.svg"),
      animOptions: {
        animationData: require("./json/wifi.json"),
        autoplay: false,
      },
      isImgError: false,
      anim: null,
      videoPoster: null,
    };
  },
  computed: {},
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
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    avatarClick() {
      this.$emit("avatarClick", this.data);
    },
    imagePreview() {
      this.itemClick();
      ImagePreview([this.data.image]);
    },
    onImgError() {
      this.isImgError = true;
    },
    itemClick() {
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

<style scoped lang="scss">
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
    }
    .chat-message-content {
      min-height: 4vw;
      display: inline-flex;
      align-items: center;
      position: relative;
      margin-top: 1.06667vw;
      padding: 1.73333vw 2.66667vw;
      line-height: 6vw;
      border-radius: 1.33333vw;
      background-color: #f2f6fb;
      font-size: 3.73333vw;
      box-shadow: #f2f6fb 0px 0px 1.06667vw;
      word-break: break-all;
      flex-wrap: wrap;
      .image {
        ::v-deep img {
          max-width: 35vw;
          height: auto;
        }
      }
    }
    .chat-message-content_wrap {
      display: inline-flex;
    }
  }
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
    position: absolute;
    top: 2.66667vw;
    right: 0px;
    width: 0px;
    height: 0px;
    border-width: 2vw;
    border-style: solid;
    border-color: transparent transparent transparent #9eea6a;
    transform: translate(100%, 0%);
  }
  .chat-message-name {
    text-align: right;
  }
  .chat-message-content_wrap {
    flex-flow: row-reverse;
  }
  .chat-message-content {
    background-color: #9eea6a !important;
  }
}
.box-people {
  padding-right: 5.3333vw;
  flex-direction: row;

  .arrow::before {
    content: "";
    position: absolute;
    top: 2.66667vw;
    left: 0px;
    width: 0px;
    height: 0px;
    border-width: 2vw;
    border-style: solid;
    border-color: transparent #f2f6fb transparent transparent;
    transform: translate(-100%, 0%);
  }
  .chat-message-content_wrap {
    flex-flow: row;
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
</style>