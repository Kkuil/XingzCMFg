import {createRouter, createWebHistory} from "vue-router"
import {routes} from "@/constant/routes"
import { afterEach } from "./guard"

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach(afterEach)

export default router
