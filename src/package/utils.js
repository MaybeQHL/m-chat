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