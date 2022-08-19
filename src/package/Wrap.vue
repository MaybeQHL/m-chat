<template>
  <div class="m-chat-wrap" :class="getTheme()" ref="mChatWrap" :style="{ height: `calc(${height})` }">
    <!-- 初始化loading -->
    <!-- <van-loading v-if="loading"></van-loading> -->
    <!-- 信息列表 -->
    <div class="m-chat-msg-wrap msg-wrap-background" ref="mChatScoller" @click="scollerClick">
      <div class="m-chat-content">
        <div class="pulldown-wrapper" v-if="!pullFinished">
          <div v-show="beforePullDown">
            <span>下拉加载更多</span>
          </div>
          <div v-show="!beforePullDown">
            <div class="pulling-box" v-show="isPullingDown || loading">
              <van-loading ref="chatLoading" size="8vw" type="circular" color="#BABABA" />
              <!-- <vue-lottie
                :options="animOptions"
                @animCreated="animCreated"
                width="40vw"
                height="40vw"
              ></vue-lottie> -->
            </div>
            <div v-show="!isPullingDown">
              <span>{{ pullError ? "刷新失败" : "刷新成功" }}</span>
            </div>
          </div>
        </div>
        <div class="finished-text" v-else>没有更多了</div>

        <div class="m-chat-msg-wrap">
          <message v-for="item in messages" :data="item" :key="item.id" :audioAnim="data.id == item.id && audioAnim"
            @itemClick="itemClick" @imageLoad="imageLoad" :defaultAvatar="defaultAvatar" @press="press"
            @pressup="pressup" :isCancel="item.isCancel" :isPress="item.self && isPress && item.id == data.id"
            @avatarClick="avatarClick" :isPlayMedia="isPlayMedia && item.id == data.id" :leadPage="leadPage"
            :isImagePreview="config.isImagePreview" :imagePreviewConfig="config.imagePreviewConfig"></message>
        </div>
      </div>
    </div>
    <!-- 唯一音频元素 -->
    <div class="media-wrap">
      <audio ref="mAudio"></audio>
    </div>
    <!-- 唯一视频元素 -->
    <div class="chat-video" v-show="videoShow">
      <video ref="mVideo" :src="data.content.videoUrl" controls></video>
      <div class="v-btn">
        <van-icon class="v-close-btn" name="close" size="7vw" color="#fff" @click="vClose"></van-icon>
      </div>
    </div>
    <!-- 回复框 -->
    <comment v-if="comment" class="m-comment comment-wrap-background" ref="mComment" @submit="submit"
      @emojiClick="emojiClick" @focus="focus" @toggleExtend="commentExtend" :customRecord="customRecord"
      @recordStart="recordStart" @recordStop="recordStop" @recordCancel="recordCancel" @imgAfterRead="imgAfterRead"
      @fileAfterRead="fileAfterRead" @videoAfterRead="videoAfterRead" :openExtends="openExtends"
      @togglePanel="togglePanel" :imgMaxSize="imgMaxSize" :videoMaxSize="videoMaxSize" :fileMaxSize="fileMaxSize"
      :openBases="openBases" :config="config">
      <template #right>
        <slot name="right"></slot>
      </template>
      <template #extend>
        <slot name="extend"></slot>
      </template>
    </comment>
    <!-- 气泡弹出框 -->
    <transition name="fade">
      <div class="chat-popover" ref="chatPopover" :style="{
        visibility:
          popoverList.length > 0 && popoverShow ? 'visible' : 'hidden',
      }" v-show="popoverList.length > 0 && popoverShow">
        <div class="chat-popover-content">
          <template v-for="(item, index) in popoverList">
            <div class="chat-pc-item" :key="index" v-if="openPops.includes(item.type)" @click="popItemClick(item)">
              <van-icon class="pop-icon" size="5vw" :name="item.icon || 'ellipsis'" color="#fff" />
              <span>{{ item.text }}</span>
            </div>
            <!-- <template v-if="item.type != 'copy' && !data.self"> </template>
            <template
              v-else-if="
                item.type == 'copy' && data.type && data.type != 'text'
              "
            >
            </template>
            <template v-else>
              <div
                class="chat-pc-item"
                :key="index"
                v-if="openPops.includes(item.type)"
                @click="popItemClick(item)"
              >
                <van-icon
                  class="pop-icon"
                  size="5vw"
                  :name="item.icon || 'ellipsis'"
                  color="#fff"
                />
                <span>{{ item.text }}</span>
              </div>
            </template> -->
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";

