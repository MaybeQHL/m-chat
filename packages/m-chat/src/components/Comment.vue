
<template>
    <div class="mc-comment">
        <div class="mc-comment__default">
            <div class="mc-comment__left">
                <svg-icon v-if="state.currentType == CurrentTypeEnum.text && isOpenFunc('audio')"
                    :classes="['mc-comment__icon']" @click="clickIcon('record')">
                    <voiceSvg></voiceSvg>
                </svg-icon>
                <svg-icon v-if="state.currentType == CurrentTypeEnum.record && isOpenFunc('text')"
                    :classes="['mc-comment__icon']" @click="clickIcon('text')">
                    <keyboardSvg></keyboardSvg>
                </svg-icon>
            </div>

            <div class="mc-comment__record" v-show="state.currentType == CurrentTypeEnum.record" ref="mChatRecord">
                <span v-show="state.recordCode == RecordCodeEnum.inactive">按住开始录音</span>
                <span v-show="state.recordCode == RecordCodeEnum.active">松开 发送</span>
                <span v-show="state.recordCode == RecordCodeEnum.cancel">松开 取消</span>
            </div>
            <form class="mc-comment__form" v-show="state.currentType == CurrentTypeEnum.text && isOpenFunc('text')"
                @submit.prevent="onInputSubmit">
                <input ref="mChatInput" class="mc-comment__form-input" @focus="onInputFocus" @blur="onInputBlur"
                    v-model="state.content" @input="onInputChange" type="text" />
            </form>
            <div class="mc-comment__right">
                <van-icon v-if="isOpenFunc('emoji')" class="mc-comment__icon" name="smile-o"
                    @click="clickIcon('emoji')"></van-icon>
                <button v-if="state.currentType == CurrentTypeEnum.text && state.showSubmitBtn" @click="onSubmit"
                    class="mc-comment__submit-btn">
                    发送
                </button>
                <van-icon v-else-if="!disabledPanel" class="mc-comment__icon" name="add-o"
                    @click="clickIcon('panel')"></van-icon>
                <!-- <transition name="move">
               
                </transition> -->
            </div>
        </div>
        <!-- 扩展面板 -->
        <div class="mc-comment__panel panel-background" v-if="state.showPanel && !disabledPanel">
            <!-- 表情包 -->
            <div class="mc-emoji" v-if="state.showEmo">
                <!--自定义表情面板 -->
                <slot name="emoji" v-if="$slots.emoji"></slot>
                <template v-else>
                    <div class="mc-emoji__wrap">
                        <div class="mc-emoji__item" v-for="(item, index) in emojiList" :key="index"
                            @click="clickEmoItem(item)">
                            {{ item.char }}
                        </div>
                    </div>
                </template>
            </div>
            <template v-else>
                <!--自定义主面板 -->
                <slot name="panel" v-if="$slots.panel"></slot>
                <!-- 主面板 -->
                <div class="mc-comment-grid" v-else>
                    <div class="mc-comment-grid__item" v-for="(item, index) in panelItems" :key="index"
                        @click="clickPanelItem(item)">
                        <div class="mc-comment-grid__item-icon">
                            <van-icon :name="item.icon" />
                        </div>
                        <div class="mc-comment-grid__item-text">
                            {{ item.text }}
                        </div>
                    </div>
                </div>

            </template>

        </div>
        <!--录音遮罩层 -->
        <div class="record-overlay" v-if="state.recordCode != RecordCodeEnum.inactive">
            <div class="record-overlay__item" v-if="state.recordCode == RecordCodeEnum.active">
                <vue-lottie :options="state.recordAnimOptions" width="20vw" height="20vw"></vue-lottie>
                <div class="record-overlay__text">手指上划,取消发送</div>
            </div>
            <div class="record-overlay__item" v-if="state.recordCode == RecordCodeEnum.cancel">
                <div class="record-overlay__icon-wrap">
                    <SvgIcon :classes="['record-overlay__icon']">
                        <closeSvg></closeSvg>
                    </SvgIcon>
                </div>
                <div class="record-overlay__text">松开取消发送录音</div>
            </div>
        </div>

        <!-- 图片上传 -->
        <van-uploader v-if="isOpenFunc('image')" v-bind="conf.vanImageUploader" ref="mChatImgUploader"
            :maxSize="conf.imageUploader.maxSize * 1024" :accept="join(conf.imageUploader.accept, ',')"
            :after-read="(file) => afterRead('image', file)" @oversize="(file) => onOversize('image', file)"
            style="display: none" />
        <!-- 文件上传 -->
        <van-uploader v-if="isOpenFunc('file')" v-bind="conf.vanFileUploader" ref="mChatFileUploader"
            :maxSize="conf.fileUploader.maxSize * 1024" :accept="join(conf.fileUploader.accept, ',')"
            :after-read="(file) => afterRead('file', file)" @oversize="(file) => onOversize('file', file)"
            style="display: none" />
        <!-- 视频上传 -->
        <van-uploader v-if="isOpenFunc('video')" v-bind="conf.vanVideoUploader" ref="mChatVideoUploader"
            :maxSize="conf.videoUploader.maxSize * 1024" :accept="join(conf.videoUploader.accept, ',')"
            :after-read="(file) => afterRead('video', file)" @oversize="(file) => onOversize('video', file)"
            style="display: none" />
        <!-- 地图 -->
        <mc-map v-if="state.showMap"></mc-map>
    </div>
