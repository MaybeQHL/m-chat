<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MChat, { Config, MessageData, MessageType } from '@maybecode/m-chat'
// import MChat from '../../../m-chat/src'
import { ref } from 'vue';
import '../node_modules/@maybecode/m-chat/dist/style.css'

const conf = ref<Config>({
  // theme: 'dark',
  // open: ["image"], // 默认全开功能
  open: ["text"],
  videoUploader: {
    maxSize: 9999,
    accept: ['video/*']
  },
  vanImagePreview: {
    closeable: true
  },
  extPanelItems: [
    // {
    //   type: "location",
    //   text: "定位",
    //   icon: "location-o"
    // },
  ]
})
const messages = ref<MessageData[]>([{
  id: 1,
  name: "我",
  self: true,
  content: {
    text: "6666666666666",
  },
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
}, {
  id: 2,
  name: "李四",
  self: false,
  type: "image",
  content: {
    imageUrl:
      "https://img1.imgtp.com/2022/09/19/sJu7LhuQ.jpg"
  },
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
},
{
  id: 3,
  name: "我",
  type: "video",
  content: {
    videoUrl:
      "http://vjs.zencdn.net/v/oceans.mp4"
  },
  self: true,
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
  isCancel: false,
  time: "2021-07-26 11:39:22",
},
{
  id: 4,
  name: "王五",
  type: "audio",
  content: {
    duration: 7,
    audioUrl:
      "https://www.heibaiketang.com/upload/mp3/testIntro.mp3",
  },
  self: false,
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
},
{
  id: 5,
  name: "我",
  type: "audio",
  content: {
    duration: 7,
    audioUrl:
      "https://www.heibaiketang.com/upload/mp3/testIntro.mp3",
  },
  self: true,
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
},
{
  id: 6,
  name: "我",
  type: "file",
  content: {
    fileUrl: "./test.json",
    fileName: "测试文件",
    fileSize: "40kb",
    fileExt: "json",
  },
  self: true,
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
  isCancel: false,
  time: "2021-07-26 11:39:22",
},
{
  id: 7,
  name: "李四",
  self: false,
  content: {
    text: '66666666666666666'
  },
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
},
{
  id: 8,
  name: "李四",
  self: false,
  content: {
    text: '66666666666666666'
  },
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
},
{
  id: 9,
  name: "李四",
  self: false,
  type: 'image',
  content: {
    imageUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
},
{
  id: 9,
  name: "李四",
  self: false,
  type: 'location',
  content: {
    location: '深圳市盐田区广东梧桐山国家森林公园',
    locationLonLat: [114.06455, 22.54846]
  },
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
},
{
  id: 9,
  name: "我",
  self: true,
  type: 'custom1',
  content: {
    customAttr: '自定义属性'
  },
  avatar:
    "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
},
])
const disabledPull = ref(false)

const onSubmit = (data: any) => {
  const typeKey = data.type == MessageType.text ? data.type : (data.type + 'Url') as any;
  const typeVal = data.type == MessageType.text ? data.content : (data.content.content) as any;
  const content = {
    [typeKey]: typeVal,
    location: '',
    locationLonLat: []
  }
  if (data.type == 'location') {
    content.location = data.content.address;
    content.locationLonLat = data.content.lonlat;
  }

  messages.value.push({
    id: messages.value.length + 1,
    name: "我",
    self: true,
    type: data.type,
    content,
    avatar:
      "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
  });

}


const onRecordStart = () => {
  console.log('微信sdk录音开始...')
}
const onRecordCancel = () => {
  console.log('微信sdk录音取消...')
}
const onRecordStop = () => {
  console.log('微信sdk录音停止...')
}

const refresh = () => {
  return new Promise((res) => {
    setTimeout(() => {
      messages.value.unshift({
        id: new Date().getTime(),
        name: new Date().getTime(),
        content: {
          text: "123213",
        },
        type: "text",
        self: false,
        avatar:
          "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
      });
      // 仅供测试 模拟数据加载完成后
      if (messages.value.length > 10) {
        disabledPull.value = true;
      }
      res(null);
    }, 2000);
  })
}
const onClickAvatar = (item: any) => {
  console.log('点击头像', item)
}

const mChatRef = ref()

const onClickPanelItem = (item: any) => {
  console.log('点击主面板item', item)
  switch (item.type) {
    // case 'location':
    //   // 可调用一些地图sdk进行定位，完成定位后这里提交给后端
    //   mChatRef.value.switchPanel(false);
    //   break;

    default:
      break;
  }

}


</script>

<template>
  <div>
    <m-chat ref="mChatRef" height="100vh" :config="conf" :messages="messages" :disabledPull="disabledPull"
      @submit="onSubmit" @recordStart="onRecordStart" @recordCancel="onRecordCancel" @recordStop="onRecordStop"
      :refresh="refresh" @clickAvatar="onClickAvatar" @clickPanelItem="onClickPanelItem">
      <!-- <template #panel>
        <div style="text-align: center;">自定义控制面板</div>
      </template> -->
      <!-- <template #emoji>
        <div style="text-align: center;">自定义表情面板</div>
      </template> -->
      <template #custom1="{ item }">
        <div>自定义插槽：</div>
        {{ item }}
      </template>
    </m-chat>
  </div>
</template>

<style scoped></style>
