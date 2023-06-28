import {SIGN_KEY_IN_HEADER, TOKEN_IN_HEADER_KEY} from "@/constant/auth.ts"
import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios"
import router from "@/router"
import {ElMessage} from "element-plus"
import nprogress from "nprogress"
import MsgTypeHandler from "@/utils/MsgTypeHandler.ts"
import {generateSignature} from "@/utils/ApiSign.ts"
import {PRIVATE_KEY} from "@/constant/ApiSignKey.ts"

// 取消请求的token
const source = axios.CancelToken.source()

const request: AxiosInstance = axios.create({
    baseURL: "/api/xingz-cm",
    timeout: 5000,
    cancelToken: source.token
})

// 请求拦截器
request.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    nprogress.start()
    // token处理
    const token = localStorage.getItem(TOKEN_IN_HEADER_KEY)
    if (token) {
        config.headers[TOKEN_IN_HEADER_KEY] = token
    }
    // 添加API签名的统一参数params，以便后端重新加密验证
    config.params = {
        ...config.params,
        timestamp: Date.now(),
        nonce: Math.random().toString(36).substr(2, 8)
    }
    const sign_value = getApiSign(config.params)
    // console.log(config.params)
    console.log(sign_value)
    if (sign_value) {
        config.headers[SIGN_KEY_IN_HEADER] = sign_value
    }
    return config
}, (err: AxiosError) => {
    nprogress.done()
    if (axios.isCancel(err)) {
        ElMessage({
            type: "error",
            message: `Request cancel:${err}`
        })
        console.error("Request cancel:", err)
    }
})

// 响应拦截器
request.interceptors.response.use((res: AxiosResponse) => {
    nprogress.done()
    // token处理
    const token = res.headers[TOKEN_IN_HEADER_KEY]
    if (token) {
        localStorage.setItem(TOKEN_IN_HEADER_KEY, token)
    }
    // 反馈处理
    MsgTypeHandler({
        type: res.data.type,
        msg: res.data.msg,
        redirectTo: "/xingz-cm"
    })
    return res.data
}, (err: AxiosError) => {
    nprogress.done()
    console.log(err?.response)
    // if (err?.response?.data?.length <= 30) {
    //     ElMessage({
    //         type: "error",
    //         message: err?.response?.data ? err?.response?.data : "error"
    //     })
    // }
    return Promise.reject(err)
})

/**
 * @description api参数签名
 * @param params
 */
function getApiSign(params: object) {
    // 1. 将参数进行排序
    const sortedParams = sortParameters(params)
    // 2. 签名
    return generateSignature(sortedParams, PRIVATE_KEY)
}

/**
 * @description 将参数进行排序
 * @param params object
 */
function sortParameters(params: object) {
    console.log(params)
    const sortedKeys = Object.keys(params).sort()
    let sortedParams = ""
    sortedKeys.forEach(key => {
        sortedParams += `${key}=${params[key]}&`
    })
    // 移除末尾的"&"字符和换行符
    sortedParams = sortedParams.slice(0, -1).replaceAll(/\n/g, "")
    console.log(sortedParams)
    return sortedParams
}

export default request