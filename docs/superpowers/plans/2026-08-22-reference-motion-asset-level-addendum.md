# 逐图动效执行附录

本附录是 `2026-08-22-reference-motion-interaction-redesign-plan.md` 的素材级执行清单。实现 agent 必须逐条处理，不得只完成通用卡片动画后宣称六个项目完成。

## 统一素材规则

### 素材角色

- `cover / hero`：项目第一识别图，允许 1.03–1.06 倍缓慢缩放，禁止裁切主体。
- `poster / original`：原始设计证据，使用纵向 `contain` 或固定比例完整展示，禁止用 `object-fit: cover` 截掉海报文字。
- `board / process`：过程展板，使用 1.015 倍 clip reveal，文字说明与图片同一章节出现。
- `extension / application`：应用场景，使用 16:9 容器，允许 2–3% 纵向视差，不能旋转整张图。
- `palette / diagram`：颜色、结构或节点信息，使用 CSS 属性和线条动画，不对图片做放大晃动。

### 统一时间和幅度

- 图片进入：`opacity 0 → 1`、`clip-path inset(0 0 100% 0) → inset(0)`、`650ms`、`power3.out`。
- 同组图片错峰：`80ms`；同一视口最多同时错峰 4 张。
- 图片视差：桌面端 `translateY` 最大 `±24px`；平板 `±10px`；手机关闭。
- 悬停缩放：普通图片 `1.015`，封面 `1.025`；持续时间 `320ms`。
- 文字与图片之间：文字先进入 `80ms`，图片在 `160ms` 开始进入，避免图片抢掉标题。
- 每个图片 caption 固定显示 `label / source`，hover 只提高不透明度，不把 caption 从不可见变成结构跳动。
- 所有图片使用原始素材路径对应的 `-w960.webp` 和 `-w1800.webp` 响应式版本；原始 JPG/PNG 只作为 fallback，不在详情页直接加载大图。

## 001 运营视觉设计

容器模式：`market-route`。章节顺序必须是 `cover → gallery → grammar → originalSystem → extensions → closing`。

### 首屏与海报组

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `/images/operation-cover.png` | 16:9 全宽 Hero；保留右侧蔬果拼贴和左侧手写标题的对角关系 | 进入详情时从 96% 放大到 100%；滚动章节中 `translateY(-16px)`；鼠标水平位置只移动内部 scrim ±6px | `object-position: 50% 50%`；手机固定 16:9，关闭视差，仅保留 clip reveal |
| `/images/operation-poster-01.jpg` | 纵向海报 01；购物篮/蔬果主体作为第一张证据 | 从左下向右上 clip reveal；出现时 `POSTER / 01` 先于图片 80ms | 使用 `contain`，完整显示文字和购物篮；手机单列 |
| `/images/operation-poster-02.jpg` | 纵向海报 02；英文蔬果名称和图形构成信息中心 | 由中心向四周轻微展开；颜色点沿标题方向出现 3 个小节点 | 原图比例较窄，不能按 01 的比例强行裁切；caption 放在图外 |
| `/images/operation-poster-03.jpg` | 纵向海报 03；网兜/路线语义作为 gallery 收束 | 由右侧进入，带 `translateY(18px)`；进入完成后不循环 | 保留边缘网兜和手写字；手机不做横向错位 |

