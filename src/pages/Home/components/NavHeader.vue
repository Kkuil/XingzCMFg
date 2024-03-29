<script setup lang="ts">
import {useRouter, useRoute} from "vue-router"
import {Operation, Close, Search, CircleClose} from "@element-plus/icons-vue"
import {
    User,
    Promotion,
    Right,
} from "@element-plus/icons-vue"
import store, {state} from "@/store"
import {reactive, ref, watch} from "vue"
import {TOKEN_IN_HEADER_KEY} from "@/constant/auth.ts";

const $router = useRouter()
const $route = useRoute()

const navigation = reactive([
    {name: "主页", path: "/xingz-cm"}
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

store.useUserAuthStore.$subscribe((mutation, state) => {
    isLogin.value = !!state.userInfo?.id
}, {
    deep: true,
    immediate: true
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
                          <el-avatar
                              class="hidden md:flex cursor-pointer"
                              :title="state.UserAuthState.userInfo.userInfo?.username"
                              :src="isLogin ? state.UserAuthState.userInfo.userInfo?.avatar : ''"
                          >
                              {{ isLogin ? '' : "user" }}
                          </el-avatar>
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