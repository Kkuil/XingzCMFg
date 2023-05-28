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
}