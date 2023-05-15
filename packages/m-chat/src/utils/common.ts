/**
 * 判断是否在元素外触发事件
 * @param event  事件源
 * @param el 元素
 * @returns {*} true 在元素外 false 在元素内
 */
export function isOutElement(event, el) {
    const { height, width, x, y } = el.getBoundingClientRect();
    const { clientX, clientY } = event;
    if (
        clientY > y + height ||
        clientY < y ||
        clientX < x ||
        clientX > x + width
    ) {
        return true;
    }
    return false;
}


export const includes = (source: any[] | string, item: any, fromIndex?: number) => {
    return source.includes(item, fromIndex);
}
export const join = (arr: any[], separator: string) => {
    return arr.join(separator);
}

export const isWeixin = () => {
    var ua = navigator.userAgent.toLowerCase();
    const res = ua.match(/MicroMessenger/i) as unknown as string;
    if (res == "micromessenger") {
        return true;
    } else {
        return false;
    }
}


export const urlEncode = (str) => {
    str = (str + '').toString();

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}



/**
 * 下载文件
 * @param {*} url 
 * @param {*} fileName 
 */
export const dowanload = (url, fileName) => {
    var x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.responseType = 'blob';
    x.onload = function (e) {
        var url = window.URL.createObjectURL(x.response)
        var a = document.createElement('a');
        a.href = url
        a.download = fileName;
        a.click()
    }
    x.send();
}
