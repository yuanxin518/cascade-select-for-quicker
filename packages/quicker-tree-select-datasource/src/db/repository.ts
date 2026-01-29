import type Database from 'better-sqlite3'
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
import { DataType } from '../types'

export class DataRepository {
  constructor(private db: Database.Database) {}

  // ==================== 数据项操作 ====================

  /** 创建数据项 */
  createDataItem(dto: CreateDataItemDTO): DataItem {
    const dataContent = JSON.stringify(dto.dataContent)
    const stmt = this.db.prepare(`
      INSERT INTO data_items (title, data_type, data_content)
      VALUES (?, ?, ?)
    `)

    const result = stmt.run(dto.title, dto.dataType, dataContent)
    const dataItemId = result.lastInsertRowid as number

    // 如果有标签，添加关联
    if (dto.tagIds && dto.tagIds.length > 0) {
      this.addTagsToDataItem(dataItemId, dto.tagIds)
    }

    return this.getDataItem(dataItemId)!
  }

  /** 获取数据项 */
  getDataItem(id: number): DataItem | null {
    const stmt = this.db.prepare(`
      SELECT id, title, data_type as dataType, data_content as dataContent,
             created_at as createdAt, updated_at as updatedAt
      FROM data_items
      WHERE id = ?
    `)
    return stmt.get(id) as DataItem | null
  }

  /** 获取数据项及其标签 */
  getDataItemWithTags(id: number): DataItemWithTags | null {
    const dataItem = this.getDataItem(id)
    if (!dataItem) return null

    const tags = this.getTagsByDataItemId(id)
    return { ...dataItem, tags }
  }

  /** 更新数据项 */
  updateDataItem(id: number, dto: UpdateDataItemDTO): DataItem {
    const updates: string[] = []
    const values: any[] = []

    if (dto.title !== undefined) {
      updates.push('title = ?')
      values.push(dto.title)
    }
    if (dto.dataType !== undefined) {
      updates.push('data_type = ?')
      values.push(dto.dataType)
    }
    if (dto.dataContent !== undefined) {
      updates.push('data_content = ?')
      values.push(JSON.stringify(dto.dataContent))
    }

    if (updates.length === 0) {
      return this.getDataItem(id)!
    }

    values.push(id)
    const stmt = this.db.prepare(`
      UPDATE data_items
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)

    return this.getDataItem(id)!
  }

  /** 删除数据项 */
  deleteDataItem(id: number): void {
    const stmt = this.db.prepare('DELETE FROM data_items WHERE id = ?')
    stmt.run(id)
  }

  /** 列出数据项 */
  listDataItems(filters?: DataItemFilters): DataItem[] {
    let query = `
      SELECT DISTINCT di.id, di.title, di.data_type as dataType,
             di.data_content as dataContent,
             di.created_at as createdAt, di.updated_at as updatedAt
      FROM data_items di
    `
    const conditions: string[] = []
    const values: any[] = []

    if (filters?.tagIds && filters.tagIds.length > 0) {
      query += `
        INNER JOIN data_item_tags dit ON di.id = dit.data_item_id
      `
      conditions.push(`dit.tag_id IN (${filters.tagIds.map(() => '?').join(',')})`)
      values.push(...filters.tagIds)
    }

    if (filters?.title) {
      conditions.push('di.title LIKE ?')
      values.push(`%${filters.title}%`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += ' ORDER BY di.updated_at DESC'

    const stmt = this.db.prepare(query)
    return stmt.all(...values) as DataItem[]
  }

  /** 列出数据项及其标签 */
  listDataItemsWithTags(filters?: DataItemFilters): DataItemWithTags[] {
    const dataItems = this.listDataItems(filters)
    return dataItems.map(item => ({
      ...item,
      tags: this.getTagsByDataItemId(item.id),
    }))
  }

  // ==================== 标签操作 ====================

  /** 创建标签 */
  createTag(dto: CreateTagDTO): Tag {
    const stmt = this.db.prepare(`
      INSERT INTO tags (name, color)
      VALUES (?, ?)
    `)
    const result = stmt.run(dto.name, dto.color || null)
    const tagId = result.lastInsertRowid as number

    return this.getTag(tagId)!
  }

  /** 获取标签 */
  getTag(id: number): Tag | null {
    const stmt = this.db.prepare(`
      SELECT id, name, color, created_at as createdAt
      FROM tags
      WHERE id = ?
    `)
    return stmt.get(id) as Tag | null
  }

  /** 根据名称获取标签 */
  getTagByName(name: string): Tag | null {
    const stmt = this.db.prepare(`
      SELECT id, name, color, created_at as createdAt
      FROM tags
      WHERE name = ?
    `)
    return stmt.get(name) as Tag | null
  }

  /** 更新标签 */
  updateTag(id: number, dto: UpdateTagDTO): Tag {
    const updates: string[] = []
    const values: any[] = []

    if (dto.name !== undefined) {
      updates.push('name = ?')
      values.push(dto.name)
    }
    if (dto.color !== undefined) {
      updates.push('color = ?')
      values.push(dto.color)
    }

    if (updates.length === 0) {
      return this.getTag(id)!
    }

    values.push(id)
    const stmt = this.db.prepare(`
      UPDATE tags
      SET ${updates.join(', ')}
      WHERE id = ?
    `)
    stmt.run(...values)

    return this.getTag(id)!
  }

  /** 删除标签 */
  deleteTag(id: number): void {
    const stmt = this.db.prepare('DELETE FROM tags WHERE id = ?')
    stmt.run(id)
  }

  /** 列出所有标签 */
  listTags(): Tag[] {
    const stmt = this.db.prepare(`
      SELECT id, name, color, created_at as createdAt
      FROM tags
      ORDER BY name
    `)
    return stmt.all() as Tag[]
  }

  // ==================== 关联操作 ====================

  /** 为数据项添加标签 */
  addTagsToDataItem(dataItemId: number, tagIds: number[]): void {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO data_item_tags (data_item_id, tag_id)
      VALUES (?, ?)
    `)

    for (const tagId of tagIds) {
      stmt.run(dataItemId, tagId)
    }
  }

