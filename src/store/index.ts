import useUserAuthStore, {UserAuthState, UserAuthActions, UserAuthGetters} from "@/store/modules/useUserAuthStore.ts"
import useTagStore, {TagState, TagActions} from "@/store/modules/useTagStore.ts"
import useChatGPTModelStore, {ChatGPTModelActions, ChatGPTModelState} from "@/store/modules/useChatGPTModelStore.ts"

// 状态
export const state = {
    UserAuthState,
    TagState,
    ChatGPTModelState
}

// actions
export const actions = {
    UserAuthActions,
    TagActions,
    ChatGPTModelActions
}

// getters
export const getters = {
    UserAuthGetters
}

export default {
    useUserAuthStore,
    useTagStore,
    useChatGPTModelStore
}