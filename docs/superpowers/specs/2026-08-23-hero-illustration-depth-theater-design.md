# 首页插画景深剧场与 GSAP 交互设计

## 1. 目标

将作品集首页 Hero 的视频和旧海报背景替换为用户指定的 NESTA 插画 `C:/Users/86135/Desktop/作品/2241f292694c0cb2497992ebc760bf2d.jpg`，并使用 `C:/Users/86135/Desktop/素材/` 中的 5 张透明 PNG 构建前、中、远景家具层。同步重做首次进入时的 0–100 加载动画，使它预加载新 Hero 资产并作为插画景深剧场的开场。

首页仍然首先表达王程程的个人作品集身份。`VISUAL DESIGNER`、作品集元信息、专业方向、导航与作品入口继续保留；NESTA 插画和家具素材承担空间氛围与交互，不把首页改成 NESTA 项目页。

## 2. 当前状态与改造边界

当前 Hero 使用 `hero-loop-web.mp4`、`hero-poster.jpg`、全屏 scrim、两行 `VISUAL DESIGNER`、两枚磁性标签、顶部元信息和底部作品入口。`Hero.jsx` 已使用 `useGSAP`、SplitText、ScrollTrigger、`quickTo()`、`contextSafe` 和 scoped cleanup。

本轮仅改造 Hero：

- 移除首页视频和旧 fallback 海报的渲染与加载。
- 重构首次会话 Preloader 的视觉、真实资源进度和 Hero 衔接。
- 不改 About、Selected Work、项目详情或 Contact。
- 不改个人信息、邮箱、项目数量和其他六个项目内容。
- 不生成或重绘用户图片。

## 3. 素材分析与语义映射

背景素材：

- `2241f292694c0cb2497992ebc760bf2d.jpg` → `public/images/hero/nesta-illustration-bg.jpg`
- 画幅 1888×1043，横向约 1.81:1，左侧包含 `Where Life Breathes`，中部为沙发，右侧为阅读人物。

透明 PNG 均为 32-bit ARGB，四角 alpha 为 0：

- `exec-332ecd8e-1118-4c8e-af89-97ed0c3265df.png` → `hero-spring-table.png`，1312×1199，前景弹簧桌。
- `exec-683b80f9-59a4-403e-aee6-fafb5c7c2dc8.png` → `hero-blue-cabinet.png`，1536×1024，右上远景边柜。
- `exec-787582f0-ca6c-46b9-afde-149343620746.png` → `hero-floating-table.png`，1536×1024，中上方悬浮圆桌。
- `exec-b93e4aee-3686-4302-939b-c12c419ad70d.png` → `hero-rocking-chair.png`，1536×1024，右下前景摇椅。
- `exec-dfbf2c41-8c9a-4308-b86e-56fd2649062e.png` → `hero-table-lamp.png`，1222×1287，左侧中景台灯。

素材复制到项目后保留 PNG alpha，不转为 JPEG。背景生成 960px 与 1800px WebP；PNG 生成 720px 和 1200px WebP，并保留原 PNG 作为 alpha fallback。

## 4. 视觉层级与排版

### 4.1 背景

插画全屏铺满 Hero，桌面使用 `object-fit: cover`，焦点保持在画面中部。只叠加轻度深蓝渐变和底部暗化，不大幅降低饱和度。

移动端使用独立 `object-position`，优先保留人物、沙发和背景文字；必要时允许背景边缘裁切，但不拉伸。

### 4.2 个人信息

- 顶部玻璃导航保持不变。
- `PORTFOLIO / VISUAL × AI × BRAND / ©2026` 保持在 Hero 顶部安全区。
- `VISUAL DESIGNER` 移至画面下部，使用超大半透明／描边混合标题，位于背景上方、家具 PNG 下方。
- 专业方向和 `VIEW SELECTED WORK` 保持底部基线，但提高背景对比度。
- 两枚现有 chip 保留，但位置调整到不遮挡背景原生文案与家具主体。

