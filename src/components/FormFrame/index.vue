<script setup lang="ts">
import {defineProps} from "vue"

const $props = defineProps({
    title: {
        type: String,
        required: true,
        default: "星知文章"
    }
})

</script>

<template>
    <div class="form w-screen h-screen flex">
        <div class="cover h-full bg-[#0094ff] w-0 lg:w-[65%] md:w-[50%] sm:w-0">
            <slot name="cover"></slot>
        </div>
        <div class="container h-full flex-center w-full lg:w-[35%] md:w-[50%] sm:w-full">
            <div
                class="registry flex flex-1 min-h-full flex-col justify-center px-6 py-12 lg:px-8 transition-all">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img class="mx-auto" src="/favicon.png" alt="星知文章CM" style="width: 200px;"/>
                    <h2 class="text-2xl flex-center my-3 font-semibold">{{ $props.title }}</h2>
                </div>
                <slot name="form"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>