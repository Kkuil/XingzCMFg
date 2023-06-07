import {createApp} from "vue"
import "@/assets/styles/global.scss"
import "element-plus/dist/index.css"
import "nprogress/nprogress.css"
import App from "@/App.vue"
import router from "./router"
import {createPinia} from "pinia"
import {QuillEditor} from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)

app.component("QuillEditor", QuillEditor)
app.mount("#app")

