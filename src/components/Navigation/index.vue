<script setup lang="ts">
import {defineProps, ref} from "vue"

import {useRoute, useRouter} from "vue-router"

const $router = useRouter()
const $route = useRoute()

const {navigation, trigger} = defineProps({
    navigation: {
        required: true
    },
    trigger: {
        type: String,
        default: "click"
    }
})

</script>

<template>
    <div
        v-for="(item, index) in navigation"
        :key="item.path"
        class="
            dropdown-select
            z-[999]
            relative
            h-[40px]
            px-4
            font-semibold
            text-md
            transition-all
            cursor-pointer
            hover:bg-[#efefef]
            hover:rounded-lg
            rounded-lg
            flex-center
            justify-around
            mx-2
        "
        :class="$route.path === item.path ? 'text-[#5d93bb] bg-[#efefef]' : ''"
        @click="() => {
            item.path && $router.push(item.path)
            if(trigger !== 'hover') {
                $emit('toggleShowSelect', index, !item.isShowSelect)
            }
        }"
        @mouseenter="() => {
            if(trigger === 'hover') {
                $emit('toggleShowSelect', index, true)
            }
        }"
        @mouseleave="() => {
            if(trigger === 'hover') {
                $emit('toggleShowSelect', index, false)
            }
        }"
        v-click-outside="() => {
            $emit('toggleShowSelect', index, false)
        }"
    >
        <span>{{ item.name }}</span>
        <i class="iconfont icon-arrow-down ml-[6px]" v-show="item?.children && item.children.length"></i>
        <Transition name="select">
            <div
                v-show="item.isShowSelect && item.children && item.children.length"
                class="
                    z-[999]
                    select
                    absolute
                    top-[110%]
                    left-0
                    w-full
                    bg-white
                    rounded-lg
                    py-[10px]
                    shadow-xl
                    transition-all
                    border-[1px]
                "
            >
                <div
                    class="c-item transition-[background-color] hover:bg-[#efefef] h-[30px] flex-center"
                    :class="$route.path === citem.path ? 'text-[#5d93bb] bg-[#efefef]' : ''"
                    v-for="citem in item.children"
                    :key="citem.path"
                    @click="() => {
                        citem.path && $router.push(citem.path)
                    }"
                >
                    {{ citem.name }}
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.select-enter-to,
.select-leave-from {
    transform: translateY(0px);
    opacity: 1;
}

.select-enter-from,
.select-leave-to {
    transform: translateY(-30px);
    opacity: 0.5;
}
</style>