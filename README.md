
# m-chat
[![npm](https://img.shields.io/npm/v/@maybecode/m-chat.svg)](https://www.npmjs.com/package/@maybecode/m-chat)
[![npm](https://img.shields.io/npm/dt/@maybecode/m-chat.svg)](https://www.npmjs.com/package/@maybecode/m-chat)
[![npm](https://img.shields.io/bundlephobia/min/@maybecode/m-chat.svg)](https://www.npmjs.com/package/@maybecode/m-chat)
![NPM](https://img.shields.io/npm/l/@maybecode/m-chat)
![npm collaborators](https://img.shields.io/npm/collaborators/@maybecode/m-chat)
## 介绍
基于vue2.x 聊天(IM)UI组件(3.x以后支持)

## 演示
[Demo](https://m-chat-1251804846.cos.ap-nanjing.myqcloud.com/dist/index.html)
## 安装
```
npm install @maybecode/m-chat
```
### 全局安装
```
import Vue from 'vue'
import MChat from '@maybecode/m-chat'

Vue.use(MChat)
```
### 局部安装
```
import MChat from '@maybecode/m-chat'

export default {
  components: {
    MChat
  }
}
```
### 功能
- [x] 文字展示（支持html标签渲染）
- [x] 图片展示和预览
- [x] 视频播放
- [x] 语音播放
- [x] 自定义默认头像
- [x] 下拉加载更多
- [x] 图片/视频/语音发送功能和UI
## 预览
![main](https://m-chat-1251804846.cos.ap-nanjing.myqcloud.com/%E9%A2%84%E8%A7%88/%E5%8A%A8%E7%94%BB.gif)
## Demo
```
 <m-chat
      ref="mChat"
      :messages="messages"
      @submit="submit"
      :loadMore="loadMore"
      height="100vh"
    >
    </m-chat>
```
## Props

| 参数          | 类型     | 默认值 | 说明                                      |
| ------------- | -------- | ------ | ----------------------------------------- |
| messages      | Array    | []     | 消息数组                                  |
| height        | String   | 100vh   | 容器高度                              |
| loadMore      | Function | -      | 加载更多函数                              |
| defaultAvatar | String   | -      | 默认头像(支持本地头像require导入或者地址)   |
| comment       | Boolean  | true   | 是否显示回复框                            |
| popoverList   | Array  | []       | 气泡框 例: [{type:'chehui',text:'撤回'}]                            |
| customRecord  | Boolean | flase | 自定义录音功能(设置为true后自带录音失效，并且不触发submit事件)
| openExtends  | Array | ["image", "file", "video"] | 扩展面板显示的功能
| imgMaxSize   | Number | 500 | 图片大小上传限制(kb)
| videoMaxSize | Number | 500 | 视频大小上传限制(kb)
| fileMaxSize | Number | 500 | 文件大小上传限制(kb)
| leadPage | String | - | 微信公众号网页下载引导页面,例: http://www.xxx.com/leadPage 会跳转到 http://www.xxx.com/leadPage?url='xxx'&name='xxxxx', 注意:参数需要用decodeComponent()解密


## 消息对象
```
 {
    id: null, // 唯一id
    name: "", // 姓名
    avatar: "", // 头像地址
    self: false, // 是否是自己
    content:{
            text: "", // 文本
            duration: "", // 时长
            imageUrl: "", // 图片地址
            videoUrl: "", // 视频地址
            audioUrl: "", // 音频地址
            fileUrl: "", // 文件地址
            fileName: "", // 文件名称
            fileSize: "", // 文件大小
            filExt: "", // 文件扩展名
    },
    type: "text", // 文件类型:text|image|audio|video,
    isBack:false // 控制该消息是否已经撤回,
    time:'' // 发送时间
 }
```

## 事件

| 事件名 | 说明           | 回调参数         |
| ------ | -------------- | ---------------- |
| submit | 文字、图片、视频、语音等等发送事件 | (content:{type:string,content:object}) |
| popItemClick | 气泡框点击事件 | (obj:{type:string,data:object}) |
| recordStart | 录音开始 | - |
| recordStop | 录音停止 | ({ blob, duration})--H5录音才有回调参数，自定义录音没有 |
| recordCancel | 录音取消 | - |

## popItemClick Demo
```
     popItemClick(obj) {
      // 撤回
      if (obj.type == "chehui") {
        obj.data.isBack = true;
      }
      console.log(obj);
    }
```

## Slots
| 名称   | 说明       | 参数 |
| ------ | ---------- | ---- |
| left   | 输入框左边 | -    |
| right  | 输入框右边 | -    |
<!-- | extend | 扩展面板   | -    | -->

## 方法
通过 ref 可以获取到 mChat 实例并调用实例方法

| 方法名       | 说明                                          | 参数           | 返回值 |
| ------------ | --------------------------------------------- | -------------- | ------ |
| toggleExtend | 控制扩展面板,通过参数可以控制是否展示扩展面板 | (flag:boolean) | -      |


## LICENSE

 版权所有Copyright ©  by 或许

 [码云](https://gitee.com/null_639_5368)
  

