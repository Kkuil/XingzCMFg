<script setup lang="ts">
import BlotFormatter from "quill-blot-formatter"
import {reactive, ref} from "vue"
import {Plus} from "@element-plus/icons-vue"
import {UploadProps, UploadUserFile} from "element-plus";

interface articleInfo {
    title?: string,
    content?: string,
    file?: UploadUserFile[]
}

const MAX_TITLE_LEN = 20

const options = {
    theme: "snow",
    placeholder: "在此处输入正文",
    enable: "true",
    modules: {
        name: "blotFormatter",
        module: BlotFormatter
    }
}

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

const articleInfo = reactive<articleInfo>({
    title: "",
    content: "",
    file: []
})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
</script>

<template>
    <div class="write-article w-screen flex flex-col xl:flex-row xl:justify-between py-[10px] px-[20px]">
        <div class="rich-text flex-[0.7] flex flex-col">
            <div class="title w-full h-[60px] border-[1px] border-[#d1d5db] mb-[15px] bg-white flex-center px-[15px]">
                <input
                    placeholder="请输入文章标题"
                    class="w-full h-[70%] text-2xl outline-none font-semibold"
                    v-model="articleInfo.title"
                    required
                    :maxlength="MAX_TITLE_LEN"
                />
            </div>
            <div class="rich-text w-full flex-[0.9] bg-white">
                <QuillEditor
                    :options="options"
                    :toolbar="toolbar"
                    class="w-full min-h-[400px] xl:min-h-[800px] h-[800px] break-all"
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
                sticky
                right-0
                top-[10px]
            "
        >
            <div
                class="
                    upload-cover
                    hidden
                    md:flex-[0.19]
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
                <div class="words border-b-[1px] border-[#d1d5db] h-[40px] flex items-center px-[20px]">
                    上传封面
                </div>
                <div class="upload flex items-center flex-1 px-[20px] py-[10px]">
                    <el-upload
                        v-model:file-list="articleInfo.file as UploadUserFile[]"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                        list-type="picture-card"
                        :limit="1"
                        :auto-upload="false"
                        :http-request="(file) => {
                            console.log(file)
                        }"
                        class="flex-center"
                    >
                        <el-icon>
                            <Plus/>
                        </el-icon>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" class="flex-center">
                        <img :src="dialogImageUrl" alt="Preview Image"/>
                    </el-dialog>
                </div>
            </div>
            <div
                class="
                    upload-cover
                    flex-1
                    md:flex-[0.79]
                    flex
                    flex-col
                    bg-white
                    border-[1px]
                    border-[#d1d5db]
                    mt-[20px]
                "
            >
                <div class="words border-b-[1px] border-[#d1d5db] h-[40px] flex items-center justify-between px-[20px]">
                    <span>推荐文章</span>
                    <i class="iconfont icon-link hover:text-[#0094ff] cursor-pointer"></i>
                </div>
                <div class="recommend-articles flex flex-col flex-1 px-[20px] py-[10px]">
                    <div
                        class="
                            article
                            w-full
                            h-[30px]
                            leading-[30px]
                            cursor-pointer
                            rounded-[2px]
                            hover:bg-[#f1f1f1]
                            overflow-hidden
                            overflow-ellipsis
                            line-clamp-1
                            my-[5px]
                            px-[5px]
                        "
                        v-for="(article, index) in 5"
                        :key="index"
                    >
                        随机一段废话因何而发生?在这种困难的抉择下, 本人思来想去, 寝食难安.
                        现在, 解决随机一段废话的问题, 是非常非常重要的. 所以, 在这种困难的抉择下, 本人思来想去,
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>