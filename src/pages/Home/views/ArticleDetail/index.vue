<script setup lang="ts">
import {useRoute, useRouter} from "vue-router"
import {h, ref, watch} from "vue"
import {collect, getArticleById, like, visit} from "@/api/article.ts"
import moment from "moment"
import _ from "lodash"
import {useDialog} from "@/hooks/useDialog"
import Form from "@/components/Form/index.vue"
import Comment from "./components/Comment.vue"
import {ElMessage} from "element-plus";
import {TOKEN_IN_HEADER_KEY} from "@/constant/auth.ts";

const $route = useRoute()
const $router = useRouter()
const article = ref<ArticleDetail.ArticleDetailInfoWithUser>({})
const dialogFormVisible = ref<boolean>(false);

// 初始化文章详情
watch(() => $route, async (route) => {
    const articleId = route.params.articleId
    if (articleId) {
        const res = await getArticleById(articleId as string)
        if (res.data) {
            article.value = res.data
        } else {
            $router.back()
        }
    }
}, {
    deep: true,
    immediate: true
});

// 浏览过
(async function () {
    // 浏览过
    const token = localStorage.getItem(TOKEN_IN_HEADER_KEY)
    if (token) {
        await visit($route.params.articleId as string)
    }
})();

/**
 * 计算数量
 */
const computeCount = (value) => {
    if (!value) {
        return 0
    }
    return value > 999 ? "999+" : value
}

/**
 * 喜欢或不喜欢
 */
const likeArticle = _.throttle(async () => {
    let res: API.Result
    try {
        res = await like($route.params.articleId as string) as API.Result
    } catch (e) {
        dialogFormVisible.value = true
        ElMessage.error("请先登录")
        $router.push("/login")
    }
    article.value.articleDetailInfo.isLiked = res.data as boolean
    article.value.articleDetailInfo?.isLiked ? article.value.articleDetailInfo.likedCount++ : article.value.articleDetailInfo.likedCount--
}, 500)

/**
 * 收藏或不收藏
 */
const collectArticle = _.throttle(async () => {
    let res: API.Result
    try {
        res = await collect($route.params.articleId as string) as API.Result
    } catch (e) {
        console.log(123)
        useDialog({
            header: "登录星知享更多权益",
            content: h(Form),
            footer: "自定义页脚"
        })
    }
    article.value.articleDetailInfo.isCollected = res.data as boolean
    article.value.articleDetailInfo.isCollected ? article.value.articleDetailInfo.collectedCount++ : article.value.articleDetailInfo.collectedCount--
}, 500)

</script>

