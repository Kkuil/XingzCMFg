import request from "@/utils/request"

/** 获取所有标签 /tag */
export async function listTags(): Promise<API.Result> {
    return await request.get("/utag", {
        method: "GET"
    })
}
