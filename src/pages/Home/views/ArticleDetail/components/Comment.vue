<script setup lang="ts">
import {computed, reactive, ref} from "vue"
import {ElMessage} from "element-plus"
import {useRoute, useRouter} from "vue-router"
import {listArticleComments} from "@/api/article.ts"
import {comment} from "@/api/article.ts"
import {state} from "@/store"
import {MAX_COMMENT_LEN, MAX_SHOW_COMMENT_LINE} from "@/constant/article.ts"
import moment from "moment"
import {disLike, like} from "@/api/comment_reaction.ts"
import {getSubComment} from "@/api/article_comment.ts"
import GoodUtils from "@/utils/GoodUtils.ts"

type ArticleCommentParams = {
    current: number;
    pageSize: number;
    list: ArticleComment.CommentDetailInfoVO[];
    total: number;
}

// 當子評論已經加載過了，就開始一段一段的展示，每一段展示該展示的數量
const SHOW_COUNT_PER_PAGE = 5

const $route = useRoute()
const $router = useRouter()
const commentListInfo = ref<ArticleCommentParams>({
    list: [],
    current: 1,
    pageSize: 10,
    total: 0
})
const commentInfo = reactive<ARTICLE.ArticleComment>({
    articleId: $route.params.articleId as string,
    content: "",
    parentId: null
})
const dialogFormVisible = ref<boolean>(false)

// 當前回復的評論id
const curReplyId = ref<number>(-1)

/**
 * 重置評論信息
 */
const resetCommentList = () => {
    commentListInfo.value = {
        list: [],
        current: 1,
        pageSize: 10,
        total: 0
    }
}

/**
 * 获取评论
 */
const getArticleComment = async () => {
    const result: API.Result = await listArticleComments({
        articleId: $route.params.articleId as string,
        current: commentListInfo.value.current as number,
        pageSize: commentListInfo.value.pageSize as number
    })
    if (result.data) {
        commentListInfo.value.list = [
            ...commentListInfo.value.list,
            ...result.data?.list.map((comment) => ({
                ...comment,
                // 添加是否折疊內容屬性
                isCollapseContent: true,
                isCollapseComment: true,
                subCommentListInfo: {
                    list: [],
                    current: 1,
                    pageSize: 5,
                    total: comment?.subCommentCount,
                    showCount: 0
                }
            }))
        ]
        commentListInfo.value.total = result.data?.total
    }
}

/**
 * 计算数量
 */
const computeCount = (value: number) => {
    if (!value || value < 0) {
        return 0
    }
    return value > 999 ? "999+" : value
}

/**
 * 选择emoji表情
 */
const onSelectEmoji = (emoji) => {
    commentInfo.content = commentInfo.content + emoji
}

/**
 * 发送评论
 */
const sendComment = GoodUtils.throttle({
    fn: async (e) => {
        if (!commentInfo.content?.trim().length) {
            return ElMessage.error("內容不能為空")
        }
        try {
            const res: API.Result = await comment(commentInfo)
            if (res.data) {
                commentInfo.content = ""
                resetCommentList()
                await getArticleComment()
            }
        } catch (e) {
            dialogFormVisible.value = true
        }
    },
    time: 1,
    count: 2
})

/**
 * 加载更多评论
 */
const loadMoreComment = async () => {
    commentListInfo.value.current++
    await getArticleComment()
}

// 计算当前是否还有需要加载的数据
const computeIsReachEnd = computed(() => {
    return (commentListInfo.value.total > commentListInfo.value.current * commentListInfo.value.pageSize)
})

/**
 * @description 點讚或取消點讚評論
 * @param commentId
 */
const likeComment = async ({commentId, parentId}: { commentId: number, parentId: number }) => {
    const result: API.Result = await like(commentId)
    commentListInfo.value.list.forEach((comment) => {
        if (!parentId) {
            if (comment.id === commentId) {
                if (result.data) {
                    comment.isLiked = true
                    comment.isDisliked = false
                    comment.likedCount++
                } else {
                    comment.isLiked = false
                    comment.likedCount--
                }
            }
        } else {
            if (comment.id === parentId) {
                comment.subCommentListInfo?.list.forEach((subComment) => {
                    if (subComment.id === commentId) {
                        if (result.data) {
                            subComment.isLiked = true
                            subComment.isDisliked = false
                            subComment.likedCount++
                        } else {
                            subComment.isLiked = false
                            subComment.likedCount--
                        }
                    }
                })
            }
        }
    })
}

