## Context

iTools 是一个 Chrome Extension MV3 弹窗应用，约 900 行 TypeScript 代码。当前代码库存在两个根本性问题：

1. **CSS 断裂**：组件使用 Tailwind 风格类名（`bg-white`, `font-semibold`, `transition-all` 等），但 Tailwind 从未安装。`main.css` 手写了约 50 个工具类，但仍有 40+ 个类名未定义，导致大面积 UI 失效。
2. **动画体积**：framer-motion 占 302KB，仅用于 tab 切换动画（`AnimatePresence` + `motion.div` + `layoutId`）。

发布流水线、错误处理、无障碍等方面也存在系统性缺陷。

## Goals / Non-Goals

**Goals:**
- 所有组件类名正确渲染，UI 恢复设计意图
- 插件体积显著减小（目标 < 200KB）
- 发布流水线安全且功能完整
- 弹窗崩溃时有友好降级 UI
- 缓存行为符合用户预期
- 满足基本无障碍要求

**Non-Goals:**
- 不增加新工具功能
- 不引入路由或状态管理库
- 不重写组件结构或引入新设计系统
- 不添加测试套件（单独规划）
- 不迁移到 chrome.storage API（单独规划）

## Decisions

### D1. Tailwind CSS v4 + PostCSS

**选择**: 安装 `tailwindcss` v4 + `@tailwindcss/postcss`

**替代方案**:
- 继续手写缺失的 ~40 个工具类 → 维护成本高，容易遗漏，新开发效率低
- Tailwind v3 → v4 更简洁（单一 `@import "tailwindcss"` 入口，无需 `tailwind.config.js`）

**设计**:
- 新建 `postcss.config.js`
- `main.css` 顶部添加 `@import "tailwindcss"`
- 保留现有 CSS 变量（`:root` 声明）和组件特定样式（`.app-container`, `.nav-bar`, `.btn-modern`, `.icon-btn` 等）
- 删除手写的工具类（`.flex`, `.items-center`, `.bg-slate-50` 等），由 Tailwind 自动生成

### D2. CSS 动画替换 framer-motion

**选择**: 纯 CSS `@keyframes` + `transition` + `animation`

**替代方案**:
- `react-spring` → 仍有额外依赖
- `motion`（framer-motion 轻量版）→ 仍需安装新依赖
- CSS 方案零依赖，与 Tailwind 完美配合

**设计**:
- **Tab 内容切换**: 用 CSS `@keyframes fadeSlideIn` / `fadeSlideOut` 实现 opacity + translateY 过渡。通过 React key 变化触发重挂载 + CSS animation。
- **底部导航栏 Pill**: 去掉 `layoutId` 动画，改用 CSS transition on `.active-pill` 的位置（或简化为背景色高亮，无滑动）。考虑到只有 4 个 tab，直接切换高亮即可。
- **QR 展示**: CSS `@keyframes scaleIn` 实现 scale + fade 效果。

### D3. 版本号自动注入

**选择**: Vite `define` 配置

**设计**:
- `vite.config.ts` 中添加 `define: { __APP_VERSION__: JSON.stringify(pkg.version) }`
- 新增 `src/vite-env.d.ts` 中声明 `__APP_VERSION__: string`
- `SettingsPage.tsx` 使用 `__APP_VERSION__` 替代硬编码字符串

### D4. 发布流水线修复

**选择**: 参数传递 + `execFileSync`

**设计**:
- `bump-version.js` 读取 `process.argv[2]` 作为版本类型（`patch`/`minor`/`major`），默认 `patch`
- `package-release.js` 读取 `process.argv[2]`，传递给 `bump-version.js`
- 所有 `execSync` 替换为 `execFileSync`（`rm`、`zip` 等），参数以数组传递
- `npm run package` 脚本改为 `node package-release.js`（不带占位参数）

### D5. Error Boundary

**选择**: App 级 class component Error Boundary

**设计**:
- 新建 `src/components/ErrorBoundary.tsx`
- Class component with `getDerivedStateFromError` + `componentDidCatch`
- 错误 UI：显示友好提示 + "Reload" 按钮（调用 `chrome.runtime.reload()` 或 `window.location.reload()`）
- 在 `main.tsx` 中包裹 `<App />`

### D6. 缓存清理

**选择**: 在 `useCachedInput` 中监听 `enableCache` 变化

**设计**:
- 添加 `useEffect` 监听 `settings.enableCache`，当变为 `false` 时 `localStorage.removeItem(key)`
- 确保清理后组件状态不受影响（输入框内容保留，只是不再持久化）

## Risks / Trade-offs

- **[Tailwind CSS 包体积]** → v4 PostCSS 模式 tree-shake 后增量很小（< 10KB gzip），远小于 framer-motion 的 300KB
- **[CSS 动画表现力下降]** → `layoutId` 的 spring 动画效果无法用 CSS 完美复现，但 tab 切换场景下 CSS 动画足够流畅
- **[Tailwind v4 兼容性]** → v4 于 2025 年发布，API 稳定，但与 v3 的配置方式不同（无 `tailwind.config.js`）
- **[Error Boundary 不覆盖异步错误]** → Error Boundary 只捕获渲染阶段错误，异步错误（如 QR 生成失败）仍需 try/catch + 状态管理
