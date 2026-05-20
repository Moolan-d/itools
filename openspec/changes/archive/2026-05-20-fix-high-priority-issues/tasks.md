## 1. Tailwind CSS 集成

- [x] 1.1 安装 `tailwindcss` 和 `@tailwindcss/postcss` 为 devDependencies
- [x] 1.2 创建 `postcss.config.js`，配置 Tailwind 插件
- [x] 1.3 更新 `main.css`：顶部添加 `@import "tailwindcss"`，删除所有手写工具类（`.flex`、`.items-center`、`.bg-slate-50` 等），保留 CSS 变量和组件特定样式（`.app-container`、`.nav-bar`、`.btn-modern`、`.icon-btn` 等）
- [x] 1.4 验证 `npm run build` 成功，所有组件正确渲染（特别检查设置页开关、字体粗细、hover 效果、背景色）

## 2. CSS 动画 & 移除 framer-motion

- [x] 2.1 在 `main.css` 中添加 CSS `@keyframes` 实现 tab 内容切换动画（fade + translateY，200ms）
- [x] 2.2 重写 `App.tsx`：移除 `motion` 和 `AnimatePresence` 导入，用 CSS class 触发动画，底部导航栏 active pill 改用 CSS transition
- [x] 2.3 在 `QRCodeTool.tsx` 中为 QR 展示区域添加 CSS scale-in 动画
- [x] 2.4 从 `package.json` 移除 `framer-motion` 依赖，运行 `npm install` 更新 lockfile
- [x] 2.5 验证 `npm run build` 成功，tab 切换动画流畅，无 console 错误

## 3. 错误处理 & 弹性

- [x] 3.1 创建 `src/components/ErrorBoundary.tsx`：class component，`getDerivedStateFromError` + `componentDidCatch`，显示友好降级 UI + Reload 按钮
- [x] 3.2 在 `main.tsx` 中用 `<ErrorBoundary>` 包裹 `<App />`
- [x] 3.3 在 `QRCodeTool.tsx` 中添加 error state，QR 生成失败时在 UI 中显示错误信息
- [x] 3.4 在所有工具的复制按钮中添加操作反馈（成功/失败的视觉指示）

## 4. 缓存生命周期

- [x] 4.1 更新 `useCachedInput.ts`：添加 `useEffect` 监听 `settings.enableCache`，变为 `false` 时调用 `localStorage.removeItem(key)`
- [x] 4.2 更新 `JSONTool.tsx`：移除挂载时的强制 prettify 逻辑，直接使用缓存的原始字符串

## 5. 版本注入 & 发布流水线

- [x] 5.1 在 `vite.config.ts` 中添加 `define: { __APP_VERSION__: JSON.stringify(pkg.version) }`
- [x] 5.2 在 `src/vite-env.d.ts` 中声明 `__APP_VERSION__` 全局变量类型
- [x] 5.3 更新 `SettingsPage.tsx`：使用 `__APP_VERSION__` 替代硬编码版本字符串
- [x] 5.4 修复 `scripts/bump-version.js`：读取 `process.argv[2]` 作为版本类型（`patch`/`minor`/`major`），默认 `patch`
- [x] 5.5 修复 `package-release.js`：读取 `process.argv[2]` 并传递给 `bump-version.js`，所有 `execSync` 替换为 `execFileSync` + 参数数组
- [x] 5.6 更新 `package.json` 中 `package` 脚本为 `node package-release.js`

## 6. 无障碍 (Accessibility)

- [x] 6.1 在 `App.tsx` 的 tab 导航中添加 ARIA 角色：`role="tablist"`、`role="tab"`、`role="tabpanel"`、`aria-selected`、`aria-controls`
- [x] 6.2 为所有 icon-only 按钮添加 `aria-label`（JSONTool 的 Copy/Clear、QRCodeTool 的 Copy/Download、URLTool 的 Copy/Clear）
- [x] 6.3 为所有 textarea 添加 `aria-label` 或关联 `<label>`

## 7. 收尾修复

- [x] 7.1 修复 `URLTool.tsx`：错误状态图标从 `Trash2` 改为 `AlertCircle`
- [x] 7.2 修复 `SettingsPage.tsx`：移除重复的 `h-full` class
- [x] 7.3 为 `JSONTool.tsx:81` 的 `eslint-disable` 添加解释注释
- [x] 7.4 在 `package.json` 中添加 `"lint": "eslint src/"` 脚本
- [x] 7.5 运行 `npm run build` 全量验证，确认无 TypeScript 错误、无 ESLint 警告
