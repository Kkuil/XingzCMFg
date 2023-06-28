import {defineStore} from "pinia"
import {listArticles} from "@/api/article.ts"
import {ListResDTO} from "@/types/ListResDTO.ts"

const useArticleStore = defineStore("Article", {
    state: (): {
        articles?: ARTICLE.ArticleItem[],
        total?: number,
        current?: number,
        pageSize?: number
    } => {
        return {
            articles: [],
            total: 0,
            current: 1,
            pageSize: 10
        }
    },
    actions: {
        async initArticles(params: {
            tagId?: string,
            categoryId?: string
        }) {
            this.current = 1
            this.pageSize = 10
            // @ts-ignore
            const {data}: { data: ListResDTO<ARTICLE.ArticleItem> } = await listArticles({
                tagId: params.tagId,
                categoryId: params.categoryId,
                current: this.current,
                pageSize: this.pageSize
            })
            if (data) {
                this.articles = data.list
                this.total = data.total
                this.current = data.current
                this.pageSize = data.pageSize
            }
        },
        async setArticles(params: {
            tagId?: string,
            categoryId?: string
        }) {
            // @ts-ignore
            this.current++
            // @ts-ignore
            const {data}: { data: ListResDTO<ARTICLE.ArticleItem> } = await listArticles({
                tagId: params.tagId,
                categoryId: params.categoryId,
                current: this.current,
                pageSize: this.pageSize
            })
            if (data) {
                this.articles = [
                    ...this.articles,
                    ...data?.list
                ]
                this.total = data.total
                this.current = data.current
                this.pageSize = data.pageSize
            }
        }
    }
})

export default useArticleStore
export const ArticleActions = {
    setArticles: useArticleStore().setArticles,
    initArticles: useArticleStore().initArticles
}
export const ArticleState = {
    articles: useArticleStore().$state
}
