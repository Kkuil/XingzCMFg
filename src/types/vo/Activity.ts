/**
 * 文章类型定义
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Activity {
    type ActivityItem = {
        id?: string;
        activatorName?: string;
        title?: string;
        detail?: string;
        cover?: string;
        type?: string;
        rule?: string;
        ps?: string;
        startTime?: string;
        endTime?: string;
        maxAttendance?: string;
        authorizedPersonnel?: string;
        maxAquirableXingCoin?: string;
        isDeleted?: string;
        createdTime?: string;
        modifiedTime?: string;
    }
    type ActivityListParams = {
        current?: number;
        pageSize?: number;
    }
}