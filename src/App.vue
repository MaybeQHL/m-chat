<template>
  <div id="app">
    <m-chat
      ref="mChat"
      :messages="messages"
      @submit="submit"
      :loadMore="loadMore"
      :comment="true"
      height="100vh"
      @popItemClick="popItemClick"
      :customRecord="false"
      @recordStart="recordStart"
      @recordStop="recordStop"
      @recordCancel="recordCancel"
      :imgMaxSize="8192"
      :videoMaxSize="8192"
      :fileMaxSize="8192"
    >
      <template #left> </template>
      <template #right></template>
      <template #extend>
        <van-grid :column-num="3" icon-size="10vw" :border="false">
          <van-grid-item
            class="my-grid-item"
            icon="photo-o"
            text="图片"
            v-for="item in 6"
            :key="item"
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
import MChat from "@/package";
// import MChat from "../lib-dist/m-chat.umd.js";

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
          content: {
            text: "6666666666666",
          },
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 1,
          name: "李四",
          content: {
            text: "6666666666666samj科技撒啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊是卡死的科技奥科吉卡死的科技科技安神科技科技ask佳都科技看见爱上科技的",
          },
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 3332,
          name: "李四",
          type: "audio",
          content: {
            duration: 7,
            audioUrl:
              "https://common-1251804846.cos.ap-guangzhou.myqcloud.com/test.mp3",
          },
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 33,
          name: "王五",
          type: "audio",
          duration: 7,
          content: {
            duration: 7,
            audioUrl:
              "https://music-10014144.cos.ap-shanghai.myqcloud.com/Cassandra%20-%20Doobi%20Doobi%20Doo%20(Don't%20Be%20Shy).mp3",
          },
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
          content: {
            imageUrl:
              "https://common-1251804846.cos.ap-guangzhou.myqcloud.com/jjy.jpg",
          },
        },
        {
          id: 4,
          name: "李四",
          self: false,
          type: "image",
          content: {
            imageUrl:
              "https://common-1251804846.cos.ap-guangzhou.myqcloud.com/1.jpg",
          },
          avatar:
            "https://tiej2inxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },
        {
          id: 44,
          name: "刘飞",
          self: false,
          content: {
            text: "6666",
          },
          avatar: "",
          time: "2021-07-26 11:39:22",
        },
        {
          id: 7,
          name: "李四",
          content: {
            text: "21321312",
          },
          self: false,
          isCancel: true,
          time: "2021-07-26 11:39:22",
          avatar:
            "https://tiej2inxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        },

        {
          id: 55,
          name: "菲菲",
          type: "video",
          content: {
            videoUrl:
              "https://common-1251804846.cos.ap-guangzhou.myqcloud.com/video.mp4",
          },
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
          isCancel: false,
          time: "2021-07-26 11:39:22",
        },
        {
          id: 66,
          name: "菲菲",
          type: "file",
          content: {
            fileUrl:
              "https://im.popoim.com/upload/files/202107/296102102f6747.json",
            fileName: "奥特女战士",
            fileSize: "200kb",
            fileExt: "json",
          },
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
          isCancel: false,
          time: "2021-07-26 11:39:22",
        },
      ],
      fileList: [],
    };
  },
  methods: {
    recordStart() {
      console.log("recordStart");
    },
    recordCancel() {
      console.log("recordCancel");
    },
    recordStop(data) {
      const file = new window.File([data.blob], new Date().getTime());
      console.log(file, file);
      const audio = document.createElement("audio");
      audio.src = (window.URL || webkitURL).createObjectURL(data.blob);
      audio.play();
      console.log("recordStop", data);
    },
    itemClick() {
      // 控制扩展面板
      this.$refs.mChat.toggleExtend();
    },

    loadMore() {
      return new Promise((res) => {
        setTimeout(() => {
          this.messages.unshift({
            id: new Date().getTime(),
            name: new Date().getTime(),
            content: {
              text: "123213",
            },
            type: "text",
            self: false,
            avatar:
              "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
          });
          res();
        }, 2000);
      });
    },
    submit(data) {
      console.log(data);
      if (data.type == "text") {
        this.messages.push({
          id: new Date().getTime(),
          name: this.messages.length + 1,
          content: {
            text: data.content,
          },
          type: "text",
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        });
      }
      if (data.type == "image") {
        this.messages.push({
          id: new Date().getTime(),
          name: this.messages[0].id - 1,
          type: "image",
          content: {
            imageUrl: data.content.content,
          },
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        });
      }
      if (data.type == "audio") {
        this.messages.push({
          id: new Date().getTime(),
          name: this.messages[0].id - 1,
          type: "audio",
          content: {
            audioUrl: (window.URL || webkitURL).createObjectURL(
              data.content.blob
            ),
            duration: Math.ceil(data.content.duration / 1000),
          },
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        });
      }
      if (data.type == "video") {
        this.messages.push({
          id: new Date().getTime(),
          name: this.messages[0].id - 1,
          type: "video",
          content: {
            videoUrl: data.content.content,
          },
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
        });
      }
      if (data.type == "file") {
        this.messages.push({
          id: new Date().getTime(),
          name: "菲菲",
          type: "file",
          content: {
            fileUrl: data.content.content,
            fileName: data.content.file.name,
            fileSize: `${Math.ceil(data.content.file.size / 1024)}kb`,
            fileExt: data.content.file.type,
          },
          self: true,
          avatar:
            "https://tiejinxiaoyuan-v2-1251804846.cos.ap-guangzhou.myqcloud.com/avatar_3.jpg",
          isCancel: false,
          time: "2021-07-26 11:39:22",
        });
      }
    },
    popItemClick(obj) {
      // 撤回
      if (obj.type == "cancel") {
        obj.data.isCancel = true;
      }
      console.log(obj.item);
    },
  },
};
</script>


<style lang="scss">
* {
  margin: 0px;
  padding: 0px;
}
html,
body {
  height: 100%;
  width: 100%;
}
.van-grid-item__content {
  padding: 1vw 8vw;
  background-color: transparent;
}
</style>
