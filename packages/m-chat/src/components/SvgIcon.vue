
<template>
    <div class="m-chat-svg-icon" :class="[...classes]" :style="{ color }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup name="SvgIcon">
import { PropType, reactive, defineProps } from 'vue';

const props = defineProps({
    color: {
        type: String,
        defualt: '#000'
    },
    classes: {
        type: Array,
        defualt() {
            return []
        }
    },
    // 利用class 自己去style限制大小
    // size: {
    //     type: String,
    //     defualt: '50px'
    // }
})
// const state = reactive({

// })



</script>

<style lang="scss" >
.m-chat-svg-icon {
    width: 50px;
    height: 50px;
}

.m-chat-svg-icon svg {
    width: 100%;
    height: 100%;

    path {
        // 设置一个默认的颜色
        // fill: #000;
        /* 通过给svg 图形元素设置fill= currentColor 图形元素的颜色会自动继承父级color的颜色 */
        fill: currentColor;
    }
}
</style>