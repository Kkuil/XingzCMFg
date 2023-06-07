import useUserAuthStore, {UserAuthState, UserAuthActions, UserAuthGetters} from "@/store/modules/useUserAuthStore.ts"
import useTagStore, {TagState, TagActions} from "@/store/modules/useTagStore.ts"

// 状态
export const state = {
    UserAuthState,
    TagState
}

// actions
export const actions = {
    UserAuthActions,
    TagActions
}

// getters
export const getters = {
    UserAuthGetters
}

export default {
    useUserAuthStore,
    useTagStore
}