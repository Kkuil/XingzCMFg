const DISTANCE = 150
const SCALE = 0.6
const DURATION = 1000

const animationMap = new WeakMap()

const ob = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const animation = animationMap.get(entry.target)
            animation.play()
            ob.unobserve(entry.target)
        }
    }
})

/**
 * 判断当前元素是否在视口之下
 */
function isBelowViewport(el: Element) {
    const rect = el.getBoundingClientRect()
    return rect.top > window.innerHeight
}

export default {
    mounted(el: Element) {
        if (!isBelowViewport(el)) {
            return
        }
        const animation = el.animate([
            {
                transform: `scale(${SCALE}) translateY(${DISTANCE}px)`,
                opacity: 0
            },
            {
                transform: `translateY(0)`,
                opacity: 1
            },
        ], {
            duration: DURATION,
            easing: "ease"
        })
        animation.pause()
        animationMap.set(el, animation)
        ob.observe(el)
    },
    unmounted(el: Element) {
        ob.unobserve(el)
    }
}