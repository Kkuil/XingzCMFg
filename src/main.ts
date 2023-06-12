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

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)

app.directive("slideIn", slideIn)
app.directive("clickOutside", clickOutside)

app.component("QuillEditor", QuillEditor)
app.mount("#app")

