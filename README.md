# 产品经理面试辅导助手

专门为腾讯元宝AI产品经理岗位面试打造的智能辅导平台。

## 功能特性

1. **个人信息管理**
   - 录入和管理个人基本信息
   - 记录实习经历和项目经验
   - 管理技能标签

2. **知识库**
   - 腾讯元宝公司信息（公司简介、核心产品、业务重点）
   - AI产品经理面试常见问题及答案
   - 常用产品框架

3. **智能辅导**
   - 基于用户背景的个性化问答
   - 结合腾讯元宝情况的专业指导
   - 支持OpenAI GPT 集成

4. **模拟面试**
   - 随机抽取面试问题
   - 参考答案查看
   - 面试进度追踪

## 快速开始

### 前置条件

- Node.js 16+
- npm 或 yarn

### 后端设置

```bash
cd backend
npm install

# 复制环境变量文件
cp .env.example .env
# 编辑 .env 文件，添加你的 OpenAI API Key
```

### 前端设置

```bash
cd frontend
npm install
```

### 运行项目

**启动后端服务**

```bash
cd backend
npm run dev
```

后端服务将在 `http://localhost:3001` 启动。

**启动前端应用**

```bash
cd frontend
npm run dev
```

前端应用将在 `http://localhost:3000` 启动。

## 配置说明

在 `backend/.env` 配置：

```
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
```

## 项目结构

```
.
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── yuanbao-info.json    # 腾讯元宝公司信息
│   │   │   ├── product-knowledge.json  # AI产品知识库
│   │   │   └── user-info.json     # 用户信息（自动保存）
│   │   └── server.ts            # 后端服务
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── UserInfoPage.tsx
│   │   │   ├── KnowledgePage.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   └── MockInterviewPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 技术栈

- **前端**：React 18, TypeScript, Vite, Ant Design
- **后端**：Node.js, Express, TypeScript
- **AI**：OpenAI API

## 使用说明

1. 首先在「个人信息」页面填写你的详细信息
2. 查看「知识库」了解腾讯元宝公司和AI产品知识
3. 使用「智能辅导」进行个性化问答
4. 在「模拟面试」中练习面试问题

## 扩展

你可以编辑 `backend/src/data/` 下的 JSON 文件来扩展知识库内容。
