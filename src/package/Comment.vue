<template>
  <div class="m-chat-comment" ref="mChatComment">
    <div class="m-chat-comment-wrap">
      <div class="m-chat-comment-main">
        <div class="m-chat-main-left" v-if="$slots.left">
          <slot name="left"></slot>
          <!-- <img src="~@/package/svg/yuyin.svg" class="c-icon" /> -->
        </div>
        <form class="m-chat-form" @submit.prevent="submit">
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
  </div>
</template>

<script>
import { Icon } from "vant";
import { Grid, GridItem } from "vant";
export default {
  components: {
    [Icon.name]: Icon,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
  },
  props: {},
  data() {
    return {
      content: "",
      isExtend: false,
      isEmoji: false,
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
  methods: {
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
      padding: 3vw 6vw;
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
  padding: 0px 1.1vw;
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
</style>