/**
 * @description 踩或取消踩點讚評論
 * @param commentId
 */
const dislikeComment = async ({commentId, parentId}: { commentId: number, parentId: number }) => {
    const result: API.Result = await disLike(commentId)
    commentListInfo.value.list.map((comment) => {
        if (!parentId) {
            if (comment.id === commentId) {
                if (result.data) {
                    comment.isDisliked = true
                    comment.isLiked = false
                    comment.dislikedCount++
                } else {
                    comment.isDisliked = false
                    comment.dislikedCount--
                }
            }
        } else {
            if (comment.id === parentId) {
                comment.subCommentListInfo?.list.forEach((subComment) => {
                    if (subComment.id === commentId) {
                        if (result.data) {
                            subComment.isDisliked = true
                            subComment.isLiked = false
                            subComment.dislikedCount++
                        } else {
                            subComment.isLiked = false
                            subComment.dislikedCount--
                        }
                    }
                })
            }
        }
    })
}

/**
 * @description 獲取子評論
 * @param comment
 */
const getSubCommentOperation = async (comment: ArticleComment.CommentDetailInfoVO) => {
    async function extracted() {
        // 如果已經加載過評論，則直接顯示加載過得評論，減少網絡請求
        if (comment.subCommentListInfo?.list.length > comment.subCommentListInfo?.showCount) {
            if (comment.subCommentListInfo?.showCount + SHOW_COUNT_PER_PAGE > comment.subCommentListInfo?.total) {
                return comment.subCommentListInfo.showCount = comment.subCommentListInfo?.total
            } else {
                return comment.subCommentListInfo.showCount += SHOW_COUNT_PER_PAGE
            }
        }
        const result: API.Result = await getSubComment({
            current: comment.subCommentListInfo?.current,
            pageSize: comment.subCommentListInfo?.pageSize,
            commentId: comment.id
        })
        commentListInfo.value.list.map((comment) => {
            if (comment.id === comment.id) {
                comment.subCommentListInfo.list = [
                    ...comment.subCommentListInfo.list,
                    ...result.data.list
                ]
                // 將當前獲取到的子評論list的長度賦值給可展示的數量
                comment.subCommentListInfo.showCount = comment.subCommentListInfo?.list?.length
            }
        })
        comment.subCommentListInfo.current++
        comment.isCollapseComment = false
    }

    // 當前評論處折疊狀態
    if (!comment.isCollapseComment) {
        // 當子評論數大於可展示子評論數時，就去獲取剩下的子評論
        if (comment.subCommentListInfo.total > comment.subCommentListInfo?.showCount) {
            await extracted()
        } else {
            // 否則就折疊
            collapseSubComment(comment)
        }
    } else {
        // 第一次獲取子評論
        await extracted()
        comment.isCollapseComment = false
    }
}

/**
 * @description 收起子評論
 * @param comment ArticleComment.CommentDetailInfoVO
 */
const collapseSubComment = (comment: ArticleComment.CommentDetailInfoVO) => {
    comment.isCollapseComment = true
    comment.subCommentListInfo.current = 1
    comment.subCommentListInfo.showCount = 0
}

/**
 * 計算當前是否還有子評論
 */
const computedIsSubCommentForShowText = (comment: ArticleComment.CommentDetailInfoVO) => {
    return comment.isCollapseComment
        ? "展开查看更多回复"
        : comment.subCommentListInfo?.total > comment.subCommentListInfo?.showCount
            ? "查看更多"
            : "收起"
}

/**
 * 計算剩餘需要展示的子評論條數
 */
const computedRemainShowSubComment = (comment: ArticleComment.CommentDetailInfoVO) => {
    const number = comment.subCommentListInfo?.total - comment.subCommentListInfo?.showCount;
    return computeCount(number)
}
</script>

