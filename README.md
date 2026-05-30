# 凡人修仙传 · 人界篇知识图谱

基于 Vue3 + D3.js 构建的《凡人修仙传》人界篇人物关系知识图谱可视化网站。

## 在线访问

[https://qiect.github.io/fanren/](https://qiect.github.io/fanren/)

## 功能

- **图谱主页** — D3.js 力导向图，支持缩放/拖拽/悬停高亮关联路径/点击查看人物详情，左侧筛选面板（势力/境界/关系类型），右下角图例
- **人物详情页** — 人物基本信息、关系列表、相关事件时间线
- **势力总览页** — 各门派/势力的核心人物、境界分布、下属组织
- **事件时间线页** — 按章节顺序展示关键事件，可展开查看详情和参与人物

## 数据覆盖

- 54+ 人物角色，涵盖七玄门、黄枫谷、落云宗、妙音门、星宫、万法门、圣魔岛、极阴岛等势力
- 69 条人物关系：师徒、同门、夫妻、盟友、敌对、亲属、主仆、知己
- 26 个关键事件：从韩立入七玄门到飞升灵界
- 24 个势力/门派

## 技术栈

- Vue 3 + TypeScript + Vite
- D3.js 7（力导向图可视化）
- Pinia（状态管理）
- Vue Router 4（路由，Hash 模式）
- Tailwind CSS 3（样式）

## 本地开发

```bash
npm install
npm run dev
```

## 部署

项目使用 GitHub Actions 自动部署到 GitHub Pages，配置见 `.github/workflows/deploy.yml`。

手动触发部署：前往仓库 Actions 页面，选择 "Deploy to GitHub Pages" workflow，点击 "Run workflow"。

## 项目结构

```
src/
├── components/
│   ├── ForceGraph.vue       # D3.js 力导向图
│   ├── FilterPanel.vue      # 筛选面板
│   ├── LegendPanel.vue       # 图例
│   ├── CharacterPanel.vue   # 人物详情面板
│   └── NavBar.vue           # 导航栏
├── data/
│   └── knowledge.ts         # 知识图谱数据
├── pages/
│   ├── GraphPage.vue        # 图谱主页
│   ├── CharacterDetailPage.vue  # 人物详情页
│   ├── FactionsPage.vue     # 势力总览页
│   └── TimelinePage.vue     # 事件时间线页
├── stores/
│   └── knowledge.ts         # Pinia Store
├── types/
│   └── index.ts             # TypeScript 类型定义
├── router/
│   └── index.ts             # 路由配置
├── style.css                # 全局样式
├── App.vue                  # 根组件
└── main.ts                  # 入口
```
