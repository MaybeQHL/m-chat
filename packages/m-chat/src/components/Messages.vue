
<template>
    <!-- mc => mc -->
    <div class="mc-msgs" :style="{ height: height }" ref="mchatScoller">
        <!-- 没有更多了 -->
        <!-- <div class="mc-msgs-finished" v-if="props.finished">
            没有更多了
        </div> -->
        <van-pull-refresh :disabled="props.disabledPull" v-model="state.loading" @refresh="onRefresh">
            <div class="mc-msg" v-for="item in messages" :key="item.id">
                <div class="mc-msg__time" v-if="item.time">{{ item.time }}</div>
                <div class="mc-msg__row" :class="[`mc-msg--${item.self ? 'self' : 'person'}`]">
                    <div class="mc-msg__avatar">
                        <van-image :src="item.avatar" @click="clickAvatar(item)" round width="10vw" height="10vw" />
                    </div>
                    <div class="mc-msg__main">
                        <div class="mc-msg__name">{{ item.name }}</div>
                        <div class="mc-msg__content-wrap">
                            <!-- 需要背景包装 -->
                            <div v-if="isRowWrap(item)" class="mc-msg__content arrow">
                                <!-- 文本 -->
                                <div v-if="!item.type || item.type == MessageType.text" class="mc-msg__text"
                                    @click.stop="clickItem('text', item)">
                                    {{ item.content.text }}
                                </div>
                                <!-- 文件 -->
                                <div class="mc-msg__file" v-if="item.type == MessageType.file">
                                    <div class="mc-msg__file-thumb">
                                        {{ item.content.fileExt }}
                                    </div>
                                    <div class="mc-msg__file-right">
                                        <div class="mc-msg__file-name" @click="clickDownloadFile(item)">
                                            {{ item.content.fileName }}
                                        </div>
                                        <span class="mc-msg__file-size">
                                            {{ item.content.fileSize }}
                                        </span>
                                    </div>
                                </div>
                                <!-- 视频 -->
                                <div class="mc-msg__video" v-if="item.type == MessageType.video"
                                    @click="clickItem('video', item)">
                                    <videoImage style="width: 8vw;height: 8vw;" />
                                </div>
                                <!-- 音频 -->
                                <div class="mc-msg__audio" :class="[item.self ? 'mc-start' : 'mc-reverse']"
                                    v-if="item.type == MessageType.audio" @click="clickItem('audio', item)">
                                    <span v-if="item.content.duration">{{ item.content.duration }} "</span>
                                    <vue-lottie :options="state.audioAnimOptions"
                                        @animCreated="(anim) => onAudioAnimCreated(anim, item)"
                                        :className="`mc-audio--${item.self ? 'right' : 'left'}`" :width="'7vw'"
                                        :height="'7vw'"></vue-lottie>
                                </div>

                                <!-- 自定义 -->
                                <div class="mc-msg__custom" v-if="isCustom(item.type)">
                                    <!-- {{ item }} -->
                                    <slot :name="item.type" :item="item"></slot>
                                </div>
                            </div>
                            <!-- 不需要背景包装 -->
                            <!-- 图片 -->
                            <div class="mc-msg__image-wrap" v-if="item.type == MessageType.image"
                                @click="clickItem('image', item)">
                                <van-image class="mc-msg__image" :src="item.content.imageUrl"
                                    @click.self="clickImagePreview" :radius="5">
                                </van-image>
                            </div>
                            <!-- 定位 -->
                            <div class="mc-msg__location" v-if="item.type == MessageType.location"
                                @click="clickItem('location', item)">
                                <div class="mc-msg__location-title">{{ item.content.location }}</div>
                                <!-- <van-icon class="mc-msg__location-icon" name="location-o"></van-icon> -->
                                <!-- 定位: {{ item }} -->
                                <SvgIcon :classes="['mc-msg__location-icon']">
                                    <locationSvg></locationSvg>
                                </SvgIcon>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </van-pull-refresh>


        <!-- 唯一音频元素 -->
        <div class="mc-audio">
            <audio ref="mChatAudio"></audio>
        </div>
        <!-- 唯一视频元素 -->
        <div class="mc-video" v-show="state.showVideo">
            <video ref="mChatVideo" controls></video>
            <div class="mc-video__btns">
                <van-icon class="mc-video__btn" name="close" size="7vw" color="#fff" @click="clickCloseVideo"></van-icon>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="MChat">
