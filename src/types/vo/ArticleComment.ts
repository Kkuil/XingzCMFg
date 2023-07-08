declare namespace ArticleComment {
    type CommentDetailInfoVO = {
        id?: number;
        userId?: string;
        username?: string;
        avatar?: string;
        content?: string;
        parentId?: string;
        parentUserId?: string;
        parentUsername?: string;
        isLiked?: boolean;
        isDisliked?: boolean;
        likedCount?: number;
        dislikedCount?: number;
        subCommentCount?: number;
        createdTime?: string;
        isCollapseContent?: boolean;
        isCollapseComment?: boolean;
        subCommentListInfo?: {
            current: number;
            pageSize: number;
            list: ArticleComment.CommentDetailInfoVO[],
            total: number;
            showCount: number
        };
    }
}