<script setup>
import {useRouter} from "vue-router"

const $router = useRouter()

</script>

<template>
    <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
            <p class="font-semibold text-indigo-600 text-xl">404</p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">页面未找到</h1>
            <p class="mt-6 text-base leading-7 text-gray-600">对不起，我们没有找到你需要的页面</p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <a href="javascript: void(0);"
                   class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                   @click="$router.push('/xingz-cm')"
                >
                    回到主页
                </a>
                <a href="#" class="text-sm font-semibold text-gray-900">
                    <span aria-hidden="true"></span>
                </a>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">

</style>