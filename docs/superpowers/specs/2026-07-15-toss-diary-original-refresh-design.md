# TOSS DIARY 新版原创与服务延展设计

## 目标

在不推翻现有 TOSS DIARY 章节的前提下，更新用户自行完成的原创设计证据，并基于新版角色与包装系统补充此前没有覆盖的服务体验延展。所有修改仅进入本地项目，不部署线上版本。

## 内容边界

- 保留现有暗色角色 Hero、角色基础、夏日活动、表情聊天、快闪空间、周边数字、四季与动态叙事。
- 用 `ip设计1` 的新版展板替换现有六张旧版原创展板；旧版原创图不继续渲染，避免新旧重复。
- 不再新增海报合集、黏土角色排排站、快闪全景、四季场景或普通表情墙。
- 新生成内容只补足“真实服务、会员机制、员工系统、点单进度、夜间叙事”五个空白触点。

## 新版原创证据

从 10 张 A4 竖版展板中选 8 张进入主画廊：

1. `b9f6c89ee03934da69c40c43f541397a.jpg` — CHARACTER DNA：三视图、人物设定与角色性格。
2. `0d27d4ee4cb03cf79bf5810534dd26d5.jpg` — EXPRESSION & WORDMARK：表情、手写字标与面包图标。
3. `90ce5c97402cb388c1f049c04edb7231.jpg` — ORIGIN STORY & MOTION：角色故事与奔跑动作。
4. `baa36fbc37ece60abd88d09858f96c87.jpg` — COLOR & STICKER LANGUAGE：标准色与贴纸语言。
5. `a9d0cdf157b25d505646fbfa91884ee1.jpg` — PACKAGING BLUEPRINT：包装结构与应用规划。
6. `43a9aa1dd7cf9e0e84eac0399a559191.jpg` — PACKAGING FAMILY：杯套、纸袋、餐盒和提袋家族。
7. `410a203906e575d0a63c30ca409b8892.jpg` — POSTER SYSTEM：红、奶油与烘焙摄影组成的传播系统。
8. `0e303f9dd355ec91170945c442e30c03.jpg` — STOREFRONT APPLICATION：门店玻璃标识和户外海报。

`11bd8a0527feabef7496a4936bc21ca2.jpg` 与海报系统重复，`a4f233dd0ed5f863dd460a63ce7ac1e2.jpg` 与包装家族重复，不进入主画廊，但可作为生成参考。

原创证据统一标注 `ORIGINAL IP DESIGN`。竖版展板使用两列暗色画框和 `object-fit: contain`，不裁切、不放大超过源文件有效尺寸；移动端改为单列。

## 角色与视觉锚点

- 主色：Toss Red `#9F2E24`、Cocoa `#552D2A`、Paper Cream `#FEFAEB`、White `#FFFFFF`。
- 角色必须保留心形双耳、宽云朵脸颊、暗红粗粝手绘线、小围裙、半月口袋与擀面杖。
- 浅蓝胶带只属于展板批注，不进入品牌主色。
- 场景采用暗红丝网印刷、奶油无涂布纸、深棕金属、面粉颗粒和温暖烘焙灯光。
- 新图减少长文案，只保留短标识、数字、图标或空白品牌区，避免 AI 乱码。

## Image-2 新延展

生成 5 张 16:9 图片，全部标注 `AI-ASSISTED SERVICE EXTENSION`：

1. `toss-dusk-first-batch.png`：黄昏门店外的“第一炉面包”叙事，使用面包篮、门店玻璃标识和克制的红奶油系统，作为新章节全宽 Hero。
2. `toss-member-diary-kit.png`：会员日记、日期印章、面包印章、收据袋与积分页的俯拍系统。
3. `toss-service-handoff.png`：真实店员把新版双杯托、纸袋与餐盒交给顾客的取餐场景。
4. `toss-baker-toolkit.png`：围裙、烤箱手套、头巾、割包刀、工作牌和面包篮标签的员工工具系统。
5. `toss-order-progress.png`：手机与自助终端上的奔跑兔制作进度，只使用图标、短数字和占位线。

生成时把新版角色规范、表情、色彩与对应包装展板作为参考，不把角色改成普通长耳兔，也不复用现有黏土材质和夏日配色。

## 页面结构

在 `ORIGINAL EVIDENCE` 之后、新有 `SUMMER CAMPAIGN` 之前增加 `BAKERY SERVICE / 03`：

- 全宽黄昏 Hero 建立叙事。
- 下方四张按 2×2 网格展示会员、取餐、员工和点单系统。
- 每张图片下方使用现有档案式标题、说明与来源标签。
- 后续章节编号顺延，但原有内容和图片保持不变。

## 数据与组件

- 将新版 JPG 复制到 `public/images/toss-diary/originals-2026/`，文件名改为语义名称；源文件保留不覆盖。
- 为每张新 JPG 和 Image-2 PNG 生成 `-w960.webp` 与 `-w1800.webp`，继续由 `ResponsiveImage` 按屏幕加载。
- 在 `projects.js` 更新 `originals`，新增 `serviceExtensions` 数据。
- 在 `IpStory.jsx` 新增独立的服务延展渲染组件，避免把布局逻辑混入数据层。
- 在 `styles.css` 增加桌面两列、全宽 Hero 与移动端单列规则。

## 验收

- 页面只显示 8 张新版原创展板，不显示旧版原创展板或两张重复新稿。
- 现有优质 AI 延展全部保留，新增 5 张内容与现有场景不重复。
- 新图的兔子轮廓、色彩和包装结构与新版原创一致。
- 桌面端与 390px 移动端无裁切、无横向滚动，所有图片能按需加载。
- 响应式资源完整性测试、IP 数据/组件测试、全量 Vitest 和 Vite build 均通过。
- 不执行 GitHub Pages、Vercel 或其他线上部署。
