<script setup lang="ts">
import {reactive} from "vue"
import FormFrame from "@/components/FormFrame/index.vue"
import {loginWithAccount} from "@/api/user"
import {useRouter} from "vue-router"

const $router = useRouter()

const userInfo = reactive({
    username: "",
    password: ""
})

/**
 * 账号登录
 * @param e
 */
const handleSubmit = async (e: Event) => {
    e.preventDefault()
    await loginWithAccount({
        username: userInfo.username,
        password: userInfo.password
    })
}

</script>

<template>
    <FormFrame title="登录">
        <template #form>
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" @submit="handleSubmit">
                    <div>
                        <label for="username" class="block text-sm font-medium leading-6 text-gray-900">账号</label>
                        <div class="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autocomplete="text"
                                required
                                placeholder="请输入账号"
                                v-model="userInfo.username"
                                class="block w-full pl-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password"
                                   class="block text-sm font-medium leading-6 text-gray-900">密码</label>
                            <div class="text-sm">
                                <a href="#" class="font-semibold text-[#0094ff] hover:text-indigo-500">忘记密码?</a>
                            </div>
                        </div>
                        <div class="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autocomplete="current-password"
                                required
                                placeholder="请输入密码"
                                v-model="userInfo.password"
                                class="block pl-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-[#6498be] hover:bg-[#4298bf] transition-[background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            登录
                        </button>
                    </div>
                </form>
                <p class="mt-10 text-center text-sm text-gray-500">
                    没有账户？
                    <a href="javascript: void(0);"
                       class="font-semibold leading-6 text-[#0094ff] hover:text-indigo-500"
                       @click="$router.push({ name: 'registry' })">手机号登录或注册</a>
                </p>
            </div>
        </template>
    </FormFrame>
</template>

<style scoped lang="scss"></style>
