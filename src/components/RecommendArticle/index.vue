<script setup lang="ts">

</script>

<template>
    <div class="recommend-articles flex flex-col flex-1 px-[20px] py-[10px]">
        <div
            class="
                article
                w-full
                h-[30px]
                leading-[30px]
                cursor-pointer
                rounded-[2px]
                hover:bg-[#f1f1f1]
                overflow-hidden
                overflow-ellipsis
                line-clamp-1
                my-[5px]
                px-[5px]
            "
            v-for="(article, index) in 5"
            :key="index"
        >
            随机一段废话因何而发生?在这种困难的抉择下, 本人思来想去, 寝食难安.
            现在, 解决随机一段废话的问题, 是非常非常重要的. 所以, 在这种困难的抉择下, 本人思来想去,
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>