<template>
    <div
        class="fixed inset-0 flex-center bg-black bg-opacity-50 z-[9999] w-screen h-screen"
        @click="handleClickOverlay"
    >
        <div
            class="bg-white rounded overflow-hidden shadow px-4 py-2 flex flex-col"
            :class="`w-[${width ? width + 'px' : '45%'}]`"
            @click.stop
        >
            <div class="title flex items-center justify-between h-[50px] text-[20px] border-b-[1px]">
                <slot name="header">标题</slot>
                <i class="iconfont icon-close text-xl cursor-pointer" @click="handleClose"></i>
            </div>
            <div
                class="content w-full h-[400px]"
                :class="`h-[${height ? height - 50 + 'px' : '400px'}]`"
            >
                <slot name="content">内容</slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps} from "vue"

type PropsType = {
    width?: number;
    height?: number;
}
const $props = defineProps(["width", "height"])
const $emits = defineEmits(["close"])

const handleClickOverlay = () => {
    $emits('close')
}

const handleClose = () => {
    $emits('close')
}

</script>

