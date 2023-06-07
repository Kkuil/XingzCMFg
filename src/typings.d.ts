/**
 * 请求相关类型定义
 */
declare namespace API {
    /**
     * 统一响应格式
     */
    type Result = {
        status: number,
        msg: string,
        data: object,
        errorType: number
    }

    /**
     * 账号登录参数
     */
    type AccountLoginParams = {
        username?: string;
        password?: string;
        captcha?: string;
    }

    /**
     * 手机号登录参数
     */
    type PhoneRegistryParams = {
        phone: string;
        sms: string;
    }

    /**
     * 错误枚举
     */
    enum ErrorType {
        /**
         * 静默控制台输出
         */
        SILENT,
        /**
         * 警告
         */
        WARN_MESSAGE,
        /**
         * 错误
         */
        ERROR_MESSAGE,
        /**
         * 弹窗通知
         */
        NOTIFICATION,
        /**
         * 重定向
         */
        REDIRECT
    }

    /**
     * 获取列表数据统一的请求格式
     */
    type ListRequestParams = {
        params?: any,
        filter?: { createdTime?: string, modifiedTime?: string },
        sort?: Record<string, SortOrder>,
        page?: { current?: number, pageSize?: number }
    }

    /**
     * 获取列表数据统一的响应格式
     */
    type ListResponseParams = {
        list: Array;
        current: number;
        pageSize: number;
        total: number;
    }
}