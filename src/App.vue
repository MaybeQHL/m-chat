<template>
  <div id="app">
    <m-chat ref="mChat" :messages="messages" @submit="submit" :loadMore="loadMore" :comment="true" height="100vh"
      @popItemClick="popItemClick" :customRecord="false" @recordStart="recordStart" @recordStop="recordStop"
      @recordCancel="recordCancel" :imgMaxSize="8192" :videoMaxSize="8192" :fileMaxSize="8192" :config="config"
      @extendItemClick="extendItemClick">
    </m-chat>

    <van-button class="btn-theme" type="warning" @click="clickTheme">切换主题</van-button>
  </div>
</template>


<script>// @ts-nocheck

import MChat from "@/package";
// import MChat from "../lib-dist/m-chat.umd.js";

import { Grid, GridItem, Uploader, Button } from "vant";
export default {
  components: {
    MChat,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Uploader.name]: Uploader,
    [Button.name]: Button
  },
  data() {
    return {
      config: {
        theme: "light",
        // theme: 'light',
        file: {
          accept: ['*'],
        },
        /**
         * 图片预览配置（兼容vant ImagePreview 配置）
         */
        imagePreviewConfig: {
          closeable: true
        },
        /**
         * 需展示的扩展面板item
         */
        openExtends: ['image', 'video', 'file', 'custom'],
        /**
         * 需额外添加的扩展面板item
         */
        extendArr: [{
          type: "custom",
          text: "位置",
          icon: "location-o"
        },]
      },
      messages: [
        {
          id: 0,
          name: "张三",
          content: {
            text: "6666666666666",
          },
          avatar:
            "https://img1.imgtp.com/2022/09/19/7alL9xne.png",
        },
        {
          id: 1,
          name: "李四",
          content: {
            text: "6666666666666samj科技撒啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊是卡死的科技奥科吉卡死的科技科技安神科技科技ask佳都科技看见爱上科技的",
          },
          self: true,
          avatar:
            "https://img1.imgtp.com/2022/09/19/7alL9xne.png",
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
            "https://img1.imgtp.com/2022/09/19/7alL9xne.png",
        },
        {
          id: 33,
          name: "王五",
          type: "audio",
          duration: 7,
          content: {
            duration: 7,
            audioUrl:
              "https://link.jscdn.cn/sharepoint/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VWSUtBcWRtNnZaTm5NTjJDeWVVWVk4QkYzSm02ZnJyY0lGRDg1SlR5ZGM0WXc.mp3",
          },
          self: false,
          avatar:
            "https://img1.imgtp.com/2022/09/19/7alL9xne.png",
        },
        {
          id: 3,
          name: "李四",
          content: "6666666666666",
          self: false,
          type: "image",
          content: {
            imageUrl:
              "https://img1.imgtp.com/2022/09/19/sJu7LhuQ.jpg"
          },
        },
        {
          id: 4,
          name: "李四",
          self: false,
          type: "image",
          content: {
            imageUrl:
              "https://img1.imgtp.com/2022/09/19/sJu7LhuQ.jpg"
          },
          avatar:
            "https://img1.imgtp.com/2022/09/19/7alL9xne.png",
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
            "https://img1.imgtp.com/2022/09/19/7alL9xne.png",
        },

        {
          id: 55,
          name: "菲菲",
          type: "video",
          content: {
            videoUrl:
              "http://vjs.zencdn.net/v/oceans.mp4"
          },
          self: true,
          avatar:
            "https://img1.imgtp.com/2022/09/19/7alL9xne.png",
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
            "https://img1.imgtp.com/2022/09/19/7alL9xne.png",
          isCancel: false,
          time: "2021-07-26 11:39:22",
        },
      ],
      fileList: [],
    };
  },
  methods: {
    clickTheme() {
      if (this.config.theme == 'light') {
        this.config.theme = 'dark'
      } else {
        this.config.theme = 'light'
      }
    },
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
    extendItemClick(item) {
      console.log('扩展面板item点击了', item)
      if (item.type == 'custom') {
        // 控制扩展面板显示和隐藏
        this.$refs.mChat.toggleExtend();
      }
    }
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


.btn-theme {
  position: fixed;
  left: 20px;
  top: 50%;
}
</style>
