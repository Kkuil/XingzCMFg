<template>
    <div
        class="fixed inset-0 flex-center bg-black bg-opacity-50 z-[9999] w-screen h-screen"
        @click="handleClickOverlay"
    >
        <img
            :src="urlList instanceof Array ? urlList[index] : urlList"
            alt="图片"
            class="origin-center transition-[transform]"
            :class="transform.size === 'large' ? 'w-full' : 'w-[400px] md:w-[500px] lg:w-[600px]'"
            @click.stop
            :style="`transform: rotate(${transform.degree}deg) scale(${transform.scale})`"
        />
        <div
            id="top"
            class="w-full h-[45px] absolute top-0 left-0 flex items-center justify-between bg-[#8e8e8e] bg-opacity-80 text-white"
            @click.stop
        >
            <div class="flex-[0.33]"></div>
            <div class="flex-[0.33] flex-center">
                <span id="cur-index">{{ index + 1 }}</span>
                <span class="split">/</span>
                <span id="img-count">{{ computedCurImgCount }}</span>
            </div>
            <div class="flex-[0.33] right h-full flex justify-end">
                <i
                    class="w-[40px] h-full flex-center transition-[background-color] hover:bg-[#000] hover:bg-opacity-10 iconfont text-[20px] cursor-pointer"
                    :class="`icon-fullscreen-${transform.size}`"
                    @click="switchSize"
                ></i>
                <i
                    class="w-[40px] h-full flex-center transition-[background-color] hover:bg-[#000] hover:bg-opacity-10 iconfont icon-rotate-left text-[20px] cursor-pointer"
                    @click="rotate(-ROTATE_DEGREE)"
                ></i>
                <i
                    class="w-[40px] h-full flex-center transition-[background-color] hover:bg-[#000] hover:bg-opacity-10 iconfont icon-rotate-right text-[20px] cursor-pointer"
                    @click="rotate(ROTATE_DEGREE)"
                ></i>
                <i
                    class="w-[40px] h-full flex-center transition-[background-color] hover:bg-[#000] hover:bg-opacity-10 iconfont icon-magnify text-[20px] cursor-pointer"
                    @click="scale(SCALE_C)"
                ></i>
                <i
                    class="w-[40px] h-full flex-center transition-[background-color] hover:bg-[#000] hover:bg-opacity-10 iconfont icon-shrink text-[20px] cursor-pointer"
                    @click="scale(-SCALE_C)"
                ></i>
                <i
                    class="w-[40px] h-full flex-center transition-[background-color] hover:bg-[#000] hover:bg-opacity-10 iconfont icon-close text-[20px] cursor-pointer"
                    @click="handleClose"
                ></i>
            </div>
        </div>
        <i
            class="iconfont icon-arrow-left hover:text-white w-[40px] h-[40px] rounded-full flex-center iconfont icon-next-left text-[20px] absolute top-[50%] left-[10px] translate-y-[-50%] cursor-pointer hover:bg-[#000] hover:bg-opacity-10 bg-opacity-10 bg-[#ccc]"
            @click.stop="switchImg(1)"
            v-if="computedCurImgCount > 1"
        ></i>
        <i
            class="iconfont icon-arrow-right hover:text-white w-[40px] h-[40px] rounded-full flex-center iconfont icon-next-right text-[20px] absolute top-[50%] right-[10px] translate-y-[-50%] cursor-pointer hover:bg-[#000] hover:bg-opacity-10 bg-opacity-10 bg-[#ccc]"
            @click.stop="switchImg(-1)"
            v-if="computedCurImgCount > 1"
        ></i>
    </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, ref, computed, onUnmounted, onBeforeUnmount} from "vue"

// 每次旋转的角度
const ROTATE_DEGREE = 90
// 每次缩放的倍数
const SCALE_C = 0.32
// 最大的放大倍数
const MAX_C = 3
// 最小的缩小倍数
const MIN_C = 0.1

// 当前展示图片索引
const index = ref<number>(0)
// 当前变换的数值
const transform = ref<{ degree: number, scale: number, size: string }>({
    degree: 0,
    scale: 1,
    size: "standard"
})

const $props = defineProps({
    urlList: {},
    isClickOutsideClose: {
        default: true
    }
})
// 关闭事件
const $emits = defineEmits(["close"])

// 点击遮罩层关闭
const handleClickOverlay = () => {
    $props.isClickOutsideClose ? $emits('close') : ''
}

// 关闭
const handleClose = () => {
    $emits('close')
}

// 计算当前图片数量
const computedCurImgCount = computed(() => {
    return $props.urlList instanceof Array ? $props.urlList.length : 1
})

// 旋转
const rotate = (deg: number) => {
    transform.value.degree += deg;
}

// 放缩
const scale = (c: number) => {
    const value = transform.value.scale + c;
    if (value >= MAX_C || value <= MIN_C) {
        return
    } else {
        transform.value.scale = value;
    }
}

// 切换图片
const switchImg = (flag) => {
    if (flag >= 0) {
        if (index.value < computedCurImgCount.value) {
            index.value++
        } else {
            index.value = 0
        }
    } else {
        if (index.value > 0) {
            index.value--
        } else {
            index.value = computedCurImgCount.value
        }
    }
}

// 切换大小
const switchSize = () => {
    if (transform.value.size === "standard") {
        transform.value = {
            degree: 0,
            scale: 1,
            size: "large"
        }
    } else {
        transform.value = {
            degree: 0,
            scale: 1,
            size: "standard"
        }
    }
}

function handleScroll(e: WheelEvent) {
    console.log(e?.deltaY)
    if (e?.deltaY >= 0) {
        scale(SCALE_C)
    } else {
        scale(-SCALE_C)
    }
}

(function () {
    window.addEventListener("wheel", handleScroll)
})()

onUnmounted(() => {
    handleClose()
    window.removeEventListener("wheel", handleScroll)
})

</script>

<style lang="scss" scoped>

</style>


