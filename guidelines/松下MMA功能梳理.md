# 松下 MMA 功能梳理

## 1. 系统定位

MMA 是 Panasonic Avionics 的媒体元数据与 IFE 内容周期管理系统，主要用于航司娱乐内容的资料录入、分类上架、周期管理、签核、完整性检查、导出发版、报表分析和配置管理。

从资料看，MMA 的业务主线是：

1. 选择航司、系统和媒体周期。
2. 维护音频、视频、游戏、电子书、有声书等媒体元数据。
3. 将媒体挂载到航司/系统/舱位/分类对应的状态表。
4. 完成媒体签核、周期签核和完整性检查。
5. 生成导出包并支持后续发版、比对、报表和问题追踪。

## 2. 顶部导航栏

MMA 顶部一级导航主要包括以下入口：

| 导航项 | 英文名称 | 主要功能 |
| --- | --- | --- |
| 家 | Home | 首页、状态树、状态表、周期里程碑、变更请求入口 |
| 元数据 | Metadata | 媒体资料维护、导入、组模板管理 |
| 循环 | Cycle | 媒体周期管理、签核、导出、完整性检查、导出比对 |
| 报告 | Reports | 媒体报表、变更请求报表、LCS/VLS 报表、QC 报表、操作报表 |
| 帮助 | MMA Help | 用户手册、Release Note、配置说明、迁移说明等 |

按用户权限不同，还可能出现以下导航：

| 导航项 | 英文名称 | 主要功能 |
| --- | --- | --- |
| Profile Setup | Profile Setup | Profile 创建、复制、链接、从配置文件导入等 |
| Configuration | Configuration | EIS 配置、Extensions、Language、Preferences、Images 等 |
| Administration | Administration | 管理员相关功能，资料中未详细展开 |
| Ad Builder | Ad Builder | 广告媒体组、智能模板、Runner、Generator、广告报表 |

## 3. 元数据二级导航

截图中，选中“元数据”后会显示二级菜单，包括：

| 二级菜单 | 英文/含义 | 说明 |
| --- | --- | --- |
| 声音的 | Audio | 音频媒体资料 |
| 视频 | Video | 视频媒体资料 |
| 游戏/应用 | Game/App | 游戏或应用类内容 |
| 有声书 | Audiobook | 有声书内容 |
| 电子书 | Ebook | 电子书内容 |
| 捆 | Bundle | 媒体 Bundle/捆绑内容 |
| 组模板 | Group Template | 可复用的媒体组模板 |
| 进口 | Import | Excel 模板导入与历史导入 |

## 4. 通用页面结构

MMA 界面中常见的结构包括：

| 区域 | 功能 |
| --- | --- |
| 顶部导航 | 切换 Home、Metadata、Cycle、Reports、Help 等模块 |
| 二级菜单 | 显示当前模块下的具体功能入口 |
| 筛选栏 | 选择航司、周期年份、周期月份 |
| 全局搜索 | 搜索 MMA 中的媒体或相关记录 |
| 面包屑 | 显示当前位置，例如 “MMA 首页 > 元数据游戏” |
| 左侧树 | 航司、系统、路线、类别、舱位、媒体分类等层级树 |
| 右侧工作区 | 表单、状态表、报表、导入页面、配置页等主操作区 |

左侧树上方通常有：

- 查找
- 扩张
- 坍塌
- 取消选择
- 刷新

## 5. Home 首页功能

Home 是唯一没有下拉菜单的主导航。它通常分为左右两个区域：

| 区域 | 功能 |
| --- | --- |
| 左侧 | Category Tree 分类树、Find 查找 |
| 右侧 | Cycle Milestones、Change Requests、状态表等 |

主要功能包括：

- 按航司、系统、路线、舱位、类别查看内容结构。
- 使用 Find 快速定位分类。
- 查看周期里程碑，例如 Initial MMA Freeze、MMA Finalized/Frozen、Corrections Confirmed。
- 查看 Dashboard 中同步过来的任务。
- 查看和处理 Change Requests。
- 通过状态表查看某个分类下的媒体内容。

状态表中可查看字段包括：

- POS
- UID
- 标题
- 原声带/音轨
- 字幕
- 无线电
- 等级
- 宽高比
- 文件名
- 文件大小
- 风险/异常标记

