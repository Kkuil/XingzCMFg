/**
 * 用户信息类型定义
 */
declare namespace USER {
    type UserInfo = {
        id?: string;
        username?: string;
        gender?: string;
        birthday?: string;
        phone?: string;
        email?: string;
        tags?: string;
        avatar?: string;
        isVip?: string;
    }
    enum Gender {
        UNKNOWN,
        MALE,
        FEMALE
    }
}