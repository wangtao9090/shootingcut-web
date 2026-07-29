# ShootingCut 网站 GEO 与内容架构方案

> 交接文档 · 2026-07-29 · 供后续在 Codex 等环境继续执行
> GEO = Generative Engine Optimization，让 ChatGPT / Perplexity / Claude 等 AI 在回答相关问题时引用本站

---

## 0. 一句话现状

网站是**单页产品介绍 + 四个法务/支持页**。产品页回答「Shooting Cut 是什么」，但 AI 被问到的是「怎么剪 USPSA 比赛视频」「多机位怎么对齐」「怎么追踪我的成绩」——这些问题站上**没有可引用的段落**。地基（robots.txt 放行 AI 爬虫、JSON-LD）已经有了，缺的是内容。

---

## 1. 已完成的修正（2026-07-29）

配合 App 1.1.3 发版，已提交并推送：

| commit | 内容 |
|---|---|
| `b971637` | 版本号 → 1.1.3；系统要求 → iOS/iPadOS/macOS 26.0+（主页 + faq + support 共 5 处过时）；两个主页移除 TikTok 直传宣传（6 处）；免费版不实表述改正（4 处）；发布 Banner 更新 |
| `12f30ea` | FAQ 移除 TikTok 分享面板提及（4 处）；**修复 `faq-zh.html` 的 JSON-LD 失效** |

**两处值得记住的坑**：

1. **`faq-zh.html` 的结构化数据曾完全失效**——JSON 字符串里嵌了未转义的半角双引号（`点击"追踪"选择`），整块 `ld+json` 解析失败，11 条 FAQ 对爬虫和 AI 完全不可见。已改为全角引号。**以后往 JSON-LD 里写中文，一律用全角引号**。
2. **中英曾长期不同步**——中文页系统要求已是 26.0+，英文页还写着 iOS 17 / macOS 14。每次改文案两边都要核。

**刻意保留的**：
- FAQ 中「9:16（TikTok, Reels）」——那是比例用途说明，不是集成宣称，删掉反而让 9:16 失去参照
- `privacy.html` / `terms.html` 中的 TikTok 条款——法律文本，用户决定保留（日后 TikTok 审核通过恢复功能还要用）
- `oauth/tiktok/` 回调页——OAuth 桥页，与营销无关

---

## 2. 调研方法（含失败路径，避免重复踩坑）

**目标**：找竞技射手的**原话**，不是从产品功能反推的痛点。

**可用的**：
- **本机 Chrome（claude-in-chrome MCP）**——唯一稳定拿到 Reddit 完整原帖+评论的途径。用 `get_page_text` 取纯文本，比截图省 token
- WebSearch

**不可用的（实测）**：
- **Reddit MCP**：缺 API 凭据，调用失败
- **WebFetch 抓 Reddit / archive.org / ar15.com / PractiScore 论坛**：被拒或屏蔽
- **Brian Enos 论坛（forums.brianenos.com）**：站点当时故障，真实浏览器打开也报错。**这是 USPSA/IPSC 圈资历最老、讨论质量最高的论坛，值得后续重试**

**待尝试**：用户提到的 `Agent Reach` skill（官方 marketplace 222 个插件中没有，需第三方来源）。

---

## 3. 调研结论

### 3.1 视频剪辑类痛点

**A. 训练复盘缺成绩数据**
r/USPSA 一条 52 赞 / 29 评论的帖子下，Master 级选手对发视频求点评者说：视频里看不到命中情况，没法判断实际打得怎么样。
→ **本质**：录像是复盘主要素材，但视频不带成绩数据，围观者只能猜。
→ 关键词：match video critique / review my run / stage video feedback

**B. 左右分屏对比找时间差（本次最强证据，56 赞 / 21 评论）**
有人把自己和另一选手同场录像剪成左右分屏，称是"找出时间损失在哪"的有效方法。用 **CapCut 手工拼**，唯一抱怨是 CapCut 自动加品牌水印。
→ **本质**：自发行为已存在，现有方案粗糙。
→ 关键词：side by side stage video / sync two runs / video compare USPSA

**C. 视频叠加成绩 —— 已被反复独立造轮子，隐私是明确加分项**
- **cyfrTimer**（5 个月前, 23 赞 / 12 评论）：独立开发者做的视频枪声计时叠加，**主打纯本地处理不上传服务器**。作者原话："我一直在找这样的工具但没有完全符合要求的，所以自己做了一个"。评论热烈，需求集中在撤销按钮、保留预备片段、叠加层大小可调
- **shotstreamer**、**MatchChaser**、**ShotArchive**（欧洲 Special Pie 计时器专用导出 App）
→ **本质**：需求真实且被验证多次；**隐私（不传服务器）是选型加分项**——这正是我们的现成差异化（本地 + 用户自己的 iCloud）