### 视觉语法与原创系统

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `project-background.jpg` | 展示背景、需求和“为什么做” | 首张进入时先显示编号 `CONTEXT / 01`，图片随后从下向上揭示；滚动 progress 0–0.12 | 纵向展板完整展示，文字不可被裁；手机先文字后图 |
| `visual-language.jpg` | 展示字体、色彩、图形语言 | 右侧 4 个语法标签沿图片边缘依次点亮；不改变展板内容 | `contain`；避免覆盖展板中的色卡 |
| `material-study.jpg` | 展示蔬果、布艺、拼贴材料 | hover/focus 时只提高材料区域亮度，使用伪元素 radial glow | 不放大超过 1.015；手机取消 glow |
| `bag-blueprint.jpg` | 展示随身包结构和功能 | 滚动到图片中心时画一条从尺寸标注到包体的 1 秒 SVG 线 | 线条只是覆盖层，不能挡住结构标注 |
| `fabric-bag-family.jpg` | 展示包袋家族 | 三列/多物件按左右 8px 错位出现，保持整体家族关系 | 不做逐个弹跳；手机整体一次进入 |
| `vendor-carry-scene.jpg` | 展示摊主真实携带场景 | 进入时人物/包袋区域优先显影，背景延迟 80ms | 以人物和袋子为焦点，不裁掉手部或商品 |
| `social-cards.jpg` | 展示社交内容卡片系统 | 卡片组沿统一网格从左到右 reveal，随后高亮当前卡片标签 | 不让网格卡片覆盖 caption；手机改纵向排列 |
| `photo-poster-display.jpg` | 展示户外展示闭环 | 作为原创系统收尾，使用较慢的 900ms reveal 和轻微 `scale(1.01)` | 保留展示环境与海报关系，不只截海报局部 |

### 市场延展图

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `/images/operation-market-activation.png` | 摊位、吊旗、头牌、价签等完整现场应用 | 作为第一张全宽应用图，滚动时先显示标题，再从中间展开；光标进入时显示 `VIEW SYSTEM` | 16:9，主体完整；移动端不视差 |
| `/images/operation-digital-system.png` | 方图、竖版、横幅和贴纸的内容系统 | 使用横向内容轨道，progress 控制不同尺寸卡片的亮度 | 不裁切卡片文字；移动端横向 overflow 可拖动 |
| `/images/operation/extensions/market-route-wayfinding.png` | 入口布旗、路线导视和站点牌 | 用一条虚线路径从左到右绘制，图片本体只做 clip reveal | 保留路径起点和终点；手机虚线改为静态 |
| `/images/operation/extensions/vendor-service-kit.png` | 围裙、价签、零钱包、布袋和周转箱标签 | 物件按“穿戴 → 售卖 → 携带”三阶段淡入，不做随机漂浮 | 不能遮挡物件名称；触摸使用点击后高亮 |
| `/images/operation/extensions/market-stamp-passport.png` | 折页地图、印章、站点卡和购物小票 | 滚动到该图时模拟一次盖章：印章覆盖层从 0.7 倍变为 1 倍 | 只允许一次盖章，不使用无限循环；手机静态加一次 reveal |

## 002 生活新搭案

容器模式：`three-phase`。章节顺序必须是 `campaignHero → strategy → visualGrammar → originalEvidence → process → activation → closing`。

### 主场景、策略与视觉语法

| 素材/模块 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `campaign-hero.png` | 三连搭拼图主场景，作为案例主入口 | 用滚动 progress 0–0.18 控制拼图从分散到组合；只移动拼图覆盖层，不移动底图 | 保留活动入口和人物；手机改成一次性组合 reveal |
| `strategy[0]` | 职场新人 / `LIGHT` / 黄色 | 进入当前阶段时黄色节点扩散 12px，卡片 y=-12px、opacity=1 | focus 与 hover 等价；手机点击展开 |
| `strategy[1]` | 大一新生 / `CONNECT` / 粉色 | 与第一阶段交接时粉色从左侧覆盖黄色，持续 480ms | 不同时闪烁两种颜色；手机静态色块 |
| `strategy[2]` | 独行青年 / `WARM` / 紫色 | 作为第三阶段收束，紫色节点连接到城市路线图 | 保留标题和 audience；手机使用折叠面板 |
| `original-puzzle-elements.jpg` | 拼图人物、色卡、材质和视觉元素源头 | 先显示图片，再用 3 个关键词沿图片底部依次亮起；不移动原图 | 原图接近方形，使用 contain；不裁掉边缘元素 |
| `sanfu-travel.jpg` | 旅行主题原创海报 | 以 `LIGHT` 节点对应色做 1px 边框，进入时从上到下 reveal | 纵向原海报完整展示 |
| `sanfu-dorm.jpg` | 宿舍主题原创海报 | 以 `CONNECT` 节点对应色做边框，和 travel 之间用 24px 空隙 | 不与前图叠压；手机单列 |
| `sanfu-office.jpg` | 职场主题原创海报 | 以 `WARM` 节点对应色做边框，作为原创证据组最后一张 | 保留海报文字；移动端不旋转 |
| `element-lab-scene.png` | 插画元素实验室过程图 | 作为 process 01，使用 1.02 倍视差和标签从左进入 | 保留桌面边缘，不截掉材料 |
| `number-lab-scene.png` | 9.1、10.1、520 数字节点研究图 | 作为 process 02，数字标签按滚动顺序点亮 | 不在图片上叠加大数字；使用外部标注 |

