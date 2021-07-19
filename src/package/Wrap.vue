<template>
  <div
    class="m-chat-wrap"
    ref="mChatWrap"
    :style="{ height: `calc(${height})` }"
  >
    <!-- 信息列表 -->
    <div class="m-chat-msg-wrap" ref="mChatScoller" @click="scollerClick">
      <div class="m-chat-content">
        <div class="pulldown-wrapper">
          <div v-show="beforePullDown">
            <span>下拉加载更多</span>
          </div>
          <div v-show="!beforePullDown">
            <div class="pulling-box" v-show="isPullingDown">
              <!-- <span> 刷新中 </span> -->
              <van-loading size="8vw" type="circular" color="#1989fa" />
            </div>
            <div v-show="!isPullingDown">
              <span>刷新成功</span>
            </div>
          </div>
        </div>

        <message
          v-for="(item, index) in messages"
          :data="item"
          :key="index"
          :audioAnim="data.id == item.id && audioAnim"
          @itemClick="itemClick"
          @imageLoad="imageLoad"
          :defaultAvatar="defaultAvatar"
          @press="press"
          @pressup="pressup"
          :isBack="item.isBack"
        ></message>
      </div>
    </div>
    <!-- 唯一音频元素 -->
    <div class="media-wrap">
      <audio ref="mAudio"></audio>
    </div>
    <!-- 唯一视频元素 -->
    <div class="chat-video" v-show="videoShow">
      <video ref="mVideo" :src="data.video" controls></video>
      <div class="v-btn">
        <van-icon
          class="v-close-btn"
          name="close"
          size="7vw"
          color="#fff"
          @click="vClose"
        ></van-icon>
      </div>
    </div>
    <!-- 回复框 -->
    <comment
      v-if="comment"
      class="m-comment"
      ref="mComment"
      @submit="submit"
      @emojiClick="emojiClick"
      @focus="focus"
      @toggleExtend="commentExtend"
    >
      <template #left>
        <slot name="left"></slot>
      </template>
      <template #right>
        <slot name="right"></slot>
      </template>
      <template #extend>
        <slot name="extend"></slot>
      </template>
    </comment>
    <!-- 气泡弹出框 -->
    <div
      class="chat-popover"
      ref="chatPopover"
      v-show="popoverList.length > 0 && popoverShow"
    >
      <div class="chat-popover-content">
        <div
          class="chat-pc-item"
          v-for="(item, index) in popoverList"
          :key="index"
          @click="popItemClick(item)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";

BScroll.use(PullDown);
import { Loading, Icon } from "vant";

import Comment from "./Comment.vue";
import Message from "./Message.vue";

