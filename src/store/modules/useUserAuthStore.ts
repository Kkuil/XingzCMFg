import {defineStore} from "pinia"
import {auth} from "@/api/auth.ts"

const useUserAuthStore = defineStore("UserAuth", {
    state: (): { userInfo?: USER.UserInfo } => {
        const userInfo: USER.UserInfo = {
            id: "",
            username: "",
            gender: "",
            birthday: "",
            phone: "",
            email: "",
            tags: "",
            avatar: "",
            isVip: "",
        }
        return {
            userInfo
        }
    },
    actions: {
        async setUserAuthInfo() {
            const {data}: API.Result = await auth()
            if (data) {
                this.userInfo = data
            }
        }
    },
    getters: {
        getIsLogin(): boolean {
            return !!this?.userInfo?.id
        }
    }
})

export default useUserAuthStore
export const UserAuthActions = {
    setUserAuthInfo: useUserAuthStore().setUserAuthInfo
}
export const UserAuthState = {
    userInfo: useUserAuthStore().$state
}

export const UserAuthGetters = {
    getIsLogin: useUserAuthStore().getIsLogin
}