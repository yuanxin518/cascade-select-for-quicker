import { DataSourceAPI, DataType } from '../src'
import fs from 'fs'
import path from 'path'

describe('DataSourceAPI', () => {
  const testDbPath = path.join(__dirname, 'test.db')
  let api: DataSourceAPI

  beforeEach(() => {
    // 删除测试数据库
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
    api = new DataSourceAPI(testDbPath)
  })

  afterEach(() => {
    api.close()
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
  })

  describe('标签操作', () => {
    it('应该能创建标签', async () => {
      const tag = await api.createTag({ name: '测试标签', color: '#FF0000' })

      expect(tag.id).toBeGreaterThan(0)
      expect(tag.name).toBe('测试标签')
      expect(tag.color).toBe('#FF0000')
    })

    it('应该能获取标签', async () => {
      const created = await api.createTag({ name: '测试标签' })
      const retrieved = await api.getTag(created.id)

      expect(retrieved).not.toBeNull()
      expect(retrieved?.name).toBe('测试标签')
    })

    it('应该能更新标签', async () => {
      const created = await api.createTag({ name: '旧名称' })
      const updated = await api.updateTag(created.id, { name: '新名称', color: '#00FF00' })

      expect(updated.name).toBe('新名称')
      expect(updated.color).toBe('#00FF00')
    })

    it('应该能删除标签', async () => {
      const created = await api.createTag({ name: '测试标签' })
      await api.deleteTag(created.id)

      const retrieved = await api.getTag(created.id)
      expect(retrieved).toBeNull()
    })

    it('应该能列出所有标签', async () => {
      await api.createTag({ name: '标签1' })
      await api.createTag({ name: '标签2' })

      const tags = await api.listTags()
      expect(tags.length).toBe(2)
    })
  })

  describe('数据项操作', () => {
    it('应该能创建数据项', async () => {
      const tag = await api.createTag({ name: '测试标签' })
      const dataItem = await api.createDataItem({
        title: '测试数据',
        dataType: DataType.ARRAY,
        dataContent: ['item1', 'item2'],
        tagIds: [tag.id],
      })

      expect(dataItem.id).toBeGreaterThan(0)
      expect(dataItem.title).toBe('测试数据')
      expect(dataItem.dataType).toBe(DataType.ARRAY)
    })

    it('应该能获取数据项及其标签', async () => {
      const tag = await api.createTag({ name: '测试标签' })
      const created = await api.createDataItem({
        title: '测试数据',
        dataType: DataType.ARRAY,
        dataContent: ['item1'],
        tagIds: [tag.id],
      })

      const retrieved = await api.getDataItemWithTags(created.id)

      expect(retrieved).not.toBeNull()
      expect(retrieved?.tags.length).toBe(1)
      expect(retrieved?.tags[0].name).toBe('测试标签')
    })

    it('应该能更新数据项', async () => {
      const tag = await api.createTag({ name: '测试标签' })
      const created = await api.createDataItem({
        title: '旧标题',
        dataType: DataType.ARRAY,
        dataContent: ['item1'],
        tagIds: [tag.id],
      })

      const updated = await api.updateDataItem(created.id, {
        title: '新标题',
      })

      expect(updated.title).toBe('新标题')
    })

    it('应该能删除数据项', async () => {
      const tag = await api.createTag({ name: '测试标签' })
      const created = await api.createDataItem({
        title: '测试数据',
        dataType: DataType.ARRAY,
        dataContent: ['item1'],
        tagIds: [tag.id],
      })

      await api.deleteDataItem(created.id)

      const retrieved = await api.getDataItem(created.id)
      expect(retrieved).toBeNull()
    })
  })

  describe('标签查询', () => {
    it('应该能根据标签查询数据项', async () => {
      const tag1 = await api.createTag({ name: '标签1' })
      const tag2 = await api.createTag({ name: '标签2' })

      await api.createDataItem({
        title: '数据1',
        dataType: DataType.ARRAY,
        dataContent: ['item1'],
        tagIds: [tag1.id, tag2.id],
      })

      await api.createDataItem({
        title: '数据2',
        dataType: DataType.ARRAY,
        dataContent: ['item2'],
        tagIds: [tag1.id],
      })

      // 查询同时包含两个标签的数据项
      const results = await api.getDataItemsByTagIds([tag1.id, tag2.id])
      expect(results.length).toBe(1)
      expect(results[0].title).toBe('数据1')
    })

    it('应该能为数据项添加和移除标签', async () => {
      const tag1 = await api.createTag({ name: '标签1' })
      const tag2 = await api.createTag({ name: '标签2' })

      const dataItem = await api.createDataItem({
        title: '测试数据',
        dataType: DataType.ARRAY,
        dataContent: ['item1'],
        tagIds: [tag1.id],
      })

      // 添加标签
      await api.addTagsToDataItem(dataItem.id, [tag2.id])
      let tags = await api.getTagsByDataItemId(dataItem.id)
      expect(tags.length).toBe(2)

      // 移除标签
      await api.removeTagsFromDataItem(dataItem.id, [tag1.id])
      tags = await api.getTagsByDataItemId(dataItem.id)
      expect(tags.length).toBe(1)
      expect(tags[0].name).toBe('标签2')
    })
  })
})
