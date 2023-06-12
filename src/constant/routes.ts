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
                        component: import("@/pages/Home/views/Home/index.vue")
                    },
                    {
                        path: "write-article",
                        name: "write-article",
                        meta: {
                            title: "写文章"
                        },
                        component: import("@/pages/Home/views/WriteArticle/index.vue")
                    },
                    {
                        path: "question-answer-area",
                        name: "question-answer-area",
                        meta: {
                            title: "问答区"
                        },
                        component: import("@/pages/Home/views/QuestionAndAnswerArea/index.vue")
                    },
                    {
                        path: "study-room",
                        name: "study-room",
                        meta: {
                            title: "自习室"
                        },
                        component: import("@/pages/Home/views/StudyRoom/index.vue")
                    },
                    {
                        path: "chat-room",
                        name: "chat-room",
                        meta: {
                            title: "聊天室"
                        },
                        component: import("@/pages/Home/views/ChatRoom/index.vue")
                    },
                    {
                        path: "chat-gpt",
                        name: "chat-gpt",
                        meta: {
                            title: "ChatGPT"
                        },
                        component: import("@/pages/Home/views/ChatGPT/index.vue")
                    },
                    {
                        path: "vip",
                        name: "vip",
                        meta: {
                            title: "VIP"
                        },
                        component: import("@/pages/Home/views/VIP/index.vue")
                    },
                    {
                        path: "greedy-snake",
                        name: "greedy-snake",
                        meta: {
                            title: "贪吃蛇"
                        },
                        component: import("@/pages/Home/views/GreedySnake/index.vue")
                    },
                    {
                        path: "tetris",
                        name: "tetris",
                        meta: {
                            title: "俄罗斯方块"
                        },
                        component: import("@/pages/Home/views/Tetris/index.vue")
                    }
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
        path: "/:pathMatch(.*)*",
        name: "notFound",
        meta: {
            title: "404"
        },
        component: () => import("@/pages/NotFound/index.vue")
    }
]