export default {
  props: {
    messages: {
      type: Array,
      default: function () {
        return [];
      },
    },
    height: {
      type: String,
      default: "100vh",
    },
    loadMore: {
      type: Function,
    },
    defaultAvatar: String,
    comment: {
      type: Boolean,
      default: true,
    },
    isPopover: {
      type: Boolean,
      default: true,
    },
    popoverList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  components: {
    Comment,
    Message,
    [Loading.name]: Loading,
    [Icon.name]: Icon,
  },
  data() {
    return {
      bs: null,
      beforePullDown: true,
      isPullingDown: false,
      // 当前点击的聊天信息
      data: {
        id: null,
        name: "", // 姓名
        avatar: "", // 头像地址
        self: false, // 是否是自己发送
        audio: "", // 音频地址
        duration: "", // 音频时长
        content: "", // 文本内容
        image: "", // 图片地址
        video: "", // 视频地址
        type: "text", // 文件类型 text|image|audio|video
      },
      audioAnim: false, // 控制是否播放音频动画
      resresh: false, // 是否刷新容器
      // showExtend: false, // 是否展示扩展面板
      // emojiShow: false, // 显示emoji表情
      videoShow: false, // 显示视频播放器
      popoverShow: false, // 显示气泡框
      isPress: false,
    };
  },
  watch: {
    messages: {
      handler: function () {
        // 在dom更新后重新去计算滚动容器高度
        this.$nextTick(() => {
          this.initScoller();
        });
      },
      immediate: true,
    },
  },
  mounted() {
    this.bs = new BScroll(this.$refs.mChatScoller, {
      scrollY: true,

      bounce: {
        top: true,
        bottom: false,
        left: false,
        right: false,
      },
      click: true,
      pullDownRefresh: true,
    });
    this.bs.on("pullingDown", this.pullingDownHandler);
    this.bs.on("scroll", this.scrollHandler);
    this.bs.on("scrollEnd", (e) => {
      // console.log("scrollEnd", e);
    });
    // 初始化消息容器的高度
    this.$refs.mChatScoller.style.height = `calc(${this.height} - ${this.$refs.mComment.$refs.mChatComment.clientHeight}px)`;

    this.$on("main_initScoller", (isExtend) => {
      // console.log("main_initScoller");
      if (isExtend) {
        this.$nextTick(() => {
          console.log(this.$refs.mComment.clientHeight);
          this.$refs.mChatScoller.style.height = `calc(${this.height} - ${this.$refs.mComment.$refs.mChatComment.clientHeight}px)`;
          this.initScoller();
        });
      } else {
        this.$nextTick(() => {
          this.$refs.mChatScoller.style.height = `calc(${this.height} - ${this.$refs.mComment.$refs.mChatComment.clientHeight}px)`;
          this.initScoller();
        });
      }
    });

    window.addEventListener("click", (e) => {
      if (!this.isPress) {
        this.popoverShow = false;
      }
    });
  },
  methods: {
    popItemClick(item) {
      this.popoverShow = false;
      this.$emit("popItemClick", {
        type: item.type,
        data: this.data,
      });
    },
    commentExtend() {
      this.popoverShow = false;
    },
    scollerClick(e) {
      // this.toggleExtend(false, e);
    },
    pressup(e, data) {
      // this.isPress = false;
    },
    press(obj) {
      this.isPress = true;
      console.log(obj);
      const parent = obj.e.srcEvent.path.find((el) =>
        Array.from(el.classList).includes("chat-message-content")
      );
      const { left, top } = parent.getBoundingClientRect();
      console.log(left, top);
      this.$refs.chatPopover.style.left = `${left - 20}px`;
      this.$refs.chatPopover.style.top = `${top}px`;
      this.popoverShow = true;
      this.data = obj.data;
    },
    focus() {
      this.popoverShow = false;
    },
    async pullingDownHandler() {
      console.log("trigger pullDown");
      this.beforePullDown = false;
      this.isPullingDown = true;

      // 开启刷新模式
      this.resresh = true;
      await this.loadMore();

      this.isPullingDown = false;
      // 等待x秒后重置
      setTimeout(() => {
        this.finishPullDown();
      }, 800);
    },
    scrollHandler(pos) {
      // console.log(pos.y);
      this.popoverShow = false;
    },
    finishPullDown() {
      this.bs.finishPullDown();
      setTimeout(() => {
        this.beforePullDown = true;
        this.bs.refresh();
        // 关闭刷新模式
        this.resresh = false;
      }, 1000);
    },
    emojiClick() {},
    itemClick(data) {
      this.data = data.data;
      if (this.data.type == "audio") {
        this.initAudio();
      }
      if (this.data.type == "video") {
        this.clearAudio();
        this.videoShow = true;
        this.$refs.mVideo.src = this.data.video;
      }
    },
    initScoller(flag) {
      this.bs.refresh();
      // 如果是刷新数据则无需重置滚动条
      if (!this.resresh) {
        const maxScrollY = this.bs.maxScrollY;
        this.bs.scrollTo(0, maxScrollY);
      }
    },
    initAudio() {
      this.audioAnim = true;
      this.$refs.mAudio.pause();
      this.$refs.mAudio.src = this.data.audio;
      this.$refs.mAudio.play();
      this.$refs.mAudio.removeEventListener("ended", this.audioListener, false);
      this.$refs.mAudio.addEventListener("ended", this.audioListener, false);
    },
    audioListener() {
      console.log("audio play over");
      this.audioAnim = false;
    },
    clearAudio() {
      this.audioAnim = false;
      this.$refs.mAudio.src = null;
    },
    imageLoad() {
      this.initScoller();
    },
    submit(content) {
      // 空白内容允许发送
      if (!content.replace(/\s+/g, "")) return;
      this.$emit("submit", content);
    },
    toggleExtend(flag, e) {
      // // 如果触发元素是消息容器则关闭气泡框
      // if (!e || Array.from(e.target.classList).includes("m-chat-msg-wrap")) {
      //   this.popoverShow = false;
      // }
      this.$refs.mComment.toggleExtend(flag);
    },
    vClose() {
      this.videoShow = false;
      this.$refs.mVideo.pause();
      this.$refs.mVideo.src = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.m-chat-wrap {
  overflow: hidden;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  // height: 100vh;
  // padding: 5vw 0px 5vw 0px;
  .m-chat-msg-wrap {
    display: block;
    overflow: hidden;
    box-sizing: content-box;
  }
}
.media-wrap {
  display: none;
}
.m-chat-content {
  position: relative;
}
.pulldown-wrapper {
  position: absolute;
  width: 100%;
  padding: 1vw;
  box-sizing: border-box;
  transform: translateY(-100%) translateZ(0);
  text-align: center;
  color: #999;
  font-size: 4vw;
}
.chat-video {
  z-index: 88;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #000;
  video {
    position: fixed;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    // height: 100%;
  }
  .v-btn {
    z-index: 99;
    position: fixed;
    bottom: 10%;
    left: 0px;
    padding: 5vw;
  }
  .v-close-btn {
  }
}
.pulling-box {
}
.m-comment {
  // flex: 1;
}
.chat-popover {
  position: absolute;
  transform: translate(0%, -110%);

  .chat-popover-content {
    background-color: #4a4a4a;
    color: #fff;
    border-radius: 5px;
    padding: 0vw 3vw;
    // display: flex;
    &::before {
      top: 98%;
      width: 0;
      height: 0;
      left: 30%;
      content: "";
      position: absolute;
      border-left: 5px solid transparent;
      border-top: 5px solid #4a4a4a;
      border-right: 5px solid transparent;
    }
    .chat-pc-item {
      display: inline-flex;
      padding: 0vw 2vw;
      font-size: 3vw;
      height: 10vw;
      line-height: 10vw;
      user-select: none;
    }
  }
}
</style>