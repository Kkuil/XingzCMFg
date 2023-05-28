<script setup>
import {ref} from "vue"
import {useRouter} from "vue-router"

const $router = useRouter()

</script>

<template>
    <el-result title="你访问的页面好像不存在了，请检查地址是否有误" sub-title="Sorry, not found">
        <template #icon>
            <img src="../../assets/images/404.png" alt="404"/>
        </template>
        <template #extra>
            <el-button type="primary" @click="$router.push('/')">Back</el-button>
        </template>
    </el-result>
</template>

<style scoped lang="scss">

</style>