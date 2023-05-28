import { TOKEN_IN_HEADER_KEY, WHITE_LIST } from "@/constant/login"
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios"

// 取消请求的token
const source = axios.CancelToken.source()

const request: AxiosInstance = axios.create({
    baseURL: "/api/xingz_cm",
    timeout: 5000,
    cancelToken: source.token
})

// 请求拦截器
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    console.log(config.url)
    if (!WHITE_LIST.includes(config.url as string)) {
        const token = localStorage.getItem(TOKEN_IN_HEADER_KEY)
        if (!token) {
            source.cancel("未登录")
        }
    }
    return config
}, (err: AxiosError) => {
    if (axios.isCancel(err)) {
        console.error("Request cancel:", err)
    }
})

// 响应拦截器
request.interceptors.response.use((res: AxiosResponse) => {
    return res
}, (err: AxiosError) => {
    return Promise.reject(err)
})

export default request