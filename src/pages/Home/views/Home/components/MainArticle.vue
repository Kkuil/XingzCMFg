<script setup lang="ts">
import {reactive, watch} from "vue"
import {actions, state} from "@/store"
import {Bottom} from "@element-plus/icons-vue"
import {useRoute, useRouter} from "vue-router"
import moment from "moment"
import {collect, like} from "@/api/article.ts";
import getPropByEventDelegation from "@/utils/getPropByEventDelegation.ts";
import {ElMessage} from "element-plus";

const $router = useRouter();
const $route = useRoute();

// 初始化tags
(async function () {
    if (!state.TagState.tags.tags?.length) {
        await actions.TagActions.setTags()
    }
})();

// 初始化分类
(async function () {
    if (!state.ArticleCategoryState.articleCategories.articleCategorys?.length) {
        await actions.ArticleCategoryActions.setArticleCategories()
    }
})();

// 当前选中的标签和分类信息
const articleInfo = reactive({
    tagId: state.TagState.tags?.tags[0]?.id ?? 1,
    categoryId: state.ArticleCategoryState.articleCategories?.articleCategorys[0]?.id ?? "1"
});

// 监听文章类型变化
watch(() => articleInfo, (ainfo) => {
    actions.ArticleActions.initArticles(ainfo)
    $router.push(`/xingz-cm?t=${articleInfo.tagId}&c=${articleInfo.categoryId}`)
}, {
    deep: true,
    immediate: true
})

/**
 * @description 更改文章类型
 */
const changeArticleCate = (cate: ARTICLE.ArticleItem) => {
    articleInfo.categoryId = cate.id
}

/**
 * @description 更改文章的标签
 */
const changeArticleTag = (e) => {
    const tagId = e.target.dataset.id
    if (tagId) {
        articleInfo.tagId = tagId
    }
}

/**
 * 加载更多
 */
const loadMore = () => {
    setTimeout(async () => {
        await actions.ArticleActions.setArticles(articleInfo)
    }, 200)
}

/**
 * 是否加载更多
 */
const isLoadMore = (): boolean => {
    return state.ArticleState.articles.total >= state.ArticleState.articles.current * state.ArticleState.articles.pageSize
}

/**
 * 查看文章详情
 */
const checkArticleDetail = (event: Event) => {
    const articleId = getPropByEventDelegation(event, "id")
    $router.push({
        name: "article-detail",
        params: {
            articleId
        }
    })
}

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
 * @description 喜欢或不喜欢文章
 * @param id
 */
const likeArticle = async (id: string) => {
    const res: API.Result = await like(id)
    if (res.data) {
        state.ArticleState.articles.articles?.map((article) => {
            if (article.id === id) {
                article.isLiked = res.data as boolean
                res.data ? article.likedCount++ : article.likedCount--
            }
        })
    } else {
        ElMessage.error("请先登录")
        $router.push("/login")
    }
}

/**
 * @description 收藏或不收藏文章
 * @param id
 */
const collectArticle = async (id: string) => {
    const res: API.Result = await collect(id)
    state.ArticleState.articles.articles?.map((article) => {
        if (article.id === id) {
            article.isCollected = res.data as boolean
            res.data ? article.collectedCount++ : article.collectedCount--
        }
    })
}

</script>

