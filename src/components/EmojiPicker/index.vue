<template>
    <div class="relative" v-click-outside="clickOutside">
        <div @click="trigger">
            <slot name="trigger"/>
        </div>

        <transition name="fade">
            <div
                v-show="emojiSelectorVisible"
                class="absolute top-0 left-0 translate-y-[-100%] translate-x-[-50%]"
            >
                <emoji-selector @select="onEmojiSelected"/>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import EmojiSelector from "./components/EmojiSelector.vue"
import {defineEmits, ref} from "vue"

const $emits = defineEmits(["select"])
const emojiSelectorVisible = ref<boolean>(false)

function trigger() {
    emojiSelectorVisible.value = !emojiSelectorVisible.value
}

function onEmojiSelected(emoji) {
    $emits("select", emoji)
}

function clickOutside() {
    emojiSelectorVisible.value = false
}

</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}
</style>