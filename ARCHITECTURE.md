# Quicker Tree Select 架构设计

## 整体架构

```
quicker-tree-select/
├── packages/
│   ├── quicker-tree-select-core/      # 核心逻辑（已存在）
│   ├── quicker-tree-select-datasource/ # 数据源管理（新增）
│   ├── quicker-tree-select-adapter/    # 数据适配器（新增）
│   └── quicker-tree-select-webui/      # Web界面（扩展）
```

## 包职责划分

### 1. quicker-tree-select-datasource
**职责**: 数据持久化和管理
- SQLite 数据库操作
- CRUD API
- 数据迁移和备份

### 2. quicker-tree-select-adapter
**职责**: 数据源适配和转换
- JSON 文件适配器
- SQLite 适配器
- 其他数据源适配器（CSV, API等）
- 统一的数据接口

### 3. quicker-tree-select-webui
**职责**: 用户界面（扩展功能）
- 数据展示（已有）
- 在线编辑功能（新增）
- 标签管理（新增）
- 数据导入导出（新增）

## 数据库设计

### SQLite Schema

#### 表: data_items
存储数据项
```sql
CREATE TABLE data_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                    -- 数据标题
  data_type TEXT NOT NULL CHECK(data_type IN ('array', 'object')), -- 数据类型
  data_content TEXT NOT NULL,             -- JSON格式存储的数据内容
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 表: tags
存储所有标签
```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,              -- 标签名称
  color TEXT,                             -- 标签颜色（可选）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 表: data_item_tags
数据项和标签的多对多关系
```sql
CREATE TABLE data_item_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_item_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (data_item_id) REFERENCES data_items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(data_item_id, tag_id)
);
```

#### 索引
```sql
CREATE INDEX idx_data_item_tags_data_item ON data_item_tags(data_item_id);
CREATE INDEX idx_data_item_tags_tag ON data_item_tags(tag_id);
CREATE INDEX idx_tags_name ON tags(name);
```

## 数据流

### 读取流程
```
SQLite DB → Datasource → Adapter → Core → WebUI
```

### 写入流程
```
WebUI → Datasource API → SQLite DB
```

### 适配器转换流程
```
External Source → Adapter → Standard Format → Datasource/Core
```

## API 设计

### Datasource API

```typescript
interface DataSourceAPI {
  // 数据项操作
  createDataItem(item: CreateDataItemDTO): Promise<DataItem>
  updateDataItem(id: number, item: UpdateDataItemDTO): Promise<DataItem>
  deleteDataItem(id: number): Promise<void>
  getDataItem(id: number): Promise<DataItem | null>
  listDataItems(filters?: DataItemFilters): Promise<DataItem[]>
  
  // 标签操作
  createTag(tag: CreateTagDTO): Promise<Tag>
  updateTag(id: number, tag: UpdateTagDTO): Promise<Tag>
  deleteTag(id: number): Promise<void>
  listTags(): Promise<Tag[]>
  
  // 关联操作
  addTagsToDataItem(dataItemId: number, tagIds: number[]): Promise<void>
  removeTagsFromDataItem(dataItemId: number, tagIds: number[]): Promise<void>
  
  // 查询操作
  getDataItemsByTags(tagIds: number[]): Promise<DataItem[]>
}
```

### Adapter API

```typescript
interface DataAdapter {
  // 从外部源读取并转换为标准格式
  import(source: any): Promise<DataSourceType[]>
  
  // 将标准格式导出为外部格式
  export(data: DataSourceType[]): Promise<any>
}
```

## 技术栈

### quicker-tree-select-datasource
- better-sqlite3: SQLite 数据库
- TypeScript
- Zod: 数据验证

### quicker-tree-select-adapter
- TypeScript
- 支持多种数据格式解析

### quicker-tree-select-webui (扩展)
- 新增组件: 数据编辑器、标签管理器
- 表单验证
- 状态管理增强
