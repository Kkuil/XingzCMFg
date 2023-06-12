import {NavigationHookAfter, NavigationGuard} from "vue-router"

/**
 * 全局前置守卫
 */
export const beforeEach: NavigationGuard = ((to, from, next) => {
    // 为每个路由添加时间戳参数
    if (to.path !== from.path) {
        // @ts-ignore
        to.query._t = Date.now()
    }
    next()
})

/**
 * 全局后置守卫
 */
export const afterEach: NavigationHookAfter = (to) => {
    if (to.meta.title) {
        document.title = "星知-" + to.meta.title
    } else {
        document.title = "星知"
    }
}