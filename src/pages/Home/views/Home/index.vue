<script setup lang="ts">
import MainArticle from "./components/MainArticle.vue"
import MainSide from "./components/MainSide.vue"

</script>

<template>
    <div class="home flex-center px-[10px] md:px-[30px] lg:px-[75px] pt-[15px] w-screen z-[-1]">
        <div class="container flex justify-between w-full">
            <MainArticle/>
            <MainSide/>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>