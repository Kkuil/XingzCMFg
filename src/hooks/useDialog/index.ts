// useDialog.ts
import {createApp, h, ComponentPublicInstance, defineComponent} from "vue"
import Dialog from "./Dialog.vue"
import {VNode, VNodeArrayChildren} from "@vue/runtime-core";

type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any)

interface DialogOptions {
    header?: () => any | RawChildren | string
    content?: () => any | RawChildren | string
    footer?: () => any | RawChildren | string
    onClose?: () => void,
    width?: number,
    height?: number
}

export function useDialog(options: DialogOptions = {}): void {
    const {
        header,
        content,
        footer,
        onClose,
        width,
        height
    } = options

    const container = document.createElement("div")
    document.body.appendChild(container)

    const closeDialog = () => {
        app.unmount(container)
        document.body.removeChild(container)
    }

    const App = defineComponent({
        setup() {
            return {
                header,
                content,
                footer,
                handleClose: () => {
                    onClose && onClose()
                    closeDialog()
                },
            }
        },
        render() {
            return h(
                Dialog,
                {
                    onClose: this.handleClose,
                    width,
                    height
                },
                {
                    header,
                    content,
                    footer,
                }
            )
        },
    })

    const app = createApp(App) as ComponentPublicInstance
    app.mount(container)
}