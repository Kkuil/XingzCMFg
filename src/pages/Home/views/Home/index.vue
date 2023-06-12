<script setup lang="ts">
import {reactive, ref, watch} from "vue"
import {state, actions} from "@/store"
import {useRoute, useRouter} from "vue-router"

const $router = useRouter()
const $route = useRoute()

const articles = ref<Element>();

// 分类
const categories = ["最新文章", "热门文章", "优质文章"];
// 当前选中的标签和分类信息
const activeInfo = reactive({
    tag: "",
    category: "最新文章"
});

// 初始化tags
(function () {
    if (!state.TagState.tags.tags?.length) {
        actions.TagActions.setTags()
    }
})()

// 监听路由变化
watch(() => $route, (route) => {
    console.log(route)
}, {
    deep: true,
    immediate: true
})

const changeArticles = () => {

}

</script>

<template>
    <div class="home flex-center px-[10px] md:px-[30px] lg:px-[75px] pt-[15px] w-screen z-[-1]" ref="home">
        <div class="container flex justify-between w-full">
            <main class="main flex flex-col flex-1 xl:flex-[0.74] w-full">
                <div class="main-tags flex w-full h-[30px] mb-[10px]">
                    <div class="tags w-full h-full hidden xl:flex">
                        <div
                            class="
                                tag
                                overflow-ellipsis
                                overflow-hidden
                                px-[10px]
                                text-sm
                                max-w-[100px]
                                h-full
                                bg-[#fafafa]
                                mr-[8px]
                                flex-center
                                cursor-pointer
                                transition-[color]
                                hover:text-[#2589d4]
                            "
                            v-for="(tag, index) in state.TagState.tags.tags" :key="tag.id"
                            :class="index === 1 ? 'text-[#2589d4]' : ''"
                        >
                            {{ tag.tagName }}
                        </div>
                    </div>
                    <div class="
                         ellipsis
                         w-[60px]
                         h-full
                         font-semibold
                         bg-[#fafafa]
                         flex-center
                         cursor-pointer
                         transition-[color]
                         hover:text-[#2589d4]
                    "
                    >...
                    </div>
                </div>
                <div class="category flex w-full h-[60px] border-t-[1px] py-[10px]">
                    <div
                        class="
                            cate
                            overflow-ellipsis
                            overflow-hidden
                            px-[10px]
                            max-w-[100px]
                            text-sm
                            bg-[#fafafa]
                            mr-[8px]
                            flex-center
                            cursor-pointer
                            transition-[color]
                            hover:text-[#2589d4]
                            text-[#2589d4]
                        "
                        v-for="item in categories"
                        :key="item"
                        :class="activeInfo.category === item ? 'text-[#2589d4]' : ''"
                        @clcik="changeArticles(item)"
                    >
                        {{ item }}
                    </div>
                </div>
                <div class="main-articles w-full flex-1" ref="articles">
                    <el-skeleton :count="5" animated :loading="false">
                        <template #default>
                            <div
                                class="w-full h-[200px] relative bg-white mb-4 flex-center p-[15px] cursor-pointer transition-all hover:bg-[#fafafa]"
                                v-for="item in 20"
                                :key="item"
                                v-slide-in
                                title="点击阅读文章"
                            >
                                <img
                                    src="https://w.wallhaven.cc/full/zy/wallhaven-zyq3xg.png"
                                    alt="Kkuil"
                                    title="Kkuil"
                                    class="w-[145px] h-[145px] object-cover hidden lg:block"
                                />
                                <div class="main m-0 lg:ml-[20px] flex-1 h-full flex flex-col">
                                    <h1 class="
                                        title
                                        w-full
                                        max-w-full
                                        overflow-ellipsis
                                        line-clamp-1
                                        break-all
                                        font-semibold
                                        text-[20px]
                                        lg:text-[25px]
                                        leading-[45px]
                                    "
                                    >
                                        Kkuil大爆炸dawdadawdawdawdawdwadwadwadwadawdwadawdwadwad
                                    </h1>
                                    <div
                                        class="content w-full overflow-ellipsis overflow-hidden text-sm lg:text-md line-clamp-6 md:line-clamp-4"
                                    >
                                        随机一段废话, 到底应该如何实现. 经过上述讨论, 随机一段废话, 发生了会如何,
                                        不发生又会如何. 经过上述讨论, 从这个角度来看, 本人也是经过了深思熟虑,在每个日日夜夜思考这个问题.
                                        问题的关键究竟为何? 从这个角度来看, 就我个人来说, 随机一段废话对我的意义,
                                        不能不说非常重大. 而这些并不是完全重要, 更加重要的问题是, 每个人都不得不面对这些问题.
                                        在面对这种问题时, 左拉曾经说过,随机一段废话, 到底应该如何实现. 经过上述讨论,
                                        随机一段废话, 发生了会如何, 不发生又会如何. 经过上述讨论, 从这个角度来看,
                                        本人也是经过了深思熟虑,在每个日日夜夜思考这个问题. 问题的关键究竟为何? 从这个角度来看,
                                        就我个人来说, 随机一段废话对我的意义, 不能不说非常重大. 而这些并不是完全重要,
                                        更加重要的问题是, 每个人都不得不面对这些问题. 在面对这种问题时, 左拉曾经说过,
                                    </div>
                                    <div class="article-info hidden md:flex justify-end w-full text-[#ccc] mt-[10px]">
                                        <div class="like ml-[15px] transition-[color] hover:text-[#0094ff] flex-center">
                                            <i class="iconfont icon-thumb-up mr-[5px] text-xl"></i>
                                            <span class="text-sm">999+</span>
                                        </div>
                                        <div class="comment ml-[15px] transition-[color] hover:text-[#000] flex-center">
                                            <i class="iconfont icon-comment_light mr-[5px] text-xl"></i>
                                            <span class="text-sm">999+</span>
                                        </div>
                                        <div
                                            class="collect ml-[15px] transition-[color] hover:text-[#a6a855] flex-center">
                                            <i class="iconfont icon-collection mr-[5px] text-xl"></i>
                                            <span class="text-sm">999+</span>
                                        </div>
                                        <div class="publishTime ml-[15px] flex-center">
                                            <i class="iconfont icon-clock mr-[5px] text-md"></i>
                                            <span class="text-sm">2023-06-07</span>
                                        </div>
                                        <el-dropdown class="ml-[25px] flex-center">
                                            <span class="el-dropdown-link font-bold text-lg">
                                              ...
                                            </span>
                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-dropdown-item>
                                                        <i class="iconfont icon-jubao"></i>
                                                        <span>举报</span>
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #template>
                            <div class="w-full h-[230px] bg-white mb-4 flex-center px-[15px]">
                                <el-skeleton-item variant="image" style="width: 180px; height: 180px;"/>
                                <div class="main ml-[20px] flex-1">
                                    <div class="title">
                                        <el-skeleton-item style="width: 200px;"/>
                                    </div>
                                    <div class="content w-full">
                                        <el-skeleton-item v-for="i in 5" :key="i" style="width: 100%;"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-skeleton>

                </div>
            </main>
            <div class="main-side bg-[#0094ff] flex-[0.24] h-[600px] sticky top-[20px] right-0 hidden xl:block"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>