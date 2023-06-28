import {defineStore} from "pinia"
import {listArticleCategories} from "@/api/article_category.ts"

const useArticleCategoryStore = defineStore("ArticleCategory", {
    state: (): { articleCategorys?: ARTICLE_CATEGORY.ArticleCategoryItem[] } => {
        return {
            articleCategorys: []
        }
    },
    actions: {
        async setArticleCategories() {
            const {data}: API.Result = await listArticleCategories()
            console.log(data)
            if (data) {
                this.articleCategorys = data?.list as ARTICLE_CATEGORY.ArticleCategoryItem[]
            }
        }
    }
})

export default useArticleCategoryStore
export const ArticleCategoryActions = {
    setArticleCategories: useArticleCategoryStore().setArticleCategories
}
export const ArticleCategoryState = {
    articleCategories: useArticleCategoryStore().$state
}