<template>
  <div id="app">
    <m-chat
      ref="mChat"
      :messages="messages"
      @submit="submit"
      :loadMore="loadMore"
      height="88vh"
    >
      <template #left> </template>
      <template #right></template>
      <template #extend>
        <van-grid :column-num="3" icon-size="10vw">
          <van-grid-item
            class="my-grid-item"
            icon="photo-o"
            text="图片"
            @click="itemClick"
          />
        </van-grid>
      </template>
    </m-chat>
    <!-- <van-uploader
      ref="uploader"
      :after-read="afterRead"
      v-model="fileList"
      style="display: none"
    /> -->
  </div>
</template>


<script>
// import MChat from "@/package";
import MChat from "../lib-dist/m-chat.umd.js";

import { Grid, GridItem, Uploader } from "vant";
export default {
  components: {
    MChat,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Uploader.name]: Uploader,
  },
  data() {
    return {
      messages: [
        {
          id: 0,
          name: "张三",
          content: "6666666666666",
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 1,
          name: "李四",
          content:
            "6666666666666samj科技撒啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊是卡死的科技奥科吉卡死的科技科技安神科技科技ask佳都科技看见爱上科技的",
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 2,
          name: "李四",
          type: "audio",
          audio:
            "https://common-1251804846.cos.ap-guangzhou.myqcloud.com/test.mp3",
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 33,
          name: "王五",
          type: "audio",
          audio:
            "https://music-10014144.cos.ap-shanghai.myqcloud.com/Cassandra%20-%20Doobi%20Doobi%20Doo%20(Don't%20Be%20Shy).mp3",
          self: false,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 3,
          name: "李四",
          content: "6666666666666",
          self: false,
          type: "image",
          image:
            "https://common-1251804846.cos.ap-guangzhou.myqcloud.com/jjy.jpg",
        },
        {
          id: 4,
          name: "李四",
          self: false,
          type: "image",
          image:
            "https://common-1251804846.cos.ap-guangzhou.myqcloud.com/1.jpg",
          avatar:
            "https://tiej2inxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 44,
          name: "刘飞",
          self: false,
          content: "6666",
          avatar: "",
        },
        {
          id: 7,
          name: "李四",
          content: "6666666666666",
          self: false,
          avatar:
            "https://tiej2inxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },

        {
          id: 44,
          name: "菲菲",
          type: "video",
          video:
            "https://common-1251804846.cos.ap-guangzhou.myqcloud.com/video.mp4",
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
      ],
      fileList: [],
    };
  },
  methods: {
    itemClick() {
      // 控制扩展面板
      this.$refs.mChat.toggleExtend();
    },

    loadMore() {
      return new Promise((res) => {
        setTimeout(() => {
          this.messages.unshift({
            id: this.messages[0].id - 1,
            name: this.messages[0].id - 1,
            content: "111111111111111111",
            self: false,
            avatar:
              "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
          });
          res();
        }, 2000);
      });
    },
    submit(content) {
      console.log(content);
      this.messages.push({
        id: this.messages.length + 1,
        name: this.messages.length + 1,
        content: content,
        self: true,
        avatar:
          "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
      });
    },
  },
};
</script>


<style lang="scss">
* {
  margin: 0px;
  padding: 0px;
}
.van-grid-item__content {
  padding: 1vw 8vw;
  background-color: transparent;
}
</style>
