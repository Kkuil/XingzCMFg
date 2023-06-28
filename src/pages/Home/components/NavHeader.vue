<script setup lang="ts">
import {useRouter, useRoute} from "vue-router"
import {Operation, Close, Search, CircleClose} from "@element-plus/icons-vue"
import {
    User,
    Promotion,
    Right,
} from "@element-plus/icons-vue"
import {state} from "@/store"
import {reactive, ref, watch} from "vue"
import {TOKEN_IN_HEADER_KEY} from "@/constant/auth.ts";
import Navigation from "@/components/Navigation/index.vue"

const $router = useRouter()
const $route = useRoute()

const navigation = reactive([
    {name: "主页", path: "/xingz-cm"},
    {
        name: "互动区",
        isShowSelect: false,
        children: [
            {name: "问答区", path: "/xingz-cm/question-answer-area"},
            {name: "自习室", path: "/xingz-cm/study-room"},
            {name: "聊天室", path: "/xingz-cm/chat-room"},
        ]
    },
    {
        name: "休息区",
        isShowSelect: false,
        children: [
            {name: "俄罗斯方块", path: "/xingz-cm/tetris"},
            {name: "贪吃蛇", path: "/xingz-cm/greedy-snake"},
        ]
    },
    {name: "ChatGPT", path: "/xingz-cm/chat-gpt"},
    {name: "会员", path: "/xingz-cm/vip"}
])

// 是否登录
const isLogin = ref<boolean>(false)
// 搜索数据
const searchData = ref<string>("")
// 是否处于撰写文章页
const isWriting = ref<boolean>(false)

/**
 * 移动端适配
 * 是否打开操作列表
 */
const isOpenOperation = ref(false)

watch(() => $route, (route) => {
    isWriting.value = route.name === "write-article"
}, {
    immediate: true,
    deep: true
})

watch(() => state.UserAuthState.userInfo.userInfo, (value) => {
    isLogin.value = !!state.UserAuthState.userInfo.userInfo?.id
}, {
    immediate: true,
    deep: true
})

const toggleShowSelect = (index: number, isShowSelect: boolean) => {
    navigation[index].isShowSelect = isShowSelect
}

/**
 * 退出登录
 */
const logout = () => {
    window.location.href = $route.fullPath
    localStorage.removeItem(TOKEN_IN_HEADER_KEY)
}

/**
 * 去登录
 */
const goLogin = () => {
    $router.push({name: 'login'})
}
</script>

