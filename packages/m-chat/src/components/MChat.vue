
<template>
    <div class="m-chat" :class="[`theme-${config.theme}`]" :style="{ height }">
        <Messages :messages="messages" :refresh="refresh">
            <template v-for="st in slotsList" #[st.name]="{ item }">
                <slot :name="st.name" :key="st.name" :item="item"></slot>
            </template>
        </Messages>
        <Comment>
            <template v-if="$slots.panel" #panel>
                <slot name="panel"></slot>
            </template>
            <template v-if="$slots.emoji" #emoji>
                <slot name="emoji"></slot>
            </template>
        </Comment>
    </div>
</template>

<script lang="ts" setup name="m-chat">
import mitt from 'mitt'
import { PropType, provide, onMounted, computed, watch, useSlots } from 'vue';
import { Config, MessageData } from '../type';
import Messages from './Messages.vue'
import Comment from './Comment.vue'
import * as eventsConst from '../utils/events.const';
import assignIn from "lodash/assignIn";

const emitter = mitt<any>()
const slots = useSlots();

Object.keys(slots).map(k => slots[k])
console.log('slots', slots)
const slotsList = Object.keys(slots).map(k => {
    return { name: k, slot: slots[k] };
})
console.log('slotsList', slotsList)
const emit = defineEmits(['submit', 'recordStart', 'recordCancel', 'recordStop', 'clickAvatar', 'clickPanelItem'])
const props = defineProps({
    messages: {
        type: Array as PropType<Array<MessageData>>
    },
    height: {
        type: String,
        default: '100vh'
    },
    config: {
        type: Object,
        default() {
            return {}
        }
    },
    refresh: {
        type: Function as PropType<() => any>
    }
})

const config = computed<Config>(() => {
    const config = props.config
    const baseConf: Config = {
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
        open: ["text", "emoji", "image", "audio", "file", "video", "location"],
        /**
         * 扩展主面板功能
         */
        extPanelItems: []
    };
    const reConf = assignIn(baseConf, config);
    // console.log('reConf', reConf, config)
    return reConf;
})


const switchPanel = (val) => {
    emitter.emit(eventsConst.COMMENT_PANEL_SWITCH, val)
}

provide('parentHeight', props.height)
provide('config', config.value);
provide('emitter', emitter);
// console.log('config', config.value)


defineExpose({
    switchPanel
})

onMounted(() => {
    emitter.on(eventsConst.COMMENT_SUBMIT, (val) => {
        // console.log('comment COMMENT_SUBMIT :', val)
        emit('submit', val)
    })

    emitter.on(eventsConst.RECORD_START, (val) => {
        // console.log('录音开始 RECORD_START :', val)
        emit('recordStart', val)
    })

    emitter.on(eventsConst.RECORD_CANCEL, (val) => {
        // console.log('录音取消 RECORD_CANCEL :', val)
        emit('recordCancel', val)
    })

    emitter.on(eventsConst.RECORD_STOP, (val) => {
        // console.log('录音停止 RECORD_STOP :', val)
        emit('recordStop', val)
    })

    emitter.on(eventsConst.CLICK_AVATAR, (val) => {
        // console.log('点击头像 AVATAR_CLICK :', val)
        emit('clickAvatar', val)
    })
    emitter.on(eventsConst.CLICK_PANEL_ITEM, (val) => {
        // console.log('点击主面板item CLICK_PANEL_ITEM :', val)
        emit('clickPanelItem', val)
    })
})
</script>

<style lang="scss" >
// @import url('../assets/css/common.css');
@import '../assets/css/theme';
@import '../assets/css/animate';
// @import url('../assets/css/vw/index.scss');

.m-chat {}
</style>