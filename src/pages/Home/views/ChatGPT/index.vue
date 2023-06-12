<script setup lang="ts">
import {state, actions} from "@/store"
import {reactive, ref} from "vue"

// 页码信息
const pageInfo = reactive({
    current: 1,
    pageSize: 10
});

// 挡圈选中的模型信息
const modelInfo = ref({
    id: "",
    name: "",
    cover: ""
});

// 初始化模型
(async function () {
    if (!state.ChatGPTModelState.chatGPTModels.chatGPTModels?.length) {
        await actions.ChatGPTModelActions.setChatGPTModels(pageInfo)
    }
})()

/**
 * 选择模型
 */
const chooseModel = (e: Event) => {
    const model = e.target?.dataset?.model
    if (model) {
        const parseModel = JSON.parse(model)
        modelInfo.value = parseModel
    }
}

</script>

<template>
    <div class="chat-gpt flex-center w-screen h-full relative">
        <div
            class="container flex w-[1000px] h-[90%] text-[#000] rounded-lg shadow-2xl bg-[#303133] overflow-hidden"
        >
            <div class="model-list h-full flex-[0.25] hidden md:flex flex-col bg-[#303133] shadow-xl">
                <div
                    class="logo w-full h-[60px] flex-center shadow-md text-[#fafafa] text-[30px] rounded-t-lg relative font-serif bg-[#303133]">
                    ChatGPT
                </div>
                <div
                    class="list h-full overflow-y-scroll scrollbar-none"
                    @click="chooseModel"
                >
                    <div
                        class="friend w-full h-[70px] flex items-center px-[15px] text-white cursor-pointer border-b-[1px] border-[#0d1117] hover:bg-[#292c33] transition-all"
                        v-for="(model,index) in state.ChatGPTModelState.chatGPTModels.chatGPTModels"
                        :key="index"
                        :class="modelInfo.id === model.id ? 'bg-[#292c33]' : ''"
                        :data-model="JSON.stringify({
                            id: model.id,
                            name: model.name,
                            cover: model.cover
                        })"
                    >
                        <img
                            :src="model.cover"
                            :title="model.name"
                            :alt="model.name"
                            class="avatar rounded-full w-[45px] h-[45px] object-cover pointer-events-none"
                        />
                        <div class="friend-info ml-[8px] pointer-events-none">
                            <div class="username text-sm w-[40px] h-[20px] overflow-ellipsis overflow-hidden">
                                {{ model.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-area flex flex-col flex-1 md:flex-[0.75]"
                 element-loading-text="连接中">
                <div class="chat-content flex flex-col flex-[0.65]">
                    <div
                        class="title w-full h-[65px] flex items-center pl-[20px] text-[#fff] font-semibold text-xl border-b-[1px] border-[#0d1117]">
                        {{ modelInfo.name }}
                    </div>
                    <div class="content w-full h-[330px] p-[10px]">
                        <div class="content w-full h-full max-h-full overflow-y-scroll scrollbar-none text-[#fafafa]">
                        </div>
                    </div>
                </div>
                <div class="send-content flex flex-col flex-[0.35]" v-if="modelInfo.id">
                    <div class="tools w-full flex-[0.2] border-y-[1px] border-[#0d1117] flex items-center px-[10px]">
                        <i class="iconfont icon-expression text-[#fafafa] hover:text-[#5d93bb] transition-[color] cursor-pointer"></i>
                    </div>
                    <div class="p-[10px] w-full flex flex-col flex-[0.8] text-white">
                        <textarea
                            class="content w-full flex-[0.85] resize-none outline-none bg-[#303133] scrollbar-none"
                            autofocus
                        ></textarea>
                        <div class="btn-send flex-[0.15] flex justify-end mb-[8px] mr-[8px]">
                            <button
                                class="send w-[95px] rounded-md h-[35px] bg-[#ccc] text-[#5d93bb] font-semibold text-sm hover:bg-[#d2d2d2] transition-all active:scale-95"
                            >
                                发送(Enter)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>