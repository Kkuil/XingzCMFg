import request from "@/utils/request.ts"

/**
 * @description 通過評論ID獲取子評論ID
 * @param params ARTICLE.ArticleSubCommentListParams
 */
export const getSubComment = async (params: ARTICLE.ArticleSubCommentListParams): Promise<API.Result> => {
    return await request({
        url: "/uarticle-comment/sub-comment",
        method: "GET",
        params
    })
}