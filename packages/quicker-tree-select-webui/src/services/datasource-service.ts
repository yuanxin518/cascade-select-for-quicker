/**
 * 数据源 API 服务
 * 这是一个模拟的 API 服务，实际使用时需要连接到后端服务器
 */

export interface Tag {
  id: number
  name: string
  color?: string | null
  createdAt: string
}

export interface DataItem {
  id: number
  title: string
  dataType: 'array' | 'object'
  dataContent: string
  createdAt: string
  updatedAt: string
}

export interface DataItemWithTags extends DataItem {
  tags: Tag[]
}

export interface CreateDataItemDTO {
  title: string
  dataType: 'array' | 'object'
  dataContent: any
  tagIds?: number[]
}

export interface UpdateDataItemDTO {
  title?: string
  dataType?: 'array' | 'object'
  dataContent?: any
}

export interface CreateTagDTO {
  name: string
  color?: string
}

export interface UpdateTagDTO {
  name?: string
  color?: string
}

class DataSourceService {
  private baseUrl = '/api' // 实际使用时配置真实的 API 地址

  // ==================== 数据项操作 ====================

  async createDataItem(dto: CreateDataItemDTO): Promise<DataItem> {
    // TODO: 实现真实的 API 调用
    // const response = await fetch(`${this.baseUrl}/data-items`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dto),
    // })
    // return response.json()

    // 模拟实现
    console.log('Creating data item:', dto)
    return {
      id: Date.now(),
      title: dto.title,
      dataType: dto.dataType,
      dataContent: JSON.stringify(dto.dataContent),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  async getDataItem(id: number): Promise<DataItem | null> {
    // TODO: 实现真实的 API 调用
    console.log('Getting data item:', id)
    return null
  }

  async getDataItemWithTags(id: number): Promise<DataItemWithTags | null> {
    // TODO: 实现真实的 API 调用
    console.log('Getting data item with tags:', id)
    return null
  }

  async updateDataItem(id: number, dto: UpdateDataItemDTO): Promise<DataItem> {
    // TODO: 实现真实的 API 调用
    console.log('Updating data item:', id, dto)
    return {
      id,
      title: dto.title || '',
      dataType: dto.dataType || 'array',
      dataContent: JSON.stringify(dto.dataContent),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  async deleteDataItem(id: number): Promise<void> {
    // TODO: 实现真实的 API 调用
    console.log('Deleting data item:', id)
  }

  async listDataItems(): Promise<DataItem[]> {
    // TODO: 实现真实的 API 调用
    console.log('Listing data items')
    return []
  }

  async listDataItemsWithTags(): Promise<DataItemWithTags[]> {
    // TODO: 实现真实的 API 调用
    console.log('Listing data items with tags')
    return []
  }

  // ==================== 标签操作 ====================

  async createTag(dto: CreateTagDTO): Promise<Tag> {
    // TODO: 实现真实的 API 调用
    console.log('Creating tag:', dto)
    return {
      id: Date.now(),
      name: dto.name,
      color: dto.color,
      createdAt: new Date().toISOString(),
    }
  }

  async getTag(id: number): Promise<Tag | null> {
    // TODO: 实现真实的 API 调用
    console.log('Getting tag:', id)
    return null
  }

  async updateTag(id: number, dto: UpdateTagDTO): Promise<Tag> {
    // TODO: 实现真实的 API 调用
    console.log('Updating tag:', id, dto)
    return {
      id,
      name: dto.name || '',
      color: dto.color,
      createdAt: new Date().toISOString(),
    }
  }

  async deleteTag(id: number): Promise<void> {
    // TODO: 实现真实的 API 调用
    console.log('Deleting tag:', id)
  }

  async listTags(): Promise<Tag[]> {
    // TODO: 实现真实的 API 调用
    console.log('Listing tags')
    return []
  }

  // ==================== 关联操作 ====================

  async addTagsToDataItem(dataItemId: number, tagIds: number[]): Promise<void> {
    // TODO: 实现真实的 API 调用
    console.log('Adding tags to data item:', dataItemId, tagIds)
  }

  async removeTagsFromDataItem(dataItemId: number, tagIds: number[]): Promise<void> {
    // TODO: 实现真实的 API 调用
    console.log('Removing tags from data item:', dataItemId, tagIds)
  }

  async getDataItemsByTagIds(tagIds: number[]): Promise<DataItemWithTags[]> {
    // TODO: 实现真实的 API 调用
    console.log('Getting data items by tag IDs:', tagIds)
    return []
  }
}

export const dataSourceService = new DataSourceService()
