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