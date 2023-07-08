import {createApp} from "vue"
import "@/assets/styles/global.scss"
import "element-plus/dist/index.css"
import "nprogress/nprogress.css"
import App from "@/App.vue"
import router from "./router"
import {createPinia} from "pinia"
import {QuillEditor} from "@vueup/vue-quill"
import "@/utils/quillEdotorUtils.ts"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import slideIn from "@/directives/slide-in.ts"
import clickOutside from "@/directives/click-outside.ts"
import showViewport from "@/directives/show-viewport.ts"
import VueDomPurifyHtml from "vue-dompurify-html"
import EmojiPicker from "@/components/EmojiPicker/index.vue"
import "@/assets/styles/icon.js"
import SvgIcon from "@/components/SvgIcon/index.vue"
import Particles from "particles.vue3"

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueDomPurifyHtml)
app.use(Particles)

app.directive("slideIn", slideIn)
app.directive("clickOutside", clickOutside)
app.directive("showViewport", showViewport)

app.component("QuillEditor", QuillEditor)
app.component("EmojiPicker", EmojiPicker)
app.component("SvgIcon", SvgIcon)
app.mount("#app")

