<script setup lang="ts">
import { reactive, ref } from "vue"
import {loginWithAccount, registryWithPhone} from "@/api/user"
import MD5 from "@/utils/MD5"
import {PHONE_REG} from "@/constant/login.ts"
import { ElMessage } from "element-plus"

/**
 * 验证手机号的合法性
 * @constructor
 */
const isLegalPhone = (phone: string): boolean => {
    if (!phone) {
        ElMessage.error("发送失败，手机号不能为空")
        return false
    }
    if (!PHONE_REG.test(phone)) {
        ElMessage.error("手机号格式不正确，请确认后再发送")
        return false
    }
    return true
}

const isLogin = ref(true)
const userInfo = reactive({
    username: "",
    password: "",
    captcha: "",
    phone: "",
    sms: "",
})

/**
 * 账号登录
 * @param e
 */
const handleSubmit = async (e: Event) => {
    e.preventDefault()
    console.log(MD5.encode(userInfo.password))
    const data = await loginWithAccount({
        username: userInfo.username,
        password: MD5.encode(userInfo.password),
        captcha: userInfo.captcha
    })
    console.log(data)
}

/**
 * 获取验证码
 */
const getSmsCaptcha = async () => {
    if(isLegalPhone(userInfo.phone)) {
       return
    }
    const data = await registryWithPhone({
        phone: userInfo.username,
        sms: userInfo.sms,
    })
    console.log(data)
}

</script>

<template>
    <div class="form w-screen h-screen flex">
        <div class="cover w-[65%] h-full bg-[#0094ff]"></div>
        <div class="container w-[35%] h-full flex">
            <div v-if="isLogin"
                class="login flex flex-1 min-h-full flex-col justify-center px-6 py-12 lg:px-8 transition-all">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img class="mx-auto" src="../../assets/images/logo.png" alt="Your Company" />
                    <h2 class="text-2xl flex-center my-3 font-semibold">登录</h2>
                </div>
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-6" @submit="handleSubmit">
                        <div>
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">账号</label>
                            <div class="mt-2">
                                <input id="id" name="id" type="text" autocomplete="text" required placeholder="请输入账号"
                                    v-model="userInfo.username"
                                    class="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <div class="flex items-center justify-between">
                                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">密码</label>
                                <div class="text-sm">
                                    <a href="#" class="font-semibold text-[#0094ff] hover:text-indigo-500">忘记密码?</a>
                                </div>
                            </div>
                            <div class="mt-2">
                                <input id="password" name="password" type="password" autocomplete="current-password"
                                    required placeholder="请输入密码" v-model="userInfo.password"
                                    class="block pl-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <button type="submit"
                                class="flex w-full justify-center rounded-md bg-[#0094fd] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#0094ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                登录
                            </button>
                        </div>
                    </form>
                    <p class="mt-10 text-center text-sm text-gray-500">
                        没有账户？
                        <a href="javascript: none;" class="font-semibold leading-6 text-[#0094ff] hover:text-indigo-500"
                            @click="isLogin = false">去注册吧</a>
                    </p>
                </div>
            </div>
            <div v-else class="registry flex flex-1 min-h-full flex-col justify-center px-6 py-12 lg:px-8 transition-all">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img class="mx-auto" src="../../assets/images/logo.png" alt="Your Company" />
                    <h2 class="text-2xl flex-center my-3 font-semibold">注册</h2>
                </div>
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-6" action="#" method="POST">
                        <div>
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">手机号</label>
                            <div class="mt-2">
                                <input id="phone" name="phone" type="phone" autocomplete="phone" required
                                    placeholder="请输入手机号"
                                    class="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <div class="flex items-center justify-between">
                                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">验证码</label>
                            </div>
                            <div class="mt-2 flex justify-between">
                                <input id="captcha" name="captcha" type="text" autocomplete="captcha" required
                                    placeholder="请输入验证码"
                                    class="block pl-3 w-[60%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                <input id="captcha" name="captcha" type="button"
                                    value="获取验证码"
                                    @click="getSmsCaptcha"
                                    class="block pl-3 w-[37%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <button type="submit"
                                class="flex w-full justify-center rounded-md bg-[#0094fd] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#0094ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                注册
                            </button>
                        </div>
                    </form>
                    <p class="mt-10 text-center text-sm text-gray-500">
                        已有账户？
                        <a href="javascript: none;" class="font-semibold leading-6 text-[#0094ff] hover:text-indigo-500"
                            @click="isLogin = true">去登录吧</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
