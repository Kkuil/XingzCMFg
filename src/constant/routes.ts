import { RouteRecordRaw } from "vue-router"

export const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/xingz-cm"
    },
    {
        path: "/xingz-cm",
        component: () => import("@/App.vue"),
        children: [
            {
                path: "/xingz-cm",
                name: "home",
                meta: {
                    title: "主页"
                },
                component: () => import("@/pages/Home/index.vue")
            },
            {
                path: "login",
                name: "login",
                meta: {
                    title: "登录"
                },
                component: () => import("@/pages/Login/index.vue")
            }
        ]
    },
    {
        path: "/login",
        redirect: "/xingz-cm/login"
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notFound",
        meta: {
            title: "404"
        },
        component: () => import("@/pages/NotFound/index.vue")
    }
]