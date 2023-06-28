<script setup lang="ts">
import {listUserRank} from "@/api/user"
import {ref} from "vue"
import {useRouter} from "vue-router"

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

// 初始化用户等级信息
(async function () {
    const result: API.Result = await listUserRank({
        current: 1,
        pageSize: 6
    })
    if (result.data) {
        userRankInfos.value = result.data.list
    }
})()

/**
 * @description 跳转用户详情页
 * @param userId
 */
const gotoProfile = (userId: string) => {
    window.location.href = `/xingz-cm/profile/${userId}`
}
</script>

<template>
    <div
        class="main-side xl:w-[350px] h-[800px] ml-[20px] sticky top-[10px] right-0 hidden xl:flex flex-col justify-between">
        <div class="user-rank w-full flex-[0.41] bg-white flex flex-col">
            <div class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center">
                <span class="font-serif font-bold">星知等级榜单</span>
                <a class="text-[12px] text-[#5d93bb] underline cursor-pointer">查看全部榜单</a>
            </div>
            <div class="rank-info flex-1 flex flex-col">
                <div class="top-three flex-[0.60] flex border-b-[1px]">
                    <div class="top-second w-[33.33%] flex items-center justify-end translate-y-[10px] cursor-pointer">
                        <AvatarFrame
                            :src="userRankInfos[1]?.avatar"
                            frameColor="#5d93bb"
                            @click="gotoProfile(userRankInfos[1].id as string)"
                        />
                    </div>
                    <div class="top-first w-[33.33%] flex-center translate-y-[-30px] cursor-pointer">
                        <AvatarFrame
                            :src="userRankInfos[0]?.avatar"
                            frameColor="#5d93bb"
                            @click="gotoProfile(userRankInfos[0].id as string)"
                        />
                    </div>
                    <div class="top-third w-[33.33%] flex items-center translate-y-[10px] cursor-pointer">
                        <AvatarFrame
                            :src="userRankInfos[2]?.avatar"
                            frameColor="#5d93bb"
                            @click="gotoProfile(userRankInfos[2].id as string)"
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
        <div class="author-info w-full flex-[0.25] bg-white flex flex-col">
            <div class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center">
                <span class="font-serif font-bold">站长大大</span>
                <el-tooltip
                    :content="`
                        <img src='../../../../../../public/wechat-payment.jpg' class='w-[130px]'/>
                    `"
                    placement="top"
                    class="bg-white"
                    raw-content
                >
                    <a class="text-[12px] text-[#5d93bb] underline cursor-pointer">给楼主赏杯可乐</a>
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
        <div class="recommend-articles w-full flex-[0.3] bg-white">
            <div class="w-full h-[45px] border-b-[1px] px-[10px] text-sm flex justify-between items-center">
                <span class="font-serif font-bold">推荐文章</span>
                <i class="iconfont icon-link hover:text-[#5d93bb] cursor-pointer"></i>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>