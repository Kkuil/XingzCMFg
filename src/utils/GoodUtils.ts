interface ThrottleParamsType {
    fn: (...args: any[]) => any;
    time?: number;
    count?: number;
}

export default {
    /**
     * @description 限流函數
     * @param fn
     * @param time 單位秒
     * @param count
     */
    throttle({fn, time = 1, count = 2}: ThrottleParamsType) {
        let remainCount = count
        const newFn = fn.bind(this)
        let timer = null
        return function () {
            if (remainCount > 0 || !timer) {
                newFn(arguments)
                timer = setTimeout(() => {
                    timer && clearTimeout(timer)
                    remainCount = count
                }, time * 1000)
                remainCount--
            } else {
                alert("太頻繁了，請稍後再試")
            }
        }
    }

}