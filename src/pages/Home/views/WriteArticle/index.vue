<script setup lang="ts">
import {reactive, ref, nextTick, watch, onUpdated, onMounted} from "vue"
import {Plus} from "@element-plus/icons-vue"
import {ElImageViewer, ElMessage, UploadUserFile} from "element-plus";
import {Delta} from "@vueup/vue-quill"
import {state, actions} from "@/store"
// Delta转html转换器
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html"
// 富文本转html，过滤潜在XSS攻击内容库
import DOMPurify from "dompurify"
import {publishArticle, saveDraftArticle, uploadCover} from "@/api/article.ts"
import _ from "lodash"
import {useRouter} from "vue-router"
import RecommendArticle from "@/components/RecommendArticle/index.vue"

import {ElInput} from "element-plus"
// 关键词提取
// import nodejieba from "nodejieba"

const $router = useRouter();

// 初始化tags
(async function () {
    if (!state.TagState.tags.tags?.length) {
        await actions.TagActions.setTags()
    }
})();

// 判断用户权限
onMounted(() => {
    setTimeout(() => {
        if (!state.UserAuthState.userInfo.userInfo?.id) {
            $router.push({
                name: "login"
            })
        }
    }, 100)
})

/**
 * 文章信息类型定义
 */
interface articleInfo {
    title?: string,
    content?: string | Delta;
    cover?: UploadUserFile[];
    coverUrl?: string;
    onlineCoverUrl?: string;
    isLocalUpload?: boolean;
    tags?: TAG.TagItem[];
}

// 最大标题长度
const MAX_TITLE_LEN = 20

// 富文本配置
const options = {
    theme: "snow",
    placeholder: "在此处输入正文",
    enable: "true",
    modules: {
        blotFormatter: {}
    }
}

// 富文本工具栏
const toolbar = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],

    ['clean']
]

// 文章信息
const articleInfo = reactive<articleInfo>({
    title: "",
    content: undefined,
    // 上传的图片对象列表
    cover: [],
    // 图片url
    coverUrl: "",
    isLocalUpload: false,
    // 线上地址
    onlineCoverUrl: "",
    // 标签数组
    tags: []
})

// 是否预览图片
const isPreviewPic = ref<boolean>(false)
// 预览地址
const previewUrl = ref<string>("")

// 选中输入框
const InputRef = ref<InstanceType<typeof ElInput>>()

/**
 * 复制文章
 */
const copyArticle = _.throttle(() => {
    const {title, content} = articleInfo
    const clipContent = `
        title: ${title},
        content: ${JSON.stringify(parseContent(content))}
    `
    if (title?.length && content) {
        navigator.clipboard.writeText(clipContent).then(r => console.log(r))
        ElMessage.success({
            message: "复制成功"
        })
    } else {
        ElMessage.error({
            message: "复制失败，内容为空"
        })
    }
}, 500)

/**
 * 预览文章
 */
const previewArticle = () => {

}

/**
 * 发布文章
 */
const publish = _.throttle(async () => {
    // 上传文章内容
    const {data}: API.Result = await publishArticle({
        title: articleInfo.title,
        content: parseContent(articleInfo.content),
        cover: articleInfo.isLocalUpload ? articleInfo.coverUrl : articleInfo.onlineCoverUrl ? "Https://" + articleInfo.onlineCoverUrl : "",
        tagIds: articleInfo.tags?.join(",")
    })
    if (data) {
        $router.push({
            name: "home"
        }).then(r => console.log(r))
    }
}, 1000)

/**
 * 保存草稿
 */
const saveDraft = _.throttle(async () => {
    // 上传文章内容
    const {data}: API.Result = await saveDraftArticle({
        title: articleInfo.title,
        content: parseContent(articleInfo.content),
        cover: articleInfo.isLocalUpload ? articleInfo.coverUrl : articleInfo.onlineCoverUrl ? "Https://" + articleInfo.onlineCoverUrl : "",
        tagIds: articleInfo.tags?.join(",")
    })
    if (data) {
        $router.push({
            name: "home"
        }).then(r => console.log(r))
    }
}, 500)