### 4.3 家具分层

- 蓝色边柜：右上远景，尺寸最小，最低视差。
- 悬浮圆桌：中上方中景。
- 台灯：左侧中景，避开背景左上 `Where Life Breathes`。
- 红色摇椅：右下前景。
- 弹簧桌：左下前景。

家具层使用绝对定位和 CSS 自定义属性描述位置、宽度、深度、旋转与视差强度。家具不按等距网格排列，也不覆盖导航、作品入口或关键文字。

## 5. GSAP 动效设计

### 5.0 首次进入加载动画

Preloader 只在每个浏览器会话第一次进入时播放，继续使用 `sessionStorage` 标记；刷新后的同一会话不重复播放。

视觉结构：

- 黑色底与 NESTA Blue 主色面板。
- 左上角为 `WANG CHENGCHENG / PORTFOLIO 2026`。
- 底部使用三位数大号进度 `000 → 100`。
- 中央放置弹簧桌 PNG，作为加载状态的视觉锚点。
- 细进度线与数字同步，不使用原荧光黄全屏 veil。

进度数据来自 1 张背景和 5 张家具资源的真实加载／decode 状态。每完成一项推进一份目标进度；显示值使用 GSAP tween 平滑追赶目标值，而不是固定时间直接跑到 100。

完成规则：

- 最短展示约 1.2 秒，避免高速缓存时闪屏。
- 单个资源加载失败仍计入完成并记录为降级，不阻塞页面。
- 最长约 3.5 秒触发 failsafe，保证弱网或异常图片不会卡死。
- 资源完成且最短时间满足后，数字到达 100，弹簧桌执行一次短回弹。
- 蓝色面板从中心向上下分开，露出已就绪的 Hero；Hero 入口 timeline 随 `ready` 开始。

Preloader 改为通过 `onReady` 通知 App，而不是 App 固定 1450ms 后单方面设置完成。App 负责写入会话标记并将同一个 `ready` 状态传给 Hero，确保加载退场与 Hero 进入不重叠。

减少动态模式直接显示 100，使用短淡出并立即进入首页，不执行数字追赶、弹簧压缩、回弹或分屏。

### 5.1 进入时间线

使用一个带标签的 `gsap.timeline()`：

1. `background`：背景从 `scale: 1.06`、`blur(8px)` 过渡到清晰稳定状态。
2. `title`：两行标题用 SplitText 字符遮罩进入。
3. `props-far`：边柜等远景家具以短距离淡入。
4. `props-mid`：圆桌与台灯进入。
5. `props-front`：摇椅与弹簧桌最后进入，幅度稍大。
6. `meta`：顶部元信息、专业方向、按钮、edge label 和 scroll cue 收尾。

所有家具默认在 CSS 中可见；GSAP 使用 `fromTo(..., { immediateRender: false })` 或在时间线真正播放时建立初态，避免热更新、减少动态或深链接状态下家具消失。

### 5.2 鼠标景深

桌面细指针设备启用：

- 背景最大移动 3–4px。
- 远景家具 6–8px。
- 中景家具 10–14px。
- 前景家具 16–22px。

每个层级创建可复用的 `gsap.quickTo()` x/y setter。指针位置先归一化为 `-1..1`，再乘以深度强度。指针离开 Hero 后所有层缓慢归零。

### 5.3 单件反馈

- 弹簧桌：`scaleY` 短暂压缩后使用 `back.out` 回弹。
- 蓝色边柜：最多 1.5° 的 rotation 与蓝色轮廓光变量增强。
- 悬浮圆桌：最多 2° 的轻微摆动和整体呼吸。
- 红色摇椅：围绕底部重心左右摇摆。
- 台灯：整体轻微点头并增强局部光晕。

PNG 是扁平图，不单独移动抽屉、灯绳或内部圆球。家具反馈作用于整张 PNG、容器阴影和 CSS 光晕。