</template>

<script lang="ts" setup name="MchatComment">
import { Emitter } from 'mitt';
import { PropType, computed, reactive, ref, useSlots, onMounted, onUnmounted, nextTick, watch, inject } from 'vue';
import * as eventsConst from '../utils/events.const';
import SvgIcon from './SvgIcon.vue';
import keyboardSvg from '../assets/svg/keyboard.svg'
import voiceSvg from '../assets/svg/voice.svg'
import closeSvg from '../assets/svg/close.svg'
import { Icon as VanIcon, Uploader as VanUploader, UploaderInstance, Toast, UploaderFileListItem } from 'vant'
import { Config } from '../type';
import VueLottie from "./VueLottie.vue";
import recordingJson from '../assets/json/recording.json'
import AnyTouch from 'any-touch';
import { isOutElement, includes, join } from '../utils/common';
import EventCenter from '../utils/EventCenter'
import assignIn from "lodash/assignIn";
import merge from "lodash/merge";
import emojiList from '../assets/json/emoji.json'
import McMap from './Map.vue'
// import { ActionSheet as VanActionSheet } from 'vant'

enum CurrentTypeEnum {
    text,
    record
}

enum RecordCodeEnum {
    /**
     * 未录音
     */
    inactive,
    /**
     * 录音中
     */
    active,
    /**
     * 录音取消
     */
    cancel,
}
const slots = useSlots();
// const props = defineProps({

// })
const state = reactive({
    content: '',
    showPanel: false,
    showSubmitBtn: false,
    showEmo: false,
    showMap: false,
    currentType: CurrentTypeEnum.text, // 
    recordCode: RecordCodeEnum.inactive, // 0 未录音 1 录音中 2 取消录音中
    recordAnimOptions: {
        animationData: recordingJson,
        autoplay: true,
    },
})
const emitter = inject<Emitter<any>>('emitter');
const mChatInput = ref<HTMLElement>();
const mChatRecord = ref<HTMLElement>();
const mChatImgUploader = ref<UploaderInstance>();
const mChatFileUploader = ref<UploaderInstance>();
const mChatVideoUploader = ref<UploaderInstance>();

let eventCenter: EventCenter;
const defaultPanelItems = ref([
    {
        type: "image",
        text: "图片",
        icon: "photo-o",
        classPrefix: ''
    },
    {
        type: "video",
        text: "视频",
        icon: "video-o",
    },
    {
        type: "file",
        text: "文件",
        icon: "description",
    },
    {
        type: "location",
        text: "定位",
        icon: "location-o"
    },
])

// 注入配置
const conf = inject<Config>('config')

const panelItems = computed(() => {
    return [...defaultPanelItems.value.filter(it => conf.open.includes(it.type)), ...conf.extPanelItems];
})

const disabledPanel = computed(() => {
    return panelItems.value.length == 0
})
const onInputBlur = () => {

}
const onInputFocus = () => {
    state.showSubmitBtn = true;
}
const onInputChange = (e) => {

}
const onInputSubmit = () => {
    if (!state.content) return;
    const result = {
        type: 'text',
        content: state.content
    }
    emitter.emit(eventsConst.COMMENT_SUBMIT, result);
    emitter.emit(eventsConst.COMMENT_PANEL_SWITCH, false)
    console.log(result)
    // 清空输入框
    state.content = '';
}

const onSubmit = () => {
    onInputSubmit();
}

/**
 * 检测功能是否开启
 * @param type 
 */
const isOpenFunc = (type: string) => {
    return conf.open.includes(type);
}

const clickIcon = (name: string) => {
    switch (name) {
        case 'panel':
            if (state.showEmo) {
                state.showEmo = false;
            } else {
                state.showPanel = !state.showPanel;
            }
            emitter.emit(eventsConst.COMMENT_PANEL_SWITCH, state.showPanel)
            break;
        case 'record':
            state.currentType = CurrentTypeEnum.record;
            break;
        case 'text':
            state.currentType = CurrentTypeEnum.text;
            break;
        case 'emoji':

            if (state.showPanel) {
                if (state.showEmo) {
                    state.showEmo = false;
                    state.showPanel = false;
                } else {
                    state.showEmo = true;
                }
            } else {
                state.showPanel = true;
                state.currentType = CurrentTypeEnum.text;
                state.showEmo = true;
            }
            emitter.emit(eventsConst.COMMENT_PANEL_SWITCH, state.showPanel)
            break;
        default:
            break;
    }
}


