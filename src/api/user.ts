import request from "@/utils/request"
import MD5 from "@/utils/MD5.ts"

/**
 * @description 用户使用账号登录接口
 * @param param0 API.LoginParams
 * @returns Promise<object>
 */
export async function loginWithAccount({username, password}: API.AccountLoginParams): Promise<API.Result> {
    const encodePwd = MD5.encode(password as string)
    return await request({
        url: "/user-login-account",
        method: "POST",
        params: {
            username,
            password: encodePwd,
        },
        data: {
            username,
            password: encodePwd,
        }
    })
}

/**
 * @description 获取验证码接口
 * @param phone API.LoginParams
 * @returns Promise<object>
 */
export async function getSms(phone: string): Promise<API.Result> {
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
export async function registryWithPhone({phone, sms}: API.PhoneRegistryParams): Promise<API.Result> {
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
 * @description 通过用户名获取用户信息
 * @param username string
 * @returns Promise<API.Result>
 */
export async function getUserByUsername(username: string): Promise<API.Result> {
    return await request({
        method: "GET",
        url: `/user-username/${username}`,
        params: {
            username
        }
    })
}

/**
 * @description 获取用户榜单
 * @param current number
 * @param pageSize number
 * @param sort number
 */
export async function listUserRank({current, pageSize, sort = 1}: {
    current: number,
    pageSize: number,
    sort?: number
}): Promise<API.Result> {
    return await request({
        url: "/user-rank",
        method: "GET",
        params: {
            current,
            pageSize,
            sort
        }
    })
}

/**
 * @description 通过用户ID获取用户信息
 * @param id string
 * @returns Promise<API.Result>
 */
export async function getUserById(id: string): Promise<API.Result> {
    return await request({
        method: "GET",
        url: `/user/${id}`,
        params: {
            id
        }
    })
}

/**
 * @description 获取用户背景图
 */
export async function listUserBg(): Promise<API.Result> {
    return await request({
        url: "/user-bg",
        method: "GET"
    })
}

/**
 * @description 更新用户背景图
 * @param id string
 * @param url string
 */
export async function updateBg(id: string, url: string): Promise<API.Result> {
    return await request({
        url: "/user-bg",
        method: "PUT",
        params: {
            id,
            url
        }
    })
}