# 作品集下半段章节氛围与 GSAP 叙事升级设计

## 1. 目标

升级首页 Hero 之后的 About、Ticker、Selected Work／WorkRing、Strengths 和 Contact，使它们从“透明章节叠在整片纯黑背景上”变成一条连续的色彩与动效叙事。新下半段必须延续首页插画景深剧场的色彩、空间感和交互质量，同时继续突出个人作品集内容，而不是变成 NESTA 项目页。

主要目标：

- 每个章节拥有明确但连续的空间氛围。
- 章节之间通过滚动换肤和图形转化衔接，不使用硬切背景。
- About 内容稳定可见，滚动增强不再成为内容可见性的前提。
- Work 轮播把滚动、拖拽、按钮与自动旋转统一为同一运动状态。
- Strengths 从四张平铺黑卡升级为能力路径叙事。
- Contact 保留荧光黄强收尾，并接住前一章节的图形和颜色。
- 桌面有完整 GSAP 体验，平板和手机按设备能力降级。

## 2. 当前实现诊断

真实浏览器和 CSS 检查确认：

- `#about`、`#work`、`.strengths` 的计算背景均为透明，实际继承全局 `#0e0e0e`。
- About 高约 1525px，但背景、光场和章节转场均不存在；巨型 `ABOUT` 仅是低透明描边字。
- About 关键文案依赖通用 `[data-reveal]`，在实际滚动状态下可能长时间保持低可见度。
- Ticker 是唯一明显的中段色彩变化，但只是独立荧光黄横条，没有转化为 Work 的结构元素。
- Work 标题、元信息、快速索引和 3D 环彼此分散；背景仍为纯黑。
- WorkRing 同时拥有自动 tween、拖拽、惯性、按钮、range 输入和鼠标旋转，控制源较多，但没有垂直滚动主叙事。
- Strengths 只有四张黑色卡片、轻微 tilt 和局部径向光，背景仍为纯黑。
- Contact 已有荧光黄、SplitText、两个 orb 和磁性链接，是下半段唯一完整的场景变化。

## 3. 总体色彩路径

页面色彩按以下顺序连续变化：

1. Hero：插画蓝与深海军蓝遮罩。
2. About：深海军蓝 `#071426`，辅以 NESTA Blue `#287BEA`、Signal Cyan `#61BDD9` 和米白文字。
3. Ticker：荧光黄 `#D8FF36`，作为章节阈值。
4. Work：Soft Cream `#FFF3EA` 主空间，深色文字与 NESTA Blue 结构线；当前项目 accent 作为局部动态色。
5. Strengths：Deep Burgundy `#4B101C` 主空间，米白文字、蓝色光场和荧光黄节点。
6. Contact：荧光黄全屏收尾，深色文字与 NESTA Blue 交互扫描线。

颜色通过 ScrollTrigger scrub 插值，过渡区不小于半个视口。章节背景不会在边界一帧内跳变。

## 4. PortfolioAtmosphere 固定氛围层

在 Hero 之后、`main` 正文之后新增固定背景组件 `PortfolioAtmosphere`。它不包含正文、不参与布局、不拦截鼠标，只渲染：

- 两个可变位置和半径的径向光场。
- 一层低透明 12 栏网格。
- 一条可变形圆弧／弹簧曲线。
- 少量粒子节点。
- 一层低透明噪点。

所有视觉状态通过 CSS 变量控制：

- `--atmo-bg`
- `--atmo-fg`
- `--atmo-accent`
- `--atmo-glow-a-x/y/size/alpha`
- `--atmo-glow-b-x/y/size/alpha`
- `--atmo-grid-alpha`
- `--atmo-curve-alpha`
- `--atmo-noise-alpha`

`usePortfolioAtmosphere` 是唯一允许修改这些全局变量的 hook。About、Work、Strengths 和 Contact 不直接操作氛围层，避免多个组件争夺背景状态。

每个章节只声明最终主题对象。hook 按页面顺序创建 ScrollTrigger，并使用 `gsap.utils.interpolate()`、`mapRange()`、`clamp()` 将当前进度映射到颜色、光场和图形变量。

## 5. About 章节升级

### 5.1 Hero 到 About

- Hero 前景家具向两侧退出时，插画蓝背景压深为海军蓝。
- 首页弹簧桌的弧线视觉延伸为 About 时间轴曲线。
- 巨型 `ABOUT` 描边字从右侧缓慢横穿章节，不再静止在低对比背景中。

### 5.2 首段布局与动效

- 桌面端肖像短暂固定，固定区间约 120vh。
- 右侧标题、简介、身份标签按 `identity → statement → introduction` 三段进入。
- 肖像从深蓝双色调随 scroll progress 恢复局部原色。
- 肖像图片、网格和标签以 3–5% 的不同幅度移动。
- 背景青蓝光场响应指针，但位移不超过 12px。

关键文案默认可见。GSAP 使用 `fromTo(..., immediateRender:false)` 增强进入，不在 CSS 中把必要内容永久设置为 `opacity:0`。

### 5.3 数据面板