### 线下、礼赠和数字延展

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `workplace-activation.png` | 职场打卡镜、扭蛋机和拼图穿搭互动角 | `LIGHT` 激活时从右向左进入，交互点出现一次 ring pulse | 保留人物与装置整体；关闭连续 pulse |
| `campus-activation.png` | 宿舍拼图客厅与互动转盘 | `CONNECT` 激活时从左向右进入，转盘只转 12° | 不把转盘做成自动游戏；手机静态 |
| `city-activation.png` | 城市拼图路径、语音点和休息站 | `WARM` 激活时画出路线，路径完成后显示标题 | 保留路线起点/终点；手机路线不动画 |
| `packaging-system.png` | 三阶段礼盒、纸袋、卡片、胶囊礼物和徽章 | 三个阶段对应三组物件，滚动时按亮/合/暖顺序显影 | 不做物件自由漂浮，保持包装关系 |
| `social-system.png` | 手机界面、竖屏、UGC 相框和倒计时卡片 | 使用横向内容带，当前卡片 `scale(1.02)`，其余 opacity .45 | 文字不能被裁；移动端可滑动 |
| `node-window.png` | 9.1、10.1、520 数字节点橱窗 | 数字节点随 progress 依次切换，不做跳闪 | 维持橱窗结构完整 |
| `node-member-kit.png` | 会员卡、折叠日历、礼券、徽章和礼盒 | 作为 closing application，使用从中心向外的 600ms reveal | 不拆散成过多小动画 |

## 003 成长日常

容器模式：`timeline-swap`。章节顺序：`posters → timeline → presentation → closing`。

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `horsh-childhood.jpg` | 小时候：玩具、画笔、积木、零食 | 固定左侧，初始 opacity 1；滚动前半段保留主体，物件层轻微上移 | 纵向海报完整展示；不把产品从中心裁掉 |
| `horsh-grown-up.jpg` | 长大后：电脑、报表、咖啡、通勤物件 | 固定右侧，随 progress 从 opacity .25 到 1；与 childhood 使用同一坐标基线 | 手机改为第二张顺序进入 |
| `horsh-timeline-stage.png` | 双联画展示场景和时间轴 | 作为结尾舞台，从底部 clip reveal；时间轴线从 0% 绘制到 100% | 16:9 保持完整，不做水平翻转 |

额外要求：桌面端两张海报的主要产品位置必须保持稳定，动画只替换周围物件和背景层；如果素材本身是合成展板，不得在网页中强行拆成不存在的图层。

## 004 倒倒 bar 品牌设计

容器模式：`pour-at-eleven`。章节顺序：`concept → identity → originals → extensions → closing`。

