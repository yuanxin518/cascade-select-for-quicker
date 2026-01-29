import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { DataSourceAPI } from 'quicker-tree-select-datasource'
import { JSONAdapter, SQLiteAdapter } from 'quicker-tree-select-adapter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// 数据库路径
const dbPath = path.join(__dirname, '../data/quicker-tree-select.db')
console.log('Database path:', dbPath)

// 初始化数据源 API
const api = new DataSourceAPI(dbPath)
const sqliteAdapter = new SQLiteAdapter()

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbPath,
  })
})

// 获取所有数据项（带标签）
app.get('/api/data-items', async (req, res) => {
  try {
    const items = await api.listDataItemsWithTags()
    res.json(items)
  } catch (error) {
    console.error('Error fetching data items:', error)
    res.status(500).json({
      error: 'Failed to fetch data items',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 导出数据（标准格式）
app.get('/api/data-items/export', async (req, res) => {
  try {
    const items = await api.listDataItemsWithTags()
    res.json(items)
  } catch (error) {
    console.error('Error exporting data:', error)
    res.status(500).json({
      error: 'Failed to export data',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 获取单个数据项
app.get('/api/data-items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const item = await api.getDataItemWithTags(id)

    if (!item) {
      return res.status(404).json({ error: 'Data item not found' })
    }

    res.json(item)
  } catch (error) {
    console.error('Error fetching data item:', error)
    res.status(500).json({
      error: 'Failed to fetch data item',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 创建数据项
app.post('/api/data-items', async (req, res) => {
  try {
    const item = await api.createDataItem(req.body)
    res.status(201).json(item)
  } catch (error) {
    console.error('Error creating data item:', error)
    res.status(500).json({
      error: 'Failed to create data item',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 更新数据项
app.put('/api/data-items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const item = await api.updateDataItem(id, req.body)
    res.json(item)
  } catch (error) {
    console.error('Error updating data item:', error)
    res.status(500).json({
      error: 'Failed to update data item',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 删除数据项
app.delete('/api/data-items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    await api.deleteDataItem(id)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting data item:', error)
    res.status(500).json({
      error: 'Failed to delete data item',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 获取所有标签
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await api.listTags()
    res.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({
      error: 'Failed to fetch tags',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 创建标签
app.post('/api/tags', async (req, res) => {
  try {
    const tag = await api.createTag(req.body)
    res.status(201).json(tag)
  } catch (error) {
    console.error('Error creating tag:', error)
    res.status(500).json({
      error: 'Failed to create tag',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 更新标签
app.put('/api/tags/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const tag = await api.updateTag(id, req.body)
    res.json(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
    res.status(500).json({
      error: 'Failed to update tag',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 删除标签
app.delete('/api/tags/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    await api.deleteTag(id)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting tag:', error)
    res.status(500).json({
      error: 'Failed to delete tag',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 根据标签查询数据项
app.post('/api/data-items/by-tags', async (req, res) => {
  try {
    const { tagIds } = req.body
    const items = await api.getDataItemsByTagIds(tagIds)
    res.json(items)
  } catch (error) {
    console.error('Error fetching data items by tags:', error)
    res.status(500).json({
      error: 'Failed to fetch data items by tags',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Quicker Tree Select API Server                           ║
╠════════════════════════════════════════════════════════════╣
║  Status: Running                                           ║
║  Port: ${PORT}                                                ║
║  Database: ${dbPath.substring(dbPath.length - 40)}  ║
║                                                            ║
║  Endpoints:                                                ║
║  - GET  /api/health                                        ║
║  - GET  /api/data-items                                    ║
║  - GET  /api/data-items/export                             ║
║  - GET  /api/tags                                          ║
║                                                            ║
║  Access: http://localhost:${PORT}                             ║
╚════════════════════════════════════════════════════════════╝
  `)
})

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\nShutting down server...')
  api.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\nShutting down server...')
  api.close()
  process.exit(0)
})
