#!/bin/bash

# ===========================================
# Netlify 自动部署脚本
# ===========================================
# 使用方法:
#   ./deploy.sh "你的提交信息"
#   ./deploy.sh  # 使用默认提交信息
# ===========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取提交信息
COMMIT_MSG="${1:-更新内容 - $(date '+%Y-%m-%d %H:%M:%S')}"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Netlify 自动部署脚本${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# 检查是否有未提交的更改
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}没有检测到文件更改，跳过提交。${NC}"
else
    echo -e "${GREEN}[1/3] 添加文件到暂存区...${NC}"
    git add .
    
    echo -e "${GREEN}[2/3] 提交更改...${NC}"
    git commit -m "$COMMIT_MSG"
fi

echo -e "${GREEN}[3/3] 推送到远程仓库...${NC}"
git push origin main

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  ✅ 部署完成！${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "📊 Netlify 将自动检测更改并开始部署"
echo -e "🔗 请登录 Netlify 控制台查看部署状态"
echo ""
