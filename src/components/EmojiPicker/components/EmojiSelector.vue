<template>
    <div class="bg-white rounded shadow-lg p-[5px] w-[300px] overflow-y-scroll scrollbar-none">
        <div
            class="flex flex-wrap"
            @click="onSelect"
        >
            <button
                v-for="emoji in emojis"
                :key="emoji.id"
                :data-emoji="emoji.emoji"
                class="text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded hover:bg-[#ccc] min-w-[30px] w-auto"
            >
                {{ emoji.emoji }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineEmits, ref} from "vue"

const $emits = defineEmits(["select"])
const emojis = ref([
    {"id": 1, "emoji": "😄", "description": "笑脸"},
    {"id": 2, "emoji": "😂", "description": "哭笑"},
    {"id": 3, "emoji": "😊", "description": "微笑"},
    {"id": 4, "emoji": "😍", "description": "爱慕"},
    {"id": 5, "emoji": "😒", "description": "不悦"},
    {"id": 6, "emoji": "😎", "description": "酷"},
    {"id": 7, "emoji": "😢", "description": "哭泣"},
    {"id": 8, "emoji": "😡", "description": "生气"},
    {"id": 9, "emoji": "😮", "description": "惊讶"},
    {"id": 10, "emoji": "😏", "description": "无奈"},
    {"id": 11, "emoji": "😌", "description": "松了一口气"},
    {"id": 12, "emoji": "😓", "description": "汗"},
    {"id": 13, "emoji": "😔", "description": "沮丧"},
    {"id": 14, "emoji": "😖", "description": "痛苦"},
    {"id": 15, "emoji": "😜", "description": "调皮"},
    {"id": 16, "emoji": "😘", "description": "亲吻"},
    {"id": 17, "emoji": "😋", "description": "馋"},
    {"id": 18, "emoji": "😃", "description": "开心"},
    {"id": 19, "emoji": "😤", "description": "憋气"},
    {"id": 20, "emoji": "😭", "description": "大哭"},
    {"id": 21, "emoji": "😦", "description": "愕然"},
    {"id": 22, "emoji": "😩", "description": "烦恼"},
    {"id": 23, "emoji": "😰", "description": "焦虑"},
    {"id": 24, "emoji": "😱", "description": "惊恐"},
    {"id": 25, "emoji": "😲", "description": "呆若木鸡"},
    {"id": 26, "emoji": "🙄", "description": "翻白眼"},
    {"id": 27, "emoji": "😉", "description": "眨眼"},
    {"id": 28, "emoji": "😺", "description": "有嘴巴的猫笑脸"},
    {"id": 29, "emoji": "😻", "description": "猫爱慕"},
    {"id": 30, "emoji": "😼", "description": "调皮的猫"},
    {"id": 31, "emoji": "😽", "description": "猫亲吻"},
    {"id": 32, "emoji": "😾", "description": "生气的猫"},
    {"id": 33, "emoji": "😿", "description": "哭泣的猫"},
    {"id": 34, "emoji": "🤔", "description": "思考"},
    {"id": 35, "emoji": "🤗", "description": "拥抱"},
    {"id": 36, "emoji": "🤩", "description": "星眼"},
    {"id": 37, "emoji": "🤪", "description": "疯狂"},
    {"id": 38, "emoji": "🤫", "description": "安静"},
    {"id": 39, "emoji": "🤭", "description": "嘘"},
    {"id": 40, "emoji": "🧐", "description": "聪明"},
    {"id": 41, "emoji": "👍", "description": "点赞"},
    {"id": 42, "emoji": "👎", "description": "点踩"},
    {"id": 43, "emoji": "👌", "description": "确定"},
    {"id": 44, "emoji": "✌️", "description": "胜利"},
    {"id": 45, "emoji": "🙏", "description": "感恩"},
    {"id": 46, "emoji": "🤙", "description": "打电话"},
    {"id": 47, "emoji": "💪", "description": "力量"},
    {"id": 48, "emoji": "❤️", "description": "爱心"},
    {"id": 49, "emoji": "💔", "description": "心碎"},
])

const onSelect = function (e: Event) {
    const emoji = e.target?.dataset?.emoji
    $emits("select", emoji)
}

</script>