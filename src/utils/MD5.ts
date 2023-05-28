import MD5 from "crypto-js/md5"

/**
 * 使用md5加密
 * @param {*} message
 */
export default {
    encode(data: string) {
        return MD5(data).toString()
    }
}