状态表上方的操作按钮包括：

- 添加媒体
- 团体/分组
- 取消分组
- 删除
- 添加到类别
- 创建版本
- 创建所有版本
- Excel
- 出口进口
- VLS 容量
- 传播数据
- 重新频道
- 取消频道

## 6. Metadata 元数据功能

Metadata 用于维护媒体项目的资料。不同媒体类型字段有所不同，但常见页签包括：

| 页签 | 说明 |
| --- | --- |
| 文件信息 | 技术信息、文件名、编码等 |
| 其他信息 | 补充属性 |
| 元数据 | 标题、语言、描述等业务元数据 |
| 图片 | 海报、封面、相关图片 |
| 类别 | 媒体所属分类 |

主要功能包括：

- 新增和维护媒体资料。
- 维护音频、视频、游戏、有声书、电子书、Bundle 等媒体类型。
- 对媒体进行分类。
- 维护音轨、字幕、图片、系统关联等信息。
- 支持媒体初始签核和完整签核。
- 签核后修改需走 Change Request。

## 7. Import 导入功能

MMA 支持通过 Excel 模板导入媒体元数据。

支持的模板包括：

- Video Template
- Audio Template
- Game Template
- Audiobook Template

导入流程：

1. 在 Metadata > Import > New Import 下载模板。
2. 填写 Excel 模板中的媒体资料。
3. 上传文件，也支持拖拽上传。
4. 点击 Start Upload。
5. 查看导入结果和错误日志。
6. 可在导入后批量分类媒体。

Previous Imports 可以查看历史导入记录，常见字段包括：

- Filename
- Status
- Log
- Export
- Media Type
- File Size
- Upload On

注意：如果要更新 MMA 内容，需要从系统中 Export 原有 Excel 后修改再重新导入，不能直接新建 Excel。

## 8. Group Template 功能

Group Template 是可复用的媒体组模板，通常用于广告、图形等伴随主内容播放的媒体。

主要能力：

- 创建命名模板。
- 添加广告、图形或其他可复用媒体。
- 定义播放顺序。
- 将模板应用到电影、电视剧等主内容。
- 支持一个模板复用到多个媒体标题。
- 支持批量应用到状态表中的多个媒体。

## 9. Cycle 周期管理功能

Cycle 用于管理媒体周期。MMA 支持同时处理多个媒体周期。

主要功能包括：

- 创建新周期。
- 按系统创建周期。
- 基于上一周期复制创建。
- 创建空周期。
- 修改 Category Set。
- 清空 Status Sheet。
- 同步系统之间的媒体/分类关联。
- 清除 LCS/VLS 数据。
- 周期签核。
- 查看待签核媒体。
- 执行完整性检查。
- 创建导出包。
- 查看导出历史。
- 比较历史导出差异。

周期管理中的重要操作：

| 操作 | 说明 |
| --- | --- |
| Change Category Set | 更换分类集，会影响状态表 |
| Clear Status Sheet | 清空状态表并解除媒体分类关联 |
| Sync | 将一个系统的媒体/分类关联同步到另一个系统 |
| Clear LCS/VLS | 清除 LCS/VLS 数据 |
| Profile Export | 导出 .pcz 系统 Profile 文件 |

## 10. 签核与变更请求

MMA 中有两类主要签核：

| 类型 | 说明 |
| --- | --- |
| Initial Sign-Off | 针对文件名、编码、音轨等物理和技术数据 |
| Full Sign-Off | 针对剩余数据，如图片、元数据等 |

签核规则：

- Initial Sign-Off 后，媒体记录会被锁定。
- Full Sign-Off 需要先完成 Initial Sign-Off。
- 完整签核后再修改，需要提交 Change Request。
- 周期导出后，相关 MID 会被锁定，后续修改通常只能面向未来周期。

Change Request 支持：

- 提交变更请求。
- 查看请求状态。
- 审批。
- 拒绝。
- 取消。
- 在报表中查看变更历史。

## 11. 导出与完整性检查

导出通常在周期锁定并完成完整性检查后执行。

导出相关功能包括：

- Sign Off Cycle。
- View Media Pending Sign-off。
- Integrity Check。
- Create New Export。
- Export Images。
- Add Program Milestone。
- Release Note 填写。
- Preload Cycle 支持。
- Force Export Debug Mode。
- Export List 历史导出列表。
- Export Diff Tool 导出差异比较。

完整性检查支持：

- 检查媒体、图片、分类、配置等是否满足导出条件。
- 可选择是否包含图片检查。
- 检查成功后提示 Cycle has passed the integrity check。
- 检查失败后在 Integrity Check Log 中列出问题。

Release Note 中还提到：

- 红色/严重错误导出不可标记为 Released 或 Testing。
- 防止用户在 1 分钟内重复发起同周期导出。
- 导出邮件中包含导出状态。
- 支持导出错误汇总报告。
- 老导出包支持 S3 归档下载。

## 12. Reports 报表功能

Reports 模块包含 5 类主要报表：

| 报表 | 功能 |
| --- | --- |
| Media Report | 媒体清单、文件大小、按条件筛选媒体 |
| Change Request Report | 查看新建、已批准、已拒绝、已取消的变更请求 |
| LCS/VLS Report | 查看 LCS/VLS 中的媒体文件、节点、容量 |
| QC Report | 查看媒体 QC 状态 |
| Action Report | 查看媒体操作历史 |

### 12.1 Media Report

Media Report 支持：

- 查看按系统统计的总文件大小。
- 按 UID、状态、媒体类型、状态表关联、签核状态、文件名是否存在、Lab、系统、上机日期等筛选。
- 自定义显示列。
- 导出 Excel。
- Export For Import。
- Activate New System。
- 批量添加语言元数据。

### 12.2 Change Request Report

支持查看：

- New Requests
- Approved Requests
- Declined Requests
- Cancelled Requests

显示字段包括：

- Section
- Field
- Original
- Change
- Request By
- Request On
- Approved/Declined/Cancelled By
- Action Notes

### 12.3 LCS/VLS Report

LCS/VLS 是 IFE 文件服务器故障时的内容存储备份机制。

报表支持：

- 按系统筛选。
- 按舱位筛选。
- 按 All Files 或 By Node 展示。
- 查看媒体状态、文件大小、总大小。
- 导出 Excel。

### 12.4 QC Report

QC Report 用于查看媒体 QC 状态。

筛选项包括：

- UID
- Media Type
- Lab
- System
- QC Status

QC 状态包括：

- All
- Failed
- Passed
- Not Received
- Not in MMA

Release Note 中还提到，QC Report 可显示 Digital Asset Management 中的 Auto QC failure detail / Fail Reason。

### 12.5 Action Report

Action Report 用于查看单个或多个媒体项目的操作历史，并可导出 Excel。

## 13. Ad Builder 功能

Ad Builder 用于广告媒体编排和模板生成。

主要模块包括：

- Media Groups
- Templates
- Runners
- Generators
- Reports

### 13.1 Media Groups

Media Groups 用于管理广告或媒体组。它可以根据以下属性组织媒体：

- Encoding
- Aspect Ratio
- Soundtrack
- Subtitle
- Soundtrack Language
- Subtitle Language
- Rating
- Category Attribute

用途包括：

- 避免同一模板内出现不应同时出现的媒体。
- 控制媒体出现频次。
- 通过子组实现广告均衡分布。
- 组可复用、改名和更新，但创建后不能删除。

### 13.2 Templates

模板分为传统 Group Template 和 Smart Group Template。

Smart Group Template 特点：

- 根据用户规则和媒体自动生成。
- 可按规则自动应用到类别。
- 自动平衡广告展示。
- 避免同一组媒体在单个模板中重复出现。
- 不受特定周期设置限制。

### 13.3 Runners

Category Runner 用于把不同 Smart Group Template 应用到一个类别。

特点：

- 按 display ratio 分配模板。
- 支持一个类别应用多个模板。
- 是生成广告模板前的必要配置。

### 13.4 Generators

Category Generator 按 Runner 生成并应用 Group Template。

生成选项包括：

- Override All
- Ungroup All
- Mode 2
- Skip Empty

### 13.5 Ad Builder Reports

Ad Builder 提供两类报表：

| 报表 | 说明 |
| --- | --- |
| Runtime | 展示所选类别的 runtime，超过阈值标红 |
| Media Use | 展示媒体使用情况，包括 UID、标题、文件名、类型、次数、百分比等 |

两类报表均支持屏幕展示和 Excel 导出。

## 14. Configuration 配置功能

Configuration 是权限控制下的配置入口。

资料中明确出现的配置包括：

- EIS Configuration
- Extensions
- Language
- Preferences
- Images

### 14.1 EIS Configuration

EIS Configuration 包含 profile 的标准配置项，主要涉及：

- System
- Audio
- Video
- Image

MID Settings 控制媒体类型是否在整个 program 中可用。

典型配置项包括：

- audio
- audioAggregate
- unknownMedia
- video
- videoAggregate
- TVChannel
- camera
- DVD
- VTR
- map
- connectingGate
- app
- webContent
- AdPlaceHolder
- fileType
- aux
- external Streamers
- cmiMedia
- game
- audiobook
- audioBookChapter
- service
- mediaBundle
- eBook

Video Type / Audio Type 用于控制 CSP 在 GUI 中可选的视频和音频类型，同时影响文件命名规则。

Video Type 示例：

- Advert
- Graphic
- Short
- Movie
- Trailer
- Safety
- Help Clip
- Other
- Dummy
- Advert Skip

Audio Type 示例：

- Album
- Broadcast
- Album Track
- Broadcast Listing
- Boarding
- Dummy
- Decompression
- Audio PA

### 14.2 Extensions

Extensions 支持从 MMT 迁移并管理以下功能：

- Dashboard Config / Tasklist
- Flight Script
- PA Language Config
- Seat Messages
- Sound Config

这些数据可在 MMA UI 中新增、更新、删除、锁定。

MMT 数据也可以通过 XML 导入 MMA。可导入表包括：

- dashboardConfigTable
- PALanguageConfigTable
- scriptConfigTable
- seatMessageTable
- seatMessageTextTable
- soundConfigTable

注意：导入会覆盖 MMA 中对应功能现有数据，且不可恢复。

## 15. Release Note 中体现的增强能力

Release Note 汇总了 MMA 的大量功能增强，可归纳为以下方向：

| 能力方向 | 典型功能 |
| --- | --- |
| 权限 | 新增 ReadOnly 只读角色 |
| 导出 | 导出状态邮件、S3 归档下载、防重复导出、严重错误导出禁止发布 |
| 配置 | Loading Type、Export Mode、Program Type、Export Target Type、Preferences 记录 |
| DND | 支持 UID/filename 标记为 Do Not Distribute，并在完整性检查和导出时阻止发布 |
| Flight Script | 支持版本历史、回滚、导入校验、新动作 |
| VLS/LCS | 容量检查、节点报表、VLS Primary Streamer、错误提示 |
| 报表 | File Size 过滤、CR Summary、QC Fail Reason、导出错误汇总 |
| 导入 | Route Template 校验、字幕数量扩展、Playlist/Trailer 导入支持 |
| Profile | Link Profile、Duplicate Profile、DCU profile、News Flash DCU 等流程优化 |
| 类别和图片 | Category 管理校验、Required Image、Force JPG Exception |
| 外部系统 | Digital Asset Management 链接、MuleSoft 失败通知 |

## 16. 可作为需求拆解的模块清单

如果后续按功能模块拆解，可初步划分为：

1. 用户权限与角色模块
2. 航司/Profile/系统选择模块
3. 媒体元数据管理模块
4. 媒体导入导出模块
5. 分类树与状态表模块
6. 周期管理模块
7. 签核与变更请求模块
8. 完整性检查模块
9. 导出发版模块
10. 导出差异比较模块
11. 报表中心模块
12. LCS/VLS 容量与节点模块
13. QC 管理模块
14. Ad Builder 广告编排模块
15. EIS Configuration 配置模块
16. Extensions 配置与 MMT 迁移模块
17. 邮件通知模块
18. 帮助文档/Release Note 模块

## 17. 资料来源

本梳理基于当前目录中的以下资料：

- `MMA_User_Guide.pdf`
- `Release Note _ MMA Help.pdf`
- `Home  Configuration  EIS Configuration.pdf`
- `Appendix  MMT to MMA Migration.pdf`
- `Home  Typography.pdf`
- `Snipaste_2026-03-19_08-45-05.png`
- `Snipaste_2026-03-19_08-45-31.png`
- `Snipaste_2026-03-19_08-46-39.png`
