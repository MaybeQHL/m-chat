export * from './type';
export * from './enum';
export type { Config } from './type';
export type { MessageData } from './type';
declare const MChat: import("./with-install").WithInstall<import("vue").DefineComponent<{
    messages: {
        type: import("vue").PropType<import("./type").MessageData[]>;
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
        type: import("vue").PropType<() => any>;
    };
    disabledPull: {
        type: BooleanConstructor;
    };
}, {
    switchPanel: (val: any) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("submit" | "recordStart" | "recordCancel" | "recordStop" | "clickAvatar" | "clickPanelItem")[], "submit" | "recordStart" | "recordCancel" | "recordStop" | "clickAvatar" | "clickPanelItem", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    messages: {
        type: import("vue").PropType<import("./type").MessageData[]>;
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
        type: import("vue").PropType<() => any>;
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
}>>;
export default MChat;
