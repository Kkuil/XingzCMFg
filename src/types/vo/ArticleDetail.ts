declare namespace ArticleDetail {
    type ArticleDetailInfoWithUser = {
        articleDetailInfo?: ArticleDetailInfo;
        authorDetailInfo?: AuthorDetailInfo;
        authorArticleDetailInfo?: AuthorArticleDetailInfo;
    }
    /**
     * 文章详情
     */
    type ArticleDetailInfo = {
        id?: string;
        title?: string;
        content?: string;
        cover?: string;
        likedCount?: number;
        collectedCount?: number;
        isLiked?: boolean;
        isCollected?: boolean;
        createdTime?: Date;
        modifiedTime?: Date;
    }
    /**
     * 作者详情
     */
    type AuthorDetailInfo = {
        id?: string;
        username?: string;
        avatar?: string;
        phone?: string;
        birthday?: Date;
        gender?: number;
        email?: string;
        tagIds?: [];
        isVip?: number;
    }
    /**
     * 作者动态详情
     */
    type AuthorArticleDetailInfo = {
        latestArticles?: ArticleLink[];
        pinnedArticles?: ArticleLink[];
    }
    /**
     * 友链
     */
    type ArticleLink = {
        id?: string;
        title?: string;
    }
}