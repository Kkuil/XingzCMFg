<script setup lang="ts">
import {actions, state} from "@/store"
import {onMounted, reactive, ref, watch} from "vue"
import {useRouter} from "vue-router"
import {CircleClose, CircleCloseFilled, Search} from "@element-plus/icons-vue"
import {getUserInfo} from "@/api/user.ts"
import {ElMessage} from "element-plus"

// websocket地址
const WsAddr = import.meta.env.VITE_WS_ADDR

const search = reactive({
    isSearch: false,
    input: "",
    data: [],
    isLoading: false
})

const chatInfo = reactive({
    username: "未连接",
    startedTime: "2023-06-03 00:00:00",
    content: [
        {
            username: "Kkuil",
            content: "你好啊",
            role: "sender",
            avatar: "https://w.wallhaven.cc/full/zy/wallhaven-zyq3xg.png",
            sendTime: "2023-06-03 00:00:00"
        },
        {
            username: "WYY",
            content: "你好啊",
            role: "reciever",
            avatar: "https://w.wallhaven.cc/full/zy/wallhaven-zyq3xg.png",
            sendTime: "2023-06-03 00:00:00"
        },
    ]
})

// 获取用户信息
async function getUserAuthInfo() {
    if (!state.UserAuthState.userInfo.userInfo?.id) {
        await actions.UserAuthActions.setUserAuthInfo()
    }
}

// 搜索用户
const searchUsername = async function () {
    if (search.input) {
        const {data}: API.Result = await getUserInfo(search.input)
        search.data = data
    } else {
        search.data = []
    }
}

// 开始建立Websocket聊天
async function startChat(e: Event) {
    console.log(e)
    const username = e.target?.dataset["username"]
    search.data = []
    if (!username) {
        return ElMessage({
            type: "error",
            message: "错误"
        })
    }
    search.isLoading = true
    // 建立连接
    let ws
    try {
        ws = new WebSocket(WsAddr + `${userId}`)
    } catch (e) {
        console.log(e)
        search.isLoading = false
        ElMessage({
            type: "error",
            message: "连接发生了点问题，请稍后再试吧"
        })
    }
    ws.onopen = (ev) => {
        console.log(ev)
        ElMessage({
            type: "success",
            message: "连接建立成功"
        })
        search.isLoading = false
        chatInfo.username = username
    }
    ws.onmessage = (ev) => {
        console.log(`收到消息：${ev.data}`)
    }
}

watch(() => search.input, searchUsername)

onMounted(async () => {
    await getUserAuthInfo()
})

</script>

<template>
    <div class="study-room flex-center w-screen h-full relative bg-[#5d93bb]">
        <div
            class="container flex w-[1000px] h-[90%] text-[#000] rounded-lg shadow-2xl text-[#000] bg-white"
        >
            <div class="friend-list h-full flex-[0.25] border-r-[1px] hidden md:flex flex-col">
                <div class="logo w-full h-[60px] flex-center shadow-md bg-white rounded-t-lg relative">
                    <el-tooltip
                        content="点击搜索用户"
                        placement="top"
                    >
                        <img
                            src="../../../../assets/images/logo.png"
                            alt="logo"
                            title="星知文章CM"
                            class="h-full cursor-pointer"
                            @click="() => {
                            search.isSearch = true
                        }"
                            v-show="!search.isSearch"
                        />
                    </el-tooltip>
                    <!-- 搜索框 -->
                    <div class="
                        search
                        flex
                        h-[50%]
                        rounded-md
                        transition-all
                        border-[1px]
                        border-[#ccc]
                        cursor-pointer
                        hover:shadow-[#5d93bb]
                        text-xs
                    "
                         v-if="search.isSearch"
                    >
                        <div class="search-input relative w-[85%] h-full flex items-center px-4">
                            <el-icon>
                                <Search/>
                            </el-icon>
                            <input
                                type="text"
                                placeholder="请输入要查找的用户名"
                                v-model="search.input"
                                class="w-full ml-2 outline-0"
                                @keyup.enter="searchUsername"
                            />
                            <el-icon
                                class="absolute right-3 top-1/2 -translate-y-1/2 ml-1 hover:text-[#5d93bb]"
                                :class="search.input ? '' : 'hidden'"
                                @click="search.input = ''"
                            >
                                <CircleClose/>
                            </el-icon>
                        </div>
                        <div
                            class="search-btn w-[15%] h-full text-md flex-center font-semibold bg-[#5d93bb] text-[#fefefe]"
                            title="搜索"
                            @click="searchUsername"
                        >
                            <el-icon>
                                <Search/>
                            </el-icon>
                        </div>
                        <!-- 搜索列表 -->
                        <div
                            class="
                                search-list
                                absolute
                                top-0
                                left-0
                                translate-y-[55px]
                                w-full
                                max-h-[250px]
                                overflow-y-scroll
                                bg-white
                                shadow-md
                                rounded-b-md
                            "
                            @dblclick="startChat"
                            v-show="search.input && search.data.length"
                        >
                            <el-tooltip
                                content="双击连接聊天"
                                :visible="!!search.data.length"
                            >
                                <div
                                    v-for="user in search.data"
                                    :key="user.id"
                                    :data-username="user.username"
                                    class="
                                        user
                                        w-full
                                        h-[40px]
                                        flex
                                        items-center
                                        justify-between
                                        px-[12px]
                                        transition-[background-color]
                                        hover:bg-[#f5f5f5]
                                    "
                                >
                                    <div class="user-info flex items-center">
                                        <img
                                            :src="user.avatar"
                                            :alt="user.username"
                                            :title="user.username"
                                            class="w-[25px] h-[25px] object-fit rounded-full"
                                        >
                                        <span class="ml-[8px]">{{ user.username }}</span>
                                    </div>
                                    <span class="justify-self-end">离线</span>
                                </div>
                            </el-tooltip>
                        </div>
                    </div>
                    <!-- 关闭搜索框 -->
                    <el-icon
                        class="
                        absolute
                        right-0
                        top-[10px]
                        text-[#ccc]
                        -translate-y-1/2
                        ml-1
                        hover:text-[#5d93bb]
                        transition-color
                        cursor-pointer
                    "
                        title="关闭"
                        v-if="search.isSearch"
                        @click="search.isSearch = false"
                    >
                        <CircleCloseFilled/>
                    </el-icon>
                </div>
                <div class="list h-full overflow-y-scroll">
                    <div
                        class="friend w-full h-[70px] flex items-center px-[15px] cursor-pointer border-b-[1px] hover:bg-[#ccc] transition-all"
                        v-for="(friend,index) in 15"
                        :key="index"
                        :class="index === 1 ? 'bg-[#f5f5f5]' : ''"
                        @click=""
                    >
                        <img
                            src="../../../../assets/images/404.png"
                            title="Kkuil"
                            alt="Kkuil"
                            class="avatar rounded-full w-[45px] h-[45px]"
                        />
                        <div class="friend-info ml-[8px]">
                            <div class="username text-sm w-[40px] h-[20px] overflow-ellipsis overflow-hidden">Kkuil
                            </div>
                            <div class="status text-sm w-[75px] h-[20px] overflow-ellipsis overflow-hidden">
                                在线dawdwadwadwadwadwad
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-area flex flex-col flex-1 md:flex-[0.75]" v-loading="search.isLoading"
                 element-loading-text="连接中">
                <div class="chat-content flex flex-col flex-[0.65]">
                    <div class="title w-full h-[65px] flex items-center pl-[20px] font-semibold text-xl border-b-[1px]">
                        {{ chatInfo.username }}
                    </div>
                    <div class="content w-full h-[330px] p-[10px]">
                        <div class="content w-full h-full max-h-full overflow-y-scroll">
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                            <div>123</div>
                        </div>
                    </div>
                </div>
                <div class="send-content flex flex-col flex-[0.35] border-t-[1px]">
                    <div class="tools w-full flex-[0.2] border-b-[1px] flex items-center px-[10px]">
                        <i class="iconfont icon-expression hover:text-[#5d93bb] transition-[color] cursor-pointer"></i>
                    </div>
                    <div class="p-[10px] w-full flex flex-col flex-[0.8]">
                        <textarea
                            class="content w-full flex-[0.85] resize-none outline-none"
                            autofocus
                        ></textarea>
                        <div class="btn-send flex-[0.15] flex justify-end mt-[8px] mr-[8px]">
                            <button
                                class="send w-[95px] rounded-md h-[35px] bg-[#e9e9e9] text-[#5d93bb] text-sm hover:bg-[#d2d2d2] transition-[background-color]">
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
.list {
    /* 隐藏滚动条 */
    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

.content {
    /* 隐藏滚动条 */
    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

.search-list {
    /* 隐藏滚动条 */
    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>