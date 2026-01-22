import type { DataSourceType } from 'quicker-tree-select-core/types'
import React from 'react'
import { TagMatchDataItemRender, TagMatchDataItemRenderWrapper } from './TagMatchDataItemRender'

type TagMatchedDataViewProps = {
  dataList: DataSourceType[]
}

export const TagMatchedDataView: React.FC<TagMatchedDataViewProps> = props => {
  const { dataList } = props

  if (!dataList || !dataList.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
      {dataList.map((dataItem, index) => {
        return (
          <div key={index} className="w-full">
            <TagMatchDataItemRenderWrapper>
              <TagMatchDataItemRender key={index} value={dataItem.data} />
            </TagMatchDataItemRenderWrapper>
          </div>
        )
      })}
    </div>
  )
}
