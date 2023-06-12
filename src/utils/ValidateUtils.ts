/**
 * @description 验证是字符串否不为为空
 * @param name string
 * @param value any
 */
export const validateIsNotEmpty = (value: string) => {
    if (value === "" || value === null) {
        return false
    }
}

/**
 * @description 判断长度是否符合规范
 * @param name string
 * @param value string
 * @param min number
 * @param max number
 */
export const validateLen = (value: string, min: number, max: number) => {
    if (min === max) {
        if (value.length !== min) {
            return false
        }
    } else {
        if (value.length !== min) {
            return false
        }
    }
    return true
}