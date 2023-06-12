import {createRouter, createWebHistory} from "vue-router"
import {routes} from "@/constant/routes"
import {afterEach, beforeEach} from "./guard"

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach(afterEach)
router.beforeEach(beforeEach)

export default router