<template>
    <main class="main flex w-full flex-col flex-1 xl:w-[600px] relative">
        <div
            class="main-tags flex w-full h-[40px] mb-[10px] overflow-x-scroll overflow-y-hidden scrollbar-none"
        >
            <div class="tags hidden md:flex" @click="changeArticleTag">
                <div
                    class="
                        tag
                        overflow-ellipsis
                        overflow-hidden
                        text-sm
                        p-[10px]
                        h-full
                        bg-[#fafafa]
                        mr-[8px]
                        flex-center
                        cursor-pointer
                        transition-[color]
                        hover:text-[#2589d4]
                        whitespace-nowrap
                    "
                    v-for="tag in state.TagState.tags.tags"
                    :key="tag.id"
                    :data-id="tag.id"
                    :class="tag.id == articleInfo.tagId ? 'text-[#2589d4]' : ''"
                >
                    {{ tag.tagName }}
                </div>
            </div>
            <el-dropdown trigger="hover">
                <div class="
                     ellipsis
                     flex
                     md:hidden
                     w-[60px]
                     h-full
                     font-semibold
                     bg-[#fafafa]
                     flex-center
                     cursor-pointer
                     transition-[color]
                     hover:text-[#2589d4]
                "
                >...
                </div>
                <template #dropdown>
                    <el-dropdown-menu class="max-h-[500px] overflow-y-auto diy-scroll-bar">
                        <el-dropdown-item
                            v-for="tag in state.TagState.tags.tags"
                            :key="tag.id"
                            :data-id="tag.id"
                            :class="tag.id == articleInfo.tagId ? 'text-[#2589d4]' : ''"
                        >
                            {{ tag.tagName }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="category flex w-full h-[60px] border-t-[1px] py-[10px]">
            <div
                class="
                    cate
                    overflow-ellipsis
                    overflow-hidden
                    px-[10px]
                    max-w-[100px]
                    text-sm
                    bg-[#fafafa]
                    mr-[8px]
                    flex-center
                    cursor-pointer
                    transition-[color]
                    hover:text-[#2589d4]
                "
                v-for="cate in state.ArticleCategoryState.articleCategories.articleCategorys"
                :key="cate.id"
                :class="cate.id === articleInfo.categoryId ? 'text-[#2589d4]' : ''"
                @click="changeArticleCate(cate)"
            >
                {{ cate.categoryName }}
            </div>
        </div>
        <div class="main-articles w-full flex-1" @click="checkArticleDetail">
            <el-skeleton :count="5" animated :loading="false">
                <template #default>
                    <div
                        class="w-full h-[200px] relative bg-white mb-4 flex-center p-[15px] cursor-pointer transition-all hover:bg-[#fafafa]"
                        v-for="article in state.ArticleState.articles.articles"
                        :key="article.id"
                        :data-id="article.id"
                        v-slide-in
                        title="点击阅读文章"
                    >
                        <img
                            src="https://w.wallhaven.cc/full/zy/wallhaven-zyq3xg.png"
                            alt="Kkuil"
                            title="Kkuil"
                            class="w-[200px] h-full object-cover hidden lg:block"
                        />
                        <div class="main m-0 lg:ml-[20px] flex-1 h-full flex flex-col justify-between">
                            <h1 class="
                                    title
                                    max-w-full
                                    overflow-ellipsis
                                    line-clamp-1
                                    break-all
                                    font-semibold
                                    text-[20px]
                                    lg:text-[25px]
                                    leading-[45px]
                                    hover:text-[#0094ff]
                                    hover:underline
                                "
                            >
                                {{ article.title }}
                            </h1>
                            <div
                                class="content w-full overflow-ellipsis overflow-hidden text-sm lg:text-md line-clamp-6 md:line-clamp-4"
                                v-dompurify-html="article.content"
                            >
                            </div>
                            <div
                                class="article-info hidden md:flex justify-between items-center w-full text-[#ccc] mt-[10px]">
                                <div class="author text-sm">
                                    <span>作者：</span>
                                    <router-link :to="`/xingz-cm/profile/${article.id}`"
                                                 class="hover:underline hover:text-[#5d93bb]" @click.stop>
                                        {{ article.username }}
                                    </router-link>
                                    <i v-if="article.isVisited" class="iconfont icon-footprint ml-[10px]"></i>
                                </div>
                                <div class="tools flex">
                                    <div
                                        class="like ml-[15px] transition-[color] hover:text-[#0094ff] flex-center"
                                        :class="article.isLiked ? 'text-[#1da0fe]' : ''"
                                        @click.stop="likeArticle(article.id as string)"
                                        :title="article.isLiked ? '取消点赞': '点赞'"
                                    >
                                        <i class="iconfont icon-thumb-up mr-[5px] text-xl"></i>
                                        <span
                                            class="text-sm">{{
                                                computeCount(article.likedCount)
                                            }}</span>
                                    </div>
                                    <div
                                        class="collect ml-[15px] transition-[color] hover:text-yellow-400 flex-center"
                                        :class="article.isCollected ? 'text-yellow-400': ''"
                                        @click.stop="collectArticle(article.id as string)"
                                        :title="article.isLiked ? '取消收藏': '收藏'"
                                    >
                                        <i class="iconfont icon-collection mr-[5px] text-xl"></i>
                                        <span class="text-sm">{{
                                                computeCount(article.collectedCount)
                                            }}</span>
                                    </div>
                                    <div class="comment ml-[15px] transition-[color] hover:text-[#000] flex-center">
                                        <i class="iconfont icon-comment_light mr-[5px] text-xl"></i>
                                        <span
                                            class="text-sm">{{
                                                computeCount(article.commentCount)
                                            }}</span>
                                    </div>
                                    <div class="publishTime ml-[15px] flex-center">
                                        <i class="iconfont icon-clock mr-[5px] text-md"></i>
                                        <span class="text-sm">发表于：{{
                                                moment(article.createdTime).format('YYYY-MM-DD')
                                            }}</span>
                                    </div>
                                    <el-dropdown class="ml-[25px] flex-center">
                                            <span class="el-dropdown-link font-bold text-lg">
                                              ...
                                            </span>
                                        <template #dropdown>
                                            <el-dropdown-menu>
                                                <el-dropdown-item>
                                                    <i class="iconfont icon-jubao"></i>
                                                    <span>举报</span>
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #template>
                    <div class="w-full h-[230px] bg-white mb-4 flex-center px-[15px]">
                        <el-skeleton-item variant="image" style="width: 180px; height: 180px;"/>
                        <div class="main ml-[20px] flex-1">
                            <div class="title">
                                <el-skeleton-item style="width: 200px;"/>
                            </div>
                            <div class="content w-full">
                                <el-skeleton-item v-for="i in 5" :key="i" style="width: 100%;"/>
                            </div>
                        </div>
                    </div>
                </template>
            </el-skeleton>
            <div
                class="load-more w-full h-[60px] flex-center" v-show-viewport="loadMore" v-if="isLoadMore()"
            >
                <div
                    class="words w-[120px] h-[38px] rounded-full flex-center bg-white text-sm cursor-pointer hover:text-[#0094ff]">
                    <span class="mr-[5px]">加载更多</span>
                    <el-icon>
                        <Bottom/>
                    </el-icon>
                </div>
            </div>
            <div v-else class="not-more flex-center my-[5px] text-[#ccc] text-sm">已经滑到底了，没有更多了~</div>
        </div>
    </main>
</template>

<style scoped lang="scss">

</style>