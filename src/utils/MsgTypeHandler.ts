import {RouteLocationRaw} from "vue-router"
import router from "@/router"
import {ElMessage} from "element-plus"

enum MsgType {
    /**
     * 静默控制台输出
     */
    SILENT = "SILENT",
    /**
     * 警告
     */
    WARN_MESSAGE = "WARN_MESSAGE",
    /**
     * 错误
     */
    ERROR_MESSAGE = "ERROR_MESSAGE",
    /**
     * 弹窗通知
     */
    NOTIFICATION = "NOTIFICATION",
    /**
     * 重定向
     */
    REDIRECT = "REDIRECT"
}

interface params {
    type: MsgType,
    msg: string,
    redirectTo: RouteLocationRaw
}

/**
 * @description 错误相应处理 只有当type为MsgType.REDIRECT时，redirectTo才有效
 */
export default function ({type, msg, redirectTo = "/xingz-cm/login"}: params) {
    switch (type) {
        case MsgType.SILENT: {
            console.log(msg)
            break
        }
        case MsgType.WARN_MESSAGE: {
            ElMessage.warning(msg)
            break
        }
        case MsgType.ERROR_MESSAGE: {
            ElMessage.error(msg)
            Promise.reject(msg).then(r => console.log(r))
            break
        }
        case MsgType.NOTIFICATION: {
            ElMessage.success(msg)
            break
        }
        case MsgType.REDIRECT: {
            ElMessage.success(msg)
            router.push(redirectTo)
            break
        }
        default: {
            ElMessage.info(msg)
        }
    }
}