- 三项统计改为横向数字面板。
- 每个面板包含节点、细线、CountUp 数字和标签。
- 面板进入视口中心时节点点亮、数字开始、背景光场轻微聚焦到该面板位置。
- 三个面板共享一个 batch／timeline，不创建三套独立 ScrollTrigger scrub。

### 5.4 时间轴与荣誉

- 时间轴使用 SVG path 或 CSS 线条逐段绘制。
- 每个经历节点到达阅读中心时点亮年份，标题上移，细节淡入。
- 荣誉从时间轴末端展开为三张错位卡片。
- 邮箱成为 About 的结束锚点，使用磁性箭头和蓝色扫描边。

### 5.5 响应式

- `>1024px` 启用肖像 pin。
- `721–1024px` 取消 pin，保留双色调过渡和时间轴绘制。
- `<=720px` 使用肖像 → 标题 → 数据 → 时间轴 → 荣誉的自然单列顺序。

## 6. Ticker 章节阈值

- 荧光黄 Ticker 从一条 2px 线扩展成完整跑马带。
- token 图片和文字根据滚动速度产生最多 4° 的倾斜。
- 悬停暂停；离开恢复。
- Ticker 离场时高度收缩，底边转化为 Work 区顶部 NESTA Blue 基准线。
- reduced-motion 显示静态双行 token，不运行 ticker loop。

## 7. Selected Work 与 WorkRing 升级

### 7.1 Work 开场

- 背景为 Soft Cream，文字为深色。
- `SELECTED WORK.` 横跨工作区，使用编辑型大标题而非孤立左列。
- Period、Projects、Scope、Action 组成四格信息带。
- ProjectRail 在桌面端作为 sticky 索引，显示当前项目状态。

### 7.2 蓝图展厅

- WorkRing 背景包含透视网格、环形轨道和当前项目 accent 光晕。
- 垂直滚动成为主控制源：scroll progress 映射到 angle。
- 拖拽、按钮和 range 控件仍写入同一个 `A.current.angle`。
- 用户滚动、拖拽或点击后暂停自动旋转；停止交互 1.2 秒后才恢复低速自动旋转。
- 任何时刻只允许 scroll、drag、settle、auto 四个来源中的一个写 angle。

### 7.3 卡片层级

- 正面卡片提高尺寸、饱和度、清晰度和光边。
- 后方卡片降低对比度并转为轮廓状态。
- 中央大编号、下方标题和分类随 front index 同步。
- 当前项目变化时，只插值 Work 区 CSS accent 变量，不重绘背景 DOM。

### 7.4 项目转场

- 使用 `Flip.getState()` 记录触发卡片状态。
- 打开 ProjectDetail 后用 `Flip.from()` 将卡片扩展到详情顶部视觉区域。
- 关闭详情恢复滚动角度、触发卡片和键盘焦点。
- Flip 失败或减少动态时直接使用现有详情覆盖层。

### 7.5 平板和手机

- `721–1024px` 使用横向 2D 卡片轨道，不使用深环。
- `<=720px` 使用横向 scroll-snap 大卡片，一次突出一个项目。
- 手机不启用自动旋转、3D perspective 或 scroll 驱动 angle。

## 8. Strengths 能力实验室

### 8.1 背景与结构

- Work 的蓝色轨道收缩后进入酒红背景。
- 四个低透明能力光场与四条连接线对应四项能力。
- 标题使用米白，编号用荧光黄，当前卡片用 NESTA Blue。

### 8.2 卡片叙事

- 桌面端标题短暂固定。
- 四张卡沿一条路径依次进入阅读中心。
- 当前卡片状态：编号放大、标题由描边变实色、描述与工具词进入、对应光场增强。
- 其他卡片保持可见但降低对比度。
- pointer tilt 最大 3.5°，只在当前卡片可见时启用。

### 8.3 Toolkit

- 工具关键词改为双层反向移动。
- scroll velocity 影响速度，悬停暂停。
- 四张卡完成后，连接线合并至 Toolkit。
- reduced-motion 显示静态换行工具列表。

## 9. Strengths 到 Contact

- 酒红背景中心生成荧光黄圆形并随滚动扩大，最终覆盖全屏。
- 四条能力连接线收束到圆心，转化为 Contact 的两个 orb。
- 过渡使用 transform／clip-path，不动画布局尺寸。

## 10. Contact 升级

- 保留荧光黄背景和现有联系内容。
- 三行标题使用不同方向和 stagger 节奏的 SplitText 进入。
- 两个 orb 使用不同阻尼响应指针，pointerleave 后归位。
- 邮箱 hover 显示 NESTA Blue 下划线扫描。
- Back to Top 使用 ScrollToPlugin 返回 Hero，并设置合理 offset。
- 手机关闭 orb 跟随，只保留一次轻微呼吸。

## 11. 组件与 Hook 边界

新增：

- `src/components/PortfolioAtmosphere.jsx`
- `src/motion/portfolioThemes.js`
- `src/motion/usePortfolioAtmosphere.js`
- `src/motion/useAboutStory.js`
- `src/motion/useStrengthsStory.js`

修改：