BScroll.use(PullDown);
import { Loading, Icon, Toast } from "vant";

import Comment from "./Comment.vue";
import Message from "./Message.vue";

import { isOutEl, isWeixin, copyContentH5 } from "./utils";
import VueLottie from "./VueLottie.vue";

export default {
  props: {
    config: {
      type: Object
    },
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
    customRecord: Boolean,
    // popoverList: {
    //   type: Array,
    //   default: function () {
    //     return [];
    //   },
    // },
    openPops: {
      type: Array,
      default: function () {
        return ["copy", "cancel"];
      },
    },
    pullFinished: Boolean,
    openExtends: Array,
    loading: Boolean,
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
    leadPage: String,
    openBases: Array,
  },
  components: {
    Comment,
    Message,
    [Loading.name]: Loading,
    [Icon.name]: Icon,
    VueLottie,
  },
  data() {
    return {
      bs: null,
      beforePullDown: true,
      isPullingDown: false,
      // 当前点击的聊天信息
      data: {
        // 详情见Message 组件
        type: "",
        content: {},
      },
      audioAnim: false, // 控制是否播放音频动画
      resresh: false, // 是否刷新容器
      // showExtend: false, // 是否展示扩展面板
      // emojiShow: false, // 显示emoji表情
      videoShow: false, // 显示视频播放器
      popoverShow: false, // 显示气泡框
      isPress: false,
      pullError: false,
      animOptions: {
        animationData: require("./json/loading.json"),
        autoplay: true,
      },
      anim: null,
      isPlayMedia: false,
      popoverList: [
        {
          type: "copy",
          icon: require("./svg/copy.svg"),
          text: "复制",
        },
        {
          type: "cancel",
          icon: "revoke",
          text: "撤回",
        },
      ],
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
    pullFinished: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.bs.closePullDown();
          });
        }
      },
      immediate: true,
    },
    // isPullingDown(val) {
    //   if (val) {
    //     this.anim.play();
    //   } else {
    //     this.anim.stop();
    //   }
    // },
    "data.type": {
      handler(val) { },
      immediate: true,
    },
  },
  mounted() {
    const pullStopHeight = window.innerWidth * 0.08 + 15;
    this.bs = new BScroll(this.$refs.mChatScoller, {
      scrollY: true,
      bounce: {
        top: true,
        bottom: false,
        left: false,
        right: false,
      },
      click: true,
      dblclick: true,
      pullDownRefresh: {
        // threshold: 100,
        stop: pullStopHeight,
      },
      preventDefaultException: {
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/, // 这些元素的默认行为都不会被阻止。
        // className: /(^|\s)chat-message-content(\s|$)/,
      },
    });
    this.bs.on("pullingDown", this.pullingDownHandler);
    this.bs.on("scroll", this.scrollHandler);
    this.bs.on("scrollEnd", (e) => {
      // console.log("scrollEnd", e);
    });

    // 初始化消息容器的宽高
    this.initScollerWH();

    this.$on("isExtend_initScoller", (isExtend) => {
      // console.log("main_initScoller");
      if (isExtend) {
        this.$nextTick(() => {
          this.$refs.mChatScoller.style.height = `calc(${this.height} - ${this.$refs.mComment.$refs.mChatComment.clientHeight}px)`;
          console.log(this.$refs.mComment.clientHeight);
          this.$nextTick(() => {
            this.initScoller();
          });
        });
      } else {
        this.$nextTick(() => {
          this.$refs.mChatScoller.style.height = `calc(${this.height} - ${this.$refs.mComment.$refs.mChatComment.clientHeight}px)`;
          this.$nextTick(() => {
            this.initScoller();
          });
        });
      }
    });
    this.$on("c_initScoller", () => {
      this.initScoller();
    });
    document.addEventListener("click", this.hidePop);
    this.$refs.mChatScoller.addEventListener("click", this.mChatScollerClick);

    // window.addEventListener("resize", this.autoRestScoller);

    // const hooks = this.bs.scroller.actionsHandler.hooks;
    // hooks.on("end", (e) => {
    //   console.log("aaaaaaaaa", e);
    // });
    window.ontouchend = (e) => {
      // debugger;
      // console.log("ontouchend", e);
      this.isPress = false;
      // this.popoverShow = false;

      this.$refs.mComment.toggleRecordStatus(0);
    };
    this.initResizeEvent();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.hidePop);
    this.$refs.mChatScoller.removeEventListener(
      "click",
      this.mChatScollerClick
    );
    // window.removeEventListener("resize", this.autoRestScoller);
    window.ontouchend = null;
  },
  methods: {
    getTheme() {
      if (this.config && this.config.theme) {
        return 'theme-' + this.config.theme;
      }
      return 'theme-light'
    },
    // 初始化消息容器的宽高
    initScollerWH() {
      this.$refs.mChatScoller.style.height = `calc(${this.height} - ${this.$refs.mComment.$refs.mChatComment.clientHeight}px)`;
    },
    initResizeEvent() {
      var clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      window.onresize = (e) => {
        var nowClientHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        if (clientHeight > nowClientHeight) {
          // 键盘弹出的事件处理，
          console.log("键盘弹出的事件处理");
          console.log(this.$refs.mChatScoller.clientHeight);
          this.initScoller();
        } else {
          // 键盘收起的事件处理
          console.log("键盘收起的事件处理");
          console.log(this.$refs.mChatScoller.clientHeight);
          this.initScoller();
        }
        // 初始化容器宽高
        this.initScollerWH();
      };
    },
    animCreated(anim) {
      this.anim = anim;
    },
    togglePanel(type) {
      this.$emit("togglePanel", type);
    },
    avatarClick(data) {
      this.$emit("avatarClick", data);
    },
    mChatScollerClick(e) {
      this.$refs.mComment.toggleExtend(false);
    },
    autoRestScoller() {
      this.initScoller();
    },
    imgAfterRead(file) {
      this.$emit("imgAfterRead", file);
    },
    fileAfterRead(file) {
      this.$emit("fileAfterRead", file);
    },
    videoAfterRead(file) {
      this.$emit("videoAfterRead", file);
    },
    hidePop(e) {
      if (!e || !e.path) return;
      const element = e.path.find((el) => {
        const arr = el.classList ? Array.from(el.classList) : [];
        return arr.includes("chat-msg-event_wrap");
      });
      if (!element) {
        this.popoverShow = false;
      }
    },
    recordStart() {
      this.$emit("recordStart");
    },
    recordStop(data) {
      this.$emit("recordStop", data);
    },
    recordCancel() {
      this.$emit("recordCancel");
    },
    popItemClick(item) {
      this.popoverShow = false;
      if (
        item.type == "copy" &&
        (!this.data.type || this.data.type == "text")
      ) {
        copyContentH5(this.data.content.text);
        return;
      }
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
      this.isPress = false;
    },
    press(obj) {
      console.log(obj);
      this.popoverShow = false;
      this.isPress = true;
      console.log(obj);
      const parent = obj.e.srcEvent.path.find((el) => {
        return Array.from(el.classList || []).includes("contentWrap");
      });
      // const parent = obj.e.path.find((el) => {
      //   return Array.from(el.classList || []).includes("contentWrap");
      // });
      if (!parent) return;
      console.log(parent);
      // debugger;
      const { left, top, width, height } = parent.getBoundingClientRect();
      console.log(parent, parent.getBoundingClientRect());
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;
      const chatPopWidth = this.$refs.chatPopover.clientWidth;
      const chatPopHeight = this.$refs.chatPopover.clientHeight;
      const mChatWrapHeight = this.$refs.mChatWrap.clientHeight;
      const cLeft = width < wWidth / 2 ? left : left + width / 4;

      const cTop = top - (wHeight - mChatWrapHeight);
      this.$refs.chatPopover.style.left = `${cLeft}px`;
      this.$refs.chatPopover.style.top = `${cTop}px`;
      this.popoverShow = true;
      this.data = obj.data;
    },
    focus() {
      this.popoverShow = false;
      // this.initScoller();
    },
    async pullingDownHandler() {
      console.log("trigger pullDown");
      this.beforePullDown = false;
      this.isPullingDown = true;

      // 开启刷新模式
      this.resresh = true;

      try {
        await this.loadMore();
      } catch (error) {
        this.pullError = true;
        Toast.fail({
          message: error.message,
          onClose: () => {
            this.pullError = false;
          },
        });
      }

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
    emojiClick() { },
    itemClick(data) {
      if (data.data.type == "audio") {
        // 重复点击当前音频暂停或播放
        if (this.audioAnim && data.data.id == this.data.id) {
          this.audioAnim = false;
          this.$refs.mAudio.pause();
          // this.data = data.data;
          // this.isPlayMedia = false;
        } else {
          // this.isPlayMedia = true;
          this.data = data.data;
          this.initAudio();
        }
      }
      this.data = data.data;
      if (this.data.type == "video") {
        this.clearAudio();
        this.videoShow = true;
        this.$refs.mVideo.src = this.data.content.videoUrl;
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
      this.$refs.mAudio.src = this.data.content.audioUrl;
      this.$refs.mAudio.play();
      this.$refs.mAudio.removeEventListener("ended", this.audioListener, false);
      this.$refs.mAudio.addEventListener("ended", this.audioListener, false);
    },
    audioListener() {
      console.log("audio play over");
      this.audioAnim = false;
      // this.isPlayMedia = false;
    },
    clearAudio() {
      this.audioAnim = false;
      this.$refs.mAudio.src = null;
    },
    imageLoad() {
      this.initScoller();
    },
    submit(data) {
      // 空白内容不允许发送
      if (
        data.type == "text" &&
        (!data.content || !data.content.replace(/\s+/g, ""))
      )
        return;
      this.$emit("submit", data);
      this.$refs.mComment.toggleExtend(false);
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

<style lang="less" scoped>
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
  // height: 10vw;
  // line-height: 10vw;
  box-sizing: border-box;
  transform: translateY(-100%);
  text-align: center;
  color: #999;
  font-size: 4vw;

  // padding: 5vw 0vw;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  .pulling-box {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
    height: auto;
    // height: 50%;
    max-height: 50%;
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

  .v-close-btn {}
}

.m-comment {
  // flex: 1;
}

.chat-popover {
  position: absolute;
  transform: translate(0%, -110%);
  visibility: hidden;

  .chat-popover-content {
    background-color: #4a4a4a;
    color: #fff;
    border-radius: 5px;
    padding: 1vw 3vw;

    // display: flex;
    &::before {
      content: "";
      position: absolute;
      bottom: -1vw;
      // width: 0;
      // height: 0;
      left: 40%;
      // content: "";
      // border-left: 3vw solid transparent;
      // border-top: 3vw solid #4a4a4a;
      // border-right: 3vw solid transparent;
      border-width: 0 0 0.1vw 0.1vw;
      border-style: solid;
      border-color: transparent;
      background-color: inherit;
      transform: translate(-50%, 0%) rotate(-45deg);
      width: 2vw;
      height: 2vw;
    }

    display: flex;
    flex-flow: row wrap;

    .chat-pc-item {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      padding: 2vw 3vw;
      font-size: 2.5vw;
      // height: 15vw;
      user-select: none;

      .pop-icon {
        margin-bottom: 1vw;
      }
    }
  }
}

.m-chat-msg-wrap {
  position: relative;
  // padding-top: 3vw;
}

.finished-text {
  text-align: center;
  margin: 3vw;
  font-size: 4vw;
  color: #000;
}
</style>