import { PropType, reactive, ref, onMounted, onUnmounted, onDeactivated, inject, watch, computed, nextTick } from 'vue';
import { Image as VanImage, ImagePreview, Icon as VanIcon, PullRefresh as VanPullRefresh, Toast } from 'vant'
import { Emitter } from 'mitt'
import VueLottie from './VueLottie.vue'
// 静态资源
import wifiJSON from '../assets/json/wifi.json'
import videoImage from '../assets/svg/video.svg'
import fileImage from '../assets/svg/file.svg'
import { Config, MessageData } from '../type';
import * as eventsConst from '../utils/events.const';
import EventCenter from '../utils/EventCenter'
import { dowanload, isWeixin, urlEncode } from '../utils/common';
import { MessageType } from '../enum'
import SvgIcon from './SvgIcon.vue';
import locationSvg from '../assets/svg/location.svg'

const props = defineProps({
    // emitter: {
    //     type: Object as PropType<Emitter<any>>
    // },
    data: {
        type: Object as PropType<MessageData>
    },
    messages: {
        type: Object as PropType<Array<MessageData>>
    },
    refresh: {
        type: Function as PropType<() => any>
    },
    /**
     * 是否禁用下拉刷新
     * @description 可用于下拉加载数据全部完成后禁用下拉动作，防止无效触发
     */
    disabledPull: {
        type: Boolean
    }
})
const state = reactive({
    loading: false,
    showVideo: false,
    audioAnimOptions: {
        animationData: wifiJSON,
        autoplay: false,
    },
    // audioAnimController: {},// 音频动画控制器
    playAudio: false, // 是否正在播放音频
})
const emitter = inject<Emitter<any>>('emitter');
// 注入配置
const config = inject<Config>('config')
let audioEc: EventCenter;

const currentItem = ref<MessageData>();

const mchatScoller = ref<HTMLElement>();
const mChatVideo = ref<HTMLVideoElement>();
const mChatAudio = ref<HTMLAudioElement>();

const parentHeight = '100%'
const height = ref(``)

const animMap = new Map();
const animMapKeyPrefix = 'ANIM_'


const currentAudioAnim = computed(() => {
    if (!currentItem.value) return;
    const controller = animMap.get(animMapKeyPrefix + currentItem.value.id);
    return controller;
})


const clickAvatar = (item) => {
    emitter.emit(eventsConst.CLICK_AVATAR, item)
}

const clickImagePreview = () => {

}

const onAnimCreated = () => {

}

const isCustom = (type: string) => {
    const arr: string[] = Object.values(MessageType)
    return !arr.includes(type)
}

const initScoller = () => {
    console.log('initScoller', mchatScoller.value.scrollTop, mchatScoller.value.scrollHeight)
    // 滚动条定位到最底部
    mchatScoller.value && (mchatScoller.value.scrollTop = mchatScoller.value.scrollHeight)
}
/**
 * 管理事件
 * @param isDestroy 
 */
const setEvents = (isDestroy = false) => {

    const mChatScollerClick = (e) => {
        emitter.emit(eventsConst.MESSAGES_CLICK);
    }

    if (isDestroy) {
        mchatScoller.value.removeEventListener('click', mChatScollerClick, true)
        console.log('已销毁messages事件')
    } else {
        mchatScoller.value.addEventListener('click', mChatScollerClick, true)
        console.log('已注册messages事件')
    }

}

const setAudioPlayer = (src, play = true) => {
    if (!src) return;
    mChatAudio.value.src = src;
    if (play) {
        mChatAudio.value.play();
    } else {
        mChatAudio.value.pause();
    }
}

