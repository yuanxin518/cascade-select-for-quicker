#!/usr/bin/env node

/**
 * 数据迁移脚本
 * 将 JSON 数据迁移到 SQLite 数据库
 *
 * 使用方法:
 * node migrate.js <json-file-path> <db-file-path>
 *
 * 示例:
 * node migrate.js ./data/data.json ./data/quicker-tree-select.db
 */

import { DataSourceAPI } from 'quicker-tree-select-datasource'
import { JSONAdapter, SQLiteAdapter } from 'quicker-tree-select-adapter'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrate(jsonPath: string, dbPath: string, options: { clearExisting?: boolean } = {}) {
  console.log('🚀 开始数据迁移...\n')

  try {
    // 1. 检查 JSON 文件是否存在
    try {
      await fs.access(jsonPath)
    } catch {
      console.error(`❌ JSON 文件不存在: ${jsonPath}`)
      process.exit(1)
    }

    // 2. 创建数据库目录
    const dbDir = path.dirname(dbPath)
    await fs.mkdir(dbDir, { recursive: true })

    // 3. 读取 JSON 数据
    console.log(`📖 读取 JSON 文件: ${jsonPath}`)
    const jsonAdapter = new JSONAdapter()
    const standardData = await jsonAdapter.importFromFile(jsonPath)
    console.log(`✅ 成功读取 ${standardData.length} 条数据\n`)

    // 4. 连接数据库
    console.log(`💾 连接数据库: ${dbPath}`)
    const api = new DataSourceAPI(dbPath)

    try {
      // 5. 导入数据
      console.log('🔄 开始导入数据到数据库...')
      const sqliteAdapter = new SQLiteAdapter()
      const result = await sqliteAdapter.exportToDatabase(api, standardData, {
        clearExisting: options.clearExisting,
        title: '迁移数据',
      })

      console.log(`✅ 成功导入 ${result.totalCount} 条数据\n`)

      // 6. 统计信息
      const tags = await api.listTags()
      const dataItems = await api.listDataItems()

      console.log('📊 迁移统计:')
      console.log(`  - 数据项: ${dataItems.length}`)
      console.log(`  - 标签: ${tags.length}`)
      console.log(`  - 标签列表: ${tags.map(t => t.name).join(', ')}`)

      console.log('\n✨ 迁移完成！')
    } finally {
      api.close()
    }
  } catch (error) {
    console.error('\n❌ 迁移失败:', error)
    process.exit(1)
  }
}

async function exportToJSON(dbPath: string, outputPath: string) {
  console.log('🚀 开始导出数据...\n')

  try {
    // 1. 检查数据库是否存在
    try {
      await fs.access(dbPath)
    } catch {
      console.error(`❌ 数据库文件不存在: ${dbPath}`)
      process.exit(1)
    }

    // 2. 连接数据库
    console.log(`💾 连接数据库: ${dbPath}`)
    const api = new DataSourceAPI(dbPath)

    try {
      // 3. 读取数据
      console.log('📖 读取数据库数据...')
      const sqliteAdapter = new SQLiteAdapter()
      const standardData = await sqliteAdapter.import(api)
      console.log(`✅ 成功读取 ${standardData.length} 条数据\n`)

      // 4. 导出到 JSON
      console.log(`💾 导出到 JSON 文件: ${outputPath}`)
      const jsonAdapter = new JSONAdapter()
      await jsonAdapter.exportToFile(standardData, outputPath)

      console.log('\n✨ 导出完成！')
    } finally {
      api.close()
    }
  } catch (error) {
    console.error('\n❌ 导出失败:', error)
    process.exit(1)
  }
}

// 命令行参数处理
const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
数据迁移工具

用法:
  # 从 JSON 导入到 SQLite
  node migrate.js import <json-file> <db-file> [--clear]

  # 从 SQLite 导出到 JSON
  node migrate.js export <db-file> <json-file>

选项:
  --clear    清空数据库中的现有数据

示例:
  node migrate.js import ./data/data.json ./data/app.db
  node migrate.js import ./data/data.json ./data/app.db --clear
  node migrate.js export ./data/app.db ./data/backup.json
  `)
  process.exit(0)
}

const command = args[0]

if (command === 'import') {
  const jsonPath = args[1]
  const dbPath = args[2]
  const clearExisting = args.includes('--clear')

  if (!jsonPath || !dbPath) {
    console.error('❌ 请提供 JSON 文件路径和数据库文件路径')
    process.exit(1)
  }

  migrate(jsonPath, dbPath, { clearExisting })
} else if (command === 'export') {
  const dbPath = args[1]
  const jsonPath = args[2]

  if (!dbPath || !jsonPath) {
    console.error('❌ 请提供数据库文件路径和 JSON 文件路径')
    process.exit(1)
  }

  exportToJSON(dbPath, jsonPath)
} else {
  console.error(`❌ 未知命令: ${command}`)
  console.log('使用 --help 查看帮助')
  process.exit(1)
}
