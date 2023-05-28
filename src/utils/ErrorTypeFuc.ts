import {RouteLocationRaw} from "vue-router"
import router from "@/router"
import {ElMessage} from "element-plus"

/**
 * 错误相应处理
 * 只有当type为ErrorType.REDIRECT时，redirectTo才有效
 */
export default function ({type, msg, redirectTo}: { type: API.ErrorType, msg: string, redirectTo: RouteLocationRaw }) {
    switch (type) {
    case API.ErrorType.SILENT: {
        console.log(msg)
        break
    }
    case API.ErrorType.WARN_MESSAGE: {
        console.warn(msg)
        break
    }
    case API.ErrorType.ERROR_MESSAGE: {
        console.error(msg)
        Promise.reject(msg).then(r => console.log(r))
        break
    }
    case API.ErrorType.NOTIFICATION: {
        ElMessage.warning(msg)
        break
    }
    case API.ErrorType.REDIRECT: {
        router.push(redirectTo)
        break
    }
    }
}