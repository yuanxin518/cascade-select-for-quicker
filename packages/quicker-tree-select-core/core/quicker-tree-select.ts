import type { DataSourceType, DataWithState } from "./types";

/**
 * 初始化函数调用环境
 * @param dataSource 数据源
 * @param dataWithState 当前的状态数据
 */
export function initDataWithState(
  _dataSource: DataSourceType[],
  dataWithState?: DataWithState | null,
) {
  const dataSource = dataWithState?.dataSource
    ? dataWithState.dataSource
    : _dataSource;

  const stateData: DataWithState = dataWithState ?? {
    dataSource: dataSource,
    state: {
      selectedTags: [],
    },
    result: {
      restRelatedTags: [],
      selectedTagsMatchedData: [],
    },
  };

  /**
   * 更新状态数据
   * 根据state计算result，并返回
   */
  const updateDataResult = (): DataWithState => {
    const { state, result } = stateData;

    result.selectedTagsMatchedData = dataSource.filter((item) =>
      state.selectedTags.every((tag) => item.tags.includes(tag)),
    );
    // 剩余可选tag
    result.restRelatedTags = [
      ...new Set(
        dataSource
          .filter((item) =>
            state.selectedTags.every((tag) => item.tags.includes(tag)),
          )
          .map((item) => item.tags)
          .flat()
          .filter((item) => !state.selectedTags.includes(item)),
      ),
    ];

    Object.assign(stateData, { state, result });
    return stateData;
  };

  /** 选中一个tag */
  const selectTag = (tag: string) => {
    stateData.state.selectedTags.push(tag);
    return updateDataResult();
  };

  /** 移除多个tag */
  const removeTag = (tags: string[]) => {
    stateData.state.selectedTags = stateData.state.selectedTags.filter(
      (item) => !tags.includes(item),
    );
    return updateDataResult();
  };

  /** 覆盖选中tag列表 */
  const overrideTagList = (tags: string[]) => {
    stateData.state.selectedTags = tags;
    return updateDataResult();
  };

  updateDataResult();

  return {
    selectTag,
    removeTag,
    overrideTagList,
    stateData,
  };
}