- `App.jsx`：在 Hero 与 main 之间挂载 Atmosphere。
- `About.jsx`：添加稳定动效 hook、时间轴 path 和必要 data hooks。
- `TickerTape.jsx`：加入 section ref、速度控制和过渡 hooks。
- `SelectedWork.jsx`：增加 Work 场景容器、sticky rail 和主题 data。
- `WorkRing.jsx`：统一 angle 控制源、scroll 驱动、responsive 模式和 Flip 触发信息。
- `ProjectDetail.jsx`／App 打开逻辑：保存触发卡片与焦点。
- `Strengths.jsx`：增加连接线、当前卡 hook 和 Toolkit 双轨。
- `Contact.jsx`：扩展 orb、SplitText 和 ScrollToPlugin。
- `styles.css`：章节主题、Atmosphere、响应式和 reduced-motion。

不新增第二个平滑滚动容器，不引入 Lenis、ScrollSmoother、Three.js 或 Canvas 粒子系统。

## 12. GSAP skills 与插件使用

- `gsap-react`：所有组件使用 scoped `useGSAP` 与 cleanup。
- `gsap-timeline`：每个章节只有一个主 timeline，使用 labels 和 position parameter。
- `gsap-scrolltrigger`：背景换肤、pin、scrub、batch 与 refresh。
- `gsap-core`：颜色、transform、opacity、CSS variables、matchMedia。
- `gsap-performance`：transform 优先、限制 `will-change`、pointer 使用 quickTo。
- `gsap-plugins`：Flip、ScrollToPlugin、SplitText；注册一次并在卸载时 revert。
- `gsap-utils`：interpolate、mapRange、clamp、snap、wrap。

禁止：

- 把 ScrollTrigger 放进已受 ScrollTrigger 控制的子 timeline。
- 同一个 trigger 同时使用 scrub 和 toggleActions。
- 对 pinned 元素本身做位移动画；只动画内部子层。
- 在每帧回调中读写布局尺寸。
- 为所有背景元素无差别设置 `will-change`。

## 13. 数据流与控制权

### 13.1 背景

章节 DOM → `usePortfolioAtmosphere` 读取顺序和进度 → theme interpolation → Atmosphere CSS variables。

### 13.2 WorkRing

所有输入写入统一 angle：

- scroll progress → 目标角度。
- drag → 即时角度与 fling。
- button／range → settle 目标。
- auto → 仅空闲时写入。

状态机优先级：`drag > settle > scroll > auto`。进入更高优先级时停止低优先级 tween；结束后由统一 idle timer 决定是否恢复 auto。

### 13.3 ProjectDetail

点击卡片 → 保存 `triggerElement`、front index、angle、focus → 打开详情 → 可选 Flip → 关闭详情 → 恢复 angle／scroll／focus。

## 14. 故障与静态降级

- Atmosphere 未挂载：各章节拥有最终静态背景色。
- GSAP／ScrollTrigger 不可用：正文和卡片全部可见，Work 使用按钮与普通链接。
- Flip 失败：直接打开详情。
- 背景变量插值失败：保持上一主题，不影响内容。
- 图片失败：显示标题、编号和项目入口。
- `prefers-reduced-motion`：取消 pin、scrub、Flip、逐字、视差和速度响应；显示每节最终主题。
- 断点变化：`gsap.matchMedia()` 自动 revert，ScrollTrigger 在图像和字体稳定后 refresh 一次。

## 15. 测试与验收

### 自动测试

- 主题数据：4 个章节主题、颜色和变量完整。
- Atmosphere：CSS 变量、pointer-events、fixed 层级、静态降级。
- About：必要文案默认可见、时间轴节点数量、pin 模式纯函数。
- Ticker：速度映射、hover pause、reduced-motion 静态。
- WorkRing：控制权优先级、angle snap、scroll 映射、drag 恢复、auto idle、responsive mode。
- Flip：触发元素与焦点恢复；无 Flip fallback。
- Strengths：4 张卡、当前索引、连接线、Toolkit 双轨。
- Contact：ScrollToPlugin 注册、磁性链接与 reduced-motion。
- 样式：章节最终背景、手机无 pin、无关键内容默认隐藏。

### 浏览器验收

- 1440×1000、1024×768、390×844。
- Hero → About → Ticker → Work → Strengths → Contact 色彩连续。
- About 文案始终可见，肖像 pin 不抖动。
- Work 滚动、拖拽、按钮和自动旋转不抢控制。
- 打开／关闭项目恢复卡片位置与焦点。
- Strengths 卡片路径无重叠，Toolkit 不造成横向滚动。
- Contact Back to Top 回到 Hero。
- 控制台无 React、GSAP、ScrollTrigger、ResizeObserver 和资源错误。
- reduced-motion 内容完整，无固定空白和不可关闭状态。

## 16. 非目标

- 不重做 Hero 插画景深剧场和首次加载动画。
- 不修改项目详情内容或 007 内部作品排版。
- 不引入新图片、视频或 3D 资源。
- 不新增 CMS、后台或外部服务。
- 不把整站改成单一 NESTA 品牌网站。