### 3.2 成绩管理类痛点（证据强度不输视频线）

**D. 官方成绩站难查难导（16 赞 / 43 评论，多轮迭代）**
开发者原话：**"the score keeping websites are awful"**。其导入功能需用户手动复制粘贴 PractiScore 结果页源代码；后承认 "Cloudflare blocks it all"——平台技术性拦阻抓取。
→ 关键词：practiscore export data / track my scores / import practiscore results

**E. 手动录入是采用率杀手（MatchChaser，27 评论 + 多轮更新）**
多名用户第一反应就是"手动输入成绩太麻烦，会因此不用"，要求自动同步。真正想要的是：**升级还差多少百分比的预测**、和任意选手逐项对比、按官方规则精确复算分级。
→ **本质**：射手要的不是"存成绩"，是"预测进步 / 对比对手"式分析。
→ 关键词：USPSA classifier tracker / path to GM / hit factor projection

### 3.3-bis 国际成绩系统格局（2026-07-29 追加调研，结论重要）

**起因**：核实芬兰用 ESS 还是 PractiScore。**答案是两个都不用。**

**芬兰的实际情况**：
- 主力是 **Pelias**（`pelias.ipscfin.org`）——IPSC Finland 协会**自建自营**的全流程系统，含赛历、成绩公示、本国/外国选手分开的注册入口、自己的手册与隐私政策。成绩表字段是芬兰本地化的（`Sarja` 组别 / `Seura` 俱乐部 / `Tulkattu` 已判读关卡数），与 PractiScore、ESS 都不同
- 部分赛事用 **ShootNScoreIt（SSI）**——`shootnscoreit.com/event/22/…` 下有芬兰霰弹枪全国锦标赛、KSA Level 1 等

**推论：「非 PractiScore 地区」不是一个统一市场，而是碎片化的。** 一个芬兰就有两套系统并行。我们目前支持的 ESS 41 地区，**需要核实是否包含芬兰**——若芬兰成绩实际落在 Pelias 和 SSI 上，芬兰射手打开 App 也导不进自己的成绩。

**SSI 直连不可行**（实测）：
- `shootnscoreit.com/event/`、`/api/` 均 404，且提示未登录无权访问
- 没有公开的赛事列表页或 API
- 想拉取只能靠登录态抓取，脆弱且有 ToS 风险

**发现一条杠杆更大的路：WinMSS 文件格式**

SSI 官方说明写明它可与 **WinMSS / ESS 双向互导**：
> Export registration or stage and scoring for IPSC matches and import this into WinMSS or ESS... You can also import match data back into SSI from WinMSS or ESS using **WinMSS file format**.

而 WinMSS 是 **IPSC 官方赛事计分程序**，各国向 `ipsc.org` 上报成绩也走它。**因此 WinMSS 格式实质上是整个 IPSC 世界的通用交换格式**——ESS、SSI、各国自建系统（含 Pelias，因为要上报）都得能导出它。支持一次，理论覆盖全部 IPSC 赛事，无需逐国接入。

**⚠️ 但有个前提未验证，投入前必须先查**：
**WinMSS 文件通常在主办方手里，选手未必能自己拿到。** 若只有赛事管理员可导出，这条路服务的是「俱乐部 / 主办方」场景，对个人选手无用——而我们的用户是选手。

要验的具体问题：**普通参赛选手有没有渠道拿到自己参赛那场的 WinMSS 文件**（主办方是否公开发布、成绩页是否提供下载）。

**WinMSS 的文件形态（已查实，是好消息）**：
- **`winmss.mdb`** — Microsoft Access 2000 数据库，WinMSS 主库，含全部赛事数据（选手 / 关卡 / 成绩 / 命中分布都在表里）
- **`winmss.cab`** — 导出备份用的压缩包，**比 mdb 小 15–20 倍**，是实际用于交换与上报的形态（WinMSS 菜单 `Match → Export/Backup`）
- **不是 PDF，完全结构化**，无需 OCR。`.mdb` 是有成熟解析方案的老格式

