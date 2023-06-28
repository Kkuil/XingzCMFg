import request from "@/utils/request"

/** 获取所有标签 /tag */
export async function listArticleCategories(): Promise<API.Result> {
    return await request.get("/uarticle-category", {
        method: "GET"
    })
}
