# iTools - Chrome Developer Toolkit

iTools 是一款基于 React + TypeScript 构建的高颜值、现代化 Chrome 开发者工具插件。它集成了日常开发中最常用的工具，提供丝滑的交互体验和精美的 UI 设计。

## ✨ 核心特性

### 1. 二维码生成 (QR Code)
- **实时生成**：输入文本/链接即时生成二维码。
- **美观交互**：采用居中卡片式布局，支持动画过渡。
- **便捷操作**：
  - 支持 **复制** 二维码图片到剪贴板。
  - 支持 **下载** 为 PNG 图片。
- **缓存支持**：可记住上次生成的内容。

### 2. JSON 工具箱 (JSON Tools)
- **智能校验**：
  - 实时检测 JSON 语法，**绿框**代表有效，**红框+错误提示**代表格式错误。
  - 底部状态栏显示元数据：数据类型、项目数量、字节大小。
- **格式化/压缩**：支持一键美化 (Format) 和 压缩 (Minify)。
- **智能输入框**：
  - 高度自适应内容 (Max lines ~20)，避免撑开整个插件窗口。
  - 白色背景更显清晰可编辑。

### 3. URL 编解码 (URL Tools)
- **现代化设计**：重新设计的 UI，采用输入 -> 输出的直观流式布局。
- **功能完备**：支持 URL Encode 和 Decode 切换。
- **细节打磨**：
  - 独立的 **Clear** 和 **Copy** 按钮。
  - 统一的风格设计 (Slate风格背景、Modern Button)。

### 4. 个性化设置 (Settings)
- **偏好记忆**：
    - **Cache Last Input**：可选择是否自动缓存各个工具的上次输入内容 (默认开启)。
    - **Default Tab**：自定义插件打开时默认展示的工具 (QR/JSON/URL)。

## 🛠 技术栈

- **Core**: React, TypeScript, Vite
- **Styling**: Vanilla CSS (Tailwind-like utility classes), CSS Variables
- **Motion**: Framer Motion (Tab 切换动画, Pill 动画)
- **Icons**: Lucide React
- **Quality**: ESLint (v9), Prettier

## 🚀 开发与构建

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 构建生产环境
```bash
npm run build
```
构建产物将输出到 `dist` 目录。

### 加载到 Chrome
1. 打开 `chrome://extensions/`
2. 开启 "开发者模式" (Developer mode)
3. 点击 "加载已解压的扩展程序" (Load unpacked)
4. 选择本项目的 `dist` 目录

## 📝 最近更新 (Refactoring)
- **UI 重构**：根据 Web Design Guidelines 进行了全面美化，统一了按钮风格和配色 (Blue/Slate theme)。
- **体验优化**：修复了 Popup 高度塌陷问题，优化了 Textarea 滚动体验。
- **新功能**：新增设置页面，支持用户习惯定制。
# itools
