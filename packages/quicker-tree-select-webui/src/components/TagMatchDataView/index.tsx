import type { DataSourceType } from "quicker-tree-select-core/types";
import React from "react";
import {
  TagMatchDataItemRender,
  TagMatchDataItemRenderWrapper,
} from "./TagMatchDataItemRender";

type TagMatchedDataViewProps = {
  dataList: DataSourceType[];
};

export const TagMatchedDataView: React.FC<TagMatchedDataViewProps> = (
  props,
) => {
  const { dataList } = props;

  if (!dataList || !dataList.length) return null;

  return (
    <div className="flex gap-3">
      {dataList.map((dataItem, index) => {
        return (
          <>
            <TagMatchDataItemRenderWrapper>
              <TagMatchDataItemRender key={index} value={dataItem.data} />
            </TagMatchDataItemRenderWrapper>
          </>
        );
      })}
    </div>
  );
};