  /** 从数据项移除标签 */
  removeTagsFromDataItem(dataItemId: number, tagIds: number[]): void {
    const placeholders = tagIds.map(() => '?').join(',')
    const stmt = this.db.prepare(`
      DELETE FROM data_item_tags
      WHERE data_item_id = ? AND tag_id IN (${placeholders})
    `)
    stmt.run(dataItemId, ...tagIds)
  }

  /** 获取数据项的所有标签 */
  getTagsByDataItemId(dataItemId: number): Tag[] {
    const stmt = this.db.prepare(`
      SELECT t.id, t.name, t.color, t.created_at as createdAt
      FROM tags t
      INNER JOIN data_item_tags dit ON t.id = dit.tag_id
      WHERE dit.data_item_id = ?
      ORDER BY t.name
    `)
    return stmt.all(dataItemId) as Tag[]
  }

  /** 获取标签关联的所有数据项 */
  getDataItemsByTagId(tagId: number): DataItem[] {
    const stmt = this.db.prepare(`
      SELECT di.id, di.title, di.data_type as dataType,
             di.data_content as dataContent,
             di.created_at as createdAt, di.updated_at as updatedAt
      FROM data_items di
      INNER JOIN data_item_tags dit ON di.id = dit.data_item_id
      WHERE dit.tag_id = ?
      ORDER BY di.updated_at DESC
    `)
    return stmt.all(tagId) as DataItem[]
  }

  /** 根据多个标签ID查询数据项（AND逻辑） */
  getDataItemsByTagIds(tagIds: number[]): DataItemWithTags[] {
    if (tagIds.length === 0) {
      return this.listDataItemsWithTags()
    }

    // 使用 HAVING COUNT 确保数据项包含所有指定的标签
    const placeholders = tagIds.map(() => '?').join(',')
    const stmt = this.db.prepare(`
      SELECT di.id, di.title, di.data_type as dataType,
             di.data_content as dataContent,
             di.created_at as createdAt, di.updated_at as updatedAt
      FROM data_items di
      INNER JOIN data_item_tags dit ON di.id = dit.data_item_id
      WHERE dit.tag_id IN (${placeholders})
      GROUP BY di.id
      HAVING COUNT(DISTINCT dit.tag_id) = ?
      ORDER BY di.updated_at DESC
    `)

    const dataItems = stmt.all(...tagIds, tagIds.length) as DataItem[]
    return dataItems.map(item => ({
      ...item,
      tags: this.getTagsByDataItemId(item.id),
    }))
  }
}
