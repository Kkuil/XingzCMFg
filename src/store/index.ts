import useUserAuthStore, {UserAuthState, UserAuthActions, UserAuthGetters} from "@/store/modules/useUserAuthStore.ts"
import useTagStore, {TagState, TagActions} from "@/store/modules/useTagStore.ts"
import useChatGPTModelStore, {ChatGPTModelActions, ChatGPTModelState} from "@/store/modules/useChatGPTModelStore.ts"
import useArticleCategoryStore, {
    ArticleCategoryActions,
    ArticleCategoryState
} from "@/store/modules/useArticleCategoryStore.ts"
import useArticleStore, {ArticleActions, ArticleState} from "@/store/modules/useArticleStore.ts"
import useUserBgStore , {UserBgActions, UserBgState} from "@/store/modules/useUserBgStore.ts"

// state
export const state = {
    UserAuthState,
    TagState,
    ChatGPTModelState,
    ArticleCategoryState,
    ArticleState,
    UserBgState
}

// actions
export const actions = {
    UserAuthActions,
    TagActions,
    ChatGPTModelActions,
    ArticleCategoryActions,
    ArticleActions,
    UserBgActions
}

// getters
export const getters = {
    UserAuthGetters,
}

export default {
    useUserAuthStore,
    useTagStore,
    useChatGPTModelStore,
    useArticleCategoryStore,
    useArticleStore,
    useUserBgStore
}