const clickItem = (type, item) => {
    console.log(type, item);

    // 缓存一下上一个节点
    const lastItem = currentItem.value;
    // 设置当前选择的信息节点
    const acticeItem = currentItem.value = item;

    switch (type) {
        case 'image':
            let conf = Object.assign({
                images: [item.content.imageUrl],
            }, config.vanImagePreview);
            ImagePreview(conf);
            break;
        case 'video':
            mChatVideo.value.src = item.content.videoUrl;
            state.showVideo = true;
            break;
        case 'audio':
            // 播放/暂停当前音频
            if (lastItem && lastItem.id == acticeItem.id) {
                const anim = animMap.get(animMapKeyPrefix + lastItem.id);
                if (state.playAudio) {
                    anim.stop();
                    mChatAudio.value.pause();
                    state.playAudio = false;
                } else {
                    anim.play();
                    mChatAudio.value.play();
                    state.playAudio = true;
                }

            } else {
                // 切换音频终止上一个音频(排除初始化)
                if (lastItem && lastItem.id != acticeItem.id) {
                    const lastAnim = animMap.get(animMapKeyPrefix + lastItem.id);
                    lastAnim.stop();
                    mChatAudio.value.pause();
                }
                const anim = animMap.get(animMapKeyPrefix + acticeItem.id);

                // 初始化音频地址
                mChatAudio.value.src = item.content.audioUrl;

                // 音频结束回调
                const audioEndListener = () => {
                    console.log('音频结束回调')

                    state.playAudio = false;
                    currentAudioAnim.value.stop(); // 停止语音动画
                }
                audioEc.off('ended');
                audioEc.on('ended', audioEndListener);
                // 播放音频
                mChatAudio.value.play();
                // 播放音频动画
                anim.play();
                state.playAudio = true;

            }
            break;

        case 'location':
            window.location.href = `https://uri.amap.com/marker?position=${item.content.locationLonLat.join(',')}`
            break;
        default:
            break;
    }
}

const clickCloseVideo = () => {
    state.showVideo = false;
    mChatVideo.value.pause();
    mChatVideo.value.src = null;
}

const onAudioAnimCreated = (anim, item) => {
    animMap.set(animMapKeyPrefix + item.id, anim);
}

const clickDownloadFile = (item) => {
    if (isWeixin() && config.leadPage) {
        const url = `${config.leadPage}?url=${urlEncode(
            item.content.fileUrl
        )}&name=${urlEncode(item.content.fileName)}`;
        console.log(url);
        window.location.href = url;
    } else {
        dowanload(item.content.fileUrl, item.content.fileName);
    }
}

const onRefresh = async () => {
    try {
        state.loading = true;
        await props.refresh();
        state.loading = false;
    } catch (error) {
        Toast.fail({
            message: error.message,
            onClose: () => {
                state.loading = false;
            },
        });
    }

}

const isRowWrap = (item) => {
    const flag = (item.type != MessageType.image && item.type != MessageType.location);
    // console.log('isRowWrap', item.type, flag)
    return flag;
}

watch(() => state.playAudio, (val) => {
    if (!currentAudioAnim.value) return;
    val ? currentAudioAnim.value.play() : currentAudioAnim.value.stop();
}, {
    immediate: true
})

onMounted(() => {
    height.value = `calc(${parentHeight} - ${'16vw'})`;

    emitter.on(eventsConst.COMMENT_PANEL_SWITCH, (val) => {
        // console.log('message commentPanelSwitch :', val)
        if (val) {
            // 面板展开
            height.value = `calc(${parentHeight} - ${53 + 16}vw)`;
        } else {
            // 面板关闭
            height.value = `calc(${parentHeight} - ${'16vw'})`;
        }


        // 等待页面渲染完成
        nextTick(() => {
            initScoller();
        })
    })
    // 等待页面渲染完成
    nextTick(() => {
        initScoller();
        setEvents();

        audioEc = new EventCenter(mChatAudio.value)
    })
})
onUnmounted(() => {
    // setEvents(true);
    audioEc.destroy();
})

</script>

<style lang="scss" >
.mc-msgs {
    // height: calc(100vh - 25vw);
    overflow-y: auto;
}

.mc-msgs-finished {
    text-align: center;
    font-size: 28px;
    color: #969799;
    // padding: 15px 0px;
    height: 75px;
    line-height: 75px;

}