/**
 * 管理事件
 * @param isDestroy 
 */
const setEvents = (isDestroy = false) => {

    const recordTouchStart = (e) => {
        // console.log('触摸开始', e)
        e.preventDefault();
        // return;
        state.recordCode = RecordCodeEnum.active
        emitter.emit(eventsConst.RECORD_START)
    }
    const recordTouchMove = (e) => {
        // console.log('触摸中', e)
        e.preventDefault();
        // return;
        if (isOutElement(e.changedTouches[0], mChatRecord.value)) {
            state.recordCode = RecordCodeEnum.cancel
        } else {
            state.recordCode = RecordCodeEnum.active
        }
    }
    const recordTouchEnd = (e) => {
        // console.log('触摸结束', e)
        e.preventDefault();
        // return;
        // 取消录音
        if (state.recordCode == RecordCodeEnum.cancel) {
            // console.log('录音取消')
            state.recordCode = RecordCodeEnum.inactive;
            emitter.emit(eventsConst.RECORD_CANCEL)
            return;
        }
        // 正常结束录音
        if (state.recordCode == RecordCodeEnum.active) {
            // console.log('录音结束')
            state.recordCode = RecordCodeEnum.inactive;
            emitter.emit(eventsConst.RECORD_STOP)
        }

    }

    eventCenter = new EventCenter(mChatRecord.value)

    eventCenter.on('touchstart', recordTouchStart)
    eventCenter.on('touchmove', recordTouchMove)
    eventCenter.on('touchend', recordTouchEnd)

}

const clickPanelItem = (item) => {
    switch (item.type) {
        case 'image':
            mChatImgUploader.value.chooseFile();
            break;
        case 'video':
            mChatVideoUploader.value.chooseFile();
            break;
        case 'file':
            mChatFileUploader.value.chooseFile();
            break;
        case 'location':
            if (!conf.amap || !conf.amap.key) {
                Toast.fail('缺少高德地图key')
                return;
            }
            state.showMap = true;
            break;
        default:
            break;
    }
    emitter.emit(eventsConst.CLICK_PANEL_ITEM, item)
}

const clickEmoItem = (item) => {
    state.content += item.char + " ";
    mChatInput.value.focus();
    state.showSubmitBtn = true;
}

const afterRead = (type: string, file) => {
    // 此时可以自行将文件上传至服务器
    console.log('afterRead', file);
    const c = conf
    const result = {
        type: '',
        content: file
    }
    switch (type) {
        case 'image':
            if (
                !((c.imageUploader.accept.includes('image/*') && file.file.type.includes('image/'))) &&
                !(c.imageUploader.accept).includes(file.file.type)
            ) {
                Toast.fail("图片格式不支持上传");
                return;
            }
            result.type = 'image';

            break;
        case 'file':
            if (
                !c.fileUploader.accept.includes("*") && !c.fileUploader.accept.includes(file.file.type)
            ) {
                Toast.fail("文件格式不支持上传");
                return;
            }
            result.type = 'file';
            break;
        case 'video':
            if (
                !((c.videoUploader.accept.includes('video/*') && file.file.type.includes('video/'))) &&
                !(c.videoUploader.accept).includes(file.file.type)
            ) {
                Toast.fail("视频格式不支持上传");
                return;
            }
            result.type = 'video';
            break;
        default:
            break;
    }
    emitter.emit(eventsConst.COMMENT_SUBMIT, result);
    emitter.emit(eventsConst.COMMENT_PANEL_SWITCH, false)
}

const onOversize = (type, file) => {
    console.log(file);
    const c = conf;
    switch (type) {
        case 'image':
            Toast.fail(`图片大小不能超过 ${c.imageUploader.maxSize}kb`);
            break;
        case 'file':
            Toast.fail(`文件大小不能超过 ${c.fileUploader.maxSize}kb`);
            break;
        case 'video':
            Toast.fail(`视频大小不能超过 ${c.videoUploader.maxSize}kb`);
            break;
        default:
            break;
    }

}


watch(() => state.content, (val) => {
    state.content ? (state.showSubmitBtn = true) : (state.showSubmitBtn = false)
})



