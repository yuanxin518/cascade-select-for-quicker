# Quicker Tree Select - 使用指南

## 项目概述

Quicker Tree Select 是一个基于标签的数据过滤和管理系统，包含以下功能：

- 🏷️ 多标签过滤数据
- 💾 SQLite 数据持久化
- 🔄 多种数据源适配器（JSON、CSV、SQLite）
- ✏️ 在线数据编辑
- 🎨 现代化的 Web UI

## 架构

```
packages/
├── quicker-tree-select-core/        # 核心过滤逻辑
├── quicker-tree-select-datasource/  # SQLite 数据管理
├── quicker-tree-select-adapter/     # 数据源适配器
└── quicker-tree-select-webui/       # Web 用户界面
```

## 安装

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm run build
```

## 使用示例

### 1. 使用 SQLite 数据源

```typescript
import { DataSourceAPI } from 'quicker-tree-select-datasource'

// 创建数据源实例
const api = new DataSourceAPI('./data/my-data.db')

// 创建标签
const tag1 = await api.createTag({ name: '工作', color: '#FF0000' })
const tag2 = await api.createTag({ name: '重要', color: '#00FF00' })

// 创建数据项
const dataItem = await api.createDataItem({
  title: '项目文档',
  dataType: 'array',
  dataContent: ['文档1.pdf', '文档2.pdf'],
  tagIds: [tag1.id, tag2.id],
})

// 查询数据
const items = await api.getDataItemsByTagIds([tag1.id, tag2.id])
console.log('匹配的数据:', items)

// 关闭连接
api.close()
```

### 2. 使用适配器转换数据

#### JSON 适配器

```typescript
import { JSONAdapter } from 'quicker-tree-select-adapter'

const adapter = new JSONAdapter()

// 从 JSON 文件导入
const data = await adapter.importFromFile('./data/data.json')

// 导出到 JSON 文件
await adapter.exportToFile(data, './data/exported.json')
```

#### SQLite 适配器

```typescript
import { DataSourceAPI } from 'quicker-tree-select-datasource'
import { SQLiteAdapter, JSONAdapter } from 'quicker-tree-select-adapter'

// 从 JSON 导入到 SQLite
const jsonAdapter = new JSONAdapter()
const sqliteAdapter = new SQLiteAdapter()
const api = new DataSourceAPI('./data/my-data.db')

// 读取 JSON 数据
const jsonData = await jsonAdapter.importFromFile('./data/data.json')

// 导入到数据库
const result = await sqliteAdapter.exportToDatabase(api, jsonData, {
  clearExisting: true,
  title: '导入的数据',
})

console.log(`成功导入 ${result.totalCount} 条数据`)

// 从数据库导出
const dbData = await sqliteAdapter.import(api)
await jsonAdapter.exportToFile(dbData, './data/backup.json')

api.close()
```

#### CSV 适配器

```typescript
import { CSVAdapter } from 'quicker-tree-select-adapter'

const adapter = new CSVAdapter()

// 从 CSV 导入
const data = await adapter.importFromFile('./data/data.csv')

// 导出到 CSV
await adapter.exportToFile(data, './data/exported.csv')
```

### 3. 使用核心过滤功能

```typescript
import { initDataWithState } from 'quicker-tree-select-core'

// 准备数据
const dataSource = [
  {
    tags: ['工作', '重要'],
    data: ['任务1', '任务2'],
  },
  {
    tags: ['工作', '普通'],
    data: ['任务3', '任务4'],
  },
]

// 初始化
const { selectTag, stateData } = initDataWithState(dataSource)

// 选择标签
selectTag('工作')
console.log('匹配的数据:', stateData.result.selectedTagsMatchedData)
console.log('剩余可选标签:', stateData.result.restRelatedTags)

// 继续选择
selectTag('重要')
console.log('匹配的数据:', stateData.result.selectedTagsMatchedData)
```

### 4. Web UI 集成

```typescript
import { DataManager } from './components/DataManager'
import { TagManager } from './components/TagManager'
import { dataSourceService } from './services/datasource-service'

