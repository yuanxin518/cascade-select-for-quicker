import type { DataSourceType } from 'quicker-tree-select-core/types'
import { DataSourceAPI, DataType } from 'quicker-tree-select-datasource'
import type { DataItemWithTags, CreateDataItemDTO } from 'quicker-tree-select-datasource'
import type { DataAdapter, SQLiteAdapterOutput, AdapterOptions } from '../types'

export class SQLiteAdapter implements DataAdapter<DataSourceAPI, SQLiteAdapterOutput> {
  constructor(private options?: AdapterOptions) {}

  async import(api: DataSourceAPI): Promise<DataSourceType[]> {
    const dataItems = await api.listDataItemsWithTags()
    return dataItems.map((item: DataItemWithTags) => this.convertToStandardFormat(item))
  }

  async export(data: DataSourceType[]): Promise<SQLiteAdapterOutput> {
    throw new Error('Export to SQLite requires a DataSourceAPI instance. Use exportToDatabase() instead.')
  }

  async exportToDatabase(
    api: DataSourceAPI,
    data: DataSourceType[],
    options?: {
      clearExisting?: boolean
      title?: string
    },
  ): Promise<SQLiteAdapterOutput> {
    if (options?.clearExisting) {
      const existingItems = await api.listDataItems()
      for (const item of existingItems) {
        await api.deleteDataItem(item.id)
      }
    }

    const createdItems: DataItemWithTags[] = []

    for (const item of data) {
      const dataItem = await this.createDataItemFromStandard(api, item, options?.title)
      createdItems.push(dataItem)
    }

    return {
      dataItems: createdItems,
      totalCount: createdItems.length,
    }
  }

  private convertToStandardFormat(item: DataItemWithTags): DataSourceType {
    let dataContent: any
    try {
      dataContent = JSON.parse(item.dataContent)
    } catch {
      dataContent = item.dataContent
    }

    return {
      tags: item.tags.map(tag => tag.name),
      data: dataContent,
    }
  }

  private async createDataItemFromStandard(api: DataSourceAPI, item: DataSourceType, titlePrefix?: string): Promise<DataItemWithTags> {
    const tagIds: number[] = []
    for (const tagName of item.tags) {
      let tag = await api.getTagByName(tagName)
      if (!tag) {
        tag = await api.createTag({ name: tagName })
      }
      tagIds.push(tag.id)
    }

    const dataType = Array.isArray(item.data) ? DataType.ARRAY : DataType.OBJECT

    const title = titlePrefix ? `${titlePrefix} - ${item.tags.join(', ')}` : `Data: ${item.tags.slice(0, 2).join(', ')}${item.tags.length > 2 ? '...' : ''}`

    const dto: CreateDataItemDTO = {
      title,
      dataType,
      dataContent: item.data as any, // 类型转换
      tagIds,
    }

    const dataItem = await api.createDataItem(dto)
    const dataItemWithTags = await api.getDataItemWithTags(dataItem.id)

    if (!dataItemWithTags) {
      throw new Error(`Failed to retrieve created data item with id ${dataItem.id}`)
    }

    return dataItemWithTags
  }
}
