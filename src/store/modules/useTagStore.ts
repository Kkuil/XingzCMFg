import {defineStore} from "pinia"
import {listTags} from "@/api/tag.ts"

const useTagStore = defineStore("Tag", {
    state: (): { tags?: TAG.TagItem[] } => {
        return {
            tags: []
        }
    },
    actions: {
        async setTags() {
            const {data}: API.Result = await listTags()
            if (data) {
                this.tags = data?.list as TAG.TagItem[]
            }
        }
    }
})

export default useTagStore
export const TagActions = {
    setTags: useTagStore().setTags
}
export const TagState = {
    tags: useTagStore().$state
}