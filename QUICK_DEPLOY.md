# 快速部署指南

## 方法一：手动推送代码（推荐）

如果你已经在本地配置了 Git 认证，请手动执行：

```bash
# 进入项目目录
cd /home/z/my-project

# 推送代码到 GitHub
git push origin main
```

如果遇到认证问题，请使用以下方法之一：

### 方法 A: 使用 GitHub CLI
```bash
gh auth login
git push origin main
```

### 方法 B: 使用 Personal Access Token
1. 在 GitHub 创建 Personal Access Token
2. 使用 token 作为密码：
```bash
git push origin main
# 输入用户名和 token
```

### 方法 C: 使用 SSH
```bash
# 更换远程地址为 SSH
git remote set-url origin git@github.com:xus427/aimnms.git
git push origin main
```

---

## 方法二：在 Netlify 手动部署

如果 Git 推送有困难，可以使用 Netlify CLI：

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化项目
netlify init

# 部署
netlify deploy --prod
```

---

## 已配置的内容

✅ `netlify.toml` - Netlify 配置文件
✅ `deploy.sh` - 自动部署脚本
✅ `package.json` - 添加了 `npm run deploy` 命令

## 后续使用

每次代码更新后，执行：

```bash
npm run deploy "你的更新说明"
```

或者：

```bash
git add .
git commit -m "更新说明"
git push origin main
```

Netlify 会自动检测到更新并重新部署。

---

## 环境变量配置

⚠️ 重要：在 Netlify 控制台配置以下环境变量：

1. 进入 Site settings → Environment variables
2. 添加：
   - `Z_AI_API_KEY` = 你的 API Key
   - `Z_AI_BASE_URL` = `https://open.bigmodel.cn/api/paas/v4`
