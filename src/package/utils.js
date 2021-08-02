/**
 * 判断是否在元素外触发事件
 * @param event  事件源
 * @param el 元素
 * @returns {*} true 在元素外 false 在元素内
 */
export function isOutEl(event, el) {
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

/**
 * 下载文件（支持跨域下载）
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

export const isWeixin = () => {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}


export const urlencode = (str) => {
    str = (str + '').toString();

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}


//h5复制文本到剪切板
export const copyContentH5 = (content) => {
    var copyDom = document.createElement('div');
    copyDom.innerText = content;
    copyDom.style.position = 'absolute';
    copyDom.style.top = '0px';
    copyDom.style.right = '-9999px';
    document.body.appendChild(copyDom);
    //创建选中范围
    var range = document.createRange();
    range.selectNode(copyDom);
    //移除剪切板中内容
    window.getSelection().removeAllRanges();
    //添加新的内容到剪切板
    window.getSelection().addRange(range);
    //复制
    var successful = document.execCommand('copy');
    copyDom.parentNode.removeChild(copyDom);
    try {
        var msg = successful ? "successful" : "failed";
        console.log('Copy command was : ' + msg);
    } catch (err) {
        console.log('Oops , unable to copy!');
    }
}
