import './App.css'
import { Chip, Label, Separator, Surface, Toast } from '@heroui/react'
import { Xmark } from '@gravity-ui/icons'
import { useQuickerTreeSelectData } from './hooks/use-quicker-tree-select-data'
import { DataWithStateContext } from './context/dataWithStateContext'
import { RestTagSelect } from './components/RestTagSelect'
import React from 'react'
import { TagMatchedDataView } from './components/TagMatchDataView'

function App() {
  const quickerTreeSelectData = useQuickerTreeSelectData()
  const { dataWithState, selectedTags, handleRemoveTag, selectedTagsMatchedData } = quickerTreeSelectData

  /** 数据源总数 */
  const dataSourceCount = dataWithState.dataSource.length

  return (
    <DataWithStateContext.Provider value={quickerTreeSelectData}>
      <Toast.Container />
      <div className="w-full min-h-screen flex items-start justify-center py-4 px-2">
        <Surface
          className="flex w-full min-w-[320px] max-w-full md:max-w-[1000px] gap-3 p-4 sm:p-6 flex-col border rounded-2xl sm:rounded-3xl bg-gray-100 border-gray-200 mx-auto"
          variant="default"
        >
          <Label className="text-[var(--color-primary)] font-bold text-xl">选择标签</Label>
          <RestTagSelect />
          {selectedTags.length === 0 ? null : (
            <React.Fragment>
              <Separator className="my-3" />
              <Label className="text-[var(--color-primary)] font-bold text-xl"> 当前已选标签</Label>
              <div className="flex flex-wrap gap-2 justify-start sm:justify-center">
                {selectedTags.map(tag => (
                  <Chip key={tag} variant="primary" color="accent">
                    {tag}
                    <Xmark className="cursor-pointer" onClick={() => handleRemoveTag(tag)} width={12} />
                  </Chip>
                ))}
              </div>
              <Separator className="my-3" />
              <Label className="text-[var(--color-primary)] font-bold text-xl">
                匹配数据({selectedTagsMatchedData.length}/{dataSourceCount})
              </Label>
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <TagMatchedDataView dataList={selectedTagsMatchedData} />
              </div>
            </React.Fragment>
          )}
        </Surface>
      </div>
    </DataWithStateContext.Provider>
  )
}

export default App
