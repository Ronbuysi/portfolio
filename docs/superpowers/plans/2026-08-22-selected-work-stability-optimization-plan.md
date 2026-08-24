# Selected Work 作品区稳定化与动效优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** 在保留黑色、米白、荧光黄、巨大字体和项目编号等现有视觉识别的前提下，把作品区从“不可控的持续自动旋转”优化成“保留自动旋转记忆点、且速度可由用户控制、首屏可见、状态稳定、移动端可靠”的 Selected Work 浏览系统。

**Architecture:** 作品区拆成三个职责：\`SelectedWork\` 管理当前项目和打开详情；\`ProjectRail\` 管理项目索引与键盘导航；\`WorkRing\` 保留 3D 环形视觉，但改为受控自动旋转，并增加位于轮播下方的速度滑块、暂停状态和可访问性。\`ProjectRailStage\` 不再作为替代方案引入，避免两套作品浏览系统同时渲染、重复加载图片和争抢焦点。

**Tech Stack:** React、原生 IntersectionObserver、requestAnimationFrame、CSS sticky/scroll-snap、Vitest、Testing Library。第一阶段不新增 GSAP 或其他动画依赖，先用原生方案保证稳定；只有在验收证明原生滚动无法达到目标时，才单独评估增加依赖。

> **最新需求覆盖（2026-08-22）：保留 WorkRing 自动旋转。** 本文件中任何“删除 WorkRing”“不再自动旋转”“移动端彻底取消 3D”的旧步骤，都由文末“Task 10：可控自动旋转速度滑块”覆盖。实现 agent 必须以 Task 10 为最终行为标准：自动旋转默认开启但速度可控，速度为 0 时暂停，用户拖动/悬停/键盘操作时临时暂停，移动端默认暂停但仍可手动开启。

---

## 不可破坏的产品约束

1. 作品区在 1280×720 首屏必须出现第一张完整作品卡片的主体，不能只看到标题和黑色空白。
2. 页面保留自动旋转，但旋转速度必须由用户控制；速度为 0 时完全暂停，默认速度不能造成难以点击的快速漂移。
3. 桌面端每次只突出一个当前项目；其他项目可见但不能抢走主焦点。
4. 所有 6 个项目都必须可以通过鼠标、触摸、键盘访问。
5. 移动端不使用 3D 透视、侧面卡片或 hover-only 标签。
6. 所有项目封面必须保留原始构图，不使用为了统一卡片比例而裁切海报文字或主体的 \`object-fit: cover\`。
7. \`#work\`、\`#work/<project-id>\`、关闭详情、上一个/下一个项目的现有 URL 行为不能破坏。
8. 作品详情组件和六个 Story 的内容、图片、顺序不在本次改造中重写。
9. 生产页面不显示 \`MOTION: FORCED\` 等调试标识。
10. \`prefers-reduced-motion: reduce\` 下内容立即可见，不能因为关闭动效而无法访问项目。
11. 页面不能出现横向 body overflow、图片加载后的布局跳动、控制台 error 或资源 404。
12. 任何一步验收失败都先修复或回退该步，不能继续叠加后续动效。

## 目标交互

### 桌面端

- 进入 \`#work\` 时，标题、项目元信息和第一张主卡片位于同一视觉范围内。
- 主卡片显示完整封面、编号、中文标题、英文标题、类别、年份和一个简短描述。
- 作品区保留 3D 环形自动旋转；用户可以用下方速度滑块调节 0—100%，速度 0 即暂停，不能通过自动旋转强迫用户等待。
- 左右箭头、项目索引、鼠标拖动和键盘方向键都可以改变当前项目。
- 选择项目只改变预览；点击主卡片或 \`OPEN CASE\` 才打开详情。
- 主卡片切换：旧卡片淡出/轻微横移，新卡片从相反方向进入；总时长 520ms，\`power3.out\` 等价的 CSS cubic-bezier。
- hover/focus/拖动/键盘操作时临时暂停自动旋转；恢复时从当前角度平滑继续，不跳回 001。

### 移动端

- 作品区改成纵向卡片列表或横向 snap 列表，默认使用纵向列表以避免小屏横向溢出。
- 每张卡片完整展示图片、编号、标题、类别和打开按钮。
- 项目索引成为可换行的普通按钮组，不固定在超大空白区域上方。
- 移动端默认自动旋转为 0，保留速度滑块作为明确的用户选择；不依赖 hover、不隐藏标题、不使用超出屏幕的 3D 卡片。
- 首张卡片在进入作品区后的首屏至少露出图片主体和标题。

---

## 文件职责和变更范围

**Modify**
- \`src/components/SelectedWork.jsx\`：移除 \`WorkRing\`，维护 \`activeId\`，连接索引、主卡片和详情打开。
- \`src/components/ProjectRail.jsx\`：改为受控索引导航，支持当前状态、键盘方向键和 focus。
- \`src/styles.css\`：删除/覆盖 \`.work-ring*\` 主布局，新增稳定的作品轨道、主卡、移动端样式和 reduced-motion 规则。
- \`src/components/SelectedWork.test.jsx\`：更新选择、打开、可访问性和完整项目数量测试。
- \`src/components/ProjectRail.test.jsx\`：新增索引导航行为测试。
- \`package.json\`：仅在需要时移除不再使用的动画依赖；本方案默认不增加依赖。

**Create**
- \`src/components/WorkRing.jsx\`：保留 3D 环形，增加受控速度、暂停原因、滑块和键盘状态。
- \`src/components/WorkRing.test.jsx\`：速度滑块、暂停、自动旋转和可访问性测试。

**Do not delete**
- \`src/components/WorkRing.jsx\`：本次优化保留并改造，不得删除。

**Do not modify**
- \`src/components/ProjectDetail.jsx\`
- \`src/components/OperationStory.jsx\`
- \`src/components/SanfuCampaignStory.jsx\`
- \`src/components/PosterStory.jsx\`
- \`src/components/DaodaoBarStory.jsx\`
- \`src/components/BrandStory.jsx\`
- \`src/components/IpStory.jsx\`
- \`src/data/projects.js\` 中已有素材和详情内容

---

## Task 1: 建立改造前基线和失败保护

**Files:**
- Test: \`src/components/SelectedWork.test.jsx\`
- Test: \`src/components/ProjectRailStage.test.jsx\`

- [ ] **Step 1: 记录当前基线**

运行：

    pnpm test
    pnpm build

记录测试数量、构建结果和当前浏览器控制台状态。若基线已有失败，先把失败记录为本次改造前问题，不要把它混入新改造。

- [ ] **Step 2: 建立必须保持的项目契约测试**

测试必须验证：

    expect(screen.getByText('006 CASES')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /运营视觉设计|生活新搭案|成长日常|倒倒 bar|MY MAY|TOSS DIARY/ })).toHaveLength(6)
    expect(container.querySelectorAll('[data-project-card]')).toHaveLength(6)

每个项目卡片必须有对应的 \`href="#work/<id>"\` 或等价的打开按钮，不能因为更换视觉结构而丢失项目入口。

- [ ] **Step 3: 建立回退点**

在开始删除 \`WorkRing\` 前，复制当前 \`SelectedWork.jsx\`、\`WorkRing.jsx\` 和相关 CSS 到本地工作备份目录；实现 agent 若使用 git，则在 Task 1 完成后建立 checkpoint。没有 checkpoint 不得进入删除旧组件的步骤。

---

## Task 2: 设计受控状态模型

**Files:**
- Modify: \`src/components/SelectedWork.jsx\`
- Modify: \`src/components/ProjectRail.jsx\`
- Test: \`src/components/ProjectRail.test.jsx\`

- [ ] **Step 1: 定义状态边界**

\`SelectedWork\` 只维护：

    const [activeId, setActiveId] = useState(projects[0]?.id ?? '')

事件职责必须分开：

- \`onSelect(id)\`：只切换当前预览，不打开详情。
- \`onOpen(id)\`：调用现有 \`onOpen\`，打开 \`#work/<id>\` 详情。
- \`onClose\`：继续由现有详情层处理，不在作品轨道中复制。
- \`onStep(direction)\`：根据当前项目计算前后项目并调用 \`onSelect\`。

禁止把自动计时器、详情路由和滚动事件全部塞进一个组件。

- [ ] **Step 2: 改造 ProjectRail 接口**

目标接口：

    <ProjectRail
      projects={projects}
      activeId={activeId}
      onSelect={setActiveId}
      onOpen={onOpen}
    />

索引按钮默认选择项目，不直接打开详情；每个按钮通过 \`aria-current={project.id === activeId ? 'true' : undefined}\` 暴露当前状态。按钮文本必须包含编号和项目名。

- [ ] **Step 3: 添加键盘行为**

ProjectRail 获得焦点后：

- ArrowRight / ArrowDown：选择下一个项目。
- ArrowLeft / ArrowUp：选择上一个项目。
- Home：选择第一个。
- End：选择最后一个。
- Enter / Space：打开当前项目。
- 方向键必须 \`preventDefault()\`，避免页面被意外滚动。
- 选择到边界时循环回到另一端，但不产生自动动画。

测试必须覆盖 001 → 002、001 ← 006、Home、End、Enter 和 Space。

- [ ] **Step 4: 验证 ProjectRail**

运行：

    pnpm vitest run src/components/ProjectRail.test.jsx

Expected：所有按钮可见，active 状态唯一，6 个项目都能通过键盘到达，Enter/Space 只打开当前项目。

---

## Task 3: 创建稳定的 ProjectRailStage（过时方案，不执行；由 Task 10 的 WorkRing 改造替代）

**Files:**
- Create: \`src/components/ProjectRailStage.jsx\`
- Test: \`src/components/ProjectRailStage.test.jsx\`

- [ ] **Step 1: 定义主卡片内容**

每个项目主卡必须读取已有数据：

- \`project.index\`
- \`project.title\`
- \`project.englishTitle\`
- \`project.category\`
- \`project.year\`
- \`project.tools\`
- \`project.description\`
- \`project.cover\`

不要在组件内手写 001—006 的标题或素材路径。

主卡结构必须包含：

    article[data-project-card]
      picture
        source media="(max-width: 720px)" srcSet="...-w960.webp"
        img src="...-w1800.webp"
      .project-card__body
        .project-card__index
        h3
        .project-card__english
        .project-card__meta
        p
        button "OPEN CASE"

- [ ] **Step 2: 编写图片 URL 和 fallback 规则**

封面路径统一转换为 \`-w1800.webp\`，移动端 source 使用 \`-w960.webp\`；如果转换路径不存在，保留原始 png/jpg 作为 \`img src\` fallback。禁止用 \`object-fit: cover\`，使用：

    object-fit: contain;
    background: #131313;

纵向海报完整显示，不能截断文字、主体和边缘。

- [ ] **Step 3: 实现受控切换**

Stage 接收：

    <ProjectRailStage
      projects={projects}
      activeId={activeId}
      onSelect={onSelect}
      onOpen={onOpen}
    />

切换时只渲染一个 active 主卡作为主视觉，其他项目以简化预览或隐藏的语义列表存在。新旧卡片必须有稳定的 \`key\`，不能因为 active 改变导致所有图片重新加载。

使用 CSS class：

- \`is-active\`
- \`is-entering\`
- \`is-leaving\`
- \`data-project-id\`

不要使用 setInterval，不要使用无限 requestAnimationFrame。

- [ ] **Step 4: 加入安全的滚动选择**

桌面端使用一个高度受控的滚动区：

- 作品区标题和主卡片位于同一 sticky viewport。
- 6 个项目对应 6 个不可见但可访问的 sentinel。
- IntersectionObserver 的 threshold 使用 \`0.55\`，同一时刻只接受最大 intersectionRatio 的 sentinel。
- 只有用户实际滚动时才更新 activeId。
- 当主卡片或项目索引获得焦点时，暂停 observer 对 active 状态的覆盖，直到 focus 离开。
- 滚动快速跳跃时只提交最后一个有效项目，不连续触发 6 次动画。

如果 IntersectionObserver 不可用，保持 001 为 active，并让左右箭头和索引按钮继续正常工作。

- [ ] **Step 5: 完成 Stage 基础测试**

必须验证：

- 默认 active 为第一个项目。
- activeId 变化只显示对应标题、编号和图片。
- \`OPEN CASE\` 调用 \`onOpen(activeId)\`。
- 6 张图片都有 alt。
- 所有 6 个项目都能通过索引切换。
- 没有计时器和无限动画依赖。

运行：

    pnpm vitest run src/components/ProjectRailStage.test.jsx

---

## Task 4: 重组 SelectedWork 首屏布局（仅执行首屏与 WorkRing 速度控制部分；不引入 ProjectRailStage）

**Files:**
- Modify: \`src/components/SelectedWork.jsx\`
- Modify: \`src/styles.css\`
- Test: \`src/components/SelectedWork.test.jsx\`

- [ ] **Step 1: 删除重复渲染**

SelectedWork 中删除：

    import WorkRing from './WorkRing'

以及：

    <WorkRing projects={projects} onOpen={onOpen} />

保留一个 ProjectRail 和一个 ProjectRailStage。禁止同时渲染旧环形和新轨道，否则会重复加载图片、重复占据高度、产生两个交互焦点。

- [ ] **Step 2: 调整桌面首屏结构**

目标 DOM 顺序：

    section#work
      .work-intro
        eyebrow
        h2
        meta
        ProjectRail
        ProjectRailStage

CSS 目标：

- work 标题字号降低到当前桌面尺寸的约 65%—75%。
- meta 与索引之间保持 24—32px。
- Stage 在标题区之后立即开始，不能再有大于 160px 的无内容空白。
- 1280×720 中第一张主卡的主体必须可见。
- Stage 采用 \`min-height: clamp(520px, 66svh, 720px)\`，不能固定超过视口高度。
- 取消旧 \`margin-left: calc(50% - 50vw)\` 对索引头部的影响；视觉全宽的图片可以全宽，但索引和标题必须与 shell 左边界对齐。

- [ ] **Step 3: 处理主卡信息层级**

主卡必须同时显示：

- 编号：荧光黄。
- 中文标题：最大。
- 英文标题：次级。
- 类别 / 年份：小型 mono。
- description：最多 2—3 行，超出隐藏。
- OPEN CASE：明显但不抢主标题。

不要把标题全部藏在 hover label 中。

- [ ] **Step 4: 更新作品区测试**

测试必须验证：

- \`SelectedWork\` 中不存在 \`.work-ring__card\`。
- 只存在一个 \`.project-rail\` 和一个 \`.project-rail-stage\`。
- 进入作品区时第一张项目卡已经存在于 DOM。
- 每个项目的标题、类别、年份都能被访问。
- 点击 OPEN CASE 仍然调用原有详情打开回调。

---

## Task 5: 实现桌面端滚动动效

**Files:**
- Modify: \`src/components/ProjectRailStage.jsx\`
- Modify: \`src/styles.css\`
- Test: \`src/components/ProjectRailStage.test.jsx\`

- [ ] **Step 1: 实现一次性进入动画**

进入 Stage 时：

- 标题/编号先进入。
- 图片延迟 80ms。
- 图片使用 \`clip-path: inset(0 0 100% 0)\` 到完整显示。
- 总时长 520—650ms。
- 只播放一次。
- 图片最多缩放到 \`1.025\`。
- 禁止整张卡片旋转。

- [ ] **Step 2: 实现项目切换**

桌面端切换时：

- 旧卡向当前方向移动 24—40px 并降低 opacity。
- 新卡从反方向进入。
- 标题、编号和图片使用同一 activeId。
- 同一切换不能产生两个 active 主卡。
- 切换期间再次点击索引时，只保留最后一次选择，不堆积动画队列。

- [ ] **Step 3: 增加滚动进度，但不让滚动锁死**

滚动区域必须满足：

- 页面仍然可以正常向上和向下滚动。
- 不对 \`wheel\` 使用永久 \`preventDefault\`。
- 不修改 \`document.body.style.overflow\`。
- sticky 结束后页面自然进入下一个 ABOUT/strengths 区域。
- 触摸设备不被桌面滚动逻辑拦截。
- Scroll event 使用 requestAnimationFrame 合帧，并在 cleanup 时取消。

- [ ] **Step 4: 实现 hover/focus 状态**

hover/focus 只做：

    outline-color: acid-lime;
    transform: scale(1.015);
    opacity: 1;

进入图片或按钮后不能继续自动转动，因为本方案已经移除自动转动。focus-visible 必须有清晰的 2px outline。

---

## Task 6: 实现移动端安全降级

**Files:**
- Modify: \`src/components/ProjectRailStage.jsx\`
- Modify: \`src/components/ProjectRail.jsx\`
- Modify: \`src/styles.css\`
- Test: \`src/components/ProjectRailStage.test.jsx\`

- [ ] **Step 1: 在 720px 以下切换普通列表**

移动端不渲染桌面 3D、perspective、横向拖拽和滚动 pinned 轨道。使用普通纵向结构：

    .project-rail-stage--mobile
      article[data-project-card]
      article[data-project-card]
      ...

每张卡片完整展示封面与信息。

- [ ] **Step 2: 固定移动端卡片比例**

- 容器宽度：\`100%\`。
- 图片区域：根据图片实际比例使用 \`aspect-ratio: 4 / 3\` 或 \`aspect-ratio: 3 / 4\`，不能强行统一裁切。
- 标题直接显示。
- 卡片间距：24—40px。
- 不允许 \`width\` 超过容器。
- 检查 \`document.documentElement.scrollWidth === document.documentElement.clientWidth\`。

- [ ] **Step 3: 移动端索引行为**

移动端索引按钮点击后：

- 使用 \`scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' })\`。
- 选择后按钮保留 \`aria-current\`。
- 如果浏览器不支持 smooth scroll，立即跳转，不报错。
- 点击按钮不会打开详情；OPEN CASE 才打开详情。

- [ ] **Step 4: 390×844 验收**

进入 \`#work\` 后必须满足：

- 第一张作品主体和标题都可见。
- 不出现只露出卡片顶部的情况。
- 不出现大片无法解释的空白。
- 6 个项目都能顺序访问。
- 页面不横向溢出。

---

## Task 7: 处理生产环境和可访问性问题

**Files:**
- Modify: \`src/components/App.jsx\` 或实际渲染 \`MOTION: FORCED\` 的文件
- Modify: \`src/components/ProjectRail.jsx\`
- Modify: \`src/components/ProjectRailStage.jsx\`
- Modify: \`src/styles.css\`
- Test: \`src/components/ProjectRail.test.jsx\`
- Test: \`src/components/ProjectRailStage.test.jsx\`

- [ ] **Step 1: 移除调试 badge**

\`MOTION: FORCED\` 只允许在明确的开发环境下显示。生产构建不应渲染该节点。不要把 URL query 直接暴露成作品集视觉元素。

- [ ] **Step 2: 修复键盘可达性**

- 6 个项目按钮都必须在 tab 顺序中。
- 禁止使用 \`tabIndex={index < 3 ? 0 : -1}\` 这种只开放前三张卡片的逻辑。
- 非 active 卡片可以视觉弱化，但不能从键盘可达性中删除。
- 所有图片 alt 不得为空。
- 所有可点击卡片必须有明确可读名称。

- [ ] **Step 3: reduced-motion**

当 \`prefers-reduced-motion: reduce\` 且 URL 没有明确强制动效时：

- active 卡片立即显示。
- 不使用 clip-path 过渡。
- 不使用 smooth scroll。
- 不运行 requestAnimationFrame scroll loop。
- 不使用 transform 过渡。
- 项目仍可通过按钮、键盘和 OPEN CASE 打开。

---

## Task 8: 清理旧 WorkRing 和 CSS（过时方案，不执行删除 WorkRing 部分；只清理冲突 CSS）

**Files:**
- Delete: \`src/components/WorkRing.jsx\`
- Modify: \`src/components/SelectedWork.test.jsx\`
- Modify: \`src/styles.css\`

- [ ] **Step 1: 确认无引用**

运行：

    rg -n "WorkRing|work-ring|AUTO_SPEED|AUTO_INTERVAL" src

Expected：除历史文档外，src 中没有 WorkRing、work-ring、AUTO_SPEED、AUTO_INTERVAL 引用。

- [ ] **Step 2: 删除旧组件**

只有在新 Stage 已通过 Task 3—7 的测试后，才删除 WorkRing。不要先删再补新组件。

- [ ] **Step 3: 清理旧 CSS**

删除或完全覆盖：

- \`.work-ring\`
- \`.work-ring__stage\`
- \`.work-ring__spin\`
- \`.work-ring__card\`
- \`.work-ring__hub\`
- \`.work-ring__path\`
- \`.work-ring__caption\`

保留与其他页面共用的变量、shell、按钮和 typography，不做全局重置。

---

## Task 9: 端到端验收和回归测试

**Files:**
- Test: 所有现有测试
- Modify: \`src/components/SelectedWork.test.jsx\`（若验收发现缺口）

- [ ] **Step 1: 运行单元测试**

    pnpm vitest run src/components/ProjectRail.test.jsx src/components/ProjectRailStage.test.jsx src/components/SelectedWork.test.jsx

Expected：PASS。

- [ ] **Step 2: 运行全量测试**

    pnpm test

Expected：原有测试全部通过，新测试全部通过；不能以跳过测试作为解决方案。

- [ ] **Step 3: 构建**

    pnpm build

Expected：Vite build 成功，没有未使用组件导致的 import error、路径错误或 WebP 资源错误。

- [ ] **Step 4: 浏览器手动检查**

在以下尺寸逐个检查：

- 1440×900
- 1280×720
- 1024×768
- 768×1024
- 390×844

每个尺寸检查：

1. 点击 WORK 后第一张作品是否立即可见。
2. 作品标题、类别、年份是否清楚。
3. 等待 10 秒，当前项目是否保持不变。
4. 点击每个索引，是否只切换到对应项目。
5. 点击 OPEN CASE，是否进入正确详情。
6. 关闭详情，是否回到原来的作品区状态。
7. 上一个/下一个项目是否不会越界。
8. 页面是否没有横向溢出。
9. 控制台是否 0 error。
10. 图片请求是否没有 404。

- [ ] **Step 5: 键盘验收**

不使用鼠标完成：

- Tab 到作品索引。
- 使用方向键选择 001—006。
- 使用 Enter 打开当前项目。
- Escape 关闭详情。
- Tab 继续移动，不应丢失焦点或跳到页面顶部。

- [ ] **Step 6: reduced-motion 验收**

开启系统 reduced motion，重新访问页面：

- 第一张卡片立即可见。
- 不出现持续旋转。
- 不出现布局跳动。
- 所有项目仍然可选、可打开。
- 详情页图片与文字完整显示。

---

## 完成标准

只有同时满足以下条件，才能宣布作品区改造完成：

- 旧 \`WorkRing\` 已删除且无 src 引用。
- 首屏能看到实际作品，不再只有标题和空白。
- 没有持续自动旋转。
- 桌面端主项目稳定，切换方向清楚。
- 移动端为完整卡片列表，不再是桌面 3D 的缩小版。
- 6 个项目鼠标、触摸、键盘均可访问。
- 作品图不被错误裁切。
- \`MOTION: FORCED\` 不出现在生产页面。
- \`pnpm test\` 和 \`pnpm build\` 通过。
- 1440×900、1280×720、1024×768、768×1024、390×844 均无横向溢出和控制台错误。
- 详情页六种 Story 类型全部保持原有内容和入口行为。

## 失败回退规则

- 如果桌面 pinned 逻辑导致页面滚动锁死，立即关闭 pinned，只保留普通纵向主卡切换。
- 如果某浏览器不支持 IntersectionObserver，使用固定 001 + 手动索引，不注入 polyfill。
- 如果 WebP 变体加载失败，立即回退到原始图片路径，不隐藏图片。
- 如果移动端卡片裁切了海报文字，改为 \`contain\`，不调整原图。
- 如果新组件测试失败，不删除 WorkRing；回退到 checkpoint 后修复。
- 不允许通过隐藏内容、关闭测试、增加随机延迟或强制跳转来掩盖问题。
+

---

## Task 10：保留自动旋转并增加速度滑块（最新最终方案）

**Files:**
- Modify: \`src/components/WorkRing.jsx\`
- Modify: \`src/components/SelectedWork.jsx\`
- Modify: \`src/styles.css\`
- Modify: \`src/components/SelectedWork.test.jsx\`
- Create: \`src/components/WorkRing.test.jsx\`

### 10.1 速度模型

- [ ] **Step 1: 删除未使用的时间常量，建立唯一速度来源**

不要同时维护 \`AUTO_INTERVAL\` 和 \`AUTO_SPEED\`。使用以下语义：

    const DEFAULT_SPEED = 32
    const MAX_SPEED_DEG_PER_SECOND = 28

滑块值范围为 0—100，实际角速度：

    const degreesPerSecond = (speedValue / 100) * MAX_SPEED_DEG_PER_SECOND

约定：

- 0：OFF，完全暂停。
- 1—24：SLOW，适合阅读。
- 25—55：NORMAL，默认 32。
- 56—80：FAST。
- 81—100：TURBO，仅作为用户主动选择，不默认开启。

不要让默认速度超过 10deg/s；当前 14deg/s 的连续旋转已经会增加点击和阅读成本，默认值应先降到约 9deg/s。

- [ ] **Step 2: 将速度放入 React 受控状态**

WorkRing 增加：

    const [speed, setSpeed] = useState(DEFAULT_SPEED)
    const speedRef = useRef(DEFAULT_SPEED)
    const [isUserPaused, setIsUserPaused] = useState(false)

\`speedRef.current\` 用于 requestAnimationFrame，避免每次拖动滑块都重新绑定整个动画循环。滑块改变时同步更新 state 和 ref。

移动端检测到 \`max-width: 720px\` 时默认使用 0；如果用户手动调整到大于 0，允许继续旋转，但页面刷新后仍回到 0。

### 10.2 控制器 DOM 和无障碍

- [ ] **Step 3: 在轮播下方增加控制器**

控制器必须位于 \`.work-ring__stage\` 之后、项目标题 caption 之前或之后的稳定位置，不得覆盖卡片：

    <div className="work-ring__controls" role="group" aria-label="作品自动旋转控制">
      <label htmlFor="work-rotation-speed">ROTATION SPEED</label>
      <input
        id="work-rotation-speed"
        type="range"
        min="0"
        max="100"
        step="1"
        value={speed}
        onChange={handleSpeedChange}
        onPointerDown={pauseForControl}
        onPointerUp={resumeAfterControl}
        onFocus={pauseForControl}
        onBlur={resumeAfterControl}
        aria-valuetext={speedLabel}
      />
      <output htmlFor="work-rotation-speed">{speedLabel}</output>
      <button type="button" aria-label={isUserPaused ? '恢复自动旋转' : '暂停自动旋转'}>
        {isUserPaused ? 'PLAY' : 'PAUSE'}
      </button>
    </div>

要求：

- label、range、output、pause button 都能通过键盘访问。
- 不使用只有图标没有 aria-label 的按钮。
- 滑块值改变时 output 实时更新，不用等待松手。
- 速度 0 时 output 显示 \`OFF\`，而不是 \`0%\`。
- 控制器不得使用 fixed 定位，不得遮挡卡片。
- 控制器在桌面和移动端都显示，但移动端宽度必须不超过容器。

- [ ] **Step 4: 增加明确的视觉档位**

滑块下方显示三个轻量刻度：

    OFF          SLOW       NORMAL       FAST

不要增加复杂刻度线、发光动画或循环脉冲。滑块的 acid-lime 只用于当前 thumb 和进度条，避免控制器抢过项目标题。

### 10.3 动画循环和暂停原因

- [ ] **Step 5: 让 requestAnimationFrame 使用当前速度**

每一帧只在满足以下条件时更新角度：

    if (!dragging && !isUserPaused && !isControlPaused && speedRef.current > 0) {
      angle += (speedRef.current / 100) * MAX_SPEED_DEG_PER_SECOND * dt
    }

当速度为 0 时可以停止循环；如果用户开始拖动、点击箭头或改变滑块，再按需恢复。禁止在速度为 0 时仍然保持无意义的 60fps loop。

- [ ] **Step 6: 处理暂停优先级**

建立明确的暂停原因集合，不使用互相覆盖的 boolean：

    const pauseReasons = {
      user: false,
      hover: false,
      focus: false,
      drag: false,
      control: false,
      reduced: false,
    }

只要任意暂停原因存在，就暂停角度自动递增；角度和项目当前状态不重置。

优先级：

1. 用户点击 PAUSE 或速度设为 0：必须暂停。
2. reduced-motion：默认暂停，除非用户明确手动把滑块调到大于 0。
3. 拖动、滑块操作、键盘操作：临时暂停。
4. hover/focus：桌面端暂停，避免用户无法稳定点击。
5. 临时原因解除后，若速度大于 0 且用户没有手动暂停，再继续。

- [ ] **Step 7: 防止滑块松手后突然跳转**

滑块调节期间：

- 暂停自动旋转。
- 只更新速度，不改变 \`angle\)。
- pointerup/blur 后延迟 300ms 恢复。
- 如果新值为 0，不恢复。
- 如果用户点击 PAUSE，不得被 pointerup 或 mouseleave 自动恢复。

### 10.4 轮播、拖动、箭头和详情入口

- [ ] **Step 8: 保持现有 3D 环形，不改变项目素材**

保留现有：

- 6 张卡片的环形布局。
- 透视和深度关系。
- 拖动旋转。
- 左右箭头。
- 卡片点击打开详情。

但修正：

- 拖动期间暂停自动旋转。
- pointerup 后先 snap 到最近项目，再恢复速度。
- 点击左右箭头时暂停 600ms，完成 snap 后恢复。
- hover 当前卡片时暂停，不再只是提高 opacity。
- 所有卡片都可通过键盘 tab 到达；不得只给前 3 张卡片 \`tabIndex=0\)。
- 当前正面项目添加 \`aria-current="true"\` 或等价的可读状态。
- 详情打开前不改变 URL 之外的全局滚动锁逻辑。

- [ ] **Step 9: 将 caption 和速度状态分工**

底部 caption 只显示当前项目：

    001 运营视觉设计  Operation Design / Poster

速度控制器只显示旋转速度：

    ROTATION SPEED   NORMAL   PAUSE

不要把项目编号、旋转角度、速度百分比全部堆在同一行。

### 10.5 首屏、移动端和 reduced-motion

- [ ] **Step 10: 修复首屏位置**

在不删除 WorkRing 的前提下调整：

- \`.work-ring__stage\` 在标题和项目索引之后立刻出现。
- 桌面端 stage 高度使用 \`clamp(470px, 58svh, 640px)\)。
- 1280×720 中第一张卡片主体至少露出 55%。
- 控制器不能把第一张卡片再次推到折叠线以下。
- \`INDEX / 006\` 和箭头必须与 shell 左边界对齐，不允许被 full-bleed margin 截断。
- 旧的大面积空白必须通过减少 intro 底部 padding 和 stage 高度解决，不得通过负 margin 覆盖内容。

- [ ] **Step 11: 移动端安全规则**

390×844 下：

- 默认 speed 为 0。
- stage 不使用超过屏幕宽度的 3D radius。
- 速度控制器宽度为 100%，label/output 换行也不能溢出。
- 卡片标题在 hover 不存在时仍可见。
- 用户主动把速度调高后，触摸滑动和点击仍优先于自动旋转。
- 任何 touch drag 都先暂停，松手后才按照用户速度恢复。
- reduced-motion 下默认关闭速度，滑块仍可见且可以被明确操作。

- [ ] **Step 12: 生产环境移除调试标记**

\`MOTION: FORCED\` 不作为公开作品区 UI。若必须保留调试信息，只允许在 \`import.meta.env.DEV\) 下渲染。

### 10.6 测试和验收

- [ ] **Step 13: 编写 WorkRing 行为测试**

必须覆盖：

1. 默认值为 32，output 显示 NORMAL。
2. range 改为 0 后 output 显示 OFF。
3. speed=0 时角度不自动改变。
4. speed>0 时角度按速度推进。
5. hover/focus/drag 时暂停。
6. 暂停期间松开 hover 不会错误恢复用户手动 PAUSE。
7. PAUSE/PLAY 按钮可用。
8. 6 个项目均存在且都能通过键盘访问。
9. 所有卡片使用完整 alt。
10. reduced-motion 默认 speed 为 0。
11. 触摸尺寸下不存在横向溢出。

- [ ] **Step 14: 浏览器验收**

在 1280×720：

- 进入 \`#work\) 后作品卡片立即可见。
- 自动旋转速度明显但不难点击。
- hover 卡片时停止。
- 将滑块拖到 OFF 后完全停止。
- 将滑块拖到 NORMAL 后平滑恢复。
- 点击 PAUSE 后等待 10 秒，角度保持不变。
- 点击项目卡片可以正确进入详情。

在 390×844：

- 默认不自动旋转。
- 速度控制器位于卡片下方且不溢出。
- 手动开启速度后，触摸拖动仍然可用。
- 所有标题和按钮始终可见。

运行：

    pnpm vitest run src/components/WorkRing.test.jsx src/components/SelectedWork.test.jsx
    pnpm test
    pnpm build

Expected：全部 PASS，控制台 0 error，网络 0 404。

### 10.7 Task 10 覆盖规则

本 Task 优先级高于本文件中任何要求删除 \`WorkRing\)、彻底取消自动旋转或强制使用 \`ProjectRailStage\` 的旧步骤。最终交付必须是：

- 保留 3D 环形。
- 自动旋转默认开启（桌面端）。
- 速度可滑动调节。
- 0 速度可暂停。
- hover、focus、drag、键盘和滑块操作不会被自动旋转干扰。
- 移动端默认暂停并允许明确开启。
- 首屏看得到作品。
- 无横向溢出、无控制台错误、无图片裁切问题。
