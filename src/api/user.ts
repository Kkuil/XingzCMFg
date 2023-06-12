import request from "@/utils/request"
import MD5 from "@/utils/MD5.ts"

/**
 * @description 用户使用账号登录接口
 * @param param0 API.LoginParams
 * @returns Promise<object>
 */
export async function loginWithAccount({username, password}: API.AccountLoginParams): Promise<object> {
    return await request({
        url: "/user-login-account",
        method: "POST",
        data: {
            username,
            password: MD5.encode(password as string),
        }
    })
}

/**
 * @description 获取验证码接口
 * @param param0 API.LoginParams
 * @returns Promise<object>
 */
export async function getSms(phone: string): Promise<object> {
    return await request({
        url: "/user-sms",
        method: "GET",
        params: {
            phone
        }
    })
}

/**
 * @description 用户使用手机号登录接口
 * @param param0 API.LoginParams
 * @returns Promise<object>
 */
export async function registryWithPhone({phone, sms}: API.PhoneRegistryParams): Promise<object> {
    return await request({
        url: "/user-registry-phone",
        method: "POST",
        data: {
            phone,
            sms
        }
    })
}

/**
 * @description 获取用户信息
 * @param param0 string
 * @returns Promise<API.Result>
 */
export async function getUserInfo(id: string): Promise<API.Result> {
    return await request({
        method: "GET",
        url: `/user/${id}`
    })
}
