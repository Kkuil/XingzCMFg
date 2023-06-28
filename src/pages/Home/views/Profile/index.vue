<script setup lang="ts">
import {useRoute, useRouter} from "vue-router"
import {getUserById} from "@/api/user.ts";
import {ref} from "vue";
import {actions, state} from "@/store";
import moment from "moment/moment";
import getPropByEventDelegation from "@/utils/getPropByEventDelegation.ts";
import {ElMessageBox} from "element-plus";

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

// 用户信息
const userInfo = ref<UserInfo>({});
// 当前激活的分类
const activeCate = ref<string>("published");
// 当前布局方式
const layoutType = ref<string>("col");
// 文章
const articleInfo = ref<{ isLoadingArticle: boolean, articles: ARTICLE.ArticleItem[] }>({
    isLoadingArticle: true,
    articles: [{}]
});
// 是否显示更改背景图抽屉
const isShowChangeBgCoverDrawer = ref<boolean>(false);
// 用户预览背景图
const previewBgCoverUrl = ref<string>("");

// 初始化个人信息
(async () => {
    const result: API.Result = await getUserById($route.params.userId as string)
    if (result.data) {
        userInfo.value = result.data
    }
})();

// 取消更改背景图
const cancelChange = () => {

}

// 确认更改背景图
const confirmChange = () => {

}

// 显示背景图选项
const showBgSelection = async () => {
    isShowChangeBgCoverDrawer.value = true
    if (!state.UserBgState.userBg.userBg.length) {
        await actions.UserBgActions.setUserBgInfo()
    }
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
    ElMessageBox.confirm('')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
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
    <div id="profile" class="w-screen h-full py-[10px] px-[15px] lg:px-[130px] flex justify-center">
        <div class="container w-full flex justify-between relative">
            <main class="w-full lg:w-[64%] xl:w-[55%] h-full relative">
                <div
                    id="topper"
                    class="w-full h-[310px] flex items-end mb-[10px]"
                    :style="`background: url(${previewBgCoverUrl ? previewBgCoverUrl :  userInfo.bgCover}) no-repeat center/cover;`"
                >
                    <div class="w-full h-[40%] px-[15px] flex items-center">
                        <img :src="userInfo.avatar" id="avatar" class="w-[90px] h-[90px] rounded-full object-cover">
                        <div id="right" class="ml-[15px] text-white flex items-stretch">
                            <div id="user-right-top" class="flex-center">
                                <span id="username" class="text-[25px] font-bold">{{ userInfo.username }}</span>
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
                    <el-button type="primary" plain class="absolute right-[15px] top-[15px]"
                               @click="showBgSelection">更换背景
                    </el-button>
                </div>
                <div id="dynamic" class="w-full bg-white">
                    <nav id="dynamic-nav" class="w-full h-[50px] flex border-b-[1px] relative">
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeCate === 'published' ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeCate = 'published'
                                $router.push('?cate=published')
                            }"
                        >
                            已发布
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeCate === 'hot' ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeCate = 'hot'
                                $router.push('?cate=hot')
                            }"
                        >
                            热门
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeCate === 'new' ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeCate = 'new'
                                $router.push('?cate=new')
                            }"
                        >
                            最新
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeCate === 'reviewing' ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeCate = 'reviewing'
                                $router.push('?cate=reviewing')
                            }"
                        >
                            审核中
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeCate === 'draft' ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeCate = 'draft'
                                $router.push('?cate=draft')
                            }"
                        >
                            草稿
                        </div>
                        <div
                            class="h-full flex-center px-[10px] text-sm hover:text-[#5d93bb] cursor-pointer border-b-[3px] border-transparent"
                            :style="activeCate === 'undercarriage' ? 'border-color: #5d93bb !important; color: #5d93bb;' : ''"
                            @click="() => {
                                activeCate = 'undercarriage'
                                $router.push('?cate=undercarriage')
                            }"
                        >
                            已下架
                        </div>
                    </nav>
                    <div id="tools" class="w-full h-[35px] px-[15px] text-[13px] flex items-center justify-between"
                         v-if="articleInfo.articles.length">
                        <div id="sort-by-time" class="cursor-pointer">按时间排序</div>
                        <i
                            class="iconfont text-[25px] cursor-pointer rounded-[5px] hover:bg-[#ccc] w-[25px] h-[25px] flex-center"
                            :class="`icon-layout-${layoutType}`"
                            @click="layoutType === 'col' ? layoutType = 'row' : layoutType = 'col'"
                        ></i>
                    </div>
                    <div class="articles py-[10px] min-h-[210px]">
                        <el-skeleton
                            :count="3"
                            animated :loading="articleInfo.isLoadingArticle"
                            v-if="articleInfo.articles.length"
                            class="flex justify-between flex-wrap"
                            :class="`flex-${layoutType === 'col' ? 'row' : 'col'}`"
                        >
                            <template #default>
                                <div
                                    class="w-full h-[200px] relative bg-white mb-4 flex-center p-[15px] cursor-pointer transition-all hover:bg-[#fafafa]"
                                    v-for="article in articleInfo.articles"
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
                                                <div
                                                    class="comment ml-[15px] transition-[color] hover:text-[#000] flex-center">
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
                        <el-empty class="w-full h-full" description="什么都没有" v-else/>
                    </div>
                </div>
            </main>
            <aside class="hidden lg:flex w-[35%] xl:w-[44%] flex-col xl:flex-row justify-between">
                <aside class="w-full xl:w-[49%] h-auto sticky top-[10px] right-0">
                    <div id="user-base-info" class="bg-white">
                        <div
                            class="topper font-serif border-b-[1px] border-[#000] h-[35px] text-[13px] leading-[35px] px-[10px] bg-[#5d93bb] text-white font-bold"
                        >
                            基本资料
                        </div>
                        <div class="info p-[8px] font-sans">
                            <h3 class="mb-[5px]">用户名：{{ userInfo.username }}</h3>
                            <h3 class="mb-[5px]">性别：{{ userInfo.gender }}</h3>
                            <h3 class="mb-[5px]">生日：{{ moment(userInfo.birthday).format("YYYY-MM-DD") }}</h3>
                            <h3 class="mb-[5px]">电话：{{ userInfo.phone }}</h3>
                            <h3 class="mb-[5px]">邮箱：{{ userInfo.email }}</h3>
                            <h3 class="mb-[5px]">标签：{{ userInfo.tags }}</h3>
                            <h3 class="mb-[5px]">等级：{{ userInfo.level }}</h3>
                        </div>
                    </div>
                    <div id="recent-browser" class="bg-white mt-[10px]">
                        <div
                            class="topper font-serif border-b-[1px] border-[#000] h-[35px] text-[13px] leading-[35px] px-[10px] bg-[#5d93bb] text-white font-bold"
                        >
                            最近浏览
                        </div>
                        <div class="browser-articles p-[8px] font-sans">
                            <div
                                class="h-[30px] flex items-center justify-between transition-all cursor-pointer hover:bg-[#aeddff] rounded-md px-[5px]"
                                v-for="article in 5"
                                :key="article"
                                @click="$router.push({ name: 'article-detail', params: { articleId: 1 } })"
                                title="点击查看文章详情"

                            >
                                12315615156
                            </div>
                            <!--                        <el-empty description="这人很懒，啥都没看" />-->
                        </div>
                    </div>
                </aside>
                <aside
                    class="w-full xl:w-[49%] h-full sticky top-[10px] right-0 text-[#848587] text-[13px] mt-[10px] xl:m-0">
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