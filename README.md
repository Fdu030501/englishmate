# EnglishMate - AI 驱动的个性化英语私教

> 2000 公里外的温暖陪伴

## 项目概述

EnglishMate 是一个基于 Next.js 14 和 Supabase 构建的个性化英语学习平台，专为考研英语备考设计。

### 核心特性

- **词缀学习系统**: 从词根词缀角度串联词汇，解决"背了不会用"的问题
- **AI 小测试生成**: 学完即测，即时反馈，基于 DeepSeek API
- **语法诊断系统**: 通过测试定位弱项，生成针对性学习计划
- **学习进度追踪**: 可视化展示进步，能力雷达图

## 技术栈

### 前端
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui 组件库

### 后端
- Next.js API Routes
- Supabase (PostgreSQL + Auth)

### AI 服务
- DeepSeek API (主要)
- 备选：通义千问

## 快速开始

### 1. 环境配置

复制环境变量文件并填入配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### 2. 安装依赖

```bash
npm install
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 部署到 Supabase

在 Supabase 项目中运行 SQL 迁移文件：

```bash
# 在 Supabase Dashboard -> SQL Editor 中运行
# supabase/migrations/001_initial_schema.sql
# supabase/migrations/002_affixes_data.sql
```

## 项目结构

```
app/
├── app/                      # Next.js App Router
│   ├── (auth)/               # 认证页面（登录/注册）
│   ├── (dashboard)/          # 主学习界面
│   │   ├── page.tsx          # 仪表盘
│   │   ├── affixes/          # 词缀学习
│   │   ├── grammar/          # 语法诊断
│   │   └── profile/          # 学习进度
│   ├── api/                  # API Routes
│   │   ├── quiz/             # 测试相关
│   │   └── grammar/          # 语法相关
│   └── layout.tsx
├── components/
│   └── ui/                   # Shadcn/ui 组件
├── lib/
│   ├── affixes/              # 词缀数据
│   ├── ai/                   # AI 服务
│   ├── grammar/              # 语法知识点
│   └── supabase/             # Supabase 客户端
├── types/                    # TypeScript 类型
└── supabase/migrations/      # 数据库迁移
```

## 功能模块

### Phase 1: MVP (当前版本)
- [x] 词缀学习系统
- [x] AI 小测试生成
- [x] 语法诊断系统
- [x] 学习进度追踪

### Phase 2: AI Agent 驱动
- [ ] 每日任务生成系统
- [ ] 主动提醒系统
- [ ] 能力雷达图可视化

### Phase 3: 情感化功能
- [ ] 学习宠物（Tamagotchi 模式）
- [ ] 情侣互动（加油卡系统）

### Phase 4: AI 进阶玩法
- [ ] 每日一句推送
- [ ] 语音日记
- [ ] 拍照学万物（多模态 AI）

## 数据库设计

核心表：
- `user_profile`: 用户能力画像
- `affixes`: 词缀库
- `affix_words`: 衍生词表
- `affix_progress`: 学习进度
- `quiz_record`: 测试记录
- `daily_task`: 每日任务
- `learning_streak`: 连续学习天数

详见 `supabase/migrations/001_initial_schema.sql`

## API 接口

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/quiz/generate` | POST | AI 生成测试 |
| `/api/grammar/diagnostic/submit` | POST | 提交诊断测试 |
| `/api/progress` | GET | 获取学习进度 |

## 开发计划

详见 `plan.md` 文件中的完整实施计划。

## 许可证

MIT
