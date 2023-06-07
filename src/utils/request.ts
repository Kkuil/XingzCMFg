import {TOKEN_IN_HEADER_KEY, WHITE_LIST} from "@/constant/auth.ts"
import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError} from "axios"
import router from "@/router"
import {ElMessage} from "element-plus"
import nprogress from "nprogress"

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
    if (!WHITE_LIST.includes(config.url as string)) {
        const token = localStorage.getItem(TOKEN_IN_HEADER_KEY)
        if (!token) {
            await router.push({
                name: "login"
            })
        } else {
            config.headers[TOKEN_IN_HEADER_KEY] = token
        }
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
    const token = res.headers[TOKEN_IN_HEADER_KEY]
    if (token) {
        localStorage.setItem(TOKEN_IN_HEADER_KEY, token)
    }
    return res.data
}, (err: AxiosError) => {
    nprogress.done()
    if (err?.response?.data?.length <= 30) {
        ElMessage({
            type: "error",
            message: err?.response?.data ? err?.response?.data : "error"
        })
    }
    console.log(err?.response?.data)
    router.push({
        name: "home"
    }).then(r => console.log(r))
    return Promise.reject(err)
})

export default request