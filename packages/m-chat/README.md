# m-chat
<p style="text-align:center;font-size:20px">基于vue3的拆箱即用的IM组件</p>

[![npm](https://img.shields.io/npm/v/@maybecode/m-chat/next.svg)](https://www.npmjs.com/package/@maybecode/m-chat)

[![npm](https://img.shields.io/npm/dt/@maybecode/m-chat/next.svg)](https://www.npmjs.com/package/@maybecode/m-chat)



## 功能

* [x] 文字展示（支持html标签渲染）
* [x] 图片展示和预览
* [x] 视频播放
* [x] 语音播放
* [x] 自定义默认头像
* [x] 下拉加载更多
* [x] 图片/视频/语音发送功能
* [x] 提供自定义类型插槽（custom）进行业务的定制
* [x] 支持Typescript

## 示例

示例源码：参考`examples`目录下面的`App.vue`文件
在线示例：[Demo](http://null_639_5368.gitee.io/m-chat)

## 安装

```
npm install @maybecode/m-chat@next
```

## Props

| 参数     | 类型     | 默认值 | 说明                           |
| -------- | -------- | ------ | ------------------------------ |
| messages | Array    | []     | 消息数组                       |
| height   | String   | 100vh  | 容器高度                       |
| refresh  | Function | -      | 刷新(加载更多)回调             |
| config   | Object   | -      | 高级配置(详情见下方config定义) |


## config 

默认配置 具体的参数规则在编辑器中都会有提示

```js
{
        /**
         * 主题
         */
        theme: 'light',
         /**
        * 图片上传配置(vant) 文件、视频...以此类推
        * @doc vant-uploader  https://vant-contrib.gitee.io/vant/#/zh-CN/uploader#props
        * @warn 如果和imageUploader中的配置存在冲突那么以imageUploader为准
        */
        vanImageUploader: {},
        /**
         * 图片上传
         */
        imageUploader: {
            /**
             * 文件大小限制，单位为 kb
             */
            maxSize: 500,
            /**
             * 允许的文件类型
             */
            accept: ["image/*"]
        },
        /**
         * 文件上传
         */
        fileUploader: {
            maxSize: 500,
            accept: ['*'],
        },
        /**
         * 视频上传
         */
        videoUploader: {
            maxSize: 500,
            accept: ['video/*']
        },
        /**
         * 开放的功能
         */
        open: ["text", "emoji", "image","audio", "file", "video"],
         /**
        * 扩展主面板功能
        * @demo  [{
            type: "location",
            text: "定位",
            icon: "location-o" // 支持http(s)地址或者vant自带的icon
         }]
         * @description 配置此选项将额外的功能item添加到列表中
         */
        extPanelItems: []
}
```
## msg(消息)对象

```
 {
    id: null, // 唯一id
    name: "", // 姓名
    avatar: "", // 头像地址
    self: false, // 是否是自己
    type: "text", // 类型: text|image|audio|video|file
    content:{
            text: "", // 文本
            duration: "", // 时长
            imageUrl: "", // 图片地址
            videoUrl: "", // 视频地址
            audioUrl: "", // 音频地址
            fileUrl: "", // 文件地址
            fileName: "", // 文件名称
            fileSize: "", // 文件大小
            fileExt: "", // 文件扩展名
    },
    isCancel:false // 控制该消息是否已经撤回,
    time:'' // 发送时间
 }
```

## 事件

| 事件名       | 说明                                     | 回调参数                          |
| ------------ | ---------------------------------------- | --------------------------------- |
| submit       | 文字、图片、视频、语音、文件等等发送事件 | ({ type:string, content:object }) |
| popItemClick | 气泡框点击事件                           | ({ type:string, data:object })    |
| recordStart  | 录音开始                                 | -                                 |
| recordStop   | 录音停止                                 | ({ blob:Blob, duration:number})   |
| recordCancel | 录音取消                                 |

## Slots

| 名称                          | 说明           | 参数     |
| ----------------------------- | -------------- | -------- |
| [custon(对应msg中的type属性)] | 自定义消息类型 | { item } |
| panel                         | 自定义扩展面板 | -        |

## 方法

通过 ref 可以获取到 m-chat 实例并调用实例方法

| 方法名      | 说明              | 参数           | 返回值 |
| ----------- | ----------------- | -------------- | ------ |
| switchPanel | 扩展面板显示/隐藏 | (flag:boolean) | -      |

## 使用须知

### 录音
从3.0版本开始组件主体不再内置H5录音相关具体实现,如果有需求利用`recordStart`,`recordCancel`,`recordStop`相关回调和 [Recorder](https://github.com/xiangyuecn/Recorder) 录音库进行开发。
对于微信公众号环境可以调用`JSSDK`中内置的录音方法配合回调来进行开发。
<!-- *后续如果有时间可能开发相关插件进行扩展* -->