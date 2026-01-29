import { DatabaseManager } from '../db/database'
import { DataRepository } from '../db/repository'
import type {
  DataItem,
  Tag,
  CreateDataItemDTO,
  UpdateDataItemDTO,
  CreateTagDTO,
  UpdateTagDTO,
  DataItemFilters,
  DataItemWithTags,
} from '../types'
import {
  CreateDataItemSchema,
  UpdateDataItemSchema,
  CreateTagSchema,
  UpdateTagSchema,
  DataItemFiltersSchema,
} from '../types'

export class DataSourceAPI {
  private dbManager: DatabaseManager
  private repository: DataRepository

  constructor(dbPath?: string) {
    this.dbManager = new DatabaseManager(dbPath)
    this.repository = new DataRepository(this.dbManager.getDatabase())
  }

  // ==================== 数据项操作 ====================

  /** 创建数据项 */
  async createDataItem(dto: CreateDataItemDTO): Promise<DataItem> {
    const validated = CreateDataItemSchema.parse(dto)
    return this.repository.createDataItem(validated)
  }

  /** 获取数据项 */
  async getDataItem(id: number): Promise<DataItem | null> {
    return this.repository.getDataItem(id)
  }

  /** 获取数据项及其标签 */
  async getDataItemWithTags(id: number): Promise<DataItemWithTags | null> {
    return this.repository.getDataItemWithTags(id)
  }

  /** 更新数据项 */
  async updateDataItem(id: number, dto: UpdateDataItemDTO): Promise<DataItem> {
    const validated = UpdateDataItemSchema.parse(dto)
    return this.repository.updateDataItem(id, validated)
  }

  /** 删除数据项 */
  async deleteDataItem(id: number): Promise<void> {
    this.repository.deleteDataItem(id)
  }

  /** 列出数据项 */
  async listDataItems(filters?: DataItemFilters): Promise<DataItem[]> {
    if (filters) {
      DataItemFiltersSchema.parse(filters)
    }
    return this.repository.listDataItems(filters)
  }

  /** 列出数据项及其标签 */
  async listDataItemsWithTags(filters?: DataItemFilters): Promise<DataItemWithTags[]> {
    if (filters) {
      DataItemFiltersSchema.parse(filters)
    }
    return this.repository.listDataItemsWithTags(filters)
  }

  // ==================== 标签操作 ====================

  /** 创建标签 */
  async createTag(dto: CreateTagDTO): Promise<Tag> {
    const validated = CreateTagSchema.parse(dto)
    return this.repository.createTag(validated)
  }

  /** 获取标签 */
  async getTag(id: number): Promise<Tag | null> {
    return this.repository.getTag(id)
  }

  /** 根据名称获取标签 */
  async getTagByName(name: string): Promise<Tag | null> {
    return this.repository.getTagByName(name)
  }

  /** 更新标签 */
  async updateTag(id: number, dto: UpdateTagDTO): Promise<Tag> {
    const validated = UpdateTagSchema.parse(dto)
    return this.repository.updateTag(id, validated)
  }

  /** 删除标签 */
  async deleteTag(id: number): Promise<void> {
    this.repository.deleteTag(id)
  }

  /** 列出所有标签 */
  async listTags(): Promise<Tag[]> {
    return this.repository.listTags()
  }

  // ==================== 关联操作 ====================

  /** 为数据项添加标签 */
  async addTagsToDataItem(dataItemId: number, tagIds: number[]): Promise<void> {
    this.repository.addTagsToDataItem(dataItemId, tagIds)
  }

  /** 从数据项移除标签 */
  async removeTagsFromDataItem(dataItemId: number, tagIds: number[]): Promise<void> {
    this.repository.removeTagsFromDataItem(dataItemId, tagIds)
  }

  /** 获取数据项的所有标签 */
  async getTagsByDataItemId(dataItemId: number): Promise<Tag[]> {
    return this.repository.getTagsByDataItemId(dataItemId)
  }

  /** 获取标签关联的所有数据项 */
  async getDataItemsByTagId(tagId: number): Promise<DataItem[]> {
    return this.repository.getDataItemsByTagId(tagId)
  }

  /** 根据多个标签ID查询数据项（AND逻辑） */
  async getDataItemsByTagIds(tagIds: number[]): Promise<DataItemWithTags[]> {
    return this.repository.getDataItemsByTagIds(tagIds)
  }

  // ==================== 工具方法 ====================

  /** 关闭数据库连接 */
  close(): void {
    this.dbManager.close()
  }

  /** 执行事务 */
  transaction<T>(fn: () => T): T {
    return this.dbManager.transaction(fn)
  }
}
