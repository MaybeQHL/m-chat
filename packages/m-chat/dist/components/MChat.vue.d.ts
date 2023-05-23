import { PropType } from 'vue';
import { MessageData } from '../type';
declare const _sfc_main: import("vue").DefineComponent<{
    messages: {
        type: PropType<MessageData[]>;
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    config: {
        type: ObjectConstructor;
        default(): {};
    };
    refresh: {
        type: PropType<() => any>;
    };
    disabledPull: {
        type: BooleanConstructor;
    };
}, {
    switchPanel: (val: any) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("submit" | "recordStart" | "recordCancel" | "recordStop" | "clickAvatar" | "clickPanelItem")[], "submit" | "recordStart" | "recordCancel" | "recordStop" | "clickAvatar" | "clickPanelItem", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    messages: {
        type: PropType<MessageData[]>;
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    config: {
        type: ObjectConstructor;
        default(): {};
    };
    refresh: {
        type: PropType<() => any>;
    };
    disabledPull: {
        type: BooleanConstructor;
    };
}>> & {
    onSubmit?: (...args: any[]) => any;
    onRecordStart?: (...args: any[]) => any;
    onRecordCancel?: (...args: any[]) => any;
    onRecordStop?: (...args: any[]) => any;
    onClickAvatar?: (...args: any[]) => any;
    onClickPanelItem?: (...args: any[]) => any;
}, {
    height: string;
    config: Record<string, any>;
    disabledPull: boolean;
}>;
export default _sfc_main;
