import {defineStore} from "pinia"
import {listUserBg} from "@/api/user.ts";

type UserBg = {
    name: string;
    url: string;
}

const useUserBgStore = defineStore("UserBg", {
    state: (): { userBg: UserBg[] } => ({
        userBg: []
    }),
    actions: {
        async setUserBgInfo() {
            const {data}: API.Result = await listUserBg()
            if (data) {
                this.userBg = data as UserBg[]
            }
        }
    }
})

export default useUserBgStore
export const UserBgActions = {
    setUserBgInfo: useUserBgStore().setUserBgInfo
}
export const UserBgState = {
    userBg: useUserBgStore().$state
}
