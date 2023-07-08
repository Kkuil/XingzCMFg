// useDialog.ts
import {createApp, h, defineComponent} from "vue"
import ImgPreview from "./ImgPreview.vue"

interface ImgPreviewOptions {
    urlList?: string[] | string;
    onClose?: () => void;
    isClickOutsideClose?: boolean
}

export function useShowImgPreview(options: ImgPreviewOptions): void {
    const {
        urlList,
        onClose,
        isClickOutsideClose
    } = options

    const container = document.createElement("div")
    document.body.appendChild(container)

    const closePreview = () => {
        document.body.removeChild(container)
    }

    const App = defineComponent({
        setup() {
            return {
                urlList,
                handleClose: () => {
                    onClose && onClose()
                    closePreview()
                },
            }
        },
        render() {
            return h(
                ImgPreview,
                {
                    urlList: this.urlList,
                    onClose: this.handleClose,
                    isClickOutsideClose
                }
            )
        },
    })

    const app = createApp(App)
    app.mount(container)
}