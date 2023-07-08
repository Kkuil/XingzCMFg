<script setup lang="ts">
import {listUserRank} from "@/api/user"
import {ref} from "vue"
import {useRouter} from "vue-router"
import SvgIcon from "@/components/SvgIcon/index.vue";
import {listActivities} from "@/api/activity.ts";

const $router = useRouter()

const authorInfo = [
    {
        icon: "github",
        name: "Github",
        link: "https://github.com/Kkuil",
    },
    {
        icon: "qq",
        name: "QQ",
        link: "https://user.qzone.qq.com/3024067144/infocenter",
    },
    {
        icon: "weixin",
        name: "微信",
        link: "",
    },
    {
        icon: "weibo-fill",
        name: "微博",
        link: "",
    },
];

const userRankInfos = ref<USER_RANK.UserRankInfo[]>([]);
const activities = ref<Activity.ActivityItem[]>([]);

// 初始化用户等级信息
(async function () {
    const result: API.Result = await listUserRank({
        current: 1,
        pageSize: 6
    })
    if (result.data) {
        userRankInfos.value = result.data.list
    }
})();

// 初始化每日任务
(async function () {
    const result: API.Result = await listActivities({
        current: 1,
        pageSize: 5
    })
    if (result.data) {
        activities.value = result.data.list
    }
})()

/**
 * @description 跳转用户详情页
 * @param userId
 */
const gotoProfile = (userId: string) => {
    $router.push({
        name: "profile",
        params: {
            userId
        }
    })
}

/**
 * @description 跳转活动详情页
 * @param activityId string
 */
const gotoActivityDetail = (activityId: string) => {
    $router.push({
        name: "activity-detail",
        params: {
            activityId
        }
    })
}
</script>