家具交互为装饰性增强，不承担导航；键盘和触摸用户不依赖它完成任何任务。触摸端可在 tap 时执行一次短回弹，但不持续跟随触点。

### 5.4 滚动离场

Hero 由顶部滚动至底部时：

- 背景缓慢放大约 4%。
- 前景家具向两侧移动，中景上浮，远景位移最小。
- 标题向上退出并降低透明度。
- 元信息、按钮和 scroll cue 分阶段淡出。
- 动画在进入 About 后结束，不继续运行离屏循环。

ScrollTrigger 只放在顶层 tween/timeline，不嵌套在已有 ScrollTrigger timeline 内。动画只修改 transform、opacity、filter 和少量 CSS 变量。

## 6. React 与性能架构

- 使用现有 `useGSAP`，scope 绑定 Hero 根节点。
- Preloader 使用自己的 scoped `useGSAP`；资源加载 Promise、最短时间计时器和 failsafe 均在卸载时取消或失效。
- App 将 `ready` 的决定权交给 Preloader `onReady`；已存在会话标记时直接跳过 Preloader。
- 家具列表由数据数组生成，每件包含 `id`、`src`、`alt`、`depth` 和 CSS class。
- 延迟触发的 hover/tap 回调全部使用 `contextSafe()`。
- 每件家具的 pointer 更新使用 `quickTo()`，不创建独立 RAF。
- `gsap.matchMedia()` 管理桌面、触摸和 `prefers-reduced-motion`。
- 组件卸载、断点变化或 `ready` 变化时清理 timeline、ScrollTrigger、监听器和 SplitText。
- `will-change` 只用于背景、标题和 5 个真实动画层。

## 7. 响应式与无障碍

- `> 1024px`：完整 5 层家具、鼠标景深、hover 反馈和滚动分层。
- `721–1024px`：缩小家具，降低位移，关闭最强前景遮挡。
- `<= 720px`：背景重新定位；所有家具仍在首页，但其中 2 件缩小至边缘；关闭 pointer parallax，仅保留进入和一次性 tap 反馈。
- `prefers-reduced-motion: reduce`：背景、家具与文字直接显示；不执行字符错峰、漂浮、视差、回弹和滚动位移。
- 新背景使用空 alt／`aria-hidden`；装饰家具使用空 alt／`aria-hidden`，个人标题和真实文字保持可读。
- 文本对比通过 scrim 和局部文字阴影实现，不给整张插画增加重度遮罩。

## 8. 测试与验收

- 资产测试验证 1 张背景和 5 张透明 PNG 的语义路径、响应式版本与有效 alpha。
- Preloader 测试验证 6 项资源、三位数进度、最短展示、资源失败继续、failsafe、`onReady` 只调用一次和 reduced-motion 快速退场。
- App 测试验证首次会话显示 Preloader、同一会话跳过、完成后写入 `wcc-pl` 并启动 Hero。
- Hero 组件测试验证无视频元素、存在新背景、5 件家具、个人标题、元信息和作品入口。
- 动效纯函数测试验证 desktop/touch/reduced 三种模式和各深度强度。
- 源码测试验证 scoped `useGSAP`、`quickTo`、`contextSafe`、`matchMedia` 和 cleanup。
- `pnpm test`、素材测试与 `pnpm build` 全部通过。
- 浏览器验证桌面、1024×768、390×844，无横向溢出、文字遮挡、家具越界和控制台错误。
- 实测 pointer 离开后家具归零，滚动到 About 后 Hero 动画停止。
- reduced-motion 下所有必要内容立即可读。

## 9. 非目标

- 不让家具变成拖拽游戏或导航按钮。
- 不引入 Three.js、Canvas 粒子系统或新的平滑滚动库。
- 不修改 NESTA 007 项目详情。
- 不重绘背景或拆分 PNG 内部结构。
- 不保留 Hero 视频作为自动播放层。
