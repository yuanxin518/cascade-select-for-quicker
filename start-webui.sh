#!/bin/bash

# Quicker Tree Select - WebUI 启动脚本
# 用于启动前端开发服务器

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Quicker Tree Select - WebUI 启动脚本                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未找到 Node.js，请先安装 Node.js${NC}"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}错误: 未找到 pnpm，请先安装 pnpm${NC}"
    echo -e "${YELLOW}提示: npm install -g pnpm${NC}"
    exit 1
fi

# 进入项目根目录
cd "$(dirname "$0")"

# 检查依赖是否已安装
if [ ! -d "node_modules" ] || [ ! -d "packages/quicker-tree-select-webui/node_modules" ]; then
    echo -e "${YELLOW}检测到依赖未安装，正在安装依赖...${NC}"
    pnpm install
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
    echo ""
fi

# 启动 WebUI
echo -e "${GREEN}正在启动 WebUI 开发服务器...${NC}"
echo ""

pnpm run dev:ui
