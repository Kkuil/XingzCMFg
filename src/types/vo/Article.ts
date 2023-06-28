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
        createdTime?: string;
    }
    type ArticleListParams = {
        tagId?: string;
        categoryId?: string;
        current?: number;
        pageSize?: number;
    }
    type ArticleComment = {
        articleId?: String;
        parentId?: number | null;
        content?: String;
    }
}