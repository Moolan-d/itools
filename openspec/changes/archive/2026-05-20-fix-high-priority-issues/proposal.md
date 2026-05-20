## Why

深度代码审查发现 iTools 存在系统性问题：40+ 个 Tailwind 风格类名未定义导致 UI 大面积失效（开关不工作、字体粗细消失、hover 动效全无），framer-motion 302KB 体积拖慢弹窗加载，发布流水线参数传递和安全性均有缺陷，且缺少错误边界和无障碍支持。这些问题严重影响用户体验和可维护性，需要系统性修复。

## What Changes

**P0 — 必须修复**
- 安装 Tailwind CSS v4 作为 PostCSS 插件，替换手写工具类，修复所有未定义类名导致的 UI 问题
- 移除 framer-motion，用 CSS `@keyframes` + `transition` 实现同等 tab 切换和 UI 动画效果（~300KB 体积缩减）

**P1 — 应该修复**
- 通过 Vite `define` 从 `package.json` 自动注入版本号，消除 SettingsPage 硬编码
- 修复 `package-release.js`：`bump-version.js` 接收版本类型参数，`execSync` 改为 `execFileSync` 消除命令注入风险
- 添加 App 级 React Error Boundary，弹窗崩溃时显示友好降级 UI
- `useCachedInput` 关闭缓存时清除对应 localStorage key，防止旧数据残留

**P2 — 值得修复**
- 添加 ARIA 语义：tab 导航使用 `tablist`/`tab`/`tabpanel` 角色，icon 按钮添加 `aria-label`，textarea 关联 label
- 修复 `QRCodeTool` 的 `generateQR` 函数每次渲染重建问题，`useCallback` + 修正 useEffect 依赖
- `JSONTool` 挂载时不再强制重新格式化缓存内容，保留用户原始格式
- 多处小修复：URLTool 错误状态用正确图标、去除重复 class、补全 eslint-disable 注释

## Capabilities

### New Capabilities

- `tailwind-integration`: 安装和配置 Tailwind CSS v4，替代手写工具类，确保所有组件类名正确渲染
- `css-animations`: 用纯 CSS 实现 tab 切换动画、QR 展示动画、底部导航栏滑动指示器，替换 framer-motion
- `error-resilience`: React Error Boundary + 各工具组件的错误反馈 UI
- `accessibility`: 完整的 ARIA 语义、键盘导航、屏幕阅读器支持

### Modified Capabilities

- `release-pipeline`: 修复版本类型参数传递、命令注入漏洞、自动版本号注入
- `cache-lifecycle`: 关闭缓存时清除 localStorage 数据，修复 JSONTool 挂载时静默重格式化

## Impact

**依赖变更**
- 新增：`tailwindcss` + `@tailwindcss/postcss`（devDependencies）
- 移除：`framer-motion`（dependencies）

**文件变更**
- `postcss.config.js`（新增）
- `src/styles/main.css`（Tailwind 指令替代手写工具类）
- `src/App.tsx`（CSS 动画替代 motion.div）
- `src/components/*.tsx`（移除 motion 导入，添加 ARIA 属性，修复图标/类名）
- `src/components/ErrorBoundary.tsx`（新增）
- `src/hooks/useCachedInput.ts`（缓存清理逻辑）
- `vite.config.ts`（版本号 define）
- `package-release.js` + `scripts/bump-version.js`（安全修复 + 参数传递）
- `package.json`（依赖变更 + lint 脚本）

**体积影响**
- 移除 framer-motion 后预计减少 ~300KB
- Tailwind CSS v4 tree-shake 后增量很小（< 10KB）