### 原创展板

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `brand-story.jpg` | 深夜情绪和品牌故事 | 首张展板从暗到亮，11 PM 标签出现 | 不用闪烁，亮度过渡 800ms |
| `identity-system.jpg` | 树懒、酒杯和核心标志系统 | 树懒/酒杯关键词以两条线连接到图形系统 | 线条在图外或空白区域，不覆盖标志 |
| `application-blueprint.jpg` | 触点蓝图和应用关系 | 滚动时四个触点编号依次亮起 | 维持完整纵向比例 |
| `pour-poster.jpg` | 倾倒主题原创海报 | 海报容器旋转最大 3°，酒液方向用 overlay line 提示 | 手机关闭旋转 |
| `color-language.jpg` | 蓝色、奶油色、棕色视觉语言 | 色块按 3 个品牌色顺序从 0 到 1 填充 | 不改变色值，不使用滤镜替代原色 |
| `retail-touchpoints.jpg` | 酒瓶、杯垫和零售触点 | 物件组按“瓶 → 杯垫 → 零售”顺序进入 | 不放大到遮挡说明 |
| `night-poster-system.jpg` | 深夜传播海报系统 | 使用低频水平扫描线，扫描只出现一次 | 禁止赛博霓虹式无限循环 |
| `brand-family.jpg` | 包装和品牌家族 | 作为展板组结尾，四周留白扩大 8px 后恢复 | 保持家族整体，不拆物件 |
| `character-language.jpg` | 树懒动作与表情 | hover/focus 切换当前动作标记；图片本身只做亮度变化 | 手机点击后高亮 450ms |

### 空间与应用延展

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `bar-exterior-hero.png` | 深夜街角门店 Hero | 11 PM 时间轴到达 0.2 时进入；招牌亮度从 .65 到 1 | 全图保留门店和街角关系 |
| `bar-counter-system.png` | 菜单、杯垫、火柴盒、酒具 | 以吧台横向线作为 progress 基线，物件由左至右进入 | 不裁掉吧台边缘 |
| `eleven-pm-member-kit.png` | 会员卡、徽章、杯具、钥匙牌 | 11 PM 节点到达时盖章式高亮一次 | 不做连续旋转徽章 |
| `night-campaign-system.png` | 灯箱、户外屏和移动端传播 | 三种媒介按屏幕顺序淡入，使用统一深蓝 scrim | 文字保持可读 |
| `interior-wayfinding.png` | 门牌、桌号、洗手间和货架标签 | 用瓶型方向作为 3 个方向箭头，箭头只平移不旋转 | 移动端静态 |
| `takeaway-family.png` | 手提袋、杯套、瓶装和贴纸 | 作为最后一组应用，使用暖色小范围 hover 光晕 | 不改变图片整体色温 |

## 005 MY MAY 品牌设计

容器模式：`pause-and-warm`。章节顺序：`positioning → identity → applications → experience → dna → viStandards → viExtensions → extensions → closing`。

### 原始展板与 VI

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `original-positioning.jpg` | 品牌定位、街角暂停键和猫咪披萨概念 | 进入时只显示定位标题和中心关键词，图片随后完整揭示 | 不裁掉展板上的定位句 |
| `original-identity.jpg` | 猫咪、披萨核心标志和视觉系统 | 猫耳轮廓用 1 次描边动画，原图不旋转 | 只在空白区域描边，不覆盖 logo |
| `original-applications.jpg` | 披萨盒和品牌摄影应用 | 包装触点从左到右进入，图片本体只做 1.015 缩放 | 维持完整展板比例 |
| `original-experience.jpg` | 色彩、语气和披萨体验 | 三个关键词 `PAUSE / PIZZA / PAWS` 依次高亮 | 手机改为静态关键词列表 |
| `viStandards.logoSource`（复用 `original-identity.jpg`） | VI 标准中的 logo 来源 | 不重复加载图片；通过同一资源的裁切窗口显示标准区域 | 必须标注“来源于原始展板”，避免重复感 |

