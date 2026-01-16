/** 数据源结构 */
export type DataSourceType = {
    tags: string[];
    value: string[];
};

/** 携带状态的数据 */
export type DataWithState = {
    state: {
        dataSource: DataSourceType[];
        /** 每次选中tag后，就加入进来 */
        selectedTags: string[];
    };
    /** 计算结果 */
    result: {
        /** dataSource中数据，过滤出selectedTags的数据后，剩下的tags */
        restRelatedTags: string[];
        /** 选中的tags绝对匹配的数据 */
        selectedTagsMatchedData: DataSourceType[];
    };
};