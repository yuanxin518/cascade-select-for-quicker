# 项目结构

```
quicker-tree-select/
├── packages/
│   ├── quicker-tree-select-core/           # 核心过滤逻辑包
│   │   ├── core/
│   │   │   ├── quicker-tree-select.ts      # 核心过滤算法
│   │   │   ├── types.ts                    # 类型定义
│   │   │   └── test/
│   │   │       └── quicker-tree-select.test.ts
│   │   ├── data/
│   │   │   └── data.json                   # 示例数据
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── rollup.config.ts
│   │
│   ├── quicker-tree-select-datasource/     # SQLite 数据管理包
│   │   ├── src/
│   │   │   ├── db/
│   │   │   │   ├── database.ts             # 数据库初始化
│   │   │   │   └── repository.ts           # 数据访问层
│   │   │   ├── api/
│   │   │   │   └── datasource-api.ts       # API 层
│   │   │   ├── types/
│   │   │   │   └── index.ts                # 类型定义和验证
│   │   │   ├── __tests__/
│   │   │   │   └── datasource-api.test.ts  # 单元测试
│   │   │   └── index.ts                    # 入口文件
│   │   ├── examples/
│   │   │   └── usage.ts                    # 使用示例
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── jest.config.ts
│   │
│   ├── quicker-tree-select-adapter/        # 数据适配器包
│   │   ├── src/
│   │   │   ├── adapters/
│   │   │   │   ├── json-adapter.ts         # JSON 适配器
│   │   │   │   ├── sqlite-adapter.ts       # SQLite 适配器
│   │   │   │   └── csv-adapter.ts          # CSV 适配器
│   │   │   ├── types/
│   │   │   │   └── index.ts                # 类型定义
│   │   │   ├── __tests__/
│   │   │   │   └── json-adapter.test.ts    # 单元测试
│   │   │   └── index.ts                    # 入口文件
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── jest.config.ts
│   │
│   └── quicker-tree-select-webui/          # Web UI 包
│       ├── src/
│       │   ├── components/
│       │   │   ├── DataManager/
│       │   │   │   ├── index.tsx           # 数据管理组件
│       │   │   │   └── DataItemEditor.tsx  # 数据编辑器
│       │   │   ├── TagManager/
│       │   │   │   └── index.tsx           # 标签管理组件
│       │   │   ├── RestTagSelect.tsx       # 标签选择器
│       │   │   └── TagMatchDataView/       # 数据展示
│       │   │       ├── index.tsx
│       │   │       └── TagMatchDataItemRender.tsx
│       │   ├── context/
│       │   │   ├── dataWithStateContext.ts # 数据状态上下文
│       │   │   └── triggerEventsContext.ts # 事件上下文
│       │   ├── hooks/
│       │   │   └── use-quicker-tree-select-data.ts
│       │   ├── providers/
│       │   │   └── data-fetcher-provider.ts
│       │   ├── services/
│       │   │   └── datasource-service.ts   # API 服务
│       │   ├── App.tsx                     # 主应用
│       │   ├── main.tsx                    # 入口
│       │   └── App.css
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── index.html
│
├── scripts/
│   └── migrate.ts                          # 数据迁移脚本
│
├── docs/                                   # 文档目录
│   ├── ARCHITECTURE.md                     # 架构设计
│   ├── USAGE.md                            # 使用指南
│   ├── QUICKSTART.md                       # 快速开始
│   └── SUMMARY.md                          # 项目总结
│
├── .gitignore
├── package.json                            # 根 package.json
├── pnpm-workspace.yaml                     # pnpm 工作区配置
├── README.md                               # 项目说明
└── home.png                                # 效果图

```

## 包依赖关系

```
quicker-tree-select-webui
    ├── quicker-tree-select-core
    ├── quicker-tree-select-datasource (可选)
    └── quicker-tree-select-adapter (可选)

quicker-tree-select-adapter
    ├── quicker-tree-select-core
    └── quicker-tree-select-datasource

quicker-tree-select-datasource
    └── (独立包，无依赖)

quicker-tree-select-core
    └── (独立包，无依赖)
```

## 文件说明

### 核心文件

| 文件 | 说明 |
|------|------|
| `core/quicker-tree-select.ts` | 核心过滤算法实现 |
| `core/types.ts` | 数据类型定义 |
| `db/database.ts` | SQLite 数据库管理 |
| `db/repository.ts` | 数据访问层（CRUD） |
| `api/datasource-api.ts` | 数据源 API |
| `adapters/*.ts` | 各种数据格式适配器 |

### 组件文件

| 文件 | 说明 |
|------|------|
| `DataManager/index.tsx` | 数据项管理界面 |
| `DataItemEditor.tsx` | 数据项编辑器 |
| `TagManager/index.tsx` | 标签管理界面 |
| `RestTagSelect.tsx` | 标签选择组件 |
| `TagMatchDataView/` | 匹配数据展示 |

### 配置文件

| 文件 | 说明 |
|------|------|
| `package.json` | 包配置和依赖 |
| `tsconfig.json` | TypeScript 配置 |
| `jest.config.ts` | Jest 测试配置 |
| `rollup.config.ts` | Rollup 打包配置 |
| `vite.config.ts` | Vite 构建配置 |

### 文档文件

| 文件 | 说明 |
|------|------|
| `README.md` | 项目介绍 |
| `ARCHITECTURE.md` | 架构设计文档 |
| `USAGE.md` | 详细使用指南 |
| `QUICKSTART.md` | 快速开始指南 |
| `SUMMARY.md` | 项目实现总结 |

## 数据流向

```
┌─────────────────────────────────────────────────────────────┐
│                         Web UI                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ TagManager   │  │ DataManager  │  │ DataViewer   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                 │
│                  ┌────────▼────────┐                        │
│                  │ DataSourceAPI   │                        │
│                  └────────┬────────┘                        │
└───────────────────────────┼─────────────────────────────────┘
                            │
                  ┌─────────▼─────────┐
                  │    Adapter Layer  │
                  │  ┌──────────────┐ │
                  │  │ JSON Adapter │ │
                  │  ├──────────────┤ │
                  │  │SQLite Adapter│ │
                  │  ├──────────────┤ │
                  │  │ CSV Adapter  │ │
                  │  └──────────────┘ │
                  └─────────┬─────────┘
                            │
                  ┌─────────▼─────────┐
                  │   Data Storage    │
                  │  ┌──────────────┐ │
                  │  │ SQLite DB    │ │
                  │  ├──────────────┤ │
                  │  │ JSON Files   │ │
                  │  ├──────────────┤ │
                  │  │ CSV Files    │ │
                  │  └──────────────┘ │
                  └───────────────────┘
```

## 开发工作流

```
1. 修改代码
   ↓
2. 运行测试 (pnpm test)
   ↓
3. 格式化代码 (pnpm format)
   ↓
4. 构建包 (pnpm build)
   ↓
5. 启动开发服务器 (pnpm dev:ui)
   ↓
6. 测试功能
   ↓
7. 提交代码
```

## 扩展指南

### 添加新的适配器

1. 在 `packages/quicker-tree-select-adapter/src/adapters/` 创建新文件
2. 实现 `DataAdapter` 接口
3. 在 `src/index.ts` 中导出
4. 添加单元测试

### 添加新的 UI 组件

1. 在 `packages/quicker-tree-select-webui/src/components/` 创建组件
2. 使用 HeroUI 组件库
3. 集成到主应用

### 扩展数据库 Schema

1. 修改 `packages/quicker-tree-select-datasource/src/db/database.ts`
2. 更新 Repository 方法
3. 更新类型定义
4. 添加迁移脚本
