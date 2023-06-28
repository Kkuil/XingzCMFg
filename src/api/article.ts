import request from "@/utils/request"

/**
 * 发布文章 /uarticle
 */
export const publishArticle = async (data: ARTICLE.ArticleInfo): Promise<API.Result> => {
    return await request({
        url: "/uarticle",
        method: "POST",
        data,
        params: data
    })
}

/**
 * 上传文章封面  /user-upload/uarticle-upload
 */
export const uploadCover = async (cover: File): Promise<API.Result> => {
    return await request({
        url: "/user-upload/uarticle-upload",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        method: "POST",
        data: {
            cover
        }
    })
}

/**
 * @description 分页获取文章
 */
export const listArticles = async (params: ARTICLE.ArticleListParams): Promise<API.Result> => {
    return await request({
        url: "/uarticle",
        method: "GET",
        params
    })
}

/**
 * 获取文章详情
 */
export const getArticleById = async (articleId: string): Promise<API.Result> => {
    return await request({
        url: `/uarticle/${articleId}`,
        method: "GET",
        params: {
            articleId
        }
    })
}

/**
 * 点赞获取消点赞
 */
export const like = async (articleId: string): Promise<API.Result> => {
    return await request({
        url: `/uarticle/like/${articleId}`,
        method: "GET",
        params: {
            articleId
        }
    })
}

/**
 * 收藏获取消收藏
 */
export const collect = async (articleId: string): Promise<API.Result> => {
    return await request({
        url: `/uarticle/collect/${articleId}`,
        method: "GET",
        params: {
            articleId
        }
    })
}

/**
 * 评论
 */
export const comment = async (data: ARTICLE.ArticleComment): Promise<API.Result> => {
    return await request({
        url: "/uarticle/comment",
        method: "POST",
        data,
        params: data
    })
}