.mc-msg {
    font-size: 60px;


    &__row {
        display: flex;
        flex-flow: row nowrap;
        padding: 2.666vw;
        overflow: hidden;
    }

    &__avatar {
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }
    }

    &__main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0px 4vw;
    }

    &__name {
        font-size: 3.5vw;
        color: #9d9d9d;
    }

    &__content-wrap {
        display: flex;
        flex-flow: row-reverse;
    }

    &__content {
        min-width: 2vw;
        min-height: 7vw;
        display: inline-flex;
        align-items: center;
        position: relative;
        margin-top: 1.06667vw;
        padding: 1.73333vw 2.66667vw;
        // line-height: 6vw;
        border-radius: 1.33333vw;
        font-size: 3.73333vw;
        box-shadow: #f2f6fb 0px 0px 1.06667vw;
        word-break: break-all;
        flex-wrap: wrap;
        border: 1px solid transparent;
        user-select: text;

        &--clear {
            padding: 0px;
            background-color: transparent;
        }
    }



    &__text {
        line-height: 6vw;
    }

    &__image-wrap {
        display: inline-flex;
        align-items: center;
        background-color: transparent;
        max-width: 25vw;
        height: auto;
        margin-top: 2vw;
    }

    &__image {
        height: auto;
        max-height: 40vw;
        border: 1px solid #ebedf0;
    }

    &__audio {
        display: flex;
        align-items: center;
    }

    &__file {
        display: flex;
        justify-content: center;
        align-items: center;

        &-thumb {
            width: 13vw;
            height: 13vw;
            border-radius: 1vw;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ee0a24;
            color: #fff;
            font-size: 4.5vw;
            font-weight: bold;
        }

        &-right {
            margin-left: 3vw;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
        }

        &-name {
            display: inline-block;
            color: #098be2;
            max-width: 25vw;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: normal;
        }

        &-size {
            color: #777;
        }
    }

    &__location {

        background-color: #f5f5f5;
        border-radius: 10px;
        padding: 10px;

        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;

        &-title {
            padding-top: 2vw;
            font-size: 4vw;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }

        &-icon {
            width: 8vw;
            height: 8vw;
            font-size: 8vw;
            color: #68c729;
            margin-top: 10px;
        }
    }
}


.mc-msg--self {
    padding-right: 5.3333vw;
    flex-direction: row-reverse;

    .arrow::before {
        content: "";
        display: inline-block;
        position: absolute;
        top: 3vw;
        right: 0;
        // width: 0px;
        // height: 0px;
        border-width: 0.1vw 0.1vw 0 0;
        border-style: solid;
        // border-color: transparent inherit inherit transparent;
        border-color: inherit;
        // transform: translate(100%, 0%);
        background-color: inherit;
        transform: translate(50%, 0%) rotate(45deg);
        width: 3vw;
        height: 3vw;
    }

    .mc-msg__name {
        text-align: right;
    }

    .mc-msg__content-wrap {
        flex-flow: row-reverse;

    }

    .mc-msg__content {
        background-color: #9eea6a;
    }
}

.mc-msg--person {
    padding-right: 5.3333vw;
    flex-direction: row;

    .arrow::before {
        content: "";
        display: inline-block;
        position: absolute;
        top: 3vw;
        left: 0px;
        width: 0px;
        height: 0px;
        // border-width: 2vw;
        // border-style: solid;
        // border-color: transparent inherit transparent transparent;
        // transform: translate(-100%, 0%);
        // background-color: red;
        border-width: 0 0 0.1vw 0.1vw;
        border-style: solid;
        border-color: inherit;
        background-color: inherit;
        transform: translate(-50%, 0%) rotate(45deg);
        width: 3vw;
        height: 3vw;
    }

    .mc-msg__content-wrap {
        flex-flow: row;

    }

    .mc-msg__content {
        background-color: #f2f6fb;
    }

}


.mc-video {
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

    .mc-video__btns {
        z-index: 99;
        position: fixed;
        bottom: 10%;
        left: 5%;
        // padding: 5vw;
    }
}

.mc-audio {
    display: none;
}

.mc-audio--left {}

.mc-audio--right {
    transform: rotateY(180deg);
}

.mc-start {
    flex-direction: row;
}

.mc-reverse {
    flex-direction: row-reverse;
}

.mc-msg__time {
    text-align: center;
    font-size: 3.5vw;
    margin: 3vw 0px;
    color: #b0b0b0;
}
</style>