<template>
    <nav class="nav w-screen flex items-center justify-between px-4 border-b-[1px] border-[gray] z-[999] bg-white">
        <!-- logo -->
        <img
            src="../../../assets/images/logo-nav.png"
            alt="logo"
            title="星知文章CM"
            class="h-[60px] cursor-pointer"
            @click="$router.push('/xingz-cm')"
        />
        <!-- 导航栏 -->
        <div class="navigation items-center justify-around z-[999] hidden md:flex">
            <Navigation
                :navigation="navigation"
                trigger="click"
                @toggleShowSelect="toggleShowSelect"
            />
        </div>
        <!-- 搜索 -->
        <div class="
                search
                w-[250px]
                2xl:w-[300px]
                h-[35px]
                rounded-md
                overflow-hidden
                transition-all
                border-[1px]
                border-[#ccc]
                xl:ml-[30px]
                2xl:ml-[100px]
                cursor-pointer
                hover:shadow-[#5d93bb]
                md:hidden
                xl:flex
                sm:flex
                hidden
            "
        >
            <div class="search-input relative flex-[75%] h-full flex items-center px-4">
                <el-icon>
                    <Search/>
                </el-icon>
                <input
                    type="text"
                    placeholder="请输入你要搜索的内容"
                    v-model="searchData"
                    class="ml-2 outline-0 bg-opacity-0"
                />
                <el-icon
                    class="absolute right-3 top-1/2 -translate-y-1/2 ml-1 hover:text-[#5d93bb]"
                    :class="searchData ? '' : 'hidden'"
                    @click="searchData = ''"
                >
                    <CircleClose/>
                </el-icon>
            </div>
            <div
                class="search-btn hidden flex-[25%] h-full 2xl:flex justify-center items-center font-semibold bg-[#5d93bb] text-[#fefefe]">
                搜索
            </div>
        </div>
        <!-- 写文章 -->
        <div
            class="
                write-article
                w-[110px]
                md:w-[35px]
                lg:w-[110px]
                h-[35px]
                rounded-md
                mx-0
                2xl:mx-[60px]
                overflow-hidden
                bg-[#5d93bb]
                text-[#fefefe]
                flex
                justify-around
                items-center
                cursor-pointer
                hover:bg-opacity-70
            "
            @click="() => {
                if(!isWriting) {
                    $router.push({ name: 'write-article' })
                }
            }"
        >
            <i class="iconfont icon-yumaobi text-[#ccc]"></i>
            <span v-if="!isWriting" class="block md:hidden xl:block">写文章</span>
            <span v-else class="md:hidden xl:block">Writing...</span>
        </div>
        <!-- 头像 -->
        <div class="avatar">
            <el-dropdown trigger="click">
            <span class="el-dropdown-link">
                  <el-tooltip
                      class="box-item"
                      :content="isLogin ? '点击展开':  '登录查看更多权益'"
                      placement="bottom-end"
                  >
                        <el-badge is-dot id="isInline" type="success">
                          <el-avatar
                              class="hidden md:flex cursor-pointer"
                              :title="state.UserAuthState.userInfo.userInfo?.username"
                              :src="isLogin ? state.UserAuthState.userInfo.userInfo?.avatar : ''"
                          >
                              {{ isLogin ? '' : "user" }}
                          </el-avatar>
                      </el-badge>
                  </el-tooltip>
            </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            v-if="isLogin"
                            :icon="User"
                            @click="$router.push({ name: 'profile', params: { userId: state.UserAuthState.userInfo.userInfo?.id } })"
                        >
                            个人中心
                        </el-dropdown-item>
                        <el-dropdown-item
                            v-if="!isLogin"
                            :icon="Promotion"
                            @click="goLogin"
                        >
                            去登录
                        </el-dropdown-item>
                        <el-dropdown-item
                            v-if="isLogin"
                            :icon="Right"
                            @click="logout"
                        >退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-icon
                class="w-[40px] h-[40px] flex-center md:hidden cursor-pointer transition-all hover:bg-[#efefef] hover:rounded-lg rounded-lg"
                @click="isOpenOperation = true"
            >
                <Operation class="text-2xl"/>
            </el-icon>
        </div>
        <!-- 操作列表 -->
        <Transition name="operationList">
            <div
                class="w-screen pb-[20px] shadow-md absolute top-0 left-0 bg-white p-2 rounded-2xl md:hidden z-[999999]"
                v-show="isOpenOperation">
                <div class="list">
                    <div
                        class="
                    close
                    w-full
                    h-[50px]
                    flex
                    justify-end
                    border-b-2
                    border-[#999ca1]
                "
                    >
                        <el-icon class="
                        w-[40px]
                        h-[40px]
                        cursor-pointer
                        transition-all
                        hover:bg-[#efefef]
                        hover:rounded-lg
                        rounded-lg
                        flex-center
                    "
                                 @click="isOpenOperation = false"
                        >
                            <Close class="text-2xl font-semibold"/>
                        </el-icon>
                    </div>
                    <div
                        v-for="item in navigation"
                        :key="item.path"
                        @click="() => {
                        $router.push(item.path)
                        isOpenOperation = false
                    }"
                        class="
                        w-full
                        h-[50px]
                        font-semibold
                        text-lg
                        transition-all
                        cursor-pointer
                        hover:bg-[#efefef]
                        rounded-lg
                        flex-center
                        shadow-sm
                    "
                        :class="$route.path === item.path ? 'text-[#5d93bb]' : ''"
                    >
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </Transition>
        <Transition name="mask">
            <div class="mask w-screen h-screen absolute top-0 left-0 bg-[#ccc] opacity-30 z-[-1]"
                 v-show="isOpenOperation"
                 @click="isOpenOperation = false"
            ></div>
        </Transition>
    </nav>
</template>

<style scoped lang="scss">
.nav {
    background-size: cover;
    backdrop-filter: blur(5px);
}

.operationList-enter-active,
.operationList-leave-active {
    transform: translateY(-100%);
    transition: all .5s;
}

.operationList-enter-from,
.operationList-leave-to {
    transform: translateY(-100%);
}

.operationList-leave-from,
.operationList-enter-to {
    transform: translateY(0);
}

.mask-enter-active,
.mask-leave-active {
    transition: opacity .2s;
}

.mask-enter-from,
.mask-leave-to {
    opacity: 0;
}

.mask-leave-from,
.mask-enter-to {
    opacity: 0.3;
}

.search {
    &:hover {
        box-shadow: #5d93bb 0 0 5px 1px;
    }
}

</style>