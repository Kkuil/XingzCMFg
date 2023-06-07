<script setup lang="ts">
import {reactive, ref} from "vue"
import FormFrame from "@/components/FormFrame/index.vue"
import {registryWithPhone, getSms} from "@/api/user"
import {PHONE_REG} from "@/constant/auth.ts"
import {ElMessage} from "element-plus"
import {useRouter} from "vue-router";
import router from "@/router";

const $router = useRouter()

const isLegalPhone = (phone: string): boolean => {
    if (!phone) {
        ElMessage.error("发送失败，手机号不能为空")
        return false
    }
    if (!PHONE_REG.test(phone)) {
        ElMessage.error("手机号格式不正确，请确认手机号后再发送")
        return false
    }
    return true
}

const userInfo = reactive({
    phone: "",
    sms: ""
})

const remainSeconds = ref(0)

const counter = () => {
    const counter = setInterval(() => {
        if (remainSeconds < 0) {
            remainSeconds.value = 60
            clearInterval(counter)
        }
        remainSeconds.value--
    }, 1000)
}

/**
 * 获取验证码
 */
const getSmsCaptcha = async () => {
    if (!isLegalPhone(userInfo.phone)) {
        return
    }
    const {status, msg, data,}: API.Result = await getSms(userInfo.phone)
    if (!data) {
        ElMessage.error(msg)
    } else {
        ElMessage.success(msg)
        remainSeconds.value = 60
        counter()
    }
}

/**
 * 注册
 */
const registry = async (e: Event) => {
    e.preventDefault()
    if (!isLegalPhone(userInfo.phone)) {
        return
    }
    if (userInfo.sms === "") {
        ElMessage.error("验证码不能为空")
        return
    }
    const {msg, data}: API.Result = await registryWithPhone({
        phone: userInfo.phone,
        sms: userInfo.sms,
    })
    if (!data) {
        ElMessage.error(msg)
    } else {
        ElMessage.success(msg)
        await router.push("/xingz-cm")
    }
}

</script>

<template>
    <FormFrame title="注册">
        <template #cover>
            <div>123</div>
        </template>
        <template #form>
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">手机号</label>
                        <div class="mt-2">
                            <input
                                id="phone"
                                name="phone"
                                type="phone"
                                autocomplete="phone" required
                                placeholder="请输入手机号"
                                class="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                v-model="userInfo.phone"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password"
                                   class="block text-sm font-medium leading-6 text-gray-900">验证码</label>
                        </div>
                        <div class="mt-2 flex justify-between">
                            <input id="sms"
                                   name="sms"
                                   type="text"
                                   autocomplete="sms"
                                   required
                                   placeholder="请输入验证码"
                                   class="block pl-3 w-[60%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                   v-model="userInfo.sms"
                            />
                            <input
                                id="captcha"
                                name="captcha"
                                type="button"
                                :value="remainSeconds === 0 ? '获取验证码' : `${remainSeconds}后发送`"
                                @click="getSmsCaptcha"
                                class="block pl-3 w-[37%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            class="flex-center w-full rounded-md bg-[#0094fd] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#0094ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            @click="registry"
                        >
                            注册
                        </button>
                    </div>
                </form>
                <p class="mt-10 text-center text-sm text-gray-500">
                    已有账户？
                    <a href="javascript: void(0);"
                       class="font-semibold leading-6 text-[#0094ff] hover:text-indigo-500"
                       @click="$router.push({ name: 'login' })">去登录吧</a>
                </p>
                <p class="text-sm text-[gray] flex-center">密码使用md5加密技术，请放心注册</p>
            </div>
        </template>
    </FormFrame>
</template>

<style scoped lang="scss"></style>