<template>
    <div
        class="main-side xl:w-[350px] ml-[20px] hidden xl:block"
    >
        <div class="user-rank w-full h-[300px] bg-white flex flex-col">
            <div
                class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center bg-[#e8dca0]">
                <span class="font-serif font-bold">星知等级榜单</span>
                <a class="text-[12px] underline cursor-pointer">查看全部榜单</a>
            </div>
            <div class="rank-info flex-1 flex flex-col">
                <div class="top-three flex-[0.60] flex border-b-[1px]">
                    <div class="top-second w-[33.33%] flex items-center justify-end translate-y-[10px]">
                        <AvatarFrame
                            :src="userRankInfos[1]?.avatar"
                            frameColor="#5d93bb"
                            :contentBelowAvatar="userRankInfos[0]?.points + '分'"
                            @click="gotoProfile(userRankInfos[1].id as string)"
                            class="cursor-pointer"
                        />
                    </div>
                    <div class="top-first w-[33.33%] flex-center translate-y-[-30px] cursor-pointer">
                        <AvatarFrame
                            :src="userRankInfos[0]?.avatar"
                            frameColor="#5d93bb"
                            :contentBelowAvatar="userRankInfos[0]?.points + '分'"
                            @click="gotoProfile(userRankInfos[0].id as string)"
                            class="cursor-pointer"
                        />
                    </div>
                    <div class="top-third w-[33.33%] flex items-center translate-y-[10px] cursor-pointer">
                        <AvatarFrame
                            :src="userRankInfos[2]?.avatar"
                            frameColor="#5d93bb"
                            :contentBelowAvatar="userRankInfos[0]?.points + '分'"
                            @click="gotoProfile(userRankInfos[2].id as string)"
                            class="cursor-pointer"
                        />
                    </div>
                </div>
                <div class="bottom-two flex-[0.4] flex flex-col p-[10px]">
                    <div
                        class="w-full flex items-center justify-between transition-all rounded-md px-[5px] h-[33.33%] cursor-pointer hover:bg-[#aeddff]"
                        v-for="item in userRankInfos.slice(3)"
                        :key="item.id"
                        :title="item.username"
                        @click="gotoProfile(item.id as string)"
                    >
                        <div class="flex-center">
                            <img :src="item.avatar" class="w-[25px] h-[25px] rounded-full"/>
                            <span class="text-sm ml-[7px]">{{ item.username }}</span>
                        </div>
                        <span class="text-xs">{{ item.points }}分</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="site-author-info w-full h-[200px] bg-white flex flex-col mt-[15px] z-[999]">
            <div
                class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center bg-[#5cb3f2]">
                <span class="font-serif font-bold">站长大大</span>
                <el-tooltip
                    :content="`
                        <img src='../../../../../../public/wechat-payment.jpg' class='w-[130px]'/>
                    `"
                    placement="top"
                    class="bg-white"
                    raw-content
                >
                    <a class="text-[12px] underline cursor-pointer">给楼主赏杯可乐</a>
                </el-tooltip>
            </div>
            <div class="container w-full flex-1">
                <div class="w-full h-full flex flex-col p-[10px]">
                    <div
                        class="w-full flex items-center justify-between transition-all cursor-pointer hover:bg-[#aeddff] rounded-md px-[5px]"
                        :class="`flex-[${1 / authorInfo.length}]`"
                        v-for="item in authorInfo"
                        :key="item.name"
                        :title="item.name"
                    >
                        <div class="left text-md">
                            <i :class="`iconfont icon-${item.icon} mr-[5px] text-[17px]`"></i>
                            <span>{{ item.name }}</span>
                        </div>
                        <a :href="item.link"
                           class="w-[150px] overflow-hidden overflow-ellipsis underline hover:text-[#0094ff] text-xs">{{
                                item.link
                            }}</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="today-activities w-full flex-[0.3] bg-white mt-[15px]">
            <div
                class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center bg-[#5d93bb] font-serif">
                <span class="font-bold text-white">每日活动</span>
                <span class="hover:text-white cursor-pointer text-xs">更多活动</span>
            </div>
            <div class="activities p-[8px] font-sans">
                <div
                    class="h-[30px] flex items-center justify-between transition-all cursor-pointer hover:bg-[#aeddff] rounded-md px-[5px]"
                    v-for="activity in activities"
                    :key="activity"
                    title="点击查看活动详情"
                    v-if="true"
                    @click="gotoActivityDetail(activity.id)"
                >
                    <span>{{ activity.title }}</span>
                </div>
                <div class="empty w-full min-h-[200px] flex-center flex-col" v-else>
                    <SvgIcon icon-class="firework" class="w-[100px] h-[100px]"/>
                    <div class="description mt-[10px]">今日任务已完成，明天再来吧！</div>
                </div>
            </div>
        </div>
        <aside
            class="h-full text-[#848587] text-[13px] mt-[10px] mt-[10px]">
            <div class="first">
                    <span>
                        <i class="iconfont icon-user"></i>
                        站长:
                        <a href="/xingz-cm/profile/477f3c9feda7e6303190a1381cd49d68"
                           class="hover:text-[#242490]">Kkuil</a>
                    </span>
                <a class="ml-[15px] hover:text-[#242490]" href="https://github.com/Kkuil/XingzFg"
                   target="_blank">
                    <i class="iconfont icon-star"></i>
                    前端菜K
                </a>
            </div>
            <div class="second">
                <a class="hover:text-[#242490]" href="https://github.com/Kkuil/XingzFg" target="_blank">
                    <i class="iconfont icon-info"></i>
                    <span>关于本站</span>
                </a>
                <a class="ml-[15px] hover:text-[#242490]" href="https://github.com/Kkuil/XingzFg"
                   target="_blank">
                    <i class="iconfont icon-bug"></i>
                    提交issue
                </a>
            </div>
            <div class="third">
                <i class="iconfont icon-copyright"></i>
                2023 前端菜K |
                <a class="text-[#0094ff]" href="https://github.com/Kkuil/XingzFg" target="_blank">沪ICP备
                    3024067144号-2</a>
            </div>
        </aside>
    </div>
</template>

<style scoped lang="scss">

</style>