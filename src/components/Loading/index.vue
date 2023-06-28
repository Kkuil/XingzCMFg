<script setup>

</script>

<template>
    <div class="container fixed w-screen flex-center">
        <div class="slinky-loader">
            <div class="slinky-loader__rotator">
                <div class="slinky-loader__bar"></div>
                <div class="slinky-loader__bar"></div>
                <div class="slinky-loader__bar"></div>
                <div class="slinky-loader__bar"></div>
                <div class="slinky-loader__bar"></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$numOfBars: 5;
$barW: 96px;
$barH: 16px;
$barMrg: 8px;
$totalH: $barH * $numOfBars + $barMrg * ($numOfBars - 1);

$colors: #ff7bac, #ff1d25, #ff931e, #7ac943, #3fa9f5;

$animTime: 2.5s;
$halfAT: $animTime / 2;
$stepDelay: 2%;
$trickGap: 0.0001%;
$midPause: 10%;
$midPauseHalf: $midPause/2;
$totalStepDelay: $stepDelay * ($numOfBars - 1);

@keyframes contMovement {
    #{$midPauseHalf} {
        transform: none;
    }
    50% {
        transform: translateX($barW * -1);
    }
    #{100% - $midPauseHalf}, 100% {
        transform: translateX($barW * -2);
    }
}

@keyframes contRotate {
    #{50% - $totalStepDelay*1.5 - $midPauseHalf} {
        transform: rotate(0);
    }
    #{50% - $totalStepDelay/2 - $midPauseHalf} {
        transform: rotate(-3deg);
    }
    50% {
        transform: rotate(0);
    }
    #{100% - $totalStepDelay*1.5 - $midPauseHalf} {
        transform: rotate(0);
    }
    #{100% - $totalStepDelay/2 - $midPauseHalf} {
        transform: rotate(-3deg);
    }
    100% {
        transform: rotate(0);
    }
}

.container {
    background-color: #f2f2f2;
    height: 100vh !important;
}

.slinky-loader {
    position: relative;
    width: $barW;
    height: $totalH;
    animation: contMovement $animTime infinite;
    will-change: transform;

    &__rotator {
        position: relative;
        height: 100%;
        animation: contRotate $animTime infinite;
        transform-origin: 100% 100%;
        will-change: transform;
    }

    &__bar {
        width: 100%;
        height: $barH;
        will-change: transform;

        &:not(:last-child) {
            margin-bottom: $barMrg;
        }

        @for $i from 1 through $numOfBars {
            $delay: $stepDelay * ($i - 1);
            $delayRev: $stepDelay * ($numOfBars - $i);

            $start: $delay + $midPauseHalf;
            $phase1End: 50% - $delayRev - $midPauseHalf;
            $phase2Start: 50% + $delayRev + $trickGap + $midPauseHalf;
            $end: 100% - $delay - $midPauseHalf;

            @keyframes barMovement#{$i} {
                #{$delay} {
                    transform: none;
                }
                #{$phase1End} {
                    transform: rotate(180deg);
                }
                #{$phase1End + $trickGap}, #{$phase2Start} {
                    transform: translateX($barW) scaleX(-1) rotate(180deg);
                }
                #{$end}, 100% {
                    transform: translateX($barW) scaleX(-1) rotate(0);
                }
            }

            &:nth-child(#{$i}) {
                background: nth($colors, $i);
                transform-origin: 100% ($totalH/2 - ($barH + $barMrg) * ($i - 1));
                animation: barMovement#{$i} $animTime infinite cubic-bezier(.55, .2, .29, 1.24);
            }
        }
    }
}
</style>