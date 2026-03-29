# Netlify 自动部署配置指南

## 一、连接 GitHub 仓库到 Netlify（推荐）

### 步骤 1: 将代码推送到 GitHub

```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "更新面试应用"

# 推送到 GitHub
git push origin main
```

### 步骤 2: 在 Netlify 创建站点

1. 登录 [Netlify](https://app.netlify.com/)
2. 点击 **"Add new site"** → **"Import an existing project"**
3. 选择 **"GitHub"** 作为 Git 提供商
4. 授权 Netlify 访问你的 GitHub 仓库
5. 选择 `xus427/aimnms` 仓库

### 步骤 3: 配置构建设置

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- 确保已安装 `@netlify/plugin-nextjs` 插件（已在 package.json 中）

### 步骤 4: 配置环境变量

在 Netlify 站点设置中添加以下环境变量：

1. 进入 **Site settings** → **Environment variables**
2. 添加变量：
   - `Z_AI_API_KEY` = `your-api-key`
   - `Z_AI_BASE_URL` = `https://open.bigmodel.cn/api/paas/v4`

### 步骤 5: 部署

点击 **"Deploy site"**，Netlify 会自动构建并部署你的应用。

---

## 二、自动部署工作流程

配置完成后，每次你推送代码到 GitHub，Netlify 会自动检测更改并重新部署：

```bash
# 方法 1: 使用部署脚本
npm run deploy "更新说明"

# 方法 2: 手动 Git 操作
git add .
git commit -m "更新内容"
git push origin main
```

---

## 三、查看部署状态

- 在 Netlify 控制台查看部署日志
- 部署成功后会获得一个 `.netlify.app` 域名
- 可以绑定自定义域名

---

## 四、常见问题

### Q: 部署失败怎么办？
1. 检查 Netlify 构建日志
2. 确认环境变量已正确配置
3. 检查 `netlify.toml` 配置

### Q: 如何回滚到之前的版本？
1. 在 Netlify 控制台的 **Deploys** 页面
2. 找到想要回滚的部署
3. 点击 **"Publish deploy"**

### Q: API 调用失败？
确认 `Z_AI_API_KEY` 环境变量已在 Netlify 中正确设置。
