# SQLite 数据源切换指南

## 当前状态

✅ **已完成**:
- 数据源配置界面
- JSON 文件/URL 数据源
- SQLite API 数据源接口
- API 服务器代码

⚠️ **待解决**:
- better-sqlite3 编译问题（需要 Python 环境）

## 快速切换方案

### 方案 1: 使用 JSON 数据源（当前可用）

这是最简单的方式，无需后端服务器。

1. 打开 WebUI: http://127.0.0.1:5173/
2. 点击右上角 **"配置"** 按钮
3. 选择 "JSON 文件（本地）"
4. 文件路径: `/data/data.json`
5. 点击 **"测试连接"** → **"保存配置"**

✅ 立即可用，无需额外配置

### 方案 2: 使用 JSON URL 数据源

如果你有远程 API 提供 JSON 数据。

1. 打开配置
2. 选择 "JSON URL（远程）"
3. 输入 URL: `https://your-api.com/data.json`
4. （可选）添加请求头
5. 测试并保存

### 方案 3: 使用 SQLite API（需要后端）

**前提条件**:
- 安装 Python 3.x
- 编译 better-sqlite3

#### 步骤 1: 安装 Python

```bash
# Ubuntu/Debian
sudo apt-get install python3 python3-pip build-essential

# 或使用 conda
conda install python
```

#### 步骤 2: 重新编译 better-sqlite3

```bash
cd /home/hyx_minipc/code/playground/quicker-tree-select
pnpm rebuild better-sqlite3
```

#### 步骤 3: 启动 API 服务器

```bash
cd server
pnpm start
```

服务器将在 http://localhost:3000 启动

#### 步骤 4: 配置 WebUI

1. 打开 WebUI 配置
2. 选择 "SQLite API 服务"
3. 配置:
   - API 地址: `http://localhost`
   - 端口: `3000`
4. 测试连接 → 保存

## 当前推荐方案

由于 better-sqlite3 编译需要 Python 环境，**推荐先使用方案 1（JSON 文件）**。

### 使用 JSON 文件的优势

- ✅ 无需后端服务器
- ✅ 无需编译依赖
- ✅ 立即可用
- ✅ 数据易于编辑
- ✅ 支持版本控制

### JSON 数据文件位置

```
packages/quicker-tree-select-webui/public/data/data.json
```

你可以直接编辑这个文件来管理数据。

## 数据格式

```json
[
  {
    "tags": ["标签1", "标签2"],
    "data": ["数据1", "数据2"]
  },
  {
    "tags": ["标签3", "标签4"],
    "data": {
      "键1": "值1",
      "键2": "值2"
    }
  }
]
```

## 切换数据源

在 WebUI 中，你可以随时切换数据源：

1. 点击右上角 **"配置"** 按钮
2. 选择新的数据源类型
3. 配置参数
4. 测试连接
5. 保存配置

配置会自动保存到浏览器 localStorage。

## 故障排除

### 问题: better-sqlite3 编译失败

**原因**: 缺少 Python 环境或构建工具

**解决方法**:
1. 安装 Python 3.x
2. 安装构建工具:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install build-essential
   
   # 或
   sudo apt-get install python3-dev
   ```
3. 重新编译:
   ```bash
   pnpm rebuild better-sqlite3
   ```

### 问题: API 服务器无法启动

**检查**:
1. better-sqlite3 是否编译成功
2. 端口 3000 是否被占用
3. 查看日志: `tail -f /tmp/api-server.log`

### 问题: WebUI 无法连接到 API

**检查**:
1. API 服务器是否运行: `curl http://localhost:3000/api/health`
2. CORS 是否配置正确
3. 防火墙是否阻止连接

## 下一步

### 立即可用
1. ✅ 使用 JSON 文件数据源
2. ✅ 测试标签过滤功能
3. ✅ 编辑 JSON 文件添加自己的数据

### 未来升级
1. 🔄 安装 Python 环境
2. 🔄 编译 better-sqlite3
3. 🔄 启动 SQLite API 服务器
4. 🔄 切换到 SQLite 数据源

## 相关文档

- [数据源配置详细指南](./DATASOURCE_CONFIG_GUIDE.md)
- [快速参考](./DATASOURCE_QUICKREF.md)
- [架构设计](./ARCHITECTURE.md)

---

**当前访问地址**: http://127.0.0.1:5173/

**当前数据源**: JSON 文件 (`/data/data.json`)

**状态**: ✅ 可用
