import type { DataSourceType, DataWithState } from "./types";

/**
 * 初始化函数调用环境
 * @param dataSource 数据源
 * @param dataWithState 当前的状态数据
 */
export function initDataWithState(
  dataSource: DataSourceType[],
  dataWithState?: DataWithState
) {
  const stateData: DataWithState = dataWithState ?? {
    state: {
      dataSource: dataSource,
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
    result.selectedTagsMatchedData = state.dataSource.filter((item) =>
      state.selectedTags.every((tag) => item.tags.includes(tag))
    );
    result.restRelatedTags = [
      ...new Set(
        state.dataSource
          .filter((item) =>
            state.selectedTags.every((tag) => item.tags.includes(tag))
          )
          .map((item) => item.tags)
          .flat()
          .filter((item) => !state.selectedTags.includes(item))
      ),
    ];
    stateData.result = result;

    return stateData;
  };

  /** 选中一个tag */
  const selectTag = (tag: string) => {
    stateData.state.selectedTags.push(tag);
    return updateDataResult();
  };

  return {
    selectTag,
  };
}
