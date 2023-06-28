/**
 * @description 使用事件委托递归获取属性值
 */
export default (event: Event, propName: string) => {
    let target = event.target;
    let value = null;

    // 向上查找最近的具有 data-id 属性的元素
    while (target) {
        if (target.dataset[propName] !== undefined) {
            value = target;
            break;
        }
        target = target.parentElement;
    }

    return value ? value.dataset[propName] : null
}