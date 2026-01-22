import { initDataWithState } from "quicker-tree-select-core";
import { useEffect, useState } from "react";
import { fetchDataSource } from "../providers/data-fetcher-provider";

export const useQuickerTreeSelectData = () => {
  const [dataWithStateInstance, setDataWithStateInstance] = useState(() => {
    return initDataWithState([]);
  });

  const initDataSource = async () => {
    try {
      const data = await fetchDataSource();
      // 创建新的实例并更新状态以触发重新渲染
      const newDataWithStateInstance = initDataWithState(data);
      setDataWithStateInstance(newDataWithStateInstance);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  useEffect(() => {
    initDataSource();
  }, []);

  const dataWithState = dataWithStateInstance.stateData;

  /** 选择一个tag */
  const selectTag = (tag: string) => {
    const data = dataWithStateInstance.selectTag(tag);
    setDataWithStateInstance({
      ...dataWithStateInstance,
      stateData: data,
    });
  };

  /** 选择多个tag */
  const handleSelectTags = (tags: string[]) => {
    dataWithStateInstance.overrideTagList(tags);
    setDataWithStateInstance({
      ...dataWithStateInstance,
      stateData: dataWithStateInstance.stateData,
    });
  };

  /** 已选择的tag */
  const selectedTags = dataWithState.state.selectedTags;

  /** 剩余可选tag */
  const restRelatedTags = dataWithState.result.restRelatedTags;

  /** 移除一个tag */
  const handleRemoveTag = (tag: string) => {
    handleSelectTags(selectedTags.filter((item) => item !== tag));
  };

  const selectedTagsMatchedData = dataWithStateInstance.stateData.result.selectedTagsMatchedData;

  return {
    dataWithState,
    selectTag,
    handleSelectTags,
    restRelatedTags,
    selectedTags,
    handleRemoveTag,
    selectedTagsMatchedData
  };
};
