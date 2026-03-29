# AI模拟面试助手 - Netlify 部署指南

## 项目结构

```
├── public/
│   └── index.html          # 主页面（纯静态HTML）
├── netlify/
│   └── functions/
│       └── interview.js    # Netlify Function（处理AI API调用）
├── netlify.toml            # Netlify 配置文件
└── NETLIFY_DEPLOY_STATIC.md # 本文档
```

## 部署步骤

### 方式一：通过 Netlify CLI 部署

1. 安装 Netlify CLI：
   ```bash
   npm install -g netlify-cli
   ```

2. 登录 Netlify：
   ```bash
   netlify login
   ```

3. 初始化项目（如果是新项目）：
   ```bash
   netlify init
   ```

4. 部署到生产环境：
   ```bash
   netlify deploy --prod
   ```

### 方式二：通过 GitHub 自动部署

1. 将代码推送到 GitHub 仓库

2. 登录 [Netlify Dashboard](https://app.netlify.com/)

3. 点击 "Add new site" → "Import an existing project"

4. 选择你的 GitHub 仓库

5. 配置构建设置：
   - **Build command**: 留空（不需要构建）
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`

6. 点击 "Deploy site"

### 方式三：拖拽部署

1. 登录 [Netlify Dashboard](https://app.netlify.com/)

2. 将整个项目文件夹拖拽到部署区域

## 环境变量配置

在 Netlify Dashboard 中设置环境变量：

1. 进入 Site settings → Environment variables

2. 添加变量：
   - **Key**: `API_KEY`
   - **Value**: 你的 GLM API 密钥

注意：当前代码中已内置 API 密钥用于演示，生产环境建议使用环境变量。

## API 说明

### POST /api/interview

请求体：
```json
{
  "action": "start",  // 或 "chat"
  "industry": "tech",
  "position": "后端开发工程师",
  "userExperience": "junior",
  "message": "用户回答内容",  // chat时需要
  "sessionId": "session_xxx"  // chat时需要
}
```

响应：
```json
{
  "success": true,
  "message": "AI回复内容",
  "sessionId": "session_xxx",  // start时返回
  "ended": false  // chat时返回，表示面试是否结束
}
```

## 支持的行业

- `tech` - 互联网/科技行业
- `manufacturing` - 制造业/实体工业
- `finance` - 金融行业
- `retail` - 消费品/零售/连锁
- `consulting` - 咨询/专业服务
- `education` - 教育/培训行业

## 支持的经验等级

- `beginner` - 应届生/实习
- `junior` - 1-3年经验
- `mid` - 3-5年经验
- `senior` - 5-10年经验
- `expert` - 10年以上经验

## 注意事项

1. Netlify Functions 有执行时间限制（免费版10秒），如需更长超时请升级套餐

2. 会话存储使用内存，函数重启后会丢失。生产环境建议使用：
   - Netlify Blobs
   - 外部数据库（如 Supabase、PlanetScale）
   - Redis 缓存

3. API 密钥安全：
   - 不要将 API 密钥提交到公开仓库
   - 使用 Netlify 环境变量管理密钥

## 故障排查

### 部署失败
- 检查 `netlify.toml` 配置是否正确
- 确保 `public` 目录存在且包含 `index.html`
- 确保 `netlify/functions` 目录存在

### API 调用失败
- 检查 Netlify Functions 日志
- 确认 API 密钥有效
- 检查网络请求是否被重定向到正确的 Function

### 面试会话丢失
- Netlify Functions 是无状态的，每次冷启动会丢失内存数据
- 建议使用持久化存储方案

## 技术栈

- **前端**: 纯 HTML + Tailwind CSS (CDN)
- **后端**: Netlify Functions (Node.js)
- **AI**: 智谱 GLM-4-Flash 模型
