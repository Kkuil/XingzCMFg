/**
 * 文章标题的长度范围
 */
export const ARTICLE_TITLE_LEN_RANGE = [5, 20]

/**
 * 文章内容的长度范围
 */
export const ARTICLE_CONTENT_LEN_RANGE = [30, 500]

/**
 * 最大的评论长度
 */
export const MAX_COMMENT_LEN = 200

/**
 * 最大显示的评论行数
 */
export const MAX_SHOW_COMMENT_LINE = 5

/**
 * 文章状态
 */
export const ARTICLE_STATUS = {
    /**
     * 未审核
     */
    0: "unaudited",
    /**
     * 已审核
     */
    1: "audited",
    /**
     * 草稿
     */
    2: "draft",
    /**
     * 已驳回
     */
    3: "rejected",
    /**
     * 已下架
     */
    4: "undercarriage",
}
