import {Ref} from "vue"

const elMapCb = new WeakMap()

const ob = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            elMapCb.get(entry.target)()
            ob.unobserve(entry.target)
        }
    }
})

export default {
    mounted(el: Element, binding: Ref) {
        if(!(binding?.value instanceof Function)) {
            return
        }
        ob.observe(el)
        elMapCb.set(el, binding.value)
    },
    unmounted(el: Element) {
        ob.unobserve(el)
    }
}