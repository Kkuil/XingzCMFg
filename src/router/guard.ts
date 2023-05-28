import {NavigationHookAfter} from "vue-router"

/**
 * 全局后置守卫
 */
export const afterEach: NavigationHookAfter = (to) => {
    if (to.meta.title) {
        document.title = to.meta.title + "-星知"
    } else {
        document.title = "星知"
    }
}