import { PropType } from 'vue';
import { MessageData } from '../type';
declare const _sfc_main: import("vue").DefineComponent<{
    data: {
        type: PropType<MessageData>;
    };
    messages: {
        type: PropType<MessageData[]>;
    };
    refresh: {
        type: PropType<() => any>;
    };
    /**
     * 是否禁用下拉刷新
     * @description 可用于下拉加载数据全部完成后禁用下拉动作，防止无效触发
     */
    disabledPull: {
        type: BooleanConstructor;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    data: {
        type: PropType<MessageData>;
    };
    messages: {
        type: PropType<MessageData[]>;
    };
    refresh: {
        type: PropType<() => any>;
    };
    /**
     * 是否禁用下拉刷新
     * @description 可用于下拉加载数据全部完成后禁用下拉动作，防止无效触发
     */
    disabledPull: {
        type: BooleanConstructor;
    };
}>>, {
    disabledPull: boolean;
}>;
export default _sfc_main;
