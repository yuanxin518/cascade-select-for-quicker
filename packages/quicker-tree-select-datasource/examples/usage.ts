import { DataSourceAPI } from 'quicker-tree-select-datasource'
import { JSONAdapter, SQLiteAdapter } from 'quicker-tree-select-adapter'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 示例：从 JSON 文件导入数据到 SQLite 数据库
 */
async function importFromJSON() {
  console.log('=== 从 JSON 导入数据到 SQLite ===\n')

  // 1. 创建数据源 API
  const dbPath = path.join(__dirname, '../data/example.db')
  const api = new DataSourceAPI(dbPath)

  try {
    // 2. 使用 JSON 适配器读取数据
    const jsonAdapter = new JSONAdapter()
    const jsonPath = path.join(__dirname, '../data/data.json')
    const standardData = await jsonAdapter.importFromFile(jsonPath)

    console.log(`从 JSON 读取了 ${standardData.length} 条数据`)

    // 3. 使用 SQLite 适配器导入到数据库
    const sqliteAdapter = new SQLiteAdapter()
    const result = await sqliteAdapter.exportToDatabase(api, standardData, {
      clearExisting: true,
      title: '导入数据',
    })

    console.log(`成功导入 ${result.totalCount} 条数据到数据库`)

    // 4. 查询所有标签
    const tags = await api.listTags()
    console.log('\n所有标签:')
    tags.forEach(tag => console.log(`  - ${tag.name} (ID: ${tag.id})`))

    // 5. 查询所有数据项
    const dataItems = await api.listDataItemsWithTags()
    console.log('\n所有数据项:')
    dataItems.forEach(item => {
      console.log(`  - ${item.title}`)
      console.log(`    标签: ${item.tags.map(t => t.name).join(', ')}`)
      console.log(`    数据: ${item.dataContent.substring(0, 50)}...`)
    })
  } finally {
    api.close()
  }
}

/**
 * 示例：从 SQLite 导出数据到 JSON
 */
async function exportToJSON() {
  console.log('\n=== 从 SQLite 导出数据到 JSON ===\n')

  const dbPath = path.join(__dirname, '../data/example.db')
  const api = new DataSourceAPI(dbPath)

  try {
    // 1. 使用 SQLite 适配器读取数据
    const sqliteAdapter = new SQLiteAdapter()
    const standardData = await sqliteAdapter.import(api)

    console.log(`从数据库读取了 ${standardData.length} 条数据`)

    // 2. 使用 JSON 适配器导出
    const jsonAdapter = new JSONAdapter()
    const outputPath = path.join(__dirname, '../data/exported.json')
    await jsonAdapter.exportToFile(standardData, outputPath)

    console.log(`成功导出到 ${outputPath}`)
  } finally {
    api.close()
  }
}

/**
 * 示例：根据标签查询数据
 */
async function queryByTags() {
  console.log('\n=== 根据标签查询数据 ===\n')

  const dbPath = path.join(__dirname, '../data/example.db')
  const api = new DataSourceAPI(dbPath)

  try {
    // 查询包含特定标签的数据
    const sqliteAdapter = new SQLiteAdapter()
    const filteredData = await sqliteAdapter.importByTags(api, ['密码相关', '项目'])

    console.log(`找到 ${filteredData.length} 条匹配的数据:`)
    filteredData.forEach(item => {
      console.log(`  标签: ${item.tags.join(', ')}`)
      console.log(`  数据:`, item.data)
    })
  } finally {
    api.close()
  }
}

/**
 * 示例：CRUD 操作
 */
async function crudOperations() {
  console.log('\n=== CRUD 操作示例 ===\n')

  const dbPath = path.join(__dirname, '../data/example.db')
  const api = new DataSourceAPI(dbPath)

  try {
    // 1. 创建标签
    const tag1 = await api.createTag({ name: '测试标签1', color: '#FF0000' })
    const tag2 = await api.createTag({ name: '测试标签2', color: '#00FF00' })
    console.log('创建了标签:', tag1.name, tag2.name)

    // 2. 创建数据项
    const dataItem = await api.createDataItem({
      title: '测试数据项',
      dataType: 'array' as any,
      dataContent: ['测试1', '测试2', '测试3'],
      tagIds: [tag1.id, tag2.id],
    })
    console.log('创建了数据项:', dataItem.title)

    // 3. 读取数据项
    const retrieved = await api.getDataItemWithTags(dataItem.id)
    console.log('读取数据项:', retrieved?.title, '标签:', retrieved?.tags.map(t => t.name))

    // 4. 更新数据项
    await api.updateDataItem(dataItem.id, {
      title: '更新后的测试数据项',
    })
    console.log('更新了数据项标题')

    // 5. 删除数据项
    await api.deleteDataItem(dataItem.id)
    console.log('删除了数据项')

    // 6. 删除标签
    await api.deleteTag(tag1.id)
    await api.deleteTag(tag2.id)
    console.log('删除了标签')
  } finally {
    api.close()
  }
}

// 运行示例
async function main() {
  try {
    await importFromJSON()
    await exportToJSON()
    await queryByTags()
    await crudOperations()
  } catch (error) {
    console.error('错误:', error)
  }
}

main()
