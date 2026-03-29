# Netlify 部署指南

## 📦 部署步骤

### 1. 连接Git仓库
1. 登录 [Netlify](https://app.netlify.com/)
2. 点击 "Add new site" → "Import an existing project"
3. 选择你的Git提供商（GitHub/GitLab/Bitbucket）
4. 授权并选择此项目仓库

### 2. 配置构建设置
Netlify会自动检测 `netlify.toml` 配置，确认以下设置：
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20

### 3. 配置环境变量（重要！）
在Netlify控制台：
1. 进入 Site settings → Environment variables
2. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `Z_AI_API_KEY` | `sk-1c72af143be642a48bc17a719dbe570b` | AI API密钥 |

### 4. 部署
点击 "Deploy site" 开始部署

---

## ⚠️ 常见问题

### 问题1: 构建失败
**解决方案**: 确保Node版本设置为20，检查构建日志中的错误信息

### 问题2: API调用失败
**解决方案**: 确认已正确设置 `Z_AI_API_KEY` 环境变量

### 问题3: 页面空白
**解决方案**: 检查浏览器控制台错误，可能是环境变量未设置

---

## 🔄 更新部署

每次推送到主分支，Netlify会自动重新部署。

手动触发部署：
1. 进入 Deploys 页面
2. 点击 "Trigger deploy" → "Deploy site"

---

## 📝 项目信息

- **框架**: Next.js 16
- **运行时**: Netlify Functions (支持API路由)
- **AI模型**: GLM-4-Flash
- **行业数量**: 6个（含教育培训）
