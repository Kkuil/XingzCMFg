<script setup lang="ts">
import NavHeader from "@/pages/Home/components/NavHeader.vue"
import {state, actions} from "@/store"

// 获取用户信息
(async function getUserAuthInfo() {
    if (!state.UserAuthState.userInfo.userInfo?.id) {
        await actions.UserAuthActions.setUserAuthInfo()
    }
})()

</script>

<template>
    <div class="container w-screen h-screen flex flex-col">
        <NavHeader class="h-[8%]"></NavHeader>
        <div class="router-container w-screen min-h-[92%] overflow-y-scroll bg-[#f0f2f5] scrollbar-none">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    /* 隐藏滚动条 */
    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>