<template>
    <div
        class="tools w-[60px] h-[280px] fixed top-1/3 left-[120px] -translate-y-1/2 flex-col justify-between z-[1] hidden xl:flex"
    >
        <el-tooltip placement="top" :content="article.articleDetailInfo?.isLiked ? '取消点赞' : '点赞'">
            <div
                class="liked w-[60px] h-[60px] rounded-full shadow-lg flex-center flex-col cursor-pointer"
                :class="article.articleDetailInfo?.isLiked ? 'bg-[#5d93bb] text-white' : 'bg-white'"
                @click="likeArticle"
            >
                <i class="liked-icon iconfont icon-thumb-up text-[24px] transition-all"></i>
                <span class="text-[12px] mt-[-7px]">{{ computeCount(article.articleDetailInfo?.likedCount) }}</span>
            </div>
        </el-tooltip>
        <el-tooltip placement="top" :content="article.articleDetailInfo?.isCollected ? '取消收藏' : '收藏'">
            <div
                class="collected w-[60px] h-[60px] rounded-full shadow-lg flex-center flex-col cursor-pointer"
                :class="article.articleDetailInfo?.isCollected ? 'bg-[#5d93bb] text-white' : 'bg-white'"
                @click="collectArticle"
            >
                <i class="collected-icon iconfont icon-collection text-[24px] transition-all"></i>
                <span class="text-[12px] mt-[-7px]">{{ computeCount(article.articleDetailInfo?.collectedCount) }}</span>
            </div>
        </el-tooltip>
        <el-tooltip placement="top" content="分享">
            <div class="shared w-[60px] h-[60px] rounded-full shadow-lg flex-center cursor-pointer bg-white">
                <i class="shared-icon iconfont icon-share text-[24px] transition-all"></i>
            </div>
        </el-tooltip>
        <el-tooltip placement="top" content="举报">
            <div class="report w-[60px] h-[60px] rounded-full shadow-lg flex-center cursor-pointer bg-white">
                <i class="report-icon iconfont icon-jubao text-[24px] transition-all"></i>
            </div>
        </el-tooltip>
    </div>
    <div class="article-detail w-screen py-[10px] flex justify-center relative">
        <div class="main-article w-[500px] md:w-[750px] h-full z-[1]">
            <div class="top h-[100px] border-b-[1px] flex flex-col px-[20px] bg-white">
                <h1 class="title flex-[0.7] flex items-center text-[33px] font-bold">{{
                        article.articleDetailInfo?.title
                    }}</h1>
                <h1 class="description text-sm text-[#ccc] flex-[0.3] flex justify-between">
                    <div class="author">
                        <span class="words">作者：</span>
                        <span>{{ article.authorDetailInfo?.username }}</span>
                    </div>
                    <div class="time">
                        <span class="modified_time">
                            上一次修改时间：{{ moment(article.articleDetailInfo?.modifiedTime).format("YYYY-MM-DD") }}
                        </span>
                        <span class="modified_time ml-[10px]">
                            发布时间：{{ moment(article.articleDetailInfo?.createdTime).format("YYYY-MM-DD") }}
                        </span>
                    </div>
                </h1>
            </div>
            <main class="content p-[15px] min-h-[500px] bg-white"
                  v-dompurify-html="article.articleDetailInfo?.content"></main>
            <Comment/>
        </div>
        <aside
            class="main-side xl:w-[350px] h-[900px] ml-[20px] sticky top-[10px] right-0 hidden xl:flex flex-col justify-between z-[1]">
            <div class="author w-full flex-[0.36] bg-white flex flex-col">
                <div class="w-full h-[45px] border-b-[1px] px-[10px] font-serif font-bold flex-center">
                    作者信息
                </div>
                <div
                    class="container flex-center flex-1 relative"
                    :style="`background: url(${article.authorDetailInfo?.avatar}) no-repeat center; background-size: cover`"
                >
                    <div class="mask backdrop-blur-sm absolute top-0 left-0 w-full h-full"></div>
                    <div class="main-author flex flex-col w-[60px] items-center z-[1] mt-[-30px] cursor-pointer"
                         @click="$router.push({ name: 'profile', params: { userId: article.authorDetailInfo?.id } })">
                        <div class="avatar-frame w-[70px] h-[70px] p-[3px] bg-white rounded-full">
                            <img :src="article.authorDetailInfo?.avatar"
                                 class="w-full h-full rounded-full object-cover"/>
                        </div>
                        <span class="font-serif text-lg mt-[px]">{{ article.authorDetailInfo?.username }}</span>
                    </div>
                    <div
                        class="author-info w-full h-full absolute top-0 left-0 bg-gradient-to-t from-white from-40% px-[10px] flex items-end"
                    >
                        <div
                            class="container w-full h-[100px] flex text-sm p-[5px] flex-wrap justify-between"
                        >
                            <div class="gender">
                                <i class="iconfont icon-gender mr-[5px]"></i>
                                <span>性别：{{
                                        article.authorDetailInfo?.gender === 0 ? "女" : article.authorDetailInfo?.gender === 1 ? "男" : "未知"
                                    }}</span>
                            </div>
                            <div class="phone">
                                <i class="iconfont icon-phone mr-[5px]"></i>
                                <span>电话：{{ article.authorDetailInfo?.phone }}</span>
                            </div>
                            <div class="email">
                                <i class="iconfont icon-email mr-[5px]"></i>
                                <span>邮箱：{{ article.authorDetailInfo?.email }}</span>
                            </div>
                            <div class="birthday">
                                <i class="iconfont icon-birthday mr-[5px]"></i>
                                <span>生日：{{
                                        moment(article.authorDetailInfo?.birthday).format("YYYY-MM-DD")
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="author-newest w-full flex-[0.3] bg-white flex flex-col">
                <div class="w-full h-[45px] border-b-[1px] px-[10px] flex-center font-serif font-bold">
                    最新动态
                </div>
                <div class="container w-full flex-1">
                    <el-empty
                        v-if="!article.authorArticleDetailInfo?.latestArticles?.length"
                        class="w-full h-full"
                        :image-size="100"
                        description="暂无置顶文章"
                    ></el-empty>
                    <div v-else class="links w-full h-full flex flex-col p-[10px]">
                        <div
                            class="w-ull h-[40px] flex items-center justify-between transition-all cursor-pointer hover:bg-[#8db3cf] rounded-md px-[5px]"
                            v-for="item in article.authorArticleDetailInfo?.latestArticles"
                            :key="item.id"
                            title="点击查看文章详情"
                            @click="$router.push({ name: 'article-detail', params: { articleId: item.id } })"
                        >
                            <div class="title text-sm w-full flex justify-between">
                                <span>{{ item.title }}</span>
                                <span v-if="article.articleDetailInfo?.id === item.id" class="text-[#ccc]">本文</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="recommend-articles w-full flex-[0.3] bg-white">
                <div class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center">
                    <span class="font-serif font-bold">置顶文章</span>
                    <i class="iconfont icon-link hover:text-[#5d93bb] cursor-pointer" title="点击查看更多"></i>
                </div>
                <div class="container w-full flex-1">
                    <el-empty
                        v-if="!article.authorArticleDetailInfo?.pinnedArticles?.length"
                        class="w-full h-full"
                        :image-size="100"
                        description="暂无置顶文章"
                    ></el-empty>
                    <div class="links w-full h-full flex flex-col p-[10px]">
                        <div
                            class="w-ull h-[40px] flex items-center justify-between transition-all cursor-pointer hover:bg-[#8db3cf] rounded-md px-[5px]"
                            v-for="item in article.authorArticleDetailInfo?.pinnedArticles"
                            :key="item.id"
                            title="点击查看文章详情"
                            @click="$router.push({ name: 'article-detail', params: { articleId: item.id } })"
                        >
                            <div class="title text-sm w-full flex justify-between">
                                <span>{{ item.title }}</span>
                                <span v-if="article.articleDetailInfo?.id === item.id" class="text-[#ccc]">本文</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
        <div
            class="container flex-center flex-1 fixed top-0 left-0 w-screen h-screen"
            :style="`background: url(${article.articleDetailInfo?.cover}) no-repeat center background-size: cover`"
        >
            <div class="mask backdrop-blur-sm absolute top-0 left-0 w-full h-full"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@keyframes thumb-up {
    50% {
        transform-origin: bottom left;
        transform: rotate(-20deg);
    }
    100% {
        transform-origin: bottom left;
        transform: rotate(0);
    }
}

.liked {
    &:hover {
        .liked-icon {
            animation: thumb-up ease-in-out 0.5s;

        }
    }
}

@keyframes collected {
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.collected {
    &:hover {
        .collected-icon {
            animation: collected ease-in-out 0.5s;

        }
    }
}

@keyframes shared {
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.shared {
    &:hover {
        .shared-icon {
            animation: shared ease-in-out 0.3s;

        }
    }
}

</style>