<template>
    <div class="comment mt-[15px] bg-white">
        <div class="comment-input min-h-[60px] h-auto py-[10px] border-b-[1px] px-[20px] flex items-center">
            <el-avatar shape="circle" size="default" :icon="UserFilled"
                       :src="state.UserAuthState.userInfo.userInfo?.avatar"/>
            <el-input
                placeholder="留下你宝贵的评论吧！"
                v-model="commentInfo.content"
                type="textarea"
                autofocus
                size="default"
                show-word-limit
                :maxlength="MAX_COMMENT_LEN"
                clearable
                :autosize="{
                            maxRows: 8,
                            minRows: 1
                        }"
                name="comment"
                class="w-[400px] rounded-md ml-[15px]"
                input-style="max-height: 150px"
                @keydown.enter.prevent="sendComment"
            />
            <emoji-picker
                @select="onSelectEmoji"
                :isCLickOutClose="true"
            >
                <template #trigger>
                    <i
                        class="iconfont icon-expression ml-[15px] text-lg hover:text-[#5d93bb] cursor-pointer"
                    ></i>
                </template>
            </emoji-picker>
            <el-button type="primary" class="ml-[15px]" @click="sendComment">发送</el-button>
        </div>
        <div class="comment-area">
            <div
                class="comment-area-top h-[40px] border-b-[1px] leading-[40px] px-[15px] text-[#ccc] text-sm flex justify-between">
                <span class="title">评论区</span>
                <span class="comment-count">共 {{ computeCount(commentListInfo.total) }} 条评论</span>
            </div>
            <div class="comment-area-main" v-show-viewport="getArticleComment">
                <el-empty v-if="!commentListInfo.list?.length" description="暂无评论，快来抢占沙发吧！"/>
                <div v-else class="comments">
                    <div
                        class="comment-info border-b-[1px] py-[10px] px-[15px]"
                        :class="curReplyId === comment.id ? 'pb-0' : ''"
                        v-for="comment in commentListInfo.list"
                        :key="comment.id"
                    >
                        <div class="topper h-[40px] flex items-center justify-between">
                            <div class="author flex h-full items-center">
                                <el-avatar
                                    shape="circle"
                                    size="default"
                                    :src="comment.avatar"
                                >
                                    <template #default>
                                        <span class="text-[sm]">User</span>
                                    </template>
                                </el-avatar>
                                <h2 class="ml-2 font-bold">{{ comment.username }}</h2>
                            </div>
                            <div class="comment-time text-sm text-[#ccc]">
                                {{ moment(comment.createdTime).format("YYYY-MM-DD HH:mm:ss") }}
                            </div>
                        </div>
                        <div class="comment relative">
                            <div
                                class="comment-content ml-[50px] overflow-hidden overflow-ellipsis line-clamp-[5]"
                                :class="`${comment?.isCollapseContent ? `line-clamp-[${MAX_SHOW_COMMENT_LINE}]` : ''}`"
                            >
                                {{ comment.content }}
                            </div>
                            <div
                                class="w-[60px] bg-gradient-to-l from-white from-[70%] absolute bottom-0 right-0 flex justify-end text-[#0094ff] cursor-pointer"
                                @click="comment.isCollapseContent = !comment?.isCollapseContent"
                                v-if="comment.content?.length >= 200"
                            >
                                {{ comment?.isCollapseContent ? '展开' : '收起' }}
                            </div>
                        </div>
                        <div
                            class="tools w-full h-[25px] flex justify-end items-center mt-[10px] pl-[50px]"
                            :class="curReplyId === comment.id ? 'mb-[10px]' : ''"
                        >
                            <div
                                class="like cursor-pointer hover:text-[#0094ff]"
                                :class="comment.isLiked ? 'text-[#0094ff]' : ''"
                                @click="likeComment({ commentId: comment.id as number, parentId: null })"
                            >
                                <i
                                    class="iconfont icon-like-comment  mr-[5px]"
                                ></i>
                                <span class="mr-[20px] text-sm">{{ computeCount(comment.likedCount) }}</span>
                            </div>
                            <div
                                class="dislike cursor-pointer hover:text-[#0094ff]"
                                :class="comment.isDisliked ? 'text-[#0094ff]' : ''"
                                @click="dislikeComment({ commentId: comment.id as number, parentId: null })"
                            >
                                <i
                                    class="iconfont icon-dislike-comment  mr-[5px]"
                                ></i>
                                <span class="mr-[20px] text-sm">{{ computeCount(comment.dislikedCount) }}</span>
                            </div>
                            <div class="reply cursor-pointer" title="回复他" @click="curReplyId = comment.id">
                                <i
                                    class="iconfont icon-reply"
                                ></i>
                            </div>
                        </div>
                        <div class="more-comment ml-[50px] relative">
                            <div
                                class="w-full border-t-[1px] py-[5px]"
                                v-for="subComment in comment.subCommentListInfo?.list.slice(0, comment.subCommentListInfo?.showCount as number)"
                                :key="subComment.id"
                                v-show="!comment.isCollapseComment"
                            >
                                <div class="topper h-[40px] flex items-center justify-between">
                                    <div class="author flex h-full items-center">
                                        <el-avatar
                                            shape="circle"
                                            size="default"
                                            :src="subComment.avatar"
                                        >
                                            <template #default>
                                                <span class="text-[sm]">User</span>
                                            </template>
                                        </el-avatar>
                                        <h2 class="ml-2 font-bold">{{ subComment.username }}</h2>
                                        <div class="reply text-[#ccc] ml-[10px] text-sm"
                                             v-show="subComment.parentUsername">
                                            回复了
                                            <strong
                                                class="cursor-pointer hover:text-[#0094ff]"
                                                @click="$router.push({ name: 'profile', params: { userId: subComment.parentUserId } })"
                                            >{{ subComment.parentUsername }}</strong>
                                        </div>
                                    </div>
                                    <div class="subComment-time text-sm text-[#ccc]">
                                        {{ moment(subComment.createdTime).format("YYYY-MM-DD HH:mm:ss") }}
                                    </div>
                                </div>
                                <div class="subComment relative">
                                    <div
                                        class="subComment-content ml-[50px] overflow-hidden overflow-ellipsis"
                                        :class="`${subComment?.isCollapseContent ? `line-clamp-[${MAX_SHOW_COMMENT_LINE}]` : ''}`"
                                    >
                                        {{ subComment.content }}
                                    </div>
                                    <div
                                        class="w-[60px] bg-gradient-to-l from-white from-[70%] absolute bottom-0 right-0 flex justify-end text-[#0094ff] cursor-pointer"
                                        @click="subComment.isCollapseContent = !subComment?.isCollapseContent"
                                        v-if="subComment.content?.length >= 200"
                                    >
                                        {{ subComment?.isCollapseContent ? '展开' : '收起' }}
                                    </div>
                                </div>
                                <div class="tools w-full h-[25px] flex justify-end items-center mt-[10px] pl-[50px]">
                                    <div
                                        class="like cursor-pointer hover:text-[#0094ff]"
                                        :class="subComment.isLiked ? 'text-[#0094ff]' : ''"
                                        @click="likeComment({ commentId: subComment.id as number, parentId: comment.id })"
                                    >
                                        <i
                                            class="iconfont icon-like-comment  mr-[5px]"
                                        ></i>
                                        <span class="mr-[20px] text-sm">{{ computeCount(subComment.likedCount) }}</span>
                                    </div>
                                    <div
                                        class="dislike cursor-pointer hover:text-[#0094ff]"
                                        :class="subComment.isDisliked ? 'text-[#0094ff]' : ''"
                                        @click="dislikeComment({ commentId: subComment.id as number, parentId: comment.id })"
                                    >
                                        <i
                                            class="iconfont icon-dislike-comment  mr-[5px]"
                                        ></i>
                                        <span class="mr-[20px] text-sm">{{
                                                computeCount(subComment.dislikedCount)
                                            }}</span>
                                    </div>
                                    <div class="reply cursor-pointer" title="回复他"
                                         @click="curReplyId = subComment.id">
                                        <i
                                            class="iconfont icon-reply"
                                        ></i>
                                    </div>
                                </div>
                                <div class="comment-reply-input flex py-[10px] border-t-[1px]"
                                     v-if="curReplyId === subComment.id">
                                    <el-input
                                        placeholder="留下你宝贵的评论吧！"
                                        v-model="commentInfo.content"
                                        type="textarea"
                                        autofocus
                                        size="default"
                                        show-word-limit
                                        :maxlength="MAX_COMMENT_LEN"
                                        clearable
                                        :autosize="{
                                                maxRows: 8,
                                                minRows: 1
                                            }"
                                        name="comment"
                                        class="w-[400px] rounded-md"
                                        input-style="max-height: 150px"
                                        @keyup.enter.prevent="sendComment"
                                    />
                                    <emoji-picker
                                        @select="onSelectEmoji"
                                        :isCLickOutClose="true"
                                    >
                                        <template #trigger>
                                            <i
                                                class="iconfont icon-expression ml-[15px] text-lg hover:text-[#5d93bb] cursor-pointer"
                                            ></i>
                                        </template>
                                    </emoji-picker>
                                    <el-button type="primary" class="ml-[15px]" @click="sendComment">发送</el-button>
                                    <el-button class="ml-[15px]" @click="curReplyId = -1">取消</el-button>
                                </div>
                            </div>
                            <div
                                class="absolute bottom-0 left-0"
                                :class="curReplyId === comment.id ? 'bottom-[10px]' : ''"
                            >
                                <div class="text-sm text-[#ccc]"
                                     v-if="!comment.subCommentCount || comment.subCommentCount <= 0">暂无回复
                                </div>
                                <div
                                    class="text-sm text-[#ccc] flex"
                                    v-else
                                >
                                    <div
                                        class="hover:text-[#777] cursor-pointer mr-[30px]"
                                        @click="getSubCommentOperation(comment)"
                                        v-show="comment.isCollapseComment || comment.subCommentListInfo?.total - comment.subCommentListInfo?.showCount > 0"
                                    >
                                        <i
                                            class="iconfont mr-[3px]"
                                            :class="comment.isCollapseComment || comment.subCommentListInfo.total > comment.subCommentListInfo?.showCount
                                                ? 'icon-arrow-down'
                                                : 'icon-arrow-up'"
                                        ></i>
                                        <span>
                                            <span>{{ computedIsSubCommentForShowText(comment) }}</span>
                                            <span> (剩余{{ computedRemainShowSubComment(comment) }}条)</span>
                                        </span>
                                    </div>
                                    <div
                                        class="collapse-sub-comment hover:text-[#777] cursor-pointer"
                                        v-show="!comment.isCollapseComment"
                                        @click="collapseSubComment(comment as ArticleComment.CommentDetailInfoVO)"
                                    >
                                        <i class="iconfont icon-arrow-up mr-[3px]"></i>
                                        <span>收起</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-reply-input flex py-[10px] border-t-[1px]" v-if="curReplyId === comment.id">
                            <el-input
                                placeholder="留下你宝贵的评论吧！"
                                v-model="commentInfo.content"
                                type="textarea"
                                autofocus
                                size="default"
                                show-word-limit
                                :maxlength="MAX_COMMENT_LEN"
                                clearable
                                :autosize="{
                                                maxRows: 8,
                                                minRows: 1
                                            }"
                                name="comment"
                                class="w-[400px] rounded-md"
                                input-style="max-height: 150px"
                                @keyup.enter.prevent="sendComment"
                            />
                            <emoji-picker
                                @select="onSelectEmoji"
                                :isCLickOutClose="true"
                            >
                                <template #trigger>
                                    <i
                                        class="iconfont icon-expression ml-[15px] text-lg hover:text-[#5d93bb] cursor-pointer"
                                    ></i>
                                </template>
                            </emoji-picker>
                            <el-button type="primary" class="ml-[15px]" @click="sendComment">发送</el-button>
                            <el-button class="ml-[15px]" @click="curReplyId = -1">取消</el-button>
                        </div>
                    </div>
                    <div
                        v-if="computeIsReachEnd"
                        class="w-full py-[5px] bg-white text-sm text-[#0094ff] flex-center cursor-pointer transition-[background-color] hover:bg-[#f9f9f9]"
                        @click="loadMoreComment"
                    >
                        加载更多
                    </div>
                    <div v-else class="not-more flex-center my-[5px] text-[#ccc] text-sm">
                        已经滑到底了，没有更多了~
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>