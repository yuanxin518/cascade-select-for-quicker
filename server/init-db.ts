import { DataSourceAPI } from 'quicker-tree-select-datasource'
import { JSONAdapter, SQLiteAdapter } from 'quicker-tree-select-adapter'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function initDatabase() {
  console.log('🚀 初始化 SQLite 数据库...\n')

  // 数据库路径
  const dbPath = path.join(__dirname, '../data/quicker-tree-select.db')
  console.log(`📁 数据库路径: ${dbPath}\n`)

  // 创建数据源 API
  const api = new DataSourceAPI(dbPath)

  try {
    // 检查是否已有数据
    const existingTags = await api.listTags()
    if (existingTags.length > 0) {
      console.log(`⚠️  数据库已包含 ${existingTags.length} 个标签`)
      const readline = await import('readline')
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const answer = await new Promise<string>(resolve => {
        rl.question('是否清空现有数据并重新导入？(y/N): ', resolve)
      })
      rl.close()

      if (answer.toLowerCase() !== 'y') {
        console.log('❌ 取消导入')
        api.close()
        return
      }

      // 清空现有数据
      console.log('\n🗑️  清空现有数据...')
      const items = await api.listDataItems()
      for (const item of items) {
        await api.deleteDataItem(item.id)
      }
      const tags = await api.listTags()
      for (const tag of tags) {
        await api.deleteTag(tag.id)
      }
      console.log('✅ 已清空\n')
    }

    // 从 JSON 文件读取数据
    const jsonPath = path.join(__dirname, '../packages/quicker-tree-select-webui/public/data/data.json')
    console.log(`📖 读取 JSON 数据: ${jsonPath}`)

    const jsonAdapter = new JSONAdapter()
    const standardData = await jsonAdapter.importFromFile(jsonPath)
    console.log(`✅ 读取了 ${standardData.length} 条数据\n`)

    // 导入到数据库
    console.log('💾 导入数据到 SQLite...')
    const sqliteAdapter = new SQLiteAdapter()
    const result = await sqliteAdapter.exportToDatabase(api, standardData, {
      clearExisting: false,
      title: '示例数据',
    })

    console.log(`✅ 成功导入 ${result.totalCount} 条数据\n`)

    // 统计信息
    const tags = await api.listTags()
    const dataItems = await api.listDataItems()

    console.log('📊 数据库统计:')
    console.log(`  - 数据项: ${dataItems.length}`)
    console.log(`  - 标签: ${tags.length}`)
    console.log(`\n📋 标签列表:`)
    tags.forEach(tag => {
      console.log(`  - ${tag.name} (ID: ${tag.id})`)
    })

    console.log('\n✨ 初始化完成！')
    console.log('\n下一步:')
    console.log('  1. 启动 API 服务器: cd server && pnpm start')
    console.log('  2. 在 WebUI 中配置 SQLite API 数据源')
  } catch (error) {
    console.error('\n❌ 初始化失败:', error)
    throw error
  } finally {
    api.close()
  }
}

initDatabase().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