function AdminPanel() {
  const [dataItems, setDataItems] = useState([])
  const [tags, setTags] = useState([])

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const items = await dataSourceService.listDataItemsWithTags()
    const allTags = await dataSourceService.listTags()
    setDataItems(items)
    setTags(allTags)
  }

  return (
    <div>
      <TagManager
        tags={tags}
        onCreateTag={async (name, color) => {
          await dataSourceService.createTag({ name, color })
          await loadData()
        }}
        onUpdateTag={async (id, name, color) => {
          await dataSourceService.updateTag(id, { name, color })
          await loadData()
        }}
        onDeleteTag={async id => {
          await dataSourceService.deleteTag(id)
          await loadData()
        }}
      />

      <DataManager
        dataItems={dataItems}
        availableTags={tags.map(t => t.name)}
        onCreateItem={async data => {
          await dataSourceService.createDataItem(data)
          await loadData()
        }}
        onUpdateItem={async (id, data) => {
          await dataSourceService.updateDataItem(id, data)
          await loadData()
        }}
        onDeleteItem={async id => {
          await dataSourceService.deleteDataItem(id)
          await loadData()
        }}
      />
    </div>
  )
}
```

## 数据格式

### 标准数据格式

```typescript
interface DataSourceType {
  tags: string[] // 标签数组
  data: string[] | Record<string, string> // 数据内容（数组或对象）
}
```

### 示例数据

```json
[
  {
    "tags": ["密码相关", "项目"],
    "data": ["password123", "admin456"]
  },
  {
    "tags": ["密码相关", "个人"],
    "data": {
      "邮箱密码": "email123",
      "银行密码": "bank456"
    }
  }
]
```

## API 参考

### DataSourceAPI

#### 数据项操作

- `createDataItem(dto)` - 创建数据项
- `getDataItem(id)` - 获取数据项
- `getDataItemWithTags(id)` - 获取数据项及其标签
- `updateDataItem(id, dto)` - 更新数据项
- `deleteDataItem(id)` - 删除数据项
- `listDataItems(filters?)` - 列出数据项
- `listDataItemsWithTags(filters?)` - 列出数据项及其标签

#### 标签操作

- `createTag(dto)` - 创建标签
- `getTag(id)` - 获取标签
- `getTagByName(name)` - 根据名称获取标签
- `updateTag(id, dto)` - 更新标签
- `deleteTag(id)` - 删除标签
- `listTags()` - 列出所有标签

#### 关联操作

- `addTagsToDataItem(dataItemId, tagIds)` - 为数据项添加标签
- `removeTagsFromDataItem(dataItemId, tagIds)` - 从数据项移除标签
- `getDataItemsByTagIds(tagIds)` - 根据标签查询数据项（AND 逻辑）

### 适配器

#### JSONAdapter

- `import(source)` - 从 JSON 导入
- `export(data)` - 导出为 JSON
- `importFromFile(filePath)` - 从文件导入
- `exportToFile(data, filePath)` - 导出到文件

#### SQLiteAdapter

- `import(api)` - 从数据库导入
- `exportToDatabase(api, data, options)` - 导出到数据库
- `importByTags(api, tagNames)` - 根据标签过滤导入
- `batchImport(api, data, batchSize)` - 批量导入

#### CSVAdapter

- `import(source)` - 从 CSV 导入
- `export(data)` - 导出为 CSV
- `importFromFile(filePath)` - 从文件导入
- `exportToFile(data, filePath)` - 导出到文件

## 开发

```bash
# 启动 Web UI 开发服务器
pnpm run dev:ui

# 运行测试
pnpm run test

# 格式化代码
pnpm run format
```

## 数据库 Schema

### data_items 表

| 字段         | 类型     | 说明         |
| ------------ | -------- | ------------ |
| id           | INTEGER  | 主键         |
| title        | TEXT     | 标题         |
| data_type    | TEXT     | 数据类型     |
| data_content | TEXT     | JSON 数据    |
| created_at   | DATETIME | 创建时间     |
| updated_at   | DATETIME | 更新时间     |

### tags 表

| 字段       | 类型     | 说明     |
| ---------- | -------- | -------- |
| id         | INTEGER  | 主键     |
| name       | TEXT     | 标签名称 |
| color      | TEXT     | 颜色     |
| created_at | DATETIME | 创建时间 |

### data_item_tags 表

| 字段         | 类型    | 说明       |
| ------------ | ------- | ---------- |
| id           | INTEGER | 主键       |
| data_item_id | INTEGER | 数据项 ID  |
| tag_id       | INTEGER | 标签 ID    |

## 许可证

MIT
