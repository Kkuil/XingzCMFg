import {defineStore} from "pinia"
import {listChatGPTModels} from "@/api/chatgpt_model.ts"

const useChatGPTModelStore = defineStore("ChatGPTModel", {
    state: (): { chatGPTModels?: ChatGPTModel.ModelItem[] } => {
        return {
            chatGPTModels: []
        }
    },
    actions: {
        async setChatGPTModels({current = 1, pageSize = 10}) {
            const {data}: API.Result = await listChatGPTModels({
                params: {},
                filter: {},
                sort: {},
                page: {
                    current,
                    pageSize
                }
            })
            if (data) {
                this.chatGPTModels = data?.list as ChatGPTModel.ModelItem[]
            }
        }
    }
})

export default useChatGPTModelStore
export const ChatGPTModelActions = {
    setChatGPTModels: useChatGPTModelStore().setChatGPTModels
}
export const ChatGPTModelState = {
    chatGPTModels: useChatGPTModelStore().$state
}