### VI 延展与品牌世界

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `my-may-staff-kit.png` | 围裙、帽子、T 恤、托特包、布章和披萨铲 | 以“团队成为品牌触点”为标题，物件依次淡入；hover 只高亮当前物件 | 保留人物/服装整体 |
| `my-may-digital-system.png` | 社交方图、竖版模板、App 图标和菜单头图 | 使用横向模板带，滚动时当前模板向前 2px | 不让横向带造成整页横向溢出 |
| `my-may-street-corner.png` | 橙红灯箱、猫耳轮廓和街角小店 | 首张应用图使用暖光 breathing，周期 4.5s，幅度小于 3% | reduced motion 改为静态亮度 |
| `my-may-takeaway-system.png` | 披萨盒、纸袋、杯具、封签和餐巾 | 以外带路径为顺序：盒 → 袋 → 封签 → 餐巾 | 不改变包装结构比例 |
| `my-may-city-touchpoints.png` | 灯箱、长椅、配送箱和路牌 | 沿城市路径从左到右进入，最后停在门店/街角焦点 | 手机只做上下进入 |

交互原则：进入 MY MAY 的媒体时，光标状态显示 `PAUSE` 而不是 `VIEW`；离开媒体恢复普通 Cursor。这个状态只改变指针标签和一层暖色光晕，不暂停页面滚动。

## 006 TOSS DIARY IP 设计

容器模式：`character-keyframes`。章节顺序：`characterFoundation → originals → service → summerCampaign → expressionSystem → extensions → campaignSystem → closing`。

### 原创角色展板

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `character-dna.jpg` | 角色结构、心形兔耳和轮廓基础 | 轮廓关键词出现，图片从下向上进入 | 保留三视图和比例说明 |
| `expression-wordmark.jpg` | 表情、字标和角色语气 | hover/focus 时切换文字标签，不改原图 | mobile 点击切换 |
| `origin-motion.jpg` | 角色动作起源和动作研究 | 使用 6 个关键帧编号从 01 到 06 依次点亮 | 图片不做逐帧裁切，除非素材已有序列 |
| `color-sticker-language.jpg` | 色彩、贴纸和图形语言 | 三个核心色按 progress 点亮；颜色使用原始 CSS value | 禁止滤镜改变颜色 |
| `packaging-blueprint.jpg` | 包装结构和版式蓝图 | 用一条细线标示结构阅读顺序 | 线条避开蓝图标注 |
| `packaging-family.jpg` | 杯套、手提袋、面包盒和卡片家族 | 物件组以 4 个固定位置出现，不随机漂移 | 完整显示物件家族 |
| `poster-system.jpg` | 面包摄影、角色插画和暗红网格海报 | 以网格线作为滚动 progress，逐步显示海报 | 不叠加额外网格覆盖原作 |
| `storefront-application.jpg` | 门店玻璃标志和沿街海报 | 作为原创展板收尾，使用较慢 900ms reveal | 保留门店环境和玻璃标志 |

### 烘焙服务图片

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `toss-dusk-first-batch.png` | 黄昏第一炉面包、门店玻璃标识 | 作为 service Hero，先进入门店暖光再进入标题 | 16:9 全图，保留篮子和玻璃字 |
| `toss-member-diary-kit.png` | 会员日记、日期章、积分页和收据袋 | 页面翻页感只用 `translateY(8px)`，不做 3D 翻转 | 保留纸张平面，不改变透视 |
| `toss-service-handoff.png` | 店员向顾客交付双杯托、纸袋和餐盒 | 交付方向从左到右进入，显示 `HANDOFF` 指示 | 不遮挡人物手部 |
| `toss-baker-toolkit.png` | 围裙、烤箱手套、头巾、工作牌和工具 | 工具按操作顺序进入，间隔 80ms，最多四步 | 手机一次性显示 |
| `toss-order-progress.png` | 手机/终端中的奔跑兔制作进度 | progress 从 0 到 1，角色只平移不连续跑动 | reduced motion 显示最终状态 |

