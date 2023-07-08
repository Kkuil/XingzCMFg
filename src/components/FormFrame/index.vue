<script setup lang="ts">
import {defineProps} from "vue"
import {loadFull} from "tsparticles"

const particlesInit = async engine => {
    await loadFull(engine)
}

const particlesLoaded = async container => {
    console.log("Particles container loaded", container)
}

const $props = defineProps({
    title: {
        type: String,
        required: true,
        default: "星知文章"
    }
})


</script>

<template>
    <div class="form w-screen h-screen flex">
        <div id="particles-js" class="z-[-999] h-full lg:w-[65%] md:w-[50%] sm:w-0 relative bg-[#000] overflow-hidden">
            <vue-particles
                id="tsparticles"
                :particlesInit="particlesInit"
                :particlesLoaded="particlesLoaded"
                :options="{
                    particles: {
                        color: {
                            value: '#FF0000',
                                animation: {
                                enable: true,
                                    speed: 10
                            }
                        },
                        move: {
                            attract: {
                                enable: false,
                                    distance: 100,
                                    rotate: {
                                    x: 2000,
                                        y: 2000
                                }
                            },
                            direction: 'none',
                                enable: true,
                                outModes: {
                            default: 'destroy'
                            },
                            path: {
                                clamp: false,
                                    enable: true,
                                    delay: {
                                    value: 0
                                },
                                generator: 'polygonPathGenerator',
                                    options: {
                                    sides: 6,
                                        turnSteps: 30,
                                        angle: 30
                                }
                            },
                            random: false,
                                speed: 3,
                                straight: false,
                                trail: {
                                fillColor: '#000',
                                    length: 20,
                                    enable: true
                            }
                        },
                        number: {
                            density: {
                                enable: true,
                                    area: 800
                            },
                            value: 0
                        },
                        opacity: {
                            value: 1
                        },
                        shape: {
                            type: 'circle'
                        },
                        size: {
                            value: 2
                        }
                    },
                    background: {
                        color: '#000'
                    },
                    fullScreen: {
                        zIndex: -1
                    },
                    emitters: {
                        direction: 'none',
                            rate: {
                            quantity: 1,
                                delay: 0.25
                        },
                        size: {
                            width: 0,
                                height: 0
                        },
                        position: {
                            x: 50,
                                y: 50
                        }
                    }
                }"
            />
        </div>
        <div class="container h-full flex-center w-full lg:w-[35%] md:w-[50%] sm:w-full bg-white">
            <div
                class="registry flex flex-1 min-h-full flex-col justify-center px-6 py-12 lg:px-8 transition-all">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img class="mx-auto" src="/favicon.png" alt="星知文章CM" style="width: 200px;"/>
                    <h2 class="text-2xl flex-center my-3 font-semibold text-white">{{ $props.title }}</h2>
                </div>
                <slot name="form"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$dot-color: #ffffff; // 白色
$max-radius: 3px; // 最大半径
$dot-count: 1000; // 小白点数量

@mixin dots($count) {
    $shadows: ();

    @for $i from 1 through $count {
        $left: random(1000); // 随机生成left值(0-100%)
        $top: random(1000); // 随机生成top值(0-100%)
        $size: random($max-radius); // 随机生成点的大小(0-10px)
        $shadow: #{$left}px #{$top}px #{$size}px $dot-color;

        $shadows: append($shadows, $shadow, comma);
    }

    &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 1px;
        box-shadow: $shadows;
    }
}

.cover {
    @include dots($dot-count);
}
</style>