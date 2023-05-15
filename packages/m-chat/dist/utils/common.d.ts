/**
 * 判断是否在元素外触发事件
 * @param event  事件源
 * @param el 元素
 * @returns {*} true 在元素外 false 在元素内
 */
export declare function isOutElement(event: any, el: any): boolean;
export declare const includes: (source: any[] | string, item: any, fromIndex?: number) => boolean;
export declare const join: (arr: any[], separator: string) => string;
export declare const isWeixin: () => boolean;
export declare const urlEncode: (str: any) => string;
/**
 * 下载文件
 * @param {*} url
 * @param {*} fileName
 */
export declare const dowanload: (url: any, fileName: any) => void;