### 夏日活动图片

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `summer-poster-picnic.png` | 草地野餐海报 / Picnic Green | 进入时绿色标签亮起，海报从下方 reveal | 纵向海报 contain |
| `summer-poster-market.png` | 面包市集海报 / Bakery Orange | 进入时橙色标签亮起，和前图形成 24px 横向错位 | 手机单列 |
| `summer-poster-beach.png` | 海边音乐海报 / Coast Blue | 进入时蓝色标签亮起，作为三色组收束 | 不裁切海报边缘 |
| `summer-pop-up-market.png` | 三色快闪市集空间 | 绿色→橙色→蓝色三段 scrim 依次覆盖，再恢复清晰 | 覆盖必须低透明，不能压暗主体 |
| `summer-picnic-kit.png` | 野餐周边、包装和餐具 | 物件按“带走”的顺序进入，不做漂浮 | 手机静态 |
| `summer-beach-activation.png` | 海边餐车、舞台和灯塔导视 | 以路线箭头连接餐车、舞台、灯塔 | 箭头使用 overlay，不覆盖人物 |

### 角色扩展、表情与季节

| 素材 | 展示细节 | 动效执行 | 画面保护与移动端 |
|---|---|---|---|
| `toss-hero-dark.png` | 暗色档案场景中的黏土角色 | 作为角色世界 Hero，缓慢 scale 1.025 | 保留角色主体和暗色背景 |
| `toss-character-lineup.png` | 五个动作：冷饮、面包袋、海边、面包篮、分享 | 当前动作根据滚动 progress 变亮，其余降低 opacity | 不让所有动作同时闪烁 |
| `toss-pop-up-space.png` | 烘焙快闪空间、包装、菜单和导视 | 空间层次从前景到背景依次进入 | 视差不超过 16px |
| `toss-merch-digital.png` | 玩偶、徽章、托特包、贴纸和社交模板 | hover/focus 只高亮当前收藏物 | 手机点击切换 |
| `toss-expression-system.png` | 9 → 16 种角色情绪 | 用 3×3/4×4 状态网格，当前情绪加荧光边框 | 键盘方向键可切换，不能依赖 hover |
| `toss-sticker-chat.png` | 聊天贴纸、消息气泡和快捷表情栏 | 当前贴纸进入消息气泡，时长 220ms，无循环 | 移动端点击发送一次即可 |
| `toss-seasonal-world.png` | 春日野餐、夏日海边、秋日收获、冬日送礼 | 四季作为四个 progress 节点，颜色和标题同步 | 不做季节自动轮播 |
| `toss-motion-storyboard.png` | 揉面、入炉、闻香、奔跑、分享六帧 | 只在用户滚动到该图时按 6 个标记显示进度，不播放视频 | reduced motion 显示完整 storyboard |

## 统一 QA：逐图检查表

每次修改一个作品后，agent 必须在 1440×1000、1024×768、390×844 三个视口检查：

1. 图片原始主体、文字、边缘和 caption 是否完整可见。
2. 进入时是否先标题后图片；图片是否只发生一次 reveal。
3. hover、focus、touch 是否产生相同的可理解反馈。
4. 图片是否使用 `-w960.webp`/`-w1800.webp`，是否有固定比例和 alt。
5. 是否存在图片加载后布局跳动、横向溢出、裁切错位或滚动卡顿。
6. reduced-motion 下图片是否立即可见、颜色是否仍正确、交互是否仍可用。
7. 浏览器控制台是否为 0 error；特别检查 `AUTO_SPEED`、ScrollTrigger refresh、图片加载失败和未清理事件监听器。

## 交付顺序

必须按以下顺序提交给下一个 agent：

1. 先修 `WorkRing` 运行错误并完成 ProjectRail 空壳。
2. 再完成 Hero、ProjectRail、ProjectDetail 三个全局交互。
3. 按 001 → 006 的顺序逐个接入图片级 motion profile，每完成一个作品就截图验收。
4. 最后统一处理 Cursor、reduced-motion、移动端和性能。

如果某张素材的实际构图与本附录中的焦点描述不一致，agent 必须保留原素材构图，并只调整 `object-position`、容器比例和动效方向；不能为了适配动画重新裁切或生成替代作品。
