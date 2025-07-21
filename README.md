# 邹城市人民政府办公室雪亮工程平台

## 项目简介

本项目是邹城市人民政府办公室雪亮工程平台前端应用，基于React + TypeScript + Ant Design构建。该平台具备重点布控、人像聚类等功能，实现对辖区内学校、广场等人口密集区域有效监控防范，提升社会治安防控体系整体防控效能。

## 核心功能

### 🎯 主要功能模块

1. **总览仪表板** - 系统整体状态监控和关键指标展示
2. **实时预警** - 实时安全预警信息展示和处理
3. **重点布控** - 重点区域监控和布控点管理
4. **自动报警** - 报警规则管理和自动报警系统
5. **远程控制** - 设备远程控制和参数调节
6. **人像聚类** - 人脸识别和聚类分析
7. **数据分析** - 数据可视化分析和趋势预测
8. **状态监控** - 设备状态监控和实时视频回传
9. **安全管理** - 安全事件监控和应急响应处理
10. **系统设置** - 系统配置和参数管理

### 🚀 技术特性

- **重点布控** - 对学校、广场等人口密集区域重点监控
- **人像聚类** - 基于AI的人脸识别和聚类分析
- **实时预警** - 智能识别异常行为并实时预警
- **自动报警** - 可配置的自动报警规则系统
- **远程控制** - 设备远程控制和参数调节
- **数据分析** - 多维度数据分析和可视化
- **模块化设计** - 功能模块独立，易于维护

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 安装依赖
npm install

# 启动开发服务器
npm start

# 访问 http://localhost:3000
```

### 部署到GitHub Pages

1. **Fork或克隆本项目到你的GitHub账户**

2. **启用GitHub Pages**：
   - 进入你的GitHub仓库
   - 点击 Settings → Pages
   - Source 选择 "GitHub Actions"

3. **自动部署**：
   - 推送代码到main/master分支会自动触发部署
   - 部署完成后可通过 `https://your-username.github.io/your-repo-name` 访问

### 手动部署

```bash
# 构建项目
npm run build

# 部署到GitHub Pages（需要安装gh-pages）
npm install -g gh-pages
gh-pages -d build
```

## 🌐 在线演示

- **GitHub Pages**: [https://sdjnzt.github.io/sdjkxj](https://sdjnzt.github.io/sdjkxj)
- **本地开发**: http://localhost:3000

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **UI组件库**: Ant Design 5
- **图表库**: @ant-design/plots
- **路由管理**: React Router DOM 6
- **构建工具**: Create React App
- **样式方案**: CSS + Ant Design主题

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 项目结构

```
src/
├── components/          # 公共组件
├── pages/              # 页面组件
│   ├── Dashboard.tsx          # 总览仪表板
│   ├── RealTimeAlert.tsx      # 实时预警
│   ├── KeyControl.tsx         # 重点布控
│   ├── AutoAlarm.tsx          # 自动报警
│   ├── RemoteControl.tsx      # 远程控制
│   ├── FaceClustering.tsx     # 人像聚类
│   ├── DataAnalysis.tsx       # 数据分析
│   ├── StatusMonitor.tsx      # 状态监控
│   ├── SafetyManagement.tsx   # 安全管理
│   └── SystemSettings.tsx     # 系统设置
├── data/               # 模拟数据
│   └── mockData.ts           # 所有模拟数据
├── App.tsx             # 主应用组件
├── index.tsx           # 应用入口
└── index.css           # 全局样式
```

## 功能说明

### 实时预警系统
- 智能识别异常行为并实时预警
- 多级别预警分类（紧急、高、中、低）
- 预警信息实时推送和处理
- 预警历史记录和统计分析

### 重点布控管理
- 重点区域布控点管理
- 学校、广场等人口密集区域监控
- 布控点状态监控和覆盖率统计
- 布控点优先级管理

### 自动报警系统
- 可配置的报警规则管理
- 多种触发方式（运动检测、人脸识别、车辆检测等）
- 报警历史记录和误报率统计
- 报警规则测试和优化

### 人像聚类分析
- 基于AI的人脸识别和聚类
- 相似度阈值可调节
- 人脸特征提取和分析
- 聚类组管理和统计分析

### 远程控制系统
- 设备远程控制和管理
- 参数实时调节
- 设备状态监控
- 控制指令下发

### 数据分析系统
- 多维度数据可视化分析
- 趋势分析和预测
- 数据质量监控
- 实时数据流分析

### 状态监控系统
- 设备状态实时监控
- 高清视频查看
- 设备参数监控
- 异常告警处理

### 安全管理系统
- 安全事件实时监控
- 应急响应处理
- 事件处理时间线
- 安全统计分析

## 数据模拟

项目使用完整的模拟数据，包括：

- 预警信息（人员、车辆、行为、人群、安全）
- 布控点信息（学校、广场、商业区、交通枢纽等）
- 报警规则（触发条件、阈值、优先级等）
- 人脸聚类（聚类组、相似度、出现频率等）
- 设备信息（摄像头、传感器、控制器等）
- 安全事件（类型、位置、严重程度等）

## 浏览器支持

- Chrome 70+
- Firefox 70+
- Safari 12+
- Edge 79+

## 开发说明

### 添加新功能模块

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 在 `src/data/mockData.ts` 中添加相应的模拟数据

### 自定义样式

项目使用 Ant Design 主题系统，可以通过修改 `src/index.css` 进行样式自定义。

### 数据接口

当前使用模拟数据，生产环境中需要替换为真实的API接口。接口规范请参考模拟数据的数据结构。

## 许可证

本项目为邹城市人民政府办公室内部使用，版权所有。

---

*邹城市人民政府办公室雪亮工程平台 - 让监控更智能，让安全更可靠* 