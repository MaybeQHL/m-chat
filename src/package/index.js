export { default as MChatComment } from './Comment.vue'
export { default as MChatMessage } from './Message.vue'

import Mchat from './Wrap.vue'

// vue的install方法，用于定义vue插件
Mchat.install = (Vue) => {
    Vue.component('m-chat', Mchat)
};
export default Mchat; // 提供按需导入组件