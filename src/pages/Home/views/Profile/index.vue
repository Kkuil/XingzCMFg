<script setup lang="ts">
import {useRoute, useRouter} from "vue-router"
import {getUserById, updateBg} from "@/api/user.ts";
import {nextTick, onMounted, ref, watch} from "vue";
import {actions, state} from "@/store";
import moment from "moment/moment";
import getPropByEventDelegation from "@/utils/getPropByEventDelegation.ts";
import {ElMessageBox} from "element-plus";
import {useShowImgPreview} from "@/hooks/useShowImgPreview";
import {listArticlesWithUserId, listVisitedArticles} from "@/api/article.ts";
import {ARTICLE_STATUS} from "@/constant/article.ts";

const $router = useRouter();
const $route = useRoute();

type UserInfo = {
    id?: string;
    username?: string;
    gender?: number;
    birthday?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    bgCover?: string;
    isVip?: number;
    tags?: string;
    level?: string;
    joinDays?: string;
    isSelf?: boolean;
}

type ActiveType = {
    activeStatusId: number,
}

// 用户信息
const userInfo = ref<UserInfo>({});
// 浏览过的文章
const visitedArticles = ref<{ id: string, title: string }[]>([])
// 当前激活信息
const activeInfo = ref<ActiveType>({
    activeStatusId: 1,
});
// 当前分页信息
const pageInfo = ref<{ current: number, pageSize: number, list: ARTICLE.ArticleItem[], total: number }>({
    current: 1,
    pageSize: 10,
    list: [],
    total: 0
})
// 当前布局方式
const layoutType = ref<string>("col");
// 文章
const articleInfo = ref<{ isLoadingArticle: boolean, articles: ARTICLE.ArticleItem[] }>({
    isLoadingArticle: false,
    articles: []
});
// 是否显示更改背景图抽屉
const isShowChangeBgCoverDrawer = ref<boolean>(false);
// 用户预览背景图
const previewBgCoverUrl = ref<string>("");

// 初始化个人信息
(async function () {
    const result: API.Result = await getUserById($route.params.userId as string)
    if (result.data) {
        userInfo.value = result.data
    }
})();

watch(() => userInfo, async () => {
    await getVisitedArticles()
    await getArticlesWithUserId()
    initStatus()
}, {
    deep: true
})

watch(() => activeInfo, async () => {
    await getArticlesWithUserId()
}, {
    deep: true
})

watch(() => $route, () => {
    initStatus()
})

const initStatus = () => {
    const status = $route.query.status
    for (const index in ARTICLE_STATUS) {
        if (ARTICLE_STATUS[index] === status) {
            activeInfo.value.activeStatusId = parseInt(index as string)
        }
    }
}

// 获取用户浏览过的文章
const getVisitedArticles = async () => {
    const result: API.Result = await listVisitedArticles(userInfo.value.id as string)
    if (result.data) {
        visitedArticles.value = result.data as { id: string, title: string }[]
    }
}

// 获取用户动态信息
const getArticlesWithUserId = async () => {
    const result: API.Result = await listArticlesWithUserId({
        userId: userInfo.value.id,
        statusId: activeInfo.value.activeStatusId,
        current: pageInfo.value.current,
        pageSize: pageInfo.value.pageSize,
    })
    if (result.data) {
        pageInfo.value = {
            current: result.data.current,
            pageSize: result.data.pageSize,
            // 当前文章信息
            list: result.data.list as ARTICLE.ArticleItem[],
            total: result.data.total
        }
    }
}

// 取消更改背景图
const cancelChange = () => {
    isShowChangeBgCoverDrawer.value = false
}

// 确认更改背景图
const confirmChange = async () => {
    // 更换背景图
    const result: API.Result = await updateBg(userInfo.value.id as string, previewBgCoverUrl.value as string)
    if (result.data) {
        isShowChangeBgCoverDrawer.value = false
    }
}

// 显示背景图选项
const showBgSelection = async () => {
    isShowChangeBgCoverDrawer.value = true
    if (!state.UserBgState.userBg.userBg.length) {
        await actions.UserBgActions.setUserBgInfo()
    }
}

// 查看背景大图
const checkLargeBgCover = () => {
    useShowImgPreview({
        urlList: userInfo.value.bgCover,
        isClickOutsideClose: true
    })
}

// 切换用户背景图
const changeUserBg = (event: Event) => {
    const url = getPropByEventDelegation(event, "url");
    if (url) {
        previewBgCoverUrl.value = url
    }
}

// 当关闭的时候
const handleClose = (done: () => void) => {
    console.log(userInfo.value.bgCover, previewBgCoverUrl.value)
    if (previewBgCoverUrl.value !== "" && userInfo.value.bgCover !== previewBgCoverUrl.value) {
        ElMessageBox.confirm("图片还未同步，是否同步数据后退出？", "是否退出", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
            .then(async () => {
                // 更换背景图
                const result: API.Result = await updateBg(userInfo.value.id as string, previewBgCoverUrl.value as string)
                done()
            })
            .catch((e) => {
                // catch error
                Promise.reject(e)
                done()
            })
    } else {
        done()
    }
    previewBgCoverUrl.value = ""
}

// 去文章详情页
const gotoArticleDetail = (e: Event) => {
    const articleId = getPropByEventDelegation(e, 'id')
    if (articleId) {
        $router.push({name: 'article-detail', params: {articleId}})
    }
}

const computeCount = (value) => {
    if (!value) {
        return 0
    }
    return value > 999 ? "999+" : value
}

</script>

<template>
    <div
        class="tools w-[60px] h-[280px] fixed top-1/3 left-[50px] -translate-y-1/2 flex-col justify-between z-[1] hidden xl:flex"
    >
        <el-tooltip placement="top" content="举报违法行为">
            <div class="report w-[60px] h-[60px] rounded-full shadow-lg flex-center cursor-pointer bg-white">
                <i class="report-icon iconfont icon-jubao text-[24px] transition-all"></i>
            </div>
        </el-tooltip>
    </div>
    <div id="profile" class="w-screen my-[10px] px-[15px] lg:px-[130px] flex justify-center">
        <div class="container w-full flex justify-between">
            <main class="w-full lg:w-[64%] xl:w-[55%] h-full relative">
                <div
                    id="topper"
                    class="w-full h-[310px] flex items-end mb-[10px]"
                    :style="`background: url(${previewBgCoverUrl ? previewBgCoverUrl : userInfo.bgCover}) no-repeat center/cover;`"
                >
                    <div class="w-full h-[40%] px-[15px] flex items-center bg-white">
                        <img :src="userInfo.avatar" id="avatar" class="w-[90px] h-[90px] rounded-full object-cover"
                             :alt="userInfo.username"/>
                        <div id="right" class="ml-[15px] text-white flex items-stretch">
                            <div id="user-right-top" class="flex-center">
                                <span id="username" class="text-[25px] font-bold text-[#000]">{{
                                        userInfo.username
                                    }}</span>
                                <span id="level" class="ml-[7px] text-[#5d93bb] text-lg font-bold font-serif">Lv{{
                                        userInfo.level
                                    }}</span>
                                <div id="level"
                                     class="p-[3px] rounded-[5px] ml-[7px] text-[#777] text-xs bg-[#ccc] font-bold"
                                     :class="userInfo.isVip ? 'bg-[#5d93bb] text-[0094ff]' : ''">
                                    星会员
                                </div>
                                <h3
                                    class="bg-[#5d93bb] text-xs ml-[8px] py-[2px] px-[3px] rounded-[5px]"
                                >
                                    已加入星知 {{ userInfo.joinDays }} 天
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div
                        class="btns absolute right-[15px] top-[15px]"
                    >
                        <el-button
                            type="primary"
                            plain
                            @click="showBgSelection"
                            v-if="userInfo.isSelf"
                        >更换背景
                        </el-button>
                        <el-button
                            type="primary"
                            plain
                            @click="checkLargeBgCover"
                        >查看大图
                        </el-button>
                    </div>
                </div>
                <div id="dynamic" class="w-full bg-white">
                    <nav id="dynamic-nav" class="w-full h-[50px] flex border-b-[1px] relative">
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeInfo.activeStatusId === 1 ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeInfo.activeStatusId = 1
                                $router.push(`?status=${ARTICLE_STATUS[activeInfo.activeStatusId]}`)
                            }"
                        >
                            全部
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeInfo.activeStatusId === 0 ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeInfo.activeStatusId = 0
                                $router.push(`?status=${ARTICLE_STATUS[activeInfo.activeStatusId]}`)
                            }"
                            v-if="userInfo.isSelf"
                        >
                            未审核
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeInfo.activeStatusId === 2 ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeInfo.activeStatusId = 2
                                $router.push(`?status=${ARTICLE_STATUS[activeInfo.activeStatusId]}`)
                            }"
                            v-if="userInfo.isSelf"
                        >
                            草稿
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeInfo.activeStatusId === 3 ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeInfo.activeStatusId = 3
                                $router.push(`?status=${ARTICLE_STATUS[activeInfo.activeStatusId]}`)
                            }"
                            v-if="userInfo.isSelf"
                        >
                            已驳回
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeInfo.activeStatusId === 4 ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeInfo.activeStatusId = 4
                                $router.push(`?status=${ARTICLE_STATUS[activeInfo.activeStatusId]}`)
                            }"
                            v-if="userInfo.isSelf"
                        >
                            已下架
                        </div>
                    </nav>
                    <div
                        id="tools"
                        class="w-full h-[35px] px-[15px] text-[13px] flex items-center justify-between border-b-[1px]"
                        v-if="pageInfo.list.length"
                    >
                        <div id="sort-by-time" class="cursor-pointer">按时间排序</div>
                        <i
                            class="iconfont text-[25px] cursor-pointer rounded-[5px] hover:bg-[#ccc] w-[25px] h-[25px] flex-center"
                            :class="`icon-layout-${layoutType}`"
                            @click="layoutType === 'col' ? layoutType = 'row' : layoutType = 'col'"
                        ></i>
                    </div>
                    <el-empty class="w-full h-full" description="什么都没有" v-else/>
                    <el-skeleton
                        :count="3"
                        animated
                        :loading="articleInfo.isLoadingArticle"
                        id="articles"
                    >
                        <template #default>
                            <div
                                @click="gotoArticleDetail"
                                class="flex flex-wrap  py-[10px] min-h-[175px] px-[5px]"
                                :class="`flex-${layoutType === 'col' ? 'row' : 'col justify-between'}`"
                                v-if="pageInfo.list.length"
                            >
                                <div
                                    class="mb-[10px] px-[15px] flex-center cursor-pointer rounded-[5px] hover:bg-[#e6e6e6]"
                                    :class="`${layoutType === 'col' ? 'flex-col w-[20%] h-[150px]' : 'flex-row flex-1 py-[8px]'}`"
                                    v-for="article in pageInfo.list"
                                    :key="article"
                                    :data-id="article.id"
                                >
                                    <img
                                        :src="article.cover"
                                        class="object-cover"
                                        :class="layoutType === 'col' ? 'w-[100px] h-[100px] mt-[5px]' : 'w-[100px] h-[120px]'"
                                        :alt="article.title"
                                        :title="article.title"
                                    />
                                    <main
                                        class="main h-auto"
                                        :class="layoutType === 'col' ? 'mt-[5px] h-[150px] mb-[5px]' : 'ml-[10px] h-[120px]'"
                                    >
                                        <h1
                                            class="title font-bold overflow-hidden overflow-ellipsis"
                                            :class="layoutType === 'col' ? 'max-w-[100px]' : 'max-w-[150px]'"
                                        >
                                            {{ article.title }}
                                        </h1>
                                        <div
                                            class="content text-[13px] overflow-hidden overflow-ellipsis"
                                            :class="layoutType === 'col' ? 'w-[100px] line-clamp-2' : 'line-clamp-4'"
                                        >
                                            {{ article.content }}
                                        </div>
                                        <div
                                            class="tools flex text-xs mt-[3px]"
                                            :class="layoutType === 'col' ? '' : 'items-center justify-between'"
                                        >
                                            <span
                                                class="text-[#0094ff]"
                                                :class="layoutType === 'col' ? 'hidden' : ''"
                                            >
                                                发布于：{{ moment(article.createdTime).format("YYYY-MM-DD") }}
                                            </span>
                                            <div
                                                class="flex text-xs"
                                            >
                                                <div class="like transition-[color] flex-center">
                                                    <i class="iconfont icon-thumb-up mr-[2px]"></i>
                                                    <span>{{ computeCount(article.likedCount) }}</span>
                                                </div>
                                                <div class="collect transition-[color] flex-center ml-[10px]">
                                                    <i class="iconfont icon-collection mr-[2px]"></i>
                                                    <span>{{ computeCount(article.collectedCount) }}</span>
                                                </div>
                                                <div class="comment transition-[color] flex-center ml-[10px]">
                                                    <i class="iconfont icon-comment_light mr-[2px]"></i>
                                                    <span>{{ computeCount(article.commentCount) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                                <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    small
                                    :total="pageInfo.total"
                                    v-model:current-page="pageInfo.current"
                                    :default-current-page="1"
                                    v-model:page-size="pageInfo.pageSize"
                                    class="w-full my-[5px] flex-center"
                                    :hide-on-single-page="true"
                                    @currentChange="async (current) => {
                                        pageInfo.current = current
                                        await getArticlesWithUserId()
                                    }"
                                />
                            </div>
                        </template>
                        <template #template>
                            <div
                                class="bg-white mb-[10px] px-[15px] flex items-center justify-between"
                                :class="`${layoutType === 'col' ? 'flex-col flex-[0.33] h-[150px]' : 'flex-row flex-1 h-full'}`"
                            >
                                <el-skeleton-item
                                    variant="image"
                                    id="template-img"
                                    :style="layoutType === 'col' ? 'width: 100%; height: 100px' : 'width: 150px; height: 150px'"
                                />
                                <main class="main flex-1 w-full"
                                      :class="layoutType === 'col' ? 'mt-[5px]' : 'ml-[20px]'">
                                    <div class="title w-1/2">
                                        <el-skeleton-item/>
                                    </div>
                                    <div class="content w-full">
                                        <el-skeleton-item v-for="i in 5" :key="i"/>
                                    </div>
                                </main>
                            </div>
                        </template>
                    </el-skeleton>
                </div>
            </main>
            <aside
                class="hidden lg:flex w-[35%] xl:w-[44%] flex-col xl:flex-row justify-between sticky top-[10px] right-0"
            >
                <aside class="w-full xl:w-[49%] h-auto">
                    <div id="user-base-info" class="bg-white">
                        <div
                            class="topper font-serif h-[35px] text-[13px] leading-[35px] px-[10px] bg-[#5d93bb] text-white font-bold"
                        >
                            基本资料
                        </div>
                        <div class="info p-[8px] font-serif text-sm">
                            <h3 class="mb-[5px]">用户名：{{ userInfo.username }}</h3>
                            <h3 class="mb-[5px]">性别：{{ userInfo.gender }}</h3>
                            <h3 class="mb-[5px]">生日：{{ moment(userInfo.birthday).format("YYYY-MM-DD") ?? "-" }}</h3>
                            <h3 class="mb-[5px]">电话：{{ userInfo.phone }}</h3>
                            <h3 class="mb-[5px]">邮箱：{{ userInfo.email }}</h3>
                            <h3 class="mb-[5px]">
                                标签：
                                <el-tag v-for="tag in userInfo.tags" :key="tag" color="#5d93bb" class="text-white">
                                    # {{ tag }}
                                </el-tag>
                            </h3>
                            <h3 class="mb-[5px]">等级：{{ userInfo.level }}</h3>
                        </div>
                    </div>
                    <div id="recent-browser" class="bg-white mt-[10px]">
                        <div
                            class="topper font-serif h-[35px] text-[13px] leading-[35px] px-[10px] bg-[#5d93bb] text-white font-bold"
                        >
                            最近浏览
                        </div>
                        <div class="browser-articles p-[8px] font-sans">
                            <div
                                class="h-[30px] flex items-center justify-between transition-all cursor-pointer hover:bg-[#aeddff] rounded-md px-[5px]"
                                v-for="article in visitedArticles"
                                :key="article"
                                @click="$router.push({ name: 'article-detail', params: { articleId: article.id } })"
                                title="点击查看文章详情"
                                v-if="visitedArticles.length"

                            >
                                <span>{{ article.title }}</span>
                            </div>
                            <el-empty description="这人很懒，啥都没看" v-else/>
                        </div>
                    </div>
                </aside>
                <aside
                    class="w-full xl:w-[49%] h-full text-[#848587] text-[13px] mt-[10px] xl:m-0">
                    <div class="first">
                    <span>
                        <i class="iconfont icon-user"></i>
                        站长:
                        <a href="/xingz-cm/profile/477f3c9feda7e6303190a1381cd49d68"
                           class="hover:text-[#242490]">Kkuil</a>
                    </span>
                        <a class="ml-[15px] hover:text-[#242490]" href="https://github.com/Kkuil/XingzFg"
                           target="_blank">
                            <i class="iconfont icon-star"></i>
                            前端菜K
                        </a>
                    </div>
                    <div class="second">
                        <a class="hover:text-[#242490]" href="https://github.com/Kkuil/XingzFg" target="_blank">
                            <i class="iconfont icon-info"></i>
                            <span>关于本站</span>
                        </a>
                        <a class="ml-[15px] hover:text-[#242490]" href="https://github.com/Kkuil/XingzFg"
                           target="_blank">
                            <i class="iconfont icon-bug"></i>
                            提交issue
                        </a>
                    </div>
                    <div class="third">
                        <i class="iconfont icon-copyright"></i>
                        2023 前端菜K |
                        <a class="text-[#0094ff]" href="https://github.com/Kkuil/XingzFg" target="_blank">沪ICP备
                            3024067144号-2</a>
                    </div>
                </aside>
            </aside>
        </div>
        <el-drawer
            v-model="isShowChangeBgCoverDrawer"
            direction="rtl"
            :before-close="handleClose"
        >
            <template #header>
                <h4>更换背景图</h4>
            </template>
            <template #default>
                <div class="container flex flex-wrap cursor-pointer" @click="changeUserBg">
                    <div
                        class="flex-center flex-col w-[200px] h-[150px] mb-[10px]"
                        v-for="bg in state.UserBgState.userBg.userBg"
                        :key="bg.url"
                        :data-url="bg.url"
                    >
                        <img :src="bg.url" :title="bg.name" class="w-[150px] h-[120px] object-cover" :alt="bg.name"/>
                        <h3 class="w-[150px] h-[30px] leading-[30px] bg-[#5d93bb] text-white text-center">
                            {{ bg.name }}
                        </h3>
                    </div>
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelChange">取消</el-button>
                    <el-button type="primary" @click="confirmChange">确认</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<style scoped lang="scss">
#topper {
    animation: bg-slow-move linear 5s infinite alternate-reverse;
}

#template-img {
    svg {
        height: 120px !important;
    }
}

@keyframes bg-slow-move {
    0% {
        background-position: center;
    }
    50% {
        background-position: top;
    }
    100% {
        background-position: bottom;
    }
}

</style>