/**
 * 解析文章内容
 */
const parseContent = (content: string | Delta) => {
    // 解析Delta
    const converter = new QuillDeltaToHtmlConverter(content?.ops)
    // 解析成避免了XSS攻击的html字符串
    return DOMPurify.sanitize(converter.convert())
}

/**
 * 提取关键词
 */
const extractKeywords = () => {
    parseContent()
    // 提取关键词频率最高的前几位词
    const topN = 3
}

</script>

<template>
    <div class="write-article w-screen flex flex-col xl:flex-row xl:justify-between py-[10px] px-[20px]">
        <div class="rich-text flex-[0.7] flex flex-col">
            <div class="top w-full h-[38px] md:h-[45px] lg:h-[50px] flex justify-between mb-[15px]">
                <div
                    class="title flex-[0.65] h-full border-[1px] border-[#d1d5db] bg-white flex-center px-[15px]">
                    <input
                        placeholder="请输入文章标题"
                        class="w-full h-[70%] md:text-2xl outline-none font-semibold"
                        v-model="articleInfo.title"
                        required
                        :maxlength="MAX_TITLE_LEN"
                    />
                </div>
                <div class="buttons flex justify-between flex-[0.34] h-full text-white md:text-xl">
                    <button
                        class="
                            w-[35%]
                            h-full
                            rounded-md
                            bg-[#4485ba]
                            transition-all
                            hover:bg-[#5d93bb]
                            active:scale-95
                        "
                        @click="publish"
                    >发布
                    </button>
                    <el-tooltip
                        placement="top"
                        content="查看预览"
                    >
                        <button
                            class="
                                w-[21%]
                                h-full
                                rounded-md
                            "
                            :class="
                                articleInfo.content && articleInfo.title
                                ? 'bg-[#4485ba] transition-all hover:bg-opacity-70 cursor-pointer active:scale-95'
                                : 'bg-[#5d93bb] cursor-not-allowed'
                            "
                            :disabled="!articleInfo.content || !articleInfo.title"
                            @click="previewArticle"
                        >
                            <i class="iconfont icon-preview_fill"></i>
                        </button>
                    </el-tooltip>
                    <el-tooltip
                        placement="top"
                        content="存为草稿"
                    >
                        <button
                            class="
                                w-[21%]
                                h-full
                                rounded-md
                                bg-[#4485ba]
                                transition-all
                                hover:bg-[#5d93bb]
                                active:scale-95
                            "
                            @click="saveDraft"
                        >
                            <i class="iconfont icon-draft text-lg"></i>
                        </button>
                    </el-tooltip>
                    <el-tooltip
                        placement="top"
                        content="复制原文"
                    >
                        <button
                            class="
                                w-[21%]
                                h-full
                                rounded-md
                                bg-[#4485ba]
                                transition-all
                                hover:bg-[#5d93bb]
                                active:scale-95
                            "
                            @click="copyArticle"
                        >
                            <i class="iconfont icon-copy"></i>
                        </button>
                    </el-tooltip>
                </div>
            </div>
            <div class="rich-text w-full flex-[0.9] bg-white">
                <QuillEditor
                    :options="options"
                    :toolbar="toolbar"
                    class="w-full min-h-[400px] xl:min-h-[800px] h-[800px] break-all"
                    v-model:content="articleInfo.content"
                />
            </div>
        </div>
        <div class="
                article-side
                h-full
                flex-[0.29]
                flex
                justify-between
                xl:justify-start
                xl:flex-col
                xl:sticky
                right-0
                top-[10px]
            "
        >
            <div
                class="
                    upload-cover
                    hidden
                    md:flex-[0.49]
                    md:flex
                    flex-col
                    xl:h-[220px]
                    min-h-[220px]
                    bg-white
                    border-[1px]
                    border-[#d1d5db]
                    mt-[20px]
                    xl:mt-0
                "
            >
                <div class="words border-b-[1px] border-[#d1d5db] h-[40px] flex items-center justify-between px-[20px]">
                    <span>上传封面</span>
                    <el-switch
                        v-model="articleInfo.isLocalUpload"
                        class="ml-2"
                        inline-prompt
                        style="--el-switch-on-color: #0094ff; --el-switch-off-color: #5d93bb"
                        active-text="本地上传"
                        inactive-text="线上链接"
                    />
                </div>
                <div class="upload flex items-center flex-1 px-[20px] py-[10px]">
                    <div class="local-upload w-full h-full" v-if="articleInfo.isLocalUpload">
                        <el-upload
                            v-model:file-list="articleInfo.cover as UploadUserFile[]"
                            list-type="picture-card"
                            :limit="1"
                            :auto-upload="false"
                            :on-change="async (uploadFile) => {
                                const { data }: API.Result = await uploadCover(uploadFile.raw as File)
                                if (data) {
                                    articleInfo.coverUrl = data
                                }
                            }"
                            :on-preview="() => {
                                isPreviewPic = true
                                previewUrl = articleInfo.coverUrl as string
                            }"
                            name="cover"
                            class="flex-center"
                        >
                            <el-icon>
                                <Plus/>
                            </el-icon>
                        </el-upload>
                    </div>
                    <div class="inline-upload w-full h-[35px] flex justify-between items-center" v-else>
                        <el-input
                            placeholder="请输入线上地址，然后点击预览"
                            v-model="articleInfo.onlineCoverUrl"
                            class="w-[80%] h-full"
                            :maxlength="100"
                            clearable
                            @input="() => {
                                const matchHttpsPrefix: RegExp = /Https:\/\//i
                                console.log(matchHttpsPrefix.test(articleInfo.onlineCoverUrl as string))
                                if (matchHttpsPrefix.test(articleInfo.onlineCoverUrl as string)) {
                                    articleInfo.onlineCoverUrl = articleInfo.onlineCoverUrl?.replace(matchHttpsPrefix, '')
                                }
                            }"
                        >
                            <template #prepend>Https://</template>
                        </el-input>
                        <el-button
                            class="bg-[#5d93bb] text-[#fafafa] w-[19%]"
                            @click="() => {
                                isPreviewPic = true
                                previewUrl = 'https://' + articleInfo.onlineCoverUrl as string
                            }"
                            :disabled="!articleInfo.onlineCoverUrl"
                        >
                            预览
                        </el-button>
                    </div>
                    <el-image-viewer
                        v-if="isPreviewPic"
                        :urlList="[previewUrl]"
                        :hideOnClickModal="true"
                        closeOnPressEscape
                        @close="isPreviewPic = false"
                    />
                </div>
            </div>
            <div
                class="article-tags md:flex-[0.49] flex-1 xl:w-full bg-white border-[1px] border-[#d1d5db] mt-[20px] ml-[10px] md:ml-0 w-[200px]"
            >
                <div
                    class="words border-b-[1px] border-[#d1d5db] h-[40px] flex items-center justify-between px-[10px] xl:px-[20px]">
                    <span>文章标签</span>
                    <el-button type="primary" round size="small" @click="extractKeywords">提取关键词</el-button>
                </div>
                <div class="container w-full px-[10px] xl:px-[20px] py-[10px]">
                    <el-check-tag
                        v-for="tag in state.TagState.tags.tags"
                        :checked="articleInfo.tags?.indexOf(tag.id) > -1"
                        @change="(isChecked) => {
                            if (isChecked) {
                                if(articleInfo.tags?.length < 5) {
                                    articleInfo.tags?.push(tag.id)
                                } else {
                                    ElMessage.error({
                                        message: '标签数量过多'
                                    })
                                }
                            } else {
                                articleInfo.tags?.splice(articleInfo.tags?.indexOf(tag.id), 1)
                            }
                        }"
                        class="mr-[5px] mb-[5px]"
                    >
                        {{ tag.tagName }}
                    </el-check-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>