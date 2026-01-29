#!/bin/bash

# Quicker Tree Select - 一键启动脚本
# 同时启动数据源服务和 WebUI

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Quicker Tree Select - 一键启动脚本                      ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
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
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}检测到依赖未安装，正在安装依赖...${NC}"
    pnpm install
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
    echo ""
fi

# 检查数据库目录
if [ ! -d "data" ]; then
    echo -e "${YELLOW}创建数据库目录...${NC}"
    mkdir -p data
    echo -e "${GREEN}✓ 数据库目录已创建${NC}"
    echo ""
fi

# 检查数据库是否存在
if [ ! -f "data/quicker-tree-select.db" ]; then
    echo -e "${YELLOW}数据库不存在，正在初始化数据库...${NC}"
    cd server
    pnpm run start init-db.ts
    cd ..
    echo -e "${GREEN}✓ 数据库初始化完成${NC}"
    echo ""
fi

# 创建日志目录
mkdir -p logs

# 清理旧的 PID 文件
rm -f logs/server.pid logs/webui.pid

# 定义清理函数
cleanup() {
    echo ""
    echo -e "${YELLOW}正在停止所有服务...${NC}"

    # 停止服务器
    if [ -f logs/server.pid ]; then
        SERVER_PID=$(cat logs/server.pid)
        if ps -p $SERVER_PID > /dev/null 2>&1; then
            echo -e "${YELLOW}停止数据源服务 (PID: $SERVER_PID)...${NC}"
            kill $SERVER_PID 2>/dev/null || true
        fi
        rm -f logs/server.pid
    fi

    # 停止 WebUI
    if [ -f logs/webui.pid ]; then
        WEBUI_PID=$(cat logs/webui.pid)
        if ps -p $WEBUI_PID > /dev/null 2>&1; then
            echo -e "${YELLOW}停止 WebUI 服务 (PID: $WEBUI_PID)...${NC}"
            kill $WEBUI_PID 2>/dev/null || true
        fi
        rm -f logs/webui.pid
    fi

    echo -e "${GREEN}✓ 所有服务已停止${NC}"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}启动数据源服务...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# 启动数据源服务（后台运行）
cd server
pnpm run start > ../logs/server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ../logs/server.pid
cd ..

echo -e "${GREEN}✓ 数据源服务已启动 (PID: $SERVER_PID)${NC}"
echo -e "${CYAN}  日志文件: logs/server.log${NC}"
echo ""

# 等待服务器启动
echo -e "${YELLOW}等待数据源服务启动...${NC}"
sleep 3

# 检查服务器是否成功启动
if ! ps -p $SERVER_PID > /dev/null 2>&1; then
    echo -e "${RED}错误: 数据源服务启动失败${NC}"
    echo -e "${YELLOW}请查看日志: logs/server.log${NC}"
    exit 1
fi

# 检查服务器健康状态
MAX_RETRIES=10
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 数据源服务健康检查通过${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo -e "${RED}错误: 数据源服务健康检查失败${NC}"
        echo -e "${YELLOW}请查看日志: logs/server.log${NC}"
        cleanup
    fi
    sleep 1
done

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}启动 WebUI 服务...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# 启动 WebUI（后台运行）
pnpm run dev:ui > logs/webui.log 2>&1 &
WEBUI_PID=$!
echo $WEBUI_PID > logs/webui.pid

echo -e "${GREEN}✓ WebUI 服务已启动 (PID: $WEBUI_PID)${NC}"
echo -e "${CYAN}  日志文件: logs/webui.log${NC}"
echo ""

# 等待 WebUI 启动
echo -e "${YELLOW}等待 WebUI 服务启动...${NC}"
sleep 5

# 检查 WebUI 是否成功启动
if ! ps -p $WEBUI_PID > /dev/null 2>&1; then
    echo -e "${RED}错误: WebUI 服务启动失败${NC}"
    echo -e "${YELLOW}请查看日志: logs/webui.log${NC}"
    cleanup
fi

echo -e "${GREEN}✓ WebUI 服务启动成功${NC}"
echo ""

# 显示服务信息
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  所有服务已成功启动！                                    ║${NC}"
echo -e "${CYAN}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  数据源服务:                                              ║${NC}"
echo -e "${CYAN}║    - URL: http://localhost:3000                            ║${NC}"
echo -e "${CYAN}║    - PID: $SERVER_PID                                                ║${NC}"
echo -e "${CYAN}║    - 日志: logs/server.log                                 ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║  WebUI 服务:                                               ║${NC}"
echo -e "${CYAN}║    - URL: http://localhost:5173 (通常)                     ║${NC}"
echo -e "${CYAN}║    - PID: $WEBUI_PID                                                ║${NC}"
echo -e "${CYAN}║    - 日志: logs/webui.log                                  ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║  按 Ctrl+C 停止所有服务                                    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 实时显示日志
echo -e "${YELLOW}实时日志输出 (Ctrl+C 停止):${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────${NC}"
echo ""

# 同时显示两个服务的日志
tail -f logs/server.log logs/webui.log
