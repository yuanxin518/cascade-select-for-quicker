# 数据源配置功能使用指南

## 功能概述

WebUI 现在支持灵活的数据源配置，你可以选择以下几种数据源方式：

1. **JSON 文件（本地）** - 从 public 目录加载 JSON 文件
2. **JSON URL（远程）** - 从远程 URL 加载 JSON 数据
3. **SQLite API 服务** - 连接到 SQLite API 后端服务

## 使用方法

### 1. 打开配置界面

在应用右上角点击 **"配置"** 按钮，打开数据源配置弹窗。

### 2. 选择数据源类型

#### 选项 A: JSON 文件（本地）

**适用场景**: 数据文件存放在项目的 public 目录中

**配置步骤**:
1. 选择数据源类型: "JSON 文件（本地）"
2. 输入文件路径（相对于 public 目录）
   - 示例: `/data/data.json`
   - 示例: `/my-data/passwords.json`

**文件位置**:
```
packages/quicker-tree-select-webui/
└── public/
    └── data/
        └── data.json  ← 你的数据文件
```

#### 选项 B: JSON URL（远程）

**适用场景**: 从远程服务器或 API 获取数据

**配置步骤**:
1. 选择数据源类型: "JSON URL（远程）"
2. 输入完整的 URL 地址
   - 示例: `https://api.example.com/data.json`
   - 示例: `http://localhost:8080/api/data`
3. （可选）添加自定义请求头
   ```json
   {
     "Authorization": "Bearer your-token-here",
     "X-Custom-Header": "value"
   }
   ```

**注意事项**:
- 确保 URL 支持 CORS（跨域资源共享）
- 如果需要认证，在请求头中添加 Authorization

#### 选项 C: SQLite API 服务

**适用场景**: 连接到后端 SQLite API 服务器

**配置步骤**:
1. 选择数据源类型: "SQLite API 服务"
2. 输入 API 地址
   - 示例: `http://localhost`
   - 示例: `https://api.example.com`
3. 输入端口号
   - 示例: `3000`
   - 示例: `8080`
4. （可选）输入数据库名称
5. （可选）添加自定义请求头

**API 要求**:

后端服务需要提供以下端点：

```
GET /api/health
- 用于测试连接
- 返回: 200 OK

GET /api/data-items/export
- 用于获取数据
- 返回格式:
[
  {
    "id": 1,
    "title": "数据标题",
    "dataType": "array",
    "dataContent": "[\"item1\", \"item2\"]",
    "tags": [
      { "id": 1, "name": "标签1" },
      { "id": 2, "name": "标签2" }
    ]
  }
]
```

### 3. 测试连接

配置完成后，点击 **"测试连接"** 按钮验证配置是否正确。

- ✅ 连接成功 - 显示绿色提示
- ❌ 连接失败 - 显示红色提示，检查配置

### 4. 保存配置

测试成功后，点击 **"保存配置"** 按钮。

配置会自动保存到浏览器的 localStorage，下次打开应用时会自动加载。

## 数据格式要求

无论使用哪种数据源，返回的数据必须符合以下格式：

```json
[
  {
    "tags": ["标签1", "标签2"],
    "data": ["数据1", "数据2", "数据3"]
  },
  {
    "tags": ["标签1", "标签3"],
    "data": {
      "键1": "值1",
      "键2": "值2"
    }
  }
]
```

### 字段说明

- **tags**: 字符串数组，定义数据项的标签
- **data**: 可以是数组或对象
  - 数组格式: `["item1", "item2"]`
  - 对象格式: `{"key": "value"}`

## 使用示例

### 示例 1: 使用本地 JSON 文件

1. 将数据文件放到 `public/data/my-data.json`
2. 打开配置，选择 "JSON 文件（本地）"
3. 输入路径: `/data/my-data.json`
4. 测试连接 → 保存配置

### 示例 2: 从远程 API 获取数据

1. 打开配置，选择 "JSON URL（远程）"
2. 输入 URL: `https://api.example.com/data`
3. 添加请求头（如果需要）:
   ```json
   {
     "Authorization": "Bearer abc123"
   }
   ```
4. 测试连接 → 保存配置

### 示例 3: 连接 SQLite API 服务

**前提**: 需要先启动后端 API 服务器

#### 启动后端服务器（示例）

创建 `server.ts`:

```typescript
import express from 'express'
import cors from 'cors'
import { DataSourceAPI } from 'quicker-tree-select-datasource'
import { SQLiteAdapter } from 'quicker-tree-select-adapter'

const app = express()
app.use(cors())
app.use(express.json())

const api = new DataSourceAPI('./data/app.db')
const adapter = new SQLiteAdapter()

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 导出数据
app.get('/api/data-items/export', async (req, res) => {
  try {
    const items = await api.listDataItemsWithTags()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

运行服务器:
```bash
npx tsx server.ts
```

#### 配置 WebUI

1. 打开配置，选择 "SQLite API 服务"
2. API 地址: `http://localhost`
3. 端口: `3000`
4. 测试连接 → 保存配置

## 功能特性

### 自动保存

配置会自动保存到浏览器的 localStorage，下次打开应用时会自动加载上次的配置。

### 刷新数据

点击右上角的 **"刷新"** 按钮可以重新加载数据，无需重新配置。

### 错误提示

如果数据加载失败，会显示详细的错误信息，帮助你排查问题。

### 加载状态

数据加载时会显示加载动画，提供更好的用户体验。

## 故障排除

### 问题 1: 连接测试失败

**可能原因**:
- URL 地址错误
- 端口号错误
- 服务器未启动
- CORS 配置问题

**解决方法**:
1. 检查 URL 和端口是否正确
2. 确认服务器正在运行
3. 检查浏览器控制台的错误信息
4. 如果是 CORS 问题，在服务器端添加 CORS 支持

### 问题 2: 数据格式错误

**错误信息**: "Failed to parse data" 或类似错误

**解决方法**:
1. 确认数据格式符合要求
2. 检查 JSON 是否有效
3. 确认 tags 字段是数组
4. 确认 data 字段存在

### 问题 3: 本地文件找不到

**错误信息**: "404 Not Found"

**解决方法**:
1. 确认文件在 `public/` 目录下
2. 路径必须以 `/` 开头
3. 检查文件名大小写

## 高级用法

### 自定义请求头

对于需要认证的 API，可以添加自定义请求头：

```json
{
  "Authorization": "Bearer your-jwt-token",
  "X-API-Key": "your-api-key",
  "Content-Type": "application/json"
}
```

### 多环境配置

你可以为不同环境准备不同的配置：

- **开发环境**: 使用本地 JSON 文件
- **测试环境**: 连接测试服务器
- **生产环境**: 连接生产 API

只需在配置界面切换即可。

## API 参考

### 数据源配置对象

```typescript
// JSON 文件配置
{
  type: 'json_file',
  filePath: '/data/data.json'
}

// JSON URL 配置
{
  type: 'json_url',
  url: 'https://api.example.com/data',
  headers: {
    'Authorization': 'Bearer token'
  }
}

// SQLite API 配置
{
  type: 'sqlite_api',
  apiUrl: 'http://localhost',
  port: 3000,
  database: 'my-db',
  headers: {}
}
```

### localStorage 键

配置保存在 localStorage 中，键名为:
```
quicker-tree-select-datasource-config
```

可以通过浏览器开发者工具查看或清除。

## 相关文档

- [架构设计](./ARCHITECTURE.md)
- [使用指南](./USAGE.md)
- [快速开始](./QUICKSTART.md)

---

**更新时间**: 2026-01-29
**版本**: 1.0.0