**已有第三方走通这条路（关键佐证）**：
- **`scoring.services`** — 页面标题即「Import WinMSS or PractiScore match — full IPSC stats worldwide」
- **`MakeReady`**（`makeready.info`）— 有专门的更新日志讲 `winmss.cab` 上传，说明该格式适合「海外 IPSC 赛事、没有 ShootingHouse URL 的 WinMSS 赛事、快速发布最终成绩」

这同时验证了两点：格式可解析（已有人在解），且这些平台的用户确实拿得到 `winmss.cab`。

**但措辞值得注意**：MakeReady 说的是「**national and international organizers** exporting WinMSS .cab files」——指向**主办方**。所以「选手个人能否拿到文件」这个前提**仍未解决**。

**然而多出一条更实际的路径**：这些第三方平台**已经把 winmss 数据导入并公开展示**。若如此，选手不必自己拿文件——去 `scoring.services` 这类站点就能看到自己成绩。那我们的接入对象就从「解析 WinMSS 文件」变成「对接已聚合好数据的平台」，性质与成本完全不同。

**下一步该查的（codex 从这里接）**：
1. `scoring.services` 覆盖多少赛事 / 哪些地区，**芬兰的赛事在不在里面**
2. 它有没有公开接口或可抓取的成绩页（对比 SSI 的无 API 情况）
3. `MakeReady` 同样查一遍
4. 若这些平台覆盖面够广 ⟹ 优先对接它们，而非自己解析 mdb/cab
5. 若覆盖面窄 ⟹ 回到「选手能否自取 winmss.cab」这个问题

**方向优先级修正**（覆盖 §7 中原有的推测）：
1. 先验「选手能否拿到 WinMSS 文件」——这一条决定后面所有投入是否成立
2. 若能拿到 → 支持 WinMSS 导入，一次覆盖全 IPSC 世界，优先级高于继续铺 ESS 地区
3. 若拿不到 → 国际成绩管理这条线整体降级，专注北美 PractiScore（那边痛点证据最强，见 §3.2 D/E）
4. **各国自建系统（Pelias 类）逐个接入不划算**——一国一套，小市场投入产出不成比例
5. SSI 直连放弃

### 3.3 如实报告：国际（ESS/HDP 地区）方向证据不足

r/IPSC 搜 "video editing" 零结果；"ESS + IPSC results" 无射手讨论命中。唯一沾边的 ShotArchive 零评论，只能证明"开发者认为是痛点"，不代表群体共鸣。

**不要用北美 PractiScore 用户的抱怨冒充国际用户诉求。** 「支持 41 个 ESS 赛区直连导入」可作为**功能事实**陈述，但不适合做成基于痛点的内容页。

**这不代表方向错**，可能只是这批人不在英文互联网讨论。要验证需换渠道：各国 IPSC 协会 Facebook 群、本地语言论坛、Brian Enos 国际版块（当时站点故障未能访问）。

---

## 4. 内容架构方案

### 4.1 首页结构调整（已决策）

**把「射手的比赛档案」提升到与「视频剪辑」并列的位置。**

依据：调研显示成绩管理的痛点强度不输甚至超过视频剪辑（43 评论、27 评论的高共鸣帖都在成绩侧），而 ShootingCut 目前以视频编辑器身份呈现，成绩导入像附属功能。两条线对应**不同的使用动机和人群**：

| | 视频剪辑线 | 比赛档案线 |
|---|---|---|
| 动机 | 发社媒 / 给人看 | 训练复盘 / 追踪进步 |
| 人群 | 想展示的选手 | 认真训练的选手 |
| 核心能力 | AutoTrim、SplitSync、StageMix、Reframe | 41 地区 ESS 导入、PractiScore 逐枪锚定、本地+iCloud 存档 |
| 差异化 | 按 timer 自动对齐 | 不上传服务器 |

首页需要在 Hero 之后就让两条线各占一块，而不是把成绩放进功能列表的第 N 项。

### 4.2 子页面（按证据强度排序）

**第一批**

| 页面 | 对应证据 | 优先级 |
|---|---|---|
| `/practiscore-scores-to-personal-archive` | D（43 评论）+ 本地存储卖点 | 最高 |
| `/side-by-side-run-comparison` | B（56 赞，最强证据）+ 可对比 CapCut | 最高 |
| `/score-overlay-without-cloud` | C（竞品验证 + 隐私差异化） | 高 |
| `/track-hit-factor-progress` | E（27 评论，晋级预测需求） | 高 |

**第二批：赛事落地页**（模板化批量生产）
`/for-uspsa`、`/for-ipsc`、`/for-idpa`、`/for-steel-challenge`、`/for-pcsl`

