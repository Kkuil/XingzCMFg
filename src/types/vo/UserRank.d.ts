/**
 * 用户等级类型定义
 */
declare namespace USER_RANK {
    type UserRankInfo = {
        id?: string;
        username?: string;
        avatar?: string;
        isVip?: string;
        level?: number;
        points?: number;
    }
}