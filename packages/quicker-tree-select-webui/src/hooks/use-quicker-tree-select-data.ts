import { initDataWithState } from 'quicker-tree-select-core'
import { useEffect, useState } from 'react'
import type { DataSourceConfig } from '../types/datasource-config'
import { loadDataSourceConfig, getDefaultDataSourceConfig } from '../types/datasource-config'
import { DataSourceFactory } from '../services/datasource-factory'

export const useQuickerTreeSelectData = () => {
  const [dataWithStateInstance, setDataWithStateInstance] = useState(() => {
    return initDataWithState([])
  })
  const [dataSourceConfig, setDataSourceConfig] = useState<DataSourceConfig>(() => {
    const savedConfig = loadDataSourceConfig()
    // 如果没有保存的配置，或者保存的是 JSON 文件配置，则使用 SQLite API 作为默认配置
    if (!savedConfig || savedConfig.type === 'json_file') {
      const defaultConfig = getDefaultDataSourceConfig()
      // 保存新的默认配置
      import('../types/datasource-config').then(({ saveDataSourceConfig }) => {
        saveDataSourceConfig(defaultConfig)
      })
      return defaultConfig
    }
    return savedConfig
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initDataSource = async (config: DataSourceConfig) => {
    setIsLoading(true)
    setError(null)

    try {
      const dataSource = DataSourceFactory.create(config)
      const data = await dataSource.fetchData()

      // 创建新的实例并更新状态以触发重新渲染
      const newDataWithStateInstance = initDataWithState(data)
      setDataWithStateInstance(newDataWithStateInstance)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data'
      console.error('Failed to load data:', error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    initDataSource(dataSourceConfig)
  }, [])

  /** 切换数据源 */
  const switchDataSource = async (config: DataSourceConfig) => {
    setDataSourceConfig(config)
    await initDataSource(config)
  }

  /** 重新加载数据 */
  const reloadData = async () => {
    await initDataSource(dataSourceConfig)
  }

  const dataWithState = dataWithStateInstance.stateData

  /** 选择一个tag */
  const selectTag = (tag: string) => {
    const data = dataWithStateInstance.selectTag(tag)
    setDataWithStateInstance({
      ...dataWithStateInstance,
      stateData: data,
    })
  }

  /** 选择多个tag */
  const handleSelectTags = (tags: string[]) => {
    dataWithStateInstance.overrideTagList(tags)
    setDataWithStateInstance({
      ...dataWithStateInstance,
      stateData: dataWithStateInstance.stateData,
    })
  }

  /** 已选择的tag */
  const selectedTags = dataWithState.state.selectedTags

  /** 剩余可选tag */
  const restRelatedTags = dataWithState.result.restRelatedTags

  /** 移除一个tag */
  const handleRemoveTag = (tag: string) => {
    handleSelectTags(selectedTags.filter(item => item !== tag))
  }

  const selectedTagsMatchedData = dataWithStateInstance.stateData.result.selectedTagsMatchedData

  return {
    dataWithState,
    selectTag,
    handleSelectTags,
    restRelatedTags,
    selectedTags,
    handleRemoveTag,
    selectedTagsMatchedData,
    dataSourceConfig,
    switchDataSource,
    reloadData,
    isLoading,
    error,
  }
}