onMounted(() => {
    emitter.on(eventsConst.COMMENT_PANEL_SWITCH, (val) => {
        console.log(`comment ${eventsConst.COMMENT_PANEL_SWITCH}:`, val)
        // 没有传变量自动切换当前的状态
        if (val == undefined) {
            state.showPanel = !state.showPanel;
            return;
        }
        val != state.showPanel && (state.showPanel = val);
    })
    emitter.on(eventsConst.MESSAGES_CLICK, (val) => {
        console.log(`comment ${eventsConst.MESSAGES_CLICK}:`, val);
        // 没有打开控制面板直接终止逻辑
        if (!state.showPanel) {
            return;
        }
        state.showPanel = false;
        state.showEmo = false;
        emitter.emit(eventsConst.COMMENT_PANEL_SWITCH, state.showPanel)
    })
    emitter.on(eventsConst.CLICK_MAP_SEND, (val) => {
        console.log(`comment ${eventsConst.CLICK_MAP_SEND}:`, val);
        state.showMap = false;
        // 提交定位结果
        const result = {
            type: 'location',
            content: val
        }
        emitter.emit(eventsConst.COMMENT_SUBMIT, result);
        emitter.emit(eventsConst.COMMENT_PANEL_SWITCH, false);
    })
    emitter.on(eventsConst.CLICK_MAP_CANCEL, (val) => {
        console.log(`comment ${eventsConst.CLICK_MAP_CANCEL}:`, val);
        state.showMap = false;
    })

    // 如果没有扩展面板
    // if (conf.open.length == 1 && conf.open.includes('text')) {
    //     state.currentType = CurrentTypeEnum.text;
    //     state.showSubmitBtn = true;
    // }
    nextTick(() => {
        setEvents();
    })
})
onUnmounted(() => {
    // setEvents(true)
    eventCenter.destroy();
})

</script>

<style lang="scss" >
.flex {
    display: flex;
}

.mc-comment {

    // position: relative;
    // position: fixed;
    // left: 0px;
    // right: 0px;
    // bottom: 0px;
    background-color: #f7f7f7;
    // height: 15vw;
    box-sizing: border-box;


    &__right {
        display: flex;
    }

    .mc-comment__default {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3vw 5vw;
        height: 16vw;
        box-sizing: border-box;
    }

    .mc-comment__icon {
        width: 8vw;
        height: 8vw;
        font-size: 8vw;
        color: #000;
        margin: 0 0.6vw;
    }

    &__form {
        flex: 1;
        display: flex;
        background-color: #fff;
        margin: 0px 2vw;

        &-input {
            width: 100%;
            // height: 5vw;
            border: none;
            // -webkit-appearance: none; /*去除阴影边框*/
            //   -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /*点击高亮的颜色*/
            outline: none;
            border-radius: 10px;
            caret-color: #9eea6a;
            background-color: transparent;
            // padding: 15px 0px;
            margin: 0px 2vw;
            font-size: 4vw;
            height: 10vw;
            box-sizing: border-box;
            overflow: hidden;
        }
    }

    &__submit-btn {

        display: block;
        font-size: 4vw;
        margin-left: 2vw;
        padding: 0vw 4vw;
        background-color: #0bbe62;
        color: #fff;
        border-radius: 1vw;
        outline: none;
        border: none;
        box-sizing: content-box;
        height: 8vw;
        line-height: 8vw;

        &:active,
        :hover {
            opacity: 0.6;
        }
    }

    &__panel {
        height: 53vw;
        // border: 1px solid red;
        box-sizing: border-box;
    }

    .mc-comment-grid {
        display: flex;
        flex-flow: row wrap;
        padding: 3vw 0vw;

        &__item {
            box-sizing: content-box;
            // margin: 1vw;
            flex-basis: 25%;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;

            &-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                color: #000;
                font-size: 10vw;
                width: 16vw;
                height: 16vw;
                border-radius: 10px;
            }

            &-text {
                font-size: 3.1vw;
                margin: 2vw 0vw;
                color: #000;
            }
        }
    }


    .mc-comment__record {
        flex: 1;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        font-size: 4vw;
        height: 10vw;
        margin: 0px 2vw;
        overflow: hidden;
        box-sizing: border-box;
    }

}

.mc-emoji {

    height: 100%;
    overflow-y: auto;

    .mc-emoji__wrap {
        display: flex;
        flex-flow: row wrap;
    }

    .mc-emoji__item {
        flex-basis: 15%;
        margin: 1.5vw 2vw;
        font-size: 6vw;
        user-select: none;
        text-align: center;
        box-sizing: content-box;
    }
}



.record-overlay {
    position: fixed;
    top: 49.5%;
    left: 49.5%;
    padding: 4vw 2vw;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 99;
    color: #fff;
    text-align: center;
    transform: translate(-50%, -50%);
    width: 40vw;
    height: 25vw;
    font-size: 4vw;

    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    .record-overlay__item {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: space-between;
        // height: 100%;
    }

    .record-overlay__text {
        // margin-top: 3vw;
    }

    &__icon-wrap {
        width: 20vw;
        height: 20vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__icon {
        margin-bottom: 3vw;
        width: 10vw;
        height: 10vw;
    }



}
</style>