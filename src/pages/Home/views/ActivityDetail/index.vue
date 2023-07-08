<script setup lang="ts">
import {onMounted, ref} from "vue"
import {useRoute} from "vue-router"
import {getActivityById} from "@/api/activity.ts";

const $route = useRoute();
const activityInfo = ref<Activity.ActivityItem>({});

(async function () {
    const result: API.Result = await getActivityById($route.params.activityId as string);
    if (result.data) {
        activityInfo.value = result.data as Activity.ActivityItem
    }
})();

// 规则展示标志类型
type RuleFlagType = {
    isOverMaxRuleLine: boolean,
    isCollapse: boolean
}

// 活动规则最多显示的行数
const MAX_LINE_IN_RULES = 15

// 获取规则元素
const activityRules = ref<HTMLParagraphElement>();

// 规则展示标志
const showRuleFlag = ref<RuleFlagType>({
    isOverMaxRuleLine: true,
    isCollapse: true
})

onMounted(() => {
    const curRuleLines = activityRules.value?.outerText.split("\n").length
    showRuleFlag.value.isOverMaxRuleLine = curRuleLines > MAX_LINE_IN_RULES
})

</script>

<template>
    <div class="activity-detail my-[10px] flex-center">
        <div class="container w-[85%] flex justify-between flex-col lg:flex-row">
            <aside class="left flex-[0.2] hidden lg:block">
                <div class="activity-type w-full bg-white">
                    <h2
                        class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center font-serif font-bold bg-emerald-300 text-white"
                    >
                        活动类型
                    </h2>
                    <div class="h-[45px] leading-[45px] px-[10px] text-sm">{{ activityInfo.type }}</div>
                </div>
                <div class="activity-activator w-full bg-white mt-[10px]">
                    <h2
                        class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center font-serif font-bold bg-[#0094ff] text-white"
                    >
                        发起者
                    </h2>
                    <a class="h-[45px] leading-[45px] px-[10px] text-sm">{{ activityInfo.activatorName }}</a>
                </div>
                <div class="attend-number w-full bg-white mt-[10px]">
                    <h2
                        class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center font-serif font-bold bg-cyan-500 text-white"
                    >
                        参与人数
                    </h2>
                    <div class="h-[45px] leading-[45px] px-[10px]">
                        <i class="iconfont icon-user mr-[5px]"></i>
                        <span class="text-sm">123人 / {{ activityInfo.maxAttendance }}</span>
                    </div>
                </div>
                <div class="activity-progress w-full bg-white mt-[10px]">
                    <h2
                        class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center font-serif font-bold bg-teal-400 text-white"
                    >
                        活动进度
                    </h2>
                    <div class="p-[10px]">
                        <el-progress
                            :percentage="10"
                            :stroke-width="13"
                            striped
                            striped-flow
                            :duration="10"
                        />
                    </div>
                    <div class="border-t-[1px] text-sm">
                        <h3 class="h-[30px] leading-[30px] px-[10px] w-full overflow-hidden overflow-ellipsis line-clamp-1">
                            开始时间：{{ activityInfo.startTime }}</h3>
                        <h3 class="h-[30px] leading-[30px] px-[10px] w-full overflow-hidden overflow-ellipsis line-clamp-1">
                            截止时间：{{ activityInfo.endTime }}</h3>
                        <h3 class="h-[30px] leading-[30px] px-[10px] w-full overflow-hidden overflow-ellipsis line-clamp-1">
                            剩余时间：2小时</h3>
                    </div>
                </div>
                <div class="attend-user-type-limit w-full bg-white mt-[10px]">
                    <h2
                        class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center font-serif font-bold bg-cyan-500 text-white"
                    >
                        谁可参与
                    </h2>
                    <div class="h-[45px] leading-[45px] px-[10px] text-sm">
                        {{ activityInfo.authorizedPersonnel }}
                    </div>
                </div>
                <div class="max-xing-coin w-full bg-white mt-[10px]">
                    <h2
                        class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center font-serif font-bold bg-cyan-500 text-white"
                    >
                        可获取的最大星分币数
                    </h2>
                    <div class="h-[45px] leading-[45px] px-[10px] text-sm">
                        <i class="iconfont icon-coin mr-[5px]"></i>
                        <span>{{ activityInfo.maxAquirableXingCoin }} / 人</span>
                    </div>
                </div>
            </aside>
            <main class="center h-full flex-[0.71] lg:flex-[0.51] bg-white min-h-[600px]">
                <h2
                    class="h-[65px] leading-[65px] text-[30px] font-bold px-[20px] border-b-[1px]"
                >
                    {{ activityInfo.title }}
                </h2>
                <p class="p-[10px]">
                    {{ activityInfo.detail }}
                </p>
            </main>
            <aside class="right h-full flex-[0.27] mt-[10px] lg:m-0">
                <div class="activity-rules w-full bg-white sticky top-[10px] right-0">
                    <h2
                        class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center font-serif font-bold"
                    >
                        活动规则
                    </h2>
                    <p
                        ref="activityRules"
                        class="p-[10px] pb-0 text-[14px] leading-[27px]"
                        :class="`${showRuleFlag.isCollapse ? `overflow-hidden overflow-ellipsis line-clamp-[${MAX_LINE_IN_RULES}]` : ''}`"
                        v-html="activityInfo.rule"
                    >
                    </p>
                    <div class="px-[10px] py-[5px] text-sm">
                        <span
                            class="cursor-pointer text-[#5d93bb]"
                            @click="showRuleFlag.isCollapse = !showRuleFlag.isCollapse"
                        >
                            {{ showRuleFlag.isCollapse ? '展开' : '收起' }}
                        </span>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>