**第三批：FAQ 扩容**
现有 11 条（中文）/ 类似数量（英文），且多为「多少钱」「支持什么平台」类产品问题。扩到 20-25 条，纳入调研发现的真实操作问题：训练复盘怎么快速定位某一枪、连射时枪声数不准怎么办、没有 timer 声音能不能用、导出多大分辨率合适。

**明确不做**：国际 ESS 成绩管理独立页（证据不足）、泛泛的"剪辑软件推荐"（内容随处可见，AI 不会引用）

---

## 5. GEO 技术清单

1. **`llms.txt`**（成本最低、收益最直接）——根目录放机器可读的站点摘要：产品是什么、解决什么、核心事实（免费范围、支持赛制、平台要求）、页面索引。多数站点还没做
2. **每页首段写成「可提取答案」**——AI 优先取能独立成立的段落。示例：
   > Shooting Cut imports official per-shot times from PractiScore and anchors them onto your own footage by matching the timer beep in the audio. The split times shown on screen match the official record. This works on iPhone, iPad and Mac, and is free — no subscription required.

   三句话里有产品名、能力、机制、平台、价格，AI 拿去几乎不用改写
3. **结构化数据扩展**——内容页加 `HowTo`（AI 回答「怎么做 X」时倾向引用有明确步骤标记的内容）、`Article`（含 `datePublished` / `author`）、`BreadcrumbList`
4. **具体数字优先于形容词**——「41 regions」「up to 20 videos」「2-3 angles」「4 layouts」是 AI 会原样搬运的东西
5. **中英对等 + hreflang**——中文 AI 搜索（豆包、Kimi、元宝）同样在抓，而中文射击视频剪辑内容供给几乎空白
6. **新页面同步进 `sitemap.xml`**

**已有的基础**（不用重做）：`robots.txt` 已显式放行 GPTBot、ChatGPT-User、Google-Extended、PerplexityBot、ClaudeBot、Applebot-Extended；JSON-LD 已有 SoftwareApplication / FAQPage / VideoObject×4 / Organization / Offer / ItemList。

---

## 6. 落地顺序建议

1. **`llms.txt` + FAQ 扩容** —— 半天内可完成，立刻扩大可引用面
2. **首页信息架构调整** —— 让「比赛档案」与「视频剪辑」并列
3. **`/practiscore-scores-to-personal-archive`** 与 **`/side-by-side-run-comparison`** —— 两条线各做一个验证效果
4. **铺开第一批剩余页面**
5. **赛事落地页**（模板化）

每批做完等 2-3 周，直接去问 ChatGPT / Perplexity「how to edit uspsa match video」「how to track my uspsa scores」看有没有被引用，再决定下一批投入。

---

## 7. 待办与未验证事项

- [ ] `Agent Reach` skill 安装（官方 marketplace 无此插件，需第三方来源地址）
- [ ] Brian Enos 论坛重试（当时站点故障；USPSA/IPSC 圈质量最高的论坛，尤其值得看**视频复盘**角度的讨论）
- [ ] 国际 ESS 地区痛点换渠道验证（各国 IPSC 协会 FB 群、本地语言论坛）
- [ ] 竞品调研补充：cyfrTimer / shotstreamer / MatchChaser / classification.rmshooting.com 的功能与定价，用于对比页
- [ ] 隐私政策 / 服务条款中的 TikTok 条款——待 TikTok 审核结果明朗后再决定去留

---

## 8. 事实基线（写文案时的准确口径）

- **版本**：1.1.3 (build 15)，2026-07-29 提交 iOS + macOS 双端审核
- **系统要求**：iOS 26+ / iPadOS 26+ / macOS 26+
- **价格**：周 $4.99 / 月 $9.99 / 年 $59.99。**无 Lifetime**（已下架）。试用：周月 3 天，年 7 天
- **免费范围**：AutoTrim 与成绩导入（含 PractiScore 官方逐枪时间）对所有用户免费。**免费导出带 Shooting Cut 水印 + Logo 片头卡**
- **Pro 解锁**：去水印、自定义片头卡、多机位模式（SplitSync / StageMix）、社交直传、批量导出
- **逐枪时间锚定只有 PractiScore 支持**；ESS / HDP / IDPA 仅导入成绩。ESS 内置 41 个地区站点
- **TikTok 直传已移除**（开发者申请未获批），YouTube / Facebook 直传不变
- **赛制支持**：USPSA、IPSC、IDPA、PCSL
