import request from "@/utils/request"

/**
 * 验证用户身份
 */
export const auth = async (): Promise<API.Result> => {
    return await request({
        url: "/user-auth",
        method: "POST"
    })
}