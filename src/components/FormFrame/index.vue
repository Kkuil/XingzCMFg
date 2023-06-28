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
        <div class="cover h-full bg-[#000] w-0 lg:w-[65%] md:w-[50%] sm:w-0 relative overflow-hidden">
            <div class="container w-full h-full flex-center flex-col">
                <h2 class="cover-text relative text-[100px] font-bold font-serif bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500 text-transparent">星知文章</h2>
            </div>
        </div>
        <div class="container h-full flex-center w-full lg:w-[35%] md:w-[50%] sm:w-full">
            <div
                class="registry flex flex-1 min-h-full flex-col justify-center px-6 py-12 lg:px-8 transition-all">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img class="mx-auto" src="/favicon.png" alt="星知文章CM" style="width: 200px;"/>
                    <h2 class="text-2xl flex-center my-3 font-semibold text-white">{{ $props.title }}</h2>
                </div>
                <slot name="form"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$dot-color: #ffffff; // 白色
$max-radius: 3px; // 最大半径
$dot-count: 1000; // 小白点数量

@mixin dots($count) {
    $shadows: ();

    @for $i from 1 through $count {
        $left: random(1000); // 随机生成left值(0-100%)
        $top: random(1000); // 随机生成top值(0-100%)
        $size: random($max-radius); // 随机生成点的大小(0-10px)
        $shadow: #{$left}px #{$top}px #{$size}px $dot-color;

        $shadows: append($shadows, $shadow, comma);
    }

    &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 1px;
        box-shadow: $shadows;
    }
}

.cover {
    @include dots($dot-count);
}
</style>