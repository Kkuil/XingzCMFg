<script setup lang="ts">
import {defineProps, ref} from "vue"
import axios from "axios"

const $props = defineProps({
    size: {
        type: String,
        default: "default"
    },
    frameColor: {
        type: String,
        default: "white"
    },
    src: {
        type: String,
    },
    content: {
        type: String,
        default: "User"
    },
    contentBelowAvatar: {
        type: String
    }
});

// 判断图片是否可显示
(async function () {
    if ($props?.src) {
        try {
            await axios.get($props.src as string)
        } catch (e) {
            isShowAvatar.value = false
        }
    } else {
        isShowAvatar.value = false
    }
})()

const isShowAvatar = ref<boolean>(true)

const mapSizeToValue = {
    small: {
        frame: "w-[50px] h-[50px]",
        avatar: "w-[45px] h-[45px]",
        fz: "xs"
    },
    default: {
        frame: "w-[60px] h-[60px]",
        avatar: "w-[55px] h-[55px]",
        fz: "sm"
    },
    large: {
        frame: "w-[95px] h-[95px]",
        avatar: "w-[80px] h-[80px]",
        fz: "md"
    },
}

</script>

<template>
    <div
        class="avatar-frame rounded-full "
        :class="`${mapSizeToValue[size].frame} bg-[${frameColor}]`"
    >
        <div class="avatar-container w-full h-full flex-center">
            <div
                class="avatar flex-center overflow-hidden rounded-full"
                :class="`${mapSizeToValue[size].avatar} text-${mapSizeToValue[size].fz}`"
            >
                <img
                    v-if="isShowAvatar"
                    class="img w-full h-full object-cover"
                    :src="src"
                />
                <div
                    v-else
                    class="content flex-center bg-white h-full w-full"
                >{{ content }}
                </div>
            </div>
        </div>
        <span class="mt-[5px] text-xs flex-center">{{ contentBelowAvatar }}</span>
    </div>
</template>

<style scoped lang="scss">

</style>