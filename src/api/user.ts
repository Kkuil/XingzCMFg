import request from "@/utils/request"
import ErrorTypeFuc from "@/utils/ErrorTypeFuc"

/**
 * 用户使用账号登录接口
 * @param param0 API.LoginParams
 * @returns Promise<object>
 */
export async function loginWithAccount({ username, password, captcha }: API.AccountLoginParams): Promise<object> {
    const { status, msg, data, errorType }: API.Result = await request({
        url: "/user-login-account",
        method: "POST",
        data: {
            username,
            password,
            captcha
        }
    })
    if (status < 200 || status >= 300 || data) {
        ErrorTypeFuc({
            type: errorType,
            msg,
            redirectTo: "/login"
        })
    }
    return data
}

/**
 * 用户使用手机号登录接口
 * @param param0 API.LoginParams
 * @returns Promise<object>
 */
export async function registryWithPhone({ phone, sms }: API.PhoneRegistryParams): Promise<object> {
    const { status, msg, data, errorType }: API.Result = await request({
        url: "/user-login-phone",
        method: "POST",
        data: {
            phone,
            sms
        }
    })
    if (status < 200 || status >= 300 || data) {
        ErrorTypeFuc({
            type: errorType,
            msg,
            redirectTo: "/login"
        })
    }
    return data
}