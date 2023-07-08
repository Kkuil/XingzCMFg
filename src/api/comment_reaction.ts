import request from "@/utils/request.ts"

/**
 * @description 點讚或取消點讚
 * @param commentId
 */
export const like = async (commentId: number): Promise<API.Result> => {
    return await request({
        url: "/comment-reaction/like",
        method: "GET",
        params: {
            commentId
        }
    })
}

/**
 * @description 踩或取消踩
 * @param commentId
 */
export const disLike = async (commentId: number): Promise<API.Result> => {
    return await request({
        url: "/comment-reaction/dislike",
        method: "GET",
        params: {
            commentId
        }
    })
}