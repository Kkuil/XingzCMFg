import {RouteRecordRaw} from "vue-router"

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
                component: () => import("@/pages/Home/index.vue"),
                children: [
                    {
                        path: "/xingz-cm",
                        name: "home",
                        meta: {
                            title: "欢迎您"
                        },
                        component: () => import("@/pages/Home/views/Home/index.vue")
                    },
                    {
                        path: "write-article",
                        name: "write-article",
                        meta: {
                            title: "写文章"
                        },
                        component: () => import("@/pages/Home/views/WriteArticle/index.vue")
                    },
                    {
                        path: "article/:articleId",
                        name: "article-detail",
                        meta: {
                            title: "文章详情"
                        },
                        component: () => import("@/pages/Home/views/ArticleDetail/index.vue")
                    },
                    {
                        path: "profile/:userId",
                        name: "profile",
                        meta: {
                            title: "个人主页"
                        },
                        component: () => import("@/pages/Home/views/Profile/index.vue")
                    },
                    {
                        path: "activity-detail/:activityId",
                        name: "activity-detail",
                        meta: {
                            title: "活动详情"
                        },
                        component: () => import("@/pages/Home/views/ActivityDetail/index.vue")
                    },
                ]
            },
            {
                path: "login",
                name: "login",
                meta: {
                    title: "登录"
                },
                component: () => import("@/pages/Login/index.vue")
            },
            {
                path: "registry",
                name: "registry",
                meta: {
                    title: "注册"
                },
                component: () => import("@/pages/Registry/index.vue")
            },
        ]
    },
    {
        path: "/login",
        redirect: "/xingz-cm/login"
    },
    {
        path: "/registry",
        redirect: "/xingz-cm/registry"
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