import './App.css'
import { Button, Chip, Label, Separator, Surface, Toast, Spinner } from '@heroui/react'
import { Xmark, Gear, ArrowRotateRight } from '@gravity-ui/icons'
import { useQuickerTreeSelectData } from './hooks/use-quicker-tree-select-data'
import { DataWithStateContext } from './context/dataWithStateContext'
import { RestTagSelect } from './components/RestTagSelect'
import React, { useState } from 'react'
import { TagMatchedDataView } from './components/TagMatchDataView'
import { DataSourceConfigModal } from './components/DataSourceConfig'
import { DataSourceTypeEnum } from './types/datasource-config'

function App() {
  const quickerTreeSelectData = useQuickerTreeSelectData()
  const { dataWithState, selectedTags, handleRemoveTag, selectedTagsMatchedData, dataSourceConfig, switchDataSource, reloadData, isLoading, error } = quickerTreeSelectData

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  /** 数据源总数 */
  const dataSourceCount = dataWithState.dataSource.length

  /** 获取数据源类型显示名称 */
  const getDataSourceTypeName = () => {
    switch (dataSourceConfig.type) {
      case DataSourceTypeEnum.JSON_FILE:
        return 'JSON 文件'
      case DataSourceTypeEnum.JSON_URL:
        return 'JSON URL'
      case DataSourceTypeEnum.SQLITE_API:
        return 'SQLite API'
      case DataSourceTypeEnum.SQLITE_WASM:
        return 'SQLite WASM'
      default:
        return '未知'
    }
  }

  return (
    <DataWithStateContext.Provider value={quickerTreeSelectData}>
      <Toast.Container />
      <div className="w-full min-h-screen flex items-start justify-center py-4 px-2">
        <Surface
          className="flex w-full min-w-[320px] max-w-full md:max-w-[1000px] gap-3 p-4 sm:p-6 flex-col border rounded-2xl sm:rounded-3xl bg-gray-100 border-gray-200 mx-auto"
          variant="default"
        >
          {/* 头部：标题和数据源配置 */}
          <div className="flex justify-between items-center">
            <Label className="text-[var(--color-primary)] font-bold text-xl">选择标签</Label>
            <div className="flex gap-2 items-center">
              {/* 数据源状态 */}
              <div className="text-sm text-gray-600 hidden sm:block">数据源: {getDataSourceTypeName()}</div>
              {/* 重新加载按钮 */}
              <Button size="sm" variant="ghost" onClick={reloadData} disabled={isLoading} startContent={<ArrowRotateRight width={16} />}>
                刷新
              </Button>
              {/* 配置按钮 */}
              <Button size="sm" variant="secondary" onClick={() => setIsConfigModalOpen(true)} startContent={<Gear width={16} />}>
                配置
              </Button>
            </div>
          </div>

          {/* 加载状态 */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Spinner size="sm" />
              <span className="text-gray-600">加载数据中...</span>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
              <strong>加载失败:</strong> {error}
            </div>
          )}

          {/* 主要内容 */}
          {!isLoading && !error && (
            <>
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
            </>
          )}
        </Surface>
      </div>

      {/* 数据源配置弹窗 */}
      <DataSourceConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} onConfigChange={switchDataSource} currentConfig={dataSourceConfig} />
    </DataWithStateContext.Provider>
  )
}

export default App
