/**
 * 请求白名单
 */
export const WHITE_LIST = [
    "/user-login-account",
    "/user-registry-phone",
    "/user-sms",
    "/user-forget-pwd"
]

/**
 * 响应头中的token key
 */
export const TOKEN_IN_HEADER_KEY = "xingz_cm_user_token"

/**
 * 手机号正则表达式
 */
export const PHONE_REG = /1[3-9]\d{9}/

/**
 * 存于请求头中的sign key值
 */
export const SIGN_KEY_IN_HEADER = "x-api-sign"