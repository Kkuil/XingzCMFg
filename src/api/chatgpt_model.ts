import request from "@/utils/request.ts"

/** 获取所有ChatGPTModelModel /xingz_cm/chagpt-model */
export async function listChatGPTModels(params: API.ListRequestParams): Promise<API.Result> {
    return await request({
        url: "/chatgpt-model",
        method: "GET",
        params
    })
}