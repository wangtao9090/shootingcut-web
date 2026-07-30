# Shooting Cut GEO 内容与技术交接

> 状态：2026-07-29 实施稿。发布前用最终 commit、CI、Pages 与线上检查结果
> 替换文中的待填项。

## 1. 目标与当前结论

本轮工作的目标不是寻找新的产品市场机会，也不是制作竞品对比，而是让
搜索引擎与生成式回答系统更容易准确理解、检索和引用 Shooting Cut 的
现有能力。

Shooting Cut 1.1.3 应被描述为一款完整的竞技射击视频编辑器。计时器蜂鸣
声与枪声分析是支持裁剪、同步、计时和字幕的一项能力，不是产品的全部。
当前内容架构围绕射手实际会问的工作流问题组织：单段自动裁剪、整场比赛
合并、双机位同步、2–3 机位剪辑、横屏素材重构、检测排查、成绩导入、
官方逐发计时字幕、泰国 HDP/ESS 结果留存、分屏比较和批量导出。

## 2. 1.1.3 产品事实基线

以下口径来自本机 `Shooting_Cut` 产品仓库的当前源码审计与已上线的
1.1.3，而不是长期未更新的用户手册。

### 2.1 平台、模式与方案

- 平台：iPhone、iPad、Mac；当前站点口径为 iOS/iPadOS/macOS 26.0+。
- Auto Trim：恰好 1 个视频。
- Merge：最多 20 个按顺序播放的视频，可调整顺序和包含状态；每个输入
  可保留自己的分析状态与成绩关联。
- Split Sync：恰好 2 个同步视角；四种布局是 Full Screen、
  Dual View: Center HUD、Dual View: Top HUD、Side by Side。
- Stage Mix：2–3 个同步输入，角色为 POV、Follow、Static；自动切换会
  考虑移动状态，并允许人工覆盖。
- Auto Trim 与成绩导入免费；免费 Auto Trim 导出包含 Shooting Cut
  水印与 Logo 片头卡。
- 可安全公开的 Pro 能力：移除 Shooting Cut 水印、自定义片头卡、
  Split Sync、Stage Mix、macOS 批量导出。
- 一次订阅覆盖订阅者的所有 Apple 设备；不得写成“一次购买”或终身买断。
- 当前用户主动直传目标是 YouTube 和 Facebook。不要宣传 TikTok 直传。

### 2.2 成绩和计时

- 当前存在 PractiScore、ESS、HDP/IDPA 的成绩导入路径。
- ESS 目录中配置了 41 个区域站点。
- 当 PractiScore 记录实际包含官方计时器逐发数据时，Shooting Cut 可用
  视频中的蜂鸣声建立锚点，并在字幕中使用官方时间、Split、发数与成绩。
- ESS、HDP、IDPA 可提供成绩导入，但不提供相同的 PractiScore 式官方
  逐发锚定来源。
- 不宣称任意 PDF、WinMSS、所有计分系统或自动弹着点识别。

### 2.3 Reframe/Track 与导出

- Auto Trim、Merge、Stage Mix 支持 Reframe/Track；Auto Trim 与 Merge
  也支持手动裁切。
- Track 驱动的裁切比例是 9:16、3:4、4:5、6:7、1:1。
- Source 不裁切；16:9 不是 Track 比例，应与追踪裁切分开说明。
- 常规分辨率选择可显示 Original、4K、1080p、720p，但会受源素材和具体
  工作流上限过滤。
- Track 裁切使用 1080 像素短边并可降为 720p，不是 4K 追踪导出。
- Split Sync 由布局决定画布，也使用 1080 像素短边；不能写成任意
  比例/分辨率组合。

### 2.4 检测排查

公开排查项包括 AGC、邻近枪声、回音/混响、弱计时器蜂鸣声、灵敏度、
计时器标记、添加/删除枪声、最后一发和 minimum split。自动检测是可编辑
的辅助结果，导出前仍需人工复核。

`.22` 不是本产品的公开限制，任何页面、FAQ 或机器摘要都不应把它列为
检测问题。

### 2.5 源码审计纠错

本轮先以 1.1.3 源码纠正旧手册和早期站点中的漂移口径，再写公开页面。
下表也是未来版本复核时的最小检查集：

| 容易漂移或误写的口径 | 1.1.3 已核实口径 |
|---|---|
| 把产品缩写成枪声字幕叠加工具 | Shooting Cut 是完整的竞技射击视频编辑器；计时器与枪声分析只是服务于裁剪、同步、计时和字幕的一项能力 |
| 版本、平台与系统要求 | 当前上线版本为 1.1.3，支持 iPhone、iPad、Mac；站点口径为 iOS/iPadOS/macOS 26.0+ |
| 模式输入数量 | Auto Trim 恰好 1 段；Merge 最多 20 段顺序素材；Split Sync 恰好 2 个同步视角；Stage Mix 为 2–3 个同步机位 |
| 购买/订阅 | Auto Trim 与成绩导入免费；公开 Pro 边界见 2.1；一次订阅覆盖订阅者的 Apple 设备，不是一次购买或终身买断 |
| 直接上传平台 | 仅宣传用户主动发起的 YouTube 与 Facebook 直传，不宣传 TikTok 直传 |
| 成绩与官方逐发计时 | PractiScore 记录实际带有官方逐发计时才可用于官方时间锚定；ESS、HDP、IDPA 是成绩导入，不提供同类逐发锚定 |
| Track 比例与分辨率 | Track 比例是 9:16、3:4、4:5、6:7、1:1；Source 不裁切，16:9 是独立非 Track 路径；Track 以 1080 短边为上限并可降至 720p |
| 检测限制 | AGC、邻近枪声、回音/混响、弱蜂鸣声是实际排查项；`.22` 不是限制 |

## 3. 隐私与安全口径

“设备端处理”是重要且可验证的定位，但必须同时说明网络边界，避免
“所有数据都不离开设备”“完全离线”“无第三方”“100% 安全”等绝对承诺。

### 3.1 设备端完成

- 核心视频/音频分析、剪辑、导出和人物追踪在用户 Apple 设备上完成。
- 原始素材不会为了核心编辑或识别上传到 Shooting Cut 的媒体处理服务器。
- 原始媒体、提取的 PCM 音频、人物追踪路径/关键帧不进入 iCloud KVS。

### 3.2 可能使用网络

- Apple Photos、iCloud Photos、iCloud Drive 的下载、上传和同步由 Apple
  服务及用户设置控制。
- iCloud KVS 可同步轻量元数据，包括素材别名、机位视角、枪械类型、
  成绩关联、导入比赛记录中的射手/比赛字段，以及已经存在的非匿名自定义
  RevenueCat App User ID。
- 以 `$RCAnonymousID:` 开头的 RevenueCat 匿名 ID 不备份到 KVS。
- 另一台 Apple 设备可读取已保存的自定义 App User ID，并用它登录
  RevenueCat 以恢复相同订阅身份；RevenueCat 接收订阅标识和权益状态。
- “帮助改进枪声检测”当前默认开启但由用户控制。行内标签为“改进”或
  “改进检测”，导出设置使用完整标签。开启时可向 Apple CloudKit 发送
  有限的伪匿名派生检测/时序/频谱字段、随机会话/分析标识和纠错事件，
  不包含原始视频、原始音频或 PCM。
- 关闭后不会创建新报告，也不会在关闭期间重试本地待处理队列；关闭不会
  删除已经提交的数据或清空本地队列，重新开启后队列可能继续重试。
- 成绩导入使用网络。
- 用户主动发起 YouTube/Facebook 上传时，所选导出视频及完成上传所需的
  授权/元数据会发送给目标平台。

## 4. 双域名、双仓库架构

| 站点 | 仓库 | 内容语言 | Pages 自定义域名 |
|---|---|---|---|
| 英文 | `wangtao9090/shootingcut-web` | English | `shootingcut.com` |
| 中文 | `wangtao9090/shootingcut-cn` | 简体中文 | `shootingcut.cn` |

两站独立维护、独立校验、独立部署。相同主题使用相同根路径，并通过跨域
`hreflang` 成对关联：

- 英文页：self `en`、中文同路径 `zh-Hans`、英文 `x-default`。
- 中文页：英文同路径 `en`、self `zh-Hans`、英文 `x-default`。

`shootingcut.com/zh/`、`.com/*-zh.html`、中文仓库内的重复 `zh/` 与
`*-zh.html` 均已移除，不保留兼容跳转。`.com` OAuth 回调不受影响。
旧的跨仓库 `sync-cn.yml` 已移除。

### 4.1 已知 App 链接依赖

当前产品源码 `Shooting_Cut/Shooting_Cut/AppURLs.swift` 的非
`GLOBAL_VERSION` 中文分支仍指向
`https://shootingcut.com/privacy-zh.html`。2026-07-29/30 线上旧页面仍
返回 200，但本轮按产品决策移除 `.com` 中文兼容页后，已上线 App 的该入口
会失去目标；同时 `https://shootingcut.cn/privacy.html` 在 DNS 修复前存在
证书主机名不匹配。

这不是网站中继续保留旧中文页面的理由，而是跨仓库发布依赖：先完成
`shootingcut.cn` 域名验证、证书和 HTTPS，再在下一次 App 版本中把中文
隐私 URL 改为 `https://shootingcut.cn/privacy.html`，并完成带签名构建、
真机链接检查与 App 发布。网站仓库本轮不越权修改 Xcode 产品源码；最终
上线报告必须明确现有 1.1.3 的过渡影响。

## 5. 调研工具与证据边界

### 5.1 工具状态

- Agent Reach 以用户级全局方式安装，当前 `v1.5.0`。
- `yt-dlp` 位于 `/opt/homebrew/bin/yt-dlp`，当前版本 `2026.07.04`。
- OpenCLI daemon/浏览器桥已连接。`agent-reach doctor --json` 为社交渠道
  给出 `warn`，原因是 doctor 不主动执行平台命令；本轮实际命令已验证
  Reddit 与 Facebook 搜索可用。
- 任意网页可通过 Jina Reader 验证；Exa 在大批并行免费查询时出现过
  HTTP 429，因此只用于发现，不作为唯一事实来源。
- YouTube 完整提取受到反机器人挑战；本轮改用 `yt-dlp --flat-playlist`
  读取公开搜索元数据，没有导出浏览器 Cookie。

### 5.2 证据强弱

- 产品能力与边界：以当前源码为最高优先级。
- 社区措辞：用于理解用户如何提问，不用于反推未实现功能。
- 来源可用性：以直接访问 ESS/HDP 等页面/API 的结果为准。
- Facebook 页面活跃度只能证明社区/语言渠道存在，不能单独证明某个剪辑
  痛点或精确市场比例。
- 竞品名只保留在内部研究，不进入公开营销、FAQ、JSON-LD 或指南。

### 5.3 OpenCLI Cookie 安全审计

本轮只读审计对象是本机实际安装的 OpenCLI CLI/daemon `1.8.6` 与 Chrome
扩展 `1.0.22`，不是仅根据项目介绍推断。

结论：没有发现把浏览器 Cookie 上传到 OpenCLI 自营云端的代码或现网连接。
扩展只连接 `ws://localhost:19825/ext`，daemon 只监听
`127.0.0.1:19825`；审计时 daemon 的全部 TCP 连接也只有 loopback。CLI
存在定期检查 npm/GitHub release 版本的请求，Chrome 扩展由 Chrome Web
Store 更新，但这些请求不携带浏览器站点 Cookie。普通 OpenCLI 站点适配器
在浏览器上下文中访问目标站点，Cookie 按浏览器规则发送给该目标站点，
命令结果经本地 daemon 返回给 CLI。

但它不是“低权限”工具，风险边界必须明确：

- 扩展拥有 `<all_urls>`、`cookies`、`debugger`、`tabs` 等广泛权限。
- 扩展实现了按 `domain` 或 `url` 读取原始 Cookie 的命令；它拒绝无范围的
  全量 Cookie dump，但本机 OpenCLI 调用者仍可取得指定站点 Cookie。
- daemon 的 HTTP 控制面使用 loopback、Origin/CORS 检查和固定
  `X-OpenCLI` header；这个 header 不是用户秘密，因此能在本机运行代码的
  其他进程可能调用 OpenCLI 控制面。应把本机恶意进程视为信任边界之外。
- 下载流程可能把目标域 Cookie 临时写入系统临时目录
  `opencli-download`，权限为 `0600`，正常路径会删除；进程崩溃仍可能留下
  临时文件。本次审计未发现遗留的 `cookies_*.txt` 或
  `media_cookies_*.txt`。
- 默认站点搜索不会把 Cookie 值作为结果输出，但明确运行 Cookie 命令、
  开启不当调试/trace、复制原始终端输出，仍可能把敏感值带进日志或 AI
  上下文。OpenCLI 自带 observation redaction 会遮盖 Cookie、
  Authorization、token 等常见字段，但不能把自动脱敏当成绝对保证。
- 扩展和 npm 包的未来更新仍属于供应链信任。建议保留自动更新可见性、
  定期复查权限/版本，在不使用社交调研时可禁用扩展或停止 daemon，并为
  高价值账号使用独立 Chrome profile。

因此适合本轮只读公开内容调研，但应按“拥有当前浏览器会话能力的本地自动
化工具”管理，而不是按普通无状态搜索 CLI 管理。

## 6. 社区与来源调研结论

### 6.1 视频与字幕查询语言

单个 Reddit 社区样本
[`How to edit USPSA match footage to show hits above target?`](https://www.reddit.com/r/CompetitionShooting/comments/1s0ta4p/how_to_edit_uspsa_match_footage_to_show_hits/)
使用了 “show hits”“match footage”“YouTube Short”“Instagram Reel”
等措辞，并讨论竖屏中结果信息占用空间的问题。它支持解释成绩/时间字幕与
竖屏可读性，但单条样本既不能代表普遍需求，也不支持宣称 Shooting Cut
能定位弹着点。

另一条 Reddit 样本
[`Playing with new Insta360 X5 - Competition with friends`](https://www.reddit.com/r/CompetitionShooting/comments/1q5573b/playing_with_new_insta360_x5_competition_with/)
显示发帖者先生成多段人物追踪裁切，再在另一个编辑步骤合并。它支持用真实
问题语言解释同一 Shooting Cut 工作流里的 Track/Reframe 与 Merge 组合，
但不支持推断市场占比，也不应在公开页面点名比较其他产品。

### 6.2 整场比赛视频

YouTube 公开标题样本反复出现：

- Full Match
- All Stages / Every Stage / Every Shot
- Full Match Recap
- POV
- 明确的关卡数量

因此 Merge 页面应回答：把 Stage 1…Stage N 按比赛顺序排列，最多合并
20 段，逐段复核并保留各自成绩关联，输出一个 YouTube 长视频或个人档案。
不得宣称自动生成章节。

### 6.3 泰国 HDP 与 ESS

HDP Thailand 与 Thailand Practical Shooting Association 在 Facebook
均有活跃公开页面，适合泰语/英语发现。直接来源审计显示：

- 审计时 ESS Thailand 只稳定暴露当前 match `98`；抽样的 `90–97` 旧
  match/result 地址无法取得对应结果。
- HDP API 当时返回 81 场比赛，其中 50 场标记完成，抽查完成赛事计分板
  均可访问。
- 单场精确姓名匹配快照支持两个参赛群体确实有明显重叠，但样本、拼写和
  音译限制使其不能作为公开百分比。

公开页面应指导泰国射手在 ESS 结果仍可访问时完成导入，并把已导入记录与
自己的本地比赛视频档案关联。Shooting Cut 可保留已经导入的记录，但不能
在源站删除结果后替用户恢复。HDP 与 ESS 都不提供 PractiScore 式官方
逐发锚定。

### 6.4 可复核证据表

以下是 2026-07-29/30 的研究快照，不应被当作永久统计。社交样本用于措辞，
产品能力仍以源码为准。

| 渠道 | 查询或端点 | 直接来源与样本 | 能支持 | 不能支持 |
|---|---|---|---|---|
| Reddit / OpenCLI | `How to edit USPSA match footage to show hits above target` | [帖子](https://www.reddit.com/r/CompetitionShooting/comments/1s0ta4p/how_to_edit_uspsa_match_footage_to_show_hits/)，1 条 | 用户样本使用了成绩展示、短视频、竖屏空间等措辞 | 普遍市场比例、自动弹着点定位能力 |
| Reddit / OpenCLI | `Playing with new Insta360 X5 - Competition with friends` | [帖子](https://www.reddit.com/r/CompetitionShooting/comments/1q5573b/playing_with_new_insta360_x5_competition_with/)，1 条 | 单个实际工作流把追踪裁切与后续合并分开完成 | 所有射手都采用该流程或对某产品的普遍评价 |
| YouTube / `yt-dlp --flat-playlist` | `USPSA full match stages`、`IPSC full match video`、`IDPA full match video`、`IDPA all stages full match POV` | 每个查询前 8 条，共 32 条；代表样本：[USPSA Every Stage](https://www.youtube.com/watch?v=OnTLFiDnQIA)、[USPSA Full Match Recap](https://www.youtube.com/watch?v=id_XyMKyqlI)、[IPSC Full Match](https://www.youtube.com/watch?v=Hi8KL6yC4vI)、[IPSC 11 Stages](https://www.youtube.com/watch?v=5nOXx6y301E)、[IDPA Every Stage](https://www.youtube.com/watch?v=lDnhbwqPmQQ)、[IDPA Full 12 Stages](https://www.youtube.com/watch?v=JpsnveHF2BY)、[IDPA All 16 Stages](https://www.youtube.com/watch?v=18bTuRl0UJ4) | “Full Match”“All/Every Stage”“POV”和明确关卡数是实际发布标题语言，Merge 应是一级主题 | 搜索结果代表所有上传者、自动章节需求或产品采用率；通用 IDPA 查询中有噪声 |
| Facebook / OpenCLI | `HDP Thailand กีฬายิงปืนเพื่อสันทนาการ` | [Facebook 登录态搜索](https://www.facebook.com/search/top?q=HDP%20Thailand%20%E0%B8%81%E0%B8%B5%E0%B8%AC%E0%B8%B2%E0%B8%A2%E0%B8%B4%E0%B8%87%E0%B8%9B%E0%B8%B7%E0%B8%99%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3)，返回约 1.8 万关注者的公开主页；1 次查询 | HDP 在 Facebook 有可见泰语社区入口 | 剪辑痛点、精确用户重叠率或稳定关注者数字 |
| Facebook / OpenCLI | `Thailand Practical Shooting Association` | [THPSA 主页](https://www.facebook.com/thpsa)，约 2.3 万关注者；1 次查询 | 泰国 IPSC 社区与泰语/英语发现入口存在 | 某一产品需求或两个参赛群体的精确重合 |
| ESS Thailand | `/portal?match=90…98` 与 `/portal/results/{id}?division=1` | [Thailand portal](https://tha.as.ipscess.org/portal)；9 个 match ID 与 9 个结果 URL。`98` 暴露 9 个 division，`90–97` 只返回通用 Matches 页且对应 division URL 为 404 | 当前结果可见而抽样旧结果 URL 不可用，支持“可访问时及时导入” | ESS 永远只保留一场、源站未来行为或 Shooting Cut 能恢复已删除来源 |
| HDP | `/api/Matchs?ItemPerPage=100` 与完成赛事 scoreboards | [HDP Matchs API](https://api.homedutypistol.com/api/Matchs?ItemPerPage=100)；81 场、其中 50 场标记完成；50 个完成赛事计分板抽查 | 审计时 HDP 提供可浏览的完成赛事与成绩导入来源 | 数字永久不变、官方逐发计时、长期可用性承诺 |
| 产品源码 | `ESSSiteDirectory.swift`、`ESSParser.swift`、`HDPParser.swift` | 1.1.3 当前仓库；ESS 41 个区域站点及 HDP/ESS 导入路径 | 公开功能、输入和来源边界 | 社区需求强度或未来路线图 |

姓名重叠分析只作为内部选题依据。单场规范化精确匹配支持两个参赛群体存在
实际交集，但拼写、音译、时间窗口和单场样本限制很大，因此公开交接和页面
均不发布计数或百分比。可复现实验细节只保留在不进入 Git 的内部研究笔记。

## 7. 内容架构

### 7.1 基础解释页

- `/competitive-shooting-video-editor/`
- `/on-device-shooting-video-editor/`

### 7.2 核心工作流

- `/auto-trim-shooting-match-video/`
- `/sync-two-shooting-videos-by-timer-beep/`
- `/edit-multi-camera-shooting-video/`
- `/shot-detection-troubleshooting/`
- `/reframe-landscape-shooting-video-for-social-media/`
- `/merge-uspsa-stage-videos/`

### 7.3 进阶工作流

- `/side-by-side-shooting-video-comparison/`
- `/batch-export-match-videos/`
- `/import-practiscore-ess-hdp-match-results/`
- `/thailand-hdp-ess-match-results/`
- `/add-shot-times-and-scores-to-match-video/`

英文与中文站必须都有上述同路径页面。泰国页可在英文正文内增加一段明确
标注 `lang="th"` 的泰语答案，但没有独立泰语 URL 时不得虚构 `th`
hreflang。

### 7.4 逐路由实施状态

状态快照为 2026-07-29/30 的 feature branch 验证结果。`tracked + validator
+ HTTP` 表示页面已进入 Git、生产 validator 通过，并在本地 HTTP 服务中
返回 200；最终合并后仍需以生产 Pages URL 再验一次。

| 路径 | 英文 `shootingcut-web` | 中文 `shootingcut-cn` |
|---|---|---|
| `/competitive-shooting-video-editor/` | tracked + validator + HTTP 200 (`4b9b90b`) | tracked + validator + HTTP 200 (`10f8a6f`) |
| `/on-device-shooting-video-editor/` | tracked + validator + HTTP 200 (`4b9b90b`) | tracked + validator + HTTP 200 (`10f8a6f`) |
| `/auto-trim-shooting-match-video/` | tracked + validator + HTTP 200 (`24281a7`, copy `cdaf87b`) | tracked + validator + HTTP 200 (`062ec95`, copy `0537f56`) |
| `/sync-two-shooting-videos-by-timer-beep/` | tracked + validator + HTTP 200 (`24281a7`, copy `cdaf87b`) | tracked + validator + HTTP 200 (`062ec95`, copy `0537f56`) |
| `/edit-multi-camera-shooting-video/` | tracked + validator + HTTP 200 (`24281a7`, copy `cdaf87b`) | tracked + validator + HTTP 200 (`062ec95`, copy `0537f56`) |
| `/shot-detection-troubleshooting/` | tracked + validator + HTTP 200 (`24281a7`, copy `cdaf87b`) | tracked + validator + HTTP 200 (`062ec95`, copy `0537f56`) |
| `/reframe-landscape-shooting-video-for-social-media/` | tracked + validator + HTTP 200 (`24281a7`, copy `cdaf87b`) | tracked + validator + HTTP 200 (`062ec95`, copy `0537f56`) |
| `/merge-uspsa-stage-videos/` | tracked + validator + HTTP 200 (`24281a7`, copy `cdaf87b`) | tracked + validator + HTTP 200 (`062ec95`, copy `0537f56`) |
| `/side-by-side-shooting-video-comparison/` | tracked + validator + HTTP 200 (`0e95fc8`) | tracked + validator + HTTP 200 (`72e67ff`, copy `1958695`) |
| `/batch-export-match-videos/` | tracked + validator + HTTP 200 (`0e95fc8`) | tracked + validator + HTTP 200 (`72e67ff`, copy `1958695`) |
| `/import-practiscore-ess-hdp-match-results/` | tracked + validator + HTTP 200 (`0e95fc8`, copy `50df07d`) | tracked + validator + HTTP 200 (`72e67ff`, copy `1958695`) |
| `/thailand-hdp-ess-match-results/` | tracked + validator + HTTP 200 (`0e95fc8`, copy `50df07d`) | tracked + validator + HTTP 200 (`72e67ff`, copy `1958695`) |
| `/add-shot-times-and-scores-to-match-video/` | tracked + validator + HTTP 200 (`0e95fc8`) | tracked + validator + HTTP 200 (`72e67ff`, copy `1958695`) |

已通过的 CI 快照：

- 英文基础、核心与进阶批次：Actions `30516027085`、`30517690464`、
  `30518112808`、`30518986702`、`30519706730` 均成功。
- 中文基础、核心、进阶与复审文案：Actions `30516111440`、
  `30517187056`、`30517561082`、`30518151793`、`30519256401` 均成功。
- 上表只代表内容批次；主页、`llms.txt`、本交接文档与最终 merge/Pages
  的 SHA 和 run 必须在发布后补入第 13 节。

## 8. 页面与机器发现实现

每篇内容页应具备：

- H1 后立即出现能独立回答查询的首段。
- 精确的输入、输出、步骤、限制、已验证的 Free/Pro 边界和更新日期。
- self canonical、精确 `og:url`、跨域 reciprocal `hreflang`。
- `Article` 与 `BreadcrumbList` JSON-LD；仅当可见内容逐项对应时增加
  `HowTo` 或 `FAQPage`。
- 可访问的跳转链接、标题层级、表格 caption、键盘焦点和移动端横向表格。
- 首页/内容中心入口及相关指南之间的上下文链接。

站点级实现包括：

- 域名独立 `robots.txt`。
- 域名独立 `sitemap.xml`，`loc` 只包含本域 URL。
- 域名独立 `llms.txt`，提供产品事实与页面索引；它只是补充发现文件，
  不应被描述为所有 AI 系统都会遵循的标准。
- dependency-free Node validator 与 GitHub Actions 门禁。

## 9. 校验与部署

每个独立仓库在提交前运行：

```bash
node --check scripts/validate-site.mjs
node --test scripts/validate-site.test.mjs
node scripts/validate-site.mjs
xmllint --noout sitemap.xml
git diff --check
```

另需启动本地 HTTP 服务，检查 sitemap 中全部公开路由返回 200，并在桌面
和移动宽度检查关键页面。每个逻辑批次使用英文 commit message，push 到
`codex/geo-optimization`，等待 Actions 终态成功，再进行独立 code review。

最终经全站复审后，将两个分支分别正常合并到各自 `main`，不重写历史。
GitHub Pages 继续使用 `main` / repository root 和现有 `CNAME`。

## 10. `shootingcut.cn` DNS 与 HTTPS

审计时中文 Pages `status=built`，但 `https_enforced=false`，生产 HTTPS
存在证书主机名不匹配。阿里云权威 DNS 当时配置为：

- apex `shootingcut.cn` CNAME → `wangtao9090.github.io`
- `www` CNAME → `wangtao9090.github.io`
- 没有 GitHub Pages 域名验证 TXT

按 GitHub 当前官方指引，完成顺序如下：

1. 在 GitHub 个人账户 `Settings → Pages → Add a domain` 添加
   `shootingcut.cn`，取得 GitHub 提供的 TXT 主机和值。
2. 在阿里云 DNS 发布该 TXT。使用
   `dig TXT _github-pages-challenge-wangtao9090.shootingcut.cn` 确认权威
   与公共解析可见后，回到 GitHub 点击 **Verify**。验证成功后永久保留
   这条 TXT，以持续降低自定义域名被接管的风险。
3. 在 `wangtao9090/shootingcut-cn → Settings → Pages` 确认 custom domain
   仍为 `shootingcut.cn`，并确认仓库根目录 `CNAME` 内容一致。
4. 删除 apex 上冲突的 CNAME，改为以下四条官方 A 记录：
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   `www` 保持直接 CNAME 到 `wangtao9090.github.io`，不要配置 wildcard，
   也不要同时保留冲突的 A/CNAME/ALIAS/ANAME。若最终选择 GitHub 支持的
   ALIAS/ANAME，必须记录实际方案，并删除冲突记录。
5. 分别核对 apex 与 `www` 的 DNS、GitHub Pages DNS check、证书 SAN。
   证书实际覆盖 `shootingcut.cn` 后再开启 **Enforce HTTPS**，最后验证
   HTTP/HTTPS 以及 apex/`www` 的跳转结果。

GitHub 当前文档说明 DNS 传播可能需要最长 24 小时，`Enforce HTTPS`
选项也可能需要最长 24 小时才可用；不能在未验证证书主机名时宣称完成。

官方参考（访问于 2026-07-29）：

- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verifying a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Securing Pages with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

## 11. 上线后的测量计划

GEO 不承诺排名或引用，应建立可重复的基线：

1. 部署后在 Google Search Console 与 Bing Webmaster Tools 提交两个
   sitemap，记录已发现/已索引 URL。
2. 按查询簇跟踪曝光、点击、平均位置与着陆页：
   - competitive-shooting/full-match video editing
   - sync two shooting videos
   - multi-camera stage video
   - landscape-to-vertical shooting video
   - PractiScore/ESS/HDP result import
   - preserve ESS Thailand results
   - add official shot times/scores to video
   - on-device/private shooting video editor
3. 单独建立 Thailand-intent 采样，至少覆盖英语与泰语：
   - `HDP ESS Thailand match result import`
   - `preserve ESS Thailand match results`
   - `link Thailand match results to shooting video`
   - `นำเข้าผลการแข่งขัน HDP ESS`
   - `เก็บผลการแข่งขัน ESS ประเทศไทย`
   - `เชื่อมผลการแข่งขันกับวิดีโอยิงปืน`
   按语言分别记录着陆页、引用和事实错误，不能用英语结果替代泰语可发现性。
4. 使用新会话、非个性化条件抽样 ChatGPT、Perplexity、Claude 及中英文
   生成式搜索的回答和引用，并加入上述泰语查询。记录日期、查询、是否出现
   本站、引用 URL 与事实错误，不把单次回答当作长期排名。
5. 在第 2、4、8 周复盘；区分“未抓取”“已抓取未索引”“有曝光无点击”
   “被引用但措辞不准”四类问题，再决定修改标题、首段、内部链接或内容。
6. 只有在站点实际部署了分析工具、且隐私披露允许时，才使用 referral 或
   analytics 数据。本轮没有把未部署的遥测当成既有证据；没有 analytics
   时，以 Search Console、Bing Webmaster Tools、Pages/HTTP 检查和人工
   引用抽样为基线。
7. 每次 App 发布后重新核对版本、系统要求、模式限制、Free/Pro、上传目标、
   成绩来源、隐私与导出上限，并同步两站。

## 12. 剩余调研与维护节奏

- 发布后 48 小时：复核双站 18 个 sitemap URL、canonical/hreflang、
  `llms.txt`、Pages 构建、移动端和旧 `.com/zh` 路径的预期 404。
- 第 2、4、8 周：按第 11 节记录索引、查询和生成式引用基线；只修正有
  证据的问题，不为单次模型回答堆砌近义页面。
- 每月：低频复查 YouTube 完整比赛标题样本、Reddit/ Facebook 直接来源
  是否仍可访问；记录查询、日期和样本数，不把社交样本升级为产品事实。
- 每月直到稳定：检查 `shootingcut.cn` TXT、apex/www DNS、证书到期日和
  HTTPS enforcement；GitHub 验证 TXT 必须永久保留。
- 每个 App 版本：从源码重跑第 2.5 节纠错表，核对首页、18 条内容路由、
  FAQ、隐私页、两份 `llms.txt` 与 README，避免双站漂移。
- 下一次 App 发布前：在 `.cn` HTTPS 正常后更新中文隐私 URL，运行产品
  仓库的带签名构建与真机链接测试；不能把当前网站改造误写成 App 已更新。
- 每季度：逐路径比较英文/中文站的主题、canonical、hreflang、sitemap 和
  核心事实；语言可本地化，但输入上限、方案、隐私和网络边界必须一致。
- 待补研究：在不扩大 Cookie 风险的前提下，持续收集更多泰语 HDP/ESS
  查询措辞和跨赛事 ESS 历史可用性快照。除非有纵向样本，不公开姓名重叠
  百分比；Facebook 关注者数字只作为带日期的渠道快照。

## 13. 2026-07-30 发布结果

- 英文 merge commit：
  `dda86076f5e20c58fba8024029a8dc1473a62b4f`。
- 中文 merge commit：
  `c01fbf486d42eea3a189587f67436450323cdd13`。
- 英文 `Validate site` Actions `30522589533` 与 Pages
  `30522588648` 均成功，Pages deployment SHA 与英文 merge commit 一致。
- 中文 `Validate site` Actions `30522589063` 与 Pages
  `30522588412` 均成功，Pages deployment SHA 与中文 merge commit 一致。
- 生产检查：英文 sitemap 的 18/18 URL 均通过正常 HTTPS 返回 200；
  中文 sitemap 的 18/18 URL 已部署并通过 HTTP/忽略证书验证的 HTTPS 返回
  200。两站首页各有 13 条唯一指南链接，`llms.txt` 与泰国专题均已上线。
- 已按产品决策移除旧 `.com/zh/`、`*-zh.html` 及中文仓库重复路径；抽查
  `.com/zh/`、`.com/privacy-zh.html`、`.com/faq-zh.html` 和中文站对应旧
  路径均返回 404。
- `shootingcut.cn` DNS/证书/HTTPS 尚未完成：GitHub Pages 仍报告
  `https_enforced=false`，正常 HTTPS 校验因证书 SAN 不匹配失败，HTTP
  当前返回 200。完成第 10 节域名验证和 DNS 顺序后才能关闭此项。
- App 1.1.3 的非 `GLOBAL_VERSION` 中文隐私链接仍指向已经移除的
  `.com/privacy-zh.html`；下一版 App 必须按第 4.1 节迁移到
  `.cn/privacy.html`。这项产品仓库变更不包含在本次网站发布中。

## 14. 2026-07-30 英文优先决策

- 当前阶段只保障 `shootingcut.com`、英文查询和已上线的非中国区 App Store
  市场；`shootingcut.cn`、中文查询、中国区 App Store 与 `.cn` HTTPS
  不作为英文 GEO 后续工作的阻塞项。
- `.com` 的所有可见导航保持纯英文：主页以及 13 条指南、FAQ、隐私、支持和
  条款页面不再显示 `Chinese` 切换入口。
- canonical、HTML `hreflang` 与 sitemap alternate 仍作为机器可读的语言关系
  保留；移除可见入口不等于删除两站的 alternate 元数据。
- 后续按
  [`2026-07-30-shootingcut-english-geo-post-launch.md`](superpowers/plans/2026-07-30-shootingcut-english-geo-post-launch.md)
  执行，并在
  [`geo-english-measurement.md`](geo-english-measurement.md)
  记录英文索引、查询、引用与媒体证据。
- 后续真实产品截图与录屏批次按
  [`geo-english-media-brief.md`](geo-english-media-brief.md)
  执行。该批次不是 Search Console 提交或英文页面收录的前置条件；Split
  Sync、Stage Mix 与 Reframe 优先复用已经上线的官方视频。

## 15. 2026-07-30 射手剪辑痛点复核

本轮使用 Agent Reach、OpenCLI、yt-dlp 与公开网页重新检查 Reddit、
Facebook、YouTube 和 Brian Enos Forum。它是一组定性语言样本，不是搜索量、
市场占比或产品采用率统计。Shooting Cut 所有者账号的帖子和产品开发者推广
帖均从独立痛点证据中排除。

按直接用户陈述、跨来源重复和工作流可复核程度，痛点排序如下：

1. **强证据：通用剪辑软件对基础比赛剪辑过重。** 用户只想完成裁剪、拼接、
   分屏、画幅调整和导出，却面对复杂时间线与较长学习过程。
2. **强证据：工作流被拆到多个 App。** 常见描述是先在相机 App 裁剪或追踪，
   导出到手机，再进入第二个编辑器拼接、叠加并再次导出。
3. **强证据：POV 与第三人称素材需要同步或同屏。** 两个视角能帮助复核脚步、
   换弹、急停、移动和 stage strategy，但手工对齐会增加剪辑负担。
4. **强至中等证据：横屏转竖屏容易损失主体或上下文。** 用户明确提到模糊
   边框、固定裁切放大以及画面两侧被切掉。
5. **中等证据：视频需要成绩与计时上下文。** Shot time、split、shot count、
   stage result 和 score 能让观众理解表现；该需求不支持自动弹着点定位宣称。
6. **中等证据：整场比赛长视频是实际发布结果。** YouTube 与 Facebook
   公开样本反复出现 `Full Match`、`Every Stage`、`All Stages`、
   `Every Shot` 与 `Full Match Recap`。
7. **中等证据、工作流推断：多 stage 重复准备和渲染产生批处理需求。**
   这一点适合解释 batch export，但不能写成未经测量的普遍用户比例。
8. **弱主痛点、强信任理由：本地处理与隐私。** 本轮只有少量直接隐私抱怨；
   因此它应作为重要信任证据，而不是替代完整剪辑结果的首页主标题。

### 15.1 可复核来源与边界

| 痛点 | 直接来源 | 能支持 | 不能支持 |
|---|---|---|---|
| 通用编辑器复杂、分屏和转画幅需求 | [Video editing software?](https://www.reddit.com/r/CompetitionShooting/comments/1qqqhbi/video_editing_software/) | 一名射手明确描述通用编辑器过重，并要求双视角与快速画幅切换 | 全部射手的工具偏好或市场份额 |
| 简单工具比专业套件更快上手 | [Video editing tips](https://www.reddit.com/r/CompetitionShooting/comments/1cuuh84/video_editing_tips/) | 一名射手明确描述专业编辑器超出需求 | 某个工具对所有用户都更好 |
| 多视角复盘价值 | [Mixed POV - tried it?](https://www.reddit.com/r/CompetitionShooting/comments/1o4mlbl/mixed_pov_tried_it/) | POV 与第三人称能显示单一视角遗漏的脚步和移动问题 | 自动技术评分或训练结果保证 |
| 横屏转竖屏裁切问题 | [How do you get Insta360 GO 3S footage vertical for YouTube Shorts?](https://www.reddit.com/r/CompetitionShooting/comments/1racdre/how_do_you_get_insta360_go_3s_footage_vertical/) | 模糊边框、放大和两侧内容损失是直接陈述的问题 | Track 会自动保留所有靶、道具和字幕 |
| 多 App 重复追踪与导出 | [Playing with new Insta360 X5](https://www.reddit.com/r/CompetitionShooting/comments/1q5573b/playing_with_new_insta360_x5_competition_with/) | 发帖者逐段追踪、导出，再用第二个工具合成 | 所有相机工作流都完全相同 |
| 让观众理解命中与表现 | [How to edit USPSA match footage to show hits above target?](https://www.reddit.com/r/CompetitionShooting/comments/1s0ta4p/how_to_edit_uspsa_match_footage_to_show_hits/) | 结果、短视频画幅和手工叠加摩擦是真实表述 | Shooting Cut 能识别或放置靶上弹孔 |
| 基础裁剪与拼接，不需要专业套件 | [Match Video Editing Software](https://brian-enos-forums.com/topic/304646-match-video-editing-software/) | 独立论坛用户明确要求简单 trim/splice 工作流 | 论坛样本代表搜索量 |
| 整场比赛发布语言 | [Every Stage, Every Shot](https://www.youtube.com/watch?v=OnTLFiDnQIA)、[Full Match Recap](https://www.youtube.com/watch?v=id_XyMKyqlI) | `Full Match`、`Every Stage` 与 recap 是真实标题语言 | 标题结果代表所有上传者或自动章节需求 |

Facebook 仍是重要的射击内容发布与发现渠道。本轮公开搜索继续出现
`full and uncut POV Match Video with all the stage results`，但可复核结果
多为个人主页而不是稳定帖子 permalink，泛查询又被普通视频剪辑群组占据。
因此这里只用 Facebook 支持发布格式和措辞，不用它夸大痛点频率。

### 15.2 对英文内容的直接含义

- 站点主实体词保持 `competitive-shooting video editor`。
- 首页首先回答如何从原始比赛素材得到完整成片，不从音频检测或字幕开始。
- `/competitive-shooting-video-editor/` 负责解释“一套产品完成常见比赛剪辑
  工作”，不公开点名比较其他产品。
- Split Sync 使用 `POV and third-person views`、脚步、换弹和 stage
  strategy 等复盘语言，同时保留 exactly 2 与人工校验边界。
- Reframe 回答固定裁切、竖屏和主体跟随问题，不承诺自动保留所有靶和叠加层。
- 成绩/时间页明确让表现“更容易理解”，并明确不定位弹着点。
- Merge 页已经直接回答 `Full Match` 与 `Every Stage`，不为本轮研究重复
  改写；Batch Export 只回答多个独立成片的重复渲染。
- 隐私和设备端处理继续作为显著信任理由，但不抢占完整编辑器主定位。

## 16. 2026-07-30 痛点导向英文 GEO 执行结果

本轮没有新增近义页面，也没有公开点名其他产品。核心实体词仍为
`competitive-shooting video editor`，首页先解释 Shooting Cut 如何把比赛
素材变成可发布的完整视频，再用隐私、本地处理和真实功能边界建立信任。

| 批次 | Commit | 已执行内容 |
|---|---|---|
| 研究与测量 | `ea130c218aecd04fb7fa068545b343c7f7a890e9` | 固化 P01–P08、痛点证据强度、页面决策和媒体优先级；未修改公开 HTML。 |
| 首页定位 | `1f6969ffedd16a289d3e74a2a70ae773fa99607d` | 用完整比赛视频编辑结果组织 Hero、功能顺序、Guide Hub 与 `llms.txt`。 |
| 完整工作流 | `7a30e5a37c2db2151bcfce0c0dec24a35d1b9df3` | 把裁剪、同步、顺序合并、成绩/计时、画幅复用映射到一个编辑器。 |
| 双视角同步 | `2b658d16b2f6d152f3edb4c57ff0a6a2dcce84a1` | 增加 POV/第三人称复盘、脚步与 stage strategy 语境，并保留 exactly 2 和人工校验边界。 |
| 横屏转竖屏 | `18875bcee00fef2eb0030baa85a0e82b7f63c72b` | 回答固定裁切、主体跟随和 YouTube/Instagram/Facebook 竖屏格式，同时声明仍需检查靶、字幕与叠加层。 |
| 计时与成绩 | `cb1f3fb9d5fd4ff788de9bd6754b572645fbbb4c` | 说明计时和成绩如何帮助理解表现，并明确不自动定位弹着点。 |
| 批量导出 | `1cdc04eb9272f6ded7280eab3b2b80a93e6dd4fc` | 解释多个已准备 Stage 的独立批量渲染；明确 Batch Export 不合并 Stage，Merge 才生成一条 Full Match 视频。 |

以下页面保留现状是明确决策，不是遗漏：

- Merge 已准确覆盖 `Full Match`、`Every Stage` 和顺序合并。
- Side by Side 已准确覆盖两次 run 的人工对比，与 Split Sync 的同时拍摄输入
  不混淆。
- On-device 隐私页继续作为信任证据，不替代完整编辑结果的首页主定位。
- Thailand HDP/ESS 页继续回答成绩留存和导入，不用普通英文剪辑样本改写泰国
  特有痛点。
- Shot Detection Troubleshooting 继续承接 AGC、隔壁枪声、回音、弱蜂鸣和
  人工纠正等支持意图，不被扩张成首页主叙事。

最终验收于 `2026-07-30T12:56:51Z` 完成：

- 本地 40 项回归测试通过；校验器检查 20 个 HTML、57 个 JSON-LD、369 个
  本地链接目标和 18 个 sitemap URL。
- 本地 18/18 公开路由返回 200；首页及 5 个改动指南在 1440×900 与
  390×844 视口下无横向溢出。
- 生产 18/18 路由返回 200，57 个 JSON-LD 均可解析；旧的
  `every gunshot` 与 `instantly get precise` 首页措辞不存在。
- `1cdc04e` 的 Validate site 与 Pages 均成功，生产 deployment SHA 与提交
  完全一致。Reframe 提交 `18875bc` 没有单独的 Pages deployment SHA，
  已在后续精确部署 `cb1f3fb` 中上线并通过生产检查；测量文档没有把前一个
  SHA 错记为该提交。

后续不立即继续改文案。固定复核时间为：72 小时 `2026-08-02` 只检查技术
发现；Week 2 `2026-08-13` 检查抓取/索引和着陆页；Week 4
`2026-08-27` 检查曝光、点击与三次生成式样本；Week 8 `2026-09-24`
判断是否存在 13 条现有指南都无法回答的真实意图。单次搜索或模型回答不作为
排名结论，也不触发新页面。
