/**
 * 文章类型定义
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace ARTICLE {
    type ArticleInfo = {
        title?: string;
        content?: string;
        cover?: string;
        tagIds?: string;
    }
    type ArticleItem = {
        id?: string;
        userId?: string;
        username?: string;
        title?: string;
        content?: string;
        statusName?: string;
        cover?: string;
        tags?: string;
        likedCount?: number;
        collectedCount?: number;
        commentCount?: number;
        isLiked?: boolean;
        isCollected?: boolean;
        isVisited?: boolean;
        createdTime?: string;
    }
    type ArticleListParams = {
        tagId?: string;
        categoryId?: string;
        current?: number;
        pageSize?: number;
    }
    type ArticleCommentListParams = {
        articleId?: string;
        current?: number;
        pageSize?: number;
    }
    type ArticleSubCommentListParams = {
        commentId?: number;
        current?: number;
        pageSize?: number;
    }
    type ArticleListWithUserIdParams = {
        userId?: string;
        statusId?: number;
        current?: number;
        pageSize?: number;
    }
    type ArticleComment = {
        articleId?: String;
        parentId?: number | null;
        content?: String;
    }
    enum ArticleStatusEnums {
        /**
         * 未审核
         */
        UNAUDITED = 0,
        /**
         * 已审核
         */
        AUDITED = 1,
        /**
         * 草稿
         */
        DRAFT = 2,
        /**
         * 已驳回
         */
        REJECTED = 3,
        /**
         * 已下架
         */
        UNDERCARRIAGE = 4,
    }
}