import request from "@/utils/request"

/**
 * @description 分页获取活动
 */
export const listActivities = async (params?: Activity.ActivityListParams): Promise<API.Result> => {
    return await request({
        url: "/uactivity",
        method: "GET",
        params
    })
}

/**
 * @description 获取活动详情
 */
export const getActivityById = async (activityId: string): Promise<API.Result> => {
    return await request({
        url: `/uactivity/${activityId}`,
        method: "GET",
        params: {
            activityId
        }
    })
}
