<script setup lang="ts">
import Loading from "@/components/Loading/index.vue"

</script>

<template>
    <div class="app w-screen h-screen transition-all overflow-x-hidden">
        <RouterView v-slot="{ Component }">
            <template v-if="Component">
                <Transition mode="out-in">
                    <KeepAlive>
                        <Suspense>
                            <!-- 主要内容 -->
                            <component :is="Component"></component>

                            <!-- 加载中状态 -->
                            <template #fallback>
                                <Loading/>
                            </template>
                        </Suspense>
                    </KeepAlive>
                </Transition>
            </template>
        </RouterView>
    </div>
</template>

<style scoped lang="scss">
</style>
