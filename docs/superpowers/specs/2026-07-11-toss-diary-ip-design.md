# TOSS DIARY IP 作品集章节设计规范

## 目标

把用户现有的 TOSS DIARY 兔子 IP 从六张设计展板和一张 AI 风格探索，整理为作品集第 006 个独立项目。章节要证明角色设计、视觉规范、叙事能力和跨媒介延展能力，同时保持作品集既有的暗色、克制、档案化呈现。

## 原创证据筛选

- `549fd3...jpg`：角色正侧背三视图与红、奶油、深棕三色，作为角色结构和色彩规范核心证据。
- `8f6512...jpg`：九种表情，作为情绪语言与社交贴纸系统的来源。
- `254c77...jpg`：抱面包奔跑的连续动作和 TOSS BREAD DIARY 字标，作为角色动态与叙事节奏证据。
- `ffbbe1...jpg`：面包贴纸、进食和抱面包动作，作为图形资产与动作扩展证据。
- `d49d5c...jpg`：杯套、纸袋和烘焙包装应用，作为原始商业应用证据。
- `134f05...jpg`：红奶油配色的海报与摄影拼贴，作为原始传播设计证据。
- 用户单独提供的夏日面包节图：作为用户主导的 AI 3D 风格探索，保留完整画面并明确标注来源，不冒充原创手绘或最终品牌规范。

## 视觉方向

采用“暗色角色档案 + 暖色黏土世界”的混合方向。网页容器、标题、编号、图注使用作品集既有黑色、细线和酸性绿系统；IP 内容保持 `#9F2E24` 红、`#FFFEF8` 奶油、`#552D2A` 深棕，并将夏日探索中的草绿、海蓝、橙黄限制在活动延展场景中。

章节顺序：

1. 暗色 Hero：角色以暖白黏土质感出现在深色烘焙档案台，作为项目开场。
2. Character Source：三视图、色彩、轮廓特征和表情语言，使用原创展板。
3. Motion & Expression：连续奔跑和九种表情，证明角色可动性。
4. Original Applications：原始贴纸、包装和海报三列归档。
5. Summer Style Exploration：完整展示用户提供的夏日面包节 3D 图。
6. Expression System：增加十六情绪黏土档案与聊天贴纸应用。
7. AI Extension：增加 3D 角色阵容、烘焙快闪空间、周边与数字系统。
8. Seasonal & Motion：增加四季运营场景与六帧动态故事板。
9. 收尾：用深棕角色宣言页结束项目，连接下一章节。

## Image-2 延展资产

生成八张 16:9 资产，并按用途标注 `AI-ASSISTED IP EXTENSION`、`AI-ASSISTED EXPRESSION EXTENSION` 或 `AI-ASSISTED CAMPAIGN EXTENSION`：

- `toss-hero-dark.png`：暗色档案台上的单角色主视觉，保留心形兔耳、宽脸、红色手绘轮廓和面包主题。
- `toss-character-lineup.png`：五个完整 3D 黏土角色动作，展示饮品、面包袋、海边休息、面包篮和分享动作。
- `toss-pop-up-space.png`：奶油、暗红和深棕构成的烘焙快闪空间，含角色装置、菜单、包装和导视。
- `toss-merch-digital.png`：玩偶、搪瓷徽章、贴纸、托特包、手机贴纸界面与社交模板的系统展示。
- `toss-expression-system.png`：十六种高频情绪与动作的 4×4 黏土表情档案。
- `toss-sticker-chat.png`：深色聊天界面、快捷表情栏与十二枚独立贴纸的数字应用。
- `toss-seasonal-world.png`：春日野餐、夏日海边、秋日收获、冬日送礼的全年运营系统。
- `toss-motion-storyboard.png`：揉面、入炉、闻香、举起面包、奔跑和分享的六帧动态叙事。

所有生成图避免可读性差的长文案、额外品牌、写实兔子和过度儿童化；角色必须保持双耳组成心形、圆角宽脸、明显大笑表情和手绘棕红线条。

## 页面结构与响应式

- 新建 `IpStory.jsx`，不把逻辑堆入 `SelectedWork.jsx`。
- 桌面端原创证据采用 2 列和 3 列对齐网格；生成延展采用 2 列 16:9 网格。
- 所有章节沿用 `--case-inset`，最大版心继续由 1700px shell 控制。
- 720px 以下全部改为单列，禁止水平溢出；完整原创展板使用 `object-fit: contain`，生成场景使用 `object-fit: cover`。
- 每张图片使用延迟加载和异步解码；Hero 也使用 lazy，避免第六项目影响首屏。

## 真实性标注

- 原始展板：`ORIGINAL CHARACTER ARTWORK`。
- 用户提供的 AI 图：`USER-DIRECTED AI STYLE EXPLORATION`。
- 本次生成图：`AI-ASSISTED IP EXTENSION`。

## 验收

- 项目数从 5 增加到 6，导航项目编号更新为 `001—006`。
- 六张原创展板、一张用户 AI 探索和四张新增延展均可加载。
- 桌面端、390px 移动端无横向溢出；原创图不裁切；生成图比例统一。
- 页面不出现电话号码，控制台无错误；全量 Vitest 和 Vite build 通过。
