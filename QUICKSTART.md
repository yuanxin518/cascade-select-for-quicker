# 快速开始指南

## 安装

```bash
# 克隆项目
git clone <repository-url>
cd quicker-tree-select

# 安装依赖
pnpm install
```

## 基础使用

### 1. 启动 Web UI

```bash
pnpm run dev:ui
```

访问 http://localhost:5173 查看界面。

### 2. 使用 SQLite 数据库

创建一个简单的脚本 `example.ts`:

```typescript
import { DataSourceAPI } from 'quicker-tree-select-datasource'

async function main() {
  // 创建数据库实例
  const api = new DataSourceAPI('./data/my-app.db')

  try {
    // 创建标签
    const workTag = await api.createTag({ name: '工作', color: '#FF5733' })
    const urgentTag = await api.createTag({ name: '紧急', color: '#C70039' })

    console.log('创建的标签:', workTag, urgentTag)

    // 创建数据项
    const dataItem = await api.createDataItem({
      title: '项目任务列表',
      dataType: 'array',
      dataContent: ['任务1: 完成设计', '任务2: 代码实现', '任务3: 测试'],
      tagIds: [workTag.id, urgentTag.id],
    })

    console.log('创建的数据项:', dataItem)

    // 查询数据
    const items = await api.getDataItemsByTagIds([workTag.id, urgentTag.id])
    console.log('查询结果:', items)

    // 列出所有标签
    const allTags = await api.listTags()
    console.log('所有标签:', allTags)
  } finally {
    api.close()
  }
}

main()
```

运行：
```bash
npx tsx example.ts
```

### 3. 数据迁移

将现有的 JSON 数据导入到 SQLite：

```bash
# 从 JSON 导入
node scripts/migrate.js import ./data/data.json ./data/app.db --clear

# 导出到 JSON
node scripts/migrate.js export ./data/app.db ./data/backup.json
```

### 4. 使用适配器

```typescript
import { JSONAdapter, SQLiteAdapter } from 'quicker-tree-select-adapter'
import { DataSourceAPI } from 'quicker-tree-select-datasource'

async function convertData() {
  // JSON → SQLite
  const jsonAdapter = new JSONAdapter()
  const sqliteAdapter = new SQLiteAdapter()
  const api = new DataSourceAPI('./data/app.db')

  // 读取 JSON
  const data = await jsonAdapter.importFromFile('./data/input.json')

  // 导入到数据库
  await sqliteAdapter.exportToDatabase(api, data, {
    clearExisting: true,
  })

  // 从数据库导出
  const dbData = await sqliteAdapter.import(api)
  await jsonAdapter.exportToFile(dbData, './data/output.json')

  api.close()
}

convertData()
```

## 常见任务

### 创建标签

```typescript
const tag = await api.createTag({
  name: '重要',
  color: '#FF0000', // 可选
})
```

### 创建数据项（数组类型）

```typescript
const item = await api.createDataItem({
  title: '购物清单',
  dataType: 'array',
  dataContent: ['牛奶', '面包', '鸡蛋'],
  tagIds: [tag.id],
})
```

### 创建数据项（对象类型）

```typescript
const item = await api.createDataItem({
  title: '用户信息',
  dataType: 'object',
  dataContent: {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
  },
  tagIds: [tag.id],
})
```

### 根据标签查询

```typescript
// 查询同时包含多个标签的数据（AND 逻辑）
const items = await api.getDataItemsByTagIds([tag1.id, tag2.id])
```

### 更新数据项

```typescript
await api.updateDataItem(item.id, {
  title: '新标题',
  dataContent: ['新内容1', '新内容2'],
})
```

### 为数据项添加标签

```typescript
await api.addTagsToDataItem(item.id, [newTag.id])
```

### 从数据项移除标签

```typescript
await api.removeTagsFromDataItem(item.id, [oldTag.id])
```

## Web UI 使用

### 标签管理

1. 点击"创建标签"按钮
2. 输入标签名称和颜色
3. 点击"保存"

### 数据管理

1. 点击"创建数据项"按钮
2. 填写标题、选择数据类型
3. 输入 JSON 格式的数据内容
4. 选择标签
5. 点击"保存"

### 数据过滤

1. 在主界面选择标签
2. 系统自动显示匹配的数据
3. 可以继续选择更多标签进行精确过滤

## 数据格式示例

### 数组格式

```json
{
  "tags": ["工作", "项目A"],
  "data": ["任务1", "任务2", "任务3"]
}
```

### 对象格式

```json
{
  "tags": ["密码", "个人"],
  "data": {
    "网站": "example.com",
    "用户名": "user123",
    "密码": "********"
  }
}
```

## 故障排除

### 数据库锁定

如果遇到数据库锁定错误，确保：
- 只有一个进程访问数据库
- 正确调用 `api.close()`

### JSON 解析错误

确保数据内容是有效的 JSON 格式：
- 数组: `["item1", "item2"]`
- 对象: `{"key": "value"}`

### 标签不存在

在创建数据项前，确保标签已经存在：
```typescript
let tag = await api.getTagByName('标签名')
if (!tag) {
  tag = await api.createTag({ name: '标签名' })
}
```

## 下一步

- 查看 [USAGE.md](./USAGE.md) 了解完整 API
- 查看 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解系统设计
- 查看示例代码 `packages/quicker-tree-select-datasource/examples/usage.ts`

## 获取帮助

如有问题，请：
1. 查看文档
2. 查看示例代码
3. 提交 Issue
