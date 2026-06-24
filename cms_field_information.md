# Envee CMS 全量系统字段信息映射表 (基于松下 MMA V9.0)

本文档参考了原始的 `字段信息_v9.0_20250516_2114.xlsx` 表格格式，深度梳理并穷举了 `Envee CMS` 中 SQLite 数据库底层的**全量字段**结构。

## 1. 媒体资产主表 (Media Items - `media`)
此表存储所有音视频、游戏、电子书等实体资产的核心元数据。

| 表 (Table) | 字段名 (Field Name) | 数据类型 (Data Type) | 是否必填 | 输入方式 | 默认值 | 取值范围/枚举值 | 业务规则/校验逻辑 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `media` | `uid` | TEXT | Y | 系统生成 | - | - | 全局唯一标识符 (如 `czm071800103m4`) |
| `media` | `mid` | TEXT | N | 文本输入 | - | - | 内容供应商方的内部 ID (可空) |
| `media` | `video_type` | TEXT | Y | 下拉单选 | `video` | `video`, `audio`, `game`, `mediaBundle`, `TVChannel` 等 | 判断资源类型的最核心标识，决定后续选项卡的展示 |
| `media` | `title` | TEXT | Y | 文本输入 | - | - | 媒体文件的默认/原始英文标题 |
| `media` | `duration` | TEXT | N | 文本输入 | `00:00:00` | `HH:MM:SS` | 针对视频和音频必填，支持格式正则校验 |
| `media` | `filename` | TEXT | Y | 文本输入 | - | `.mp4`, `.mpg`, `.mp3`, `.ts` | 物理文件名称，必须与 CDN/OSS 中的文件名完全匹配 |
| `media` | `filesize` | TEXT | N | 文本输入 | - | - | 文件大小（如 `1.83 GiB`） |
| `media` | `rating` | TEXT | N | 下拉单选 | `NR` | `G`, `PG`, `PG-13`, `R`, `NC-17`, `NR` | MPAA 分级，用于合规性前端过滤 |
| `media` | `aspect_ratio` | TEXT | N | 下拉单选 | - | `16x9Adjustable`, `4x3`, `16x9` | 屏幕宽高比配置 |
| `media` | `encoding` | TEXT | N | 文本输入 | - | `H264`, `MPEG2` | 视频编码格式 |
| `media` | `bitrate` | TEXT | N | 文本输入 | - | - | 码率大小 |
| `media` | `distributor` | TEXT | N | 文本输入 | - | - | 发行商 / 供应商名称 |
| `media` | `release_year` | TEXT | N | 数字输入 | - | `1900` - `2099` | 电影/专辑发行年份 |
| `media` | `eidr` | TEXT | N | 文本输入 | - | - | EIDR (Entertainment Identifier Registry) ID |
| `media` | `country` | TEXT | N | 下拉单选 | - | 国家缩写 (如 `US`, `CN`) | 产地/原片国家 |
| `media` | `keywords` | TEXT | N | 文本域 | - | - | 用于模糊检索的标签 / Tag |
| `media` | `sign_off_status`| TEXT | N | 下拉单选 | `Pending`| `Pending`, `Approved`, `Rejected` | 资产入库审核状态 |
| `media` | `ppv` | TEXT | N | Checkbox | `0` | `0`, `1` | (Pay Per View) 标记是否为付费影片 |
| `media` | `original_artist`| TEXT | N | 文本输入 | - | - | 原唱 / 核心主创 |
| `media` | `credits_start_time`| TEXT| N | 文本输入 | - | `HH:MM:SS` | 演职员表开始时间 (用于跳过片尾逻辑) |
| `media` | `intro_start_time`| TEXT | N | 文本输入 | - | `HH:MM:SS` | 跳过片头起 |
| `media` | `intro_end_time` | TEXT | N | 文本输入 | - | `HH:MM:SS` | 跳过片头止 |
| `media` | `systems` | TEXT | N | 文本域 | - | `eX3 eX3`, `eFX Qt` | 该内容兼容的硬件系统标识符 |
| `media` | `season_number` | TEXT | N | 文本输入 | - | - | (针对剧集) 季号 |
| `media` | `episode_number` | TEXT | N | 文本输入 | - | - | (针对剧集) 集号 |
| `media` | `series_uid` | TEXT | N | 文本输入 | - | 现存 UID | 绑定至父级剧集 UID |
| `media` | `album_title` | TEXT | N | 文本输入 | - | - | (针对音频) 专辑名称 |
| `media` | `track_number` | TEXT | N | 数字输入 | - | - | (针对音频) 专辑内音轨号 |
| `media` | `qc_status` | TEXT | N | 下拉单选 | - | `Pass`, `Fail`, `Pending` | 质检 (QC) 状态 |
| `media` | `qc_validate_date`| TEXT | N | 日期选择 | - | `YYYY-MM-DD` | 质检完成日期 |
| `media` | `license_period` | TEXT | N | 文本域 | - | - | 授权有效期文本说明 |


## 2. 媒体多语言元数据表 (Media Metadata - `media_metadata`)
存储多语言化的标题、简介和演职员表。

| 表 (Table) | 字段名 (Field Name) | 数据类型 (Data Type) | 是否必填 | 输入方式 | 默认值 | 取值范围/枚举值 | 业务规则/校验逻辑 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `media_metadata` | `language` | TEXT | Y | 下拉单选 | `English` | `English`, `Simplified Chinese`, `German`, `French` | 每一组语种对应独立的一行记录 |
| `media_metadata` | `language_iso` | TEXT | N | 关联生成 | - | `eng`, `chi`, `ger` | **[机载新增]** 飞机底层 (v_languages) 强依赖的 ISO 标准语言代码 |
| `media_metadata` | `label_lid` | INTEGER | N | 关联生成 | - | - | **[机载新增]** 松下标准的底层语言 ID 映射键 (用于关联音轨与字幕) |
| `media_metadata` | `title` | TEXT | N | 文本输入 | - | - | 在对应语言下的本地化名称 (如 `复仇者联盟`) |
| `media_metadata` | `short_title` | TEXT | N | 文本输入 | - | - | 用于小屏幕的短标题 |
| `media_metadata` | `director` | TEXT | N | 文本输入 | - | - | 导演名称 |
| `media_metadata` | `cast_members` | TEXT | N | 文本域 | - | - | 演员表 (逗号分隔) |
| `media_metadata` | `genre` | TEXT | N | 下拉多选 | - | `Action`, `Comedy`, `Drama`...| 流派 / 分类风格 |
| `media_metadata` | `description` | TEXT | N | 长文本域 | - | - | 详细的剧情介绍或专辑介绍 |
| `media_metadata` | `short_description`| TEXT| N | 短文本域 | - | - | 不超过250字符的短简介 |
| `media_metadata` | `review` | TEXT | N | 长文本域 | - | - | 媒体评价 / 影评 |

## 3. 媒体图片资产表 (Media Images - `media_images`)

| 表 (Table) | 字段名 (Field Name) | 数据类型 (Data Type) | 是否必填 | 输入方式 | 默认值 | 取值范围/枚举值 | 业务规则/校验逻辑 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `media_images` | `image_type` | TEXT | Y | 下拉单选 | - | `SYNOPSIS`, `POSTER`, `THUMBNAIL` | 松下规范的不同图片使用场景 |
| `media_images` | `size_category`| TEXT | Y | 文本输入 | - | `_1`, `_2`, `_3`, `_11`, `_12`, `_21`, `_22` | **[机载新增]** 适配 Phase 6c (eX3 NewGUI 等) 激增的多分辨率要求 |
| `media_images` | `dimensions` | TEXT | N | 文本输入 | - | 如 `800x600` | 图片的像素尺寸 |
| `media_images` | `file_url` | TEXT | Y | 文件上传 | - | URL / 相对路径 | 指向图片静态资源的实际存储地址 |


## 4. 拓扑配置体系 (Profile Setup)

| 表 (Table) | 字段名 (Field Name) | 数据类型 (Data Type) | 是否必填 | 输入方式 | 默认值 | 取值范围/枚举值 | 业务规则/校验逻辑 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `profiles` | `name` | TEXT | Y | 文本输入 | - | - | 航司或核心客户名称 (如 `Hainan Airlines`) |
| `profiles` | `type` | TEXT | N | 下拉单选 | - | `Aircraft`, `Fleet` | Profile 属性归属 |
| `profiles` | `shipment_info`| TEXT(JSON)| N | 结构化录入| - | - | 包括 Shipping Method, Date 等交付信息 |
| `media_configs`| `config_id` | TEXT | Y | 文本输入 | - | - | 硬件拓扑 ID (如 `eX3`, `eFX`) |
| `classes` | `mma_display_name`| TEXT | Y | 文本输入 | - | `First Class`, `Business`... | 对应硬件下的舱位展示名 |
| `category_sets`| `name` | TEXT | Y | 文本输入 | - | - | 绑定的分类树集合名 |
| `category_sets`| `applied_cycles`| TEXT(JSON)| N | 下拉多选 | `[]` | - | 锁定至对应 Cycle 后，树结构不可修改 |


## 5. 分类树节点结构 (Categories Tree - `categories`)

| 表 (Table) | 字段名 (Field Name) | 数据类型 (Data Type) | 是否必填 | 输入方式 | 默认值 | 取值范围/枚举值 | 业务规则/校验逻辑 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `categories` | `cid` | INTEGER | Y | 数字输入 | - | `200`, `201`, `300`... | 松下树结构的标准唯一节点 ID |
| `categories` | `default_name` | TEXT | Y | 文本输入 | - | - | 节点展示名 |
| `categories` | `parent_id` | TEXT | N | 树形拖拽 | NULL | - | 决定层级关系。NULL 代表 Root 节点 |
| `categories` | `media_type` | TEXT | N | 下拉单选 | - | `video`, `audio`, `game` | 用于限制该节点下允许放置的媒体类型 |
| `categories` | `virtual` | BOOLEAN | Y | Checkbox | `0` | `0`, `1` | True 表示是虚假挂载节点，不在 GUI 中独立成入口 |
| `categories` | `ppv` | BOOLEAN | Y | Checkbox | `0` | `0`, `1` | True 表示节点专区属于收费频道 |
| `categories` | `lock_type` | TEXT | Y | 下拉单选 | `Unlocked`| `Unlocked`, `Locked` | 判断节点是否可以被业务人员重命名或删除 |
| `categories` | `propagation_data`| TEXT(JSON)| N | 面板配置 | - | - | 定义如何将该节点的子媒体传播至其他关联的节点或系统 |

### 5.1 节点映射扩展属性 (CategoryMedia Association - `categorymedia`)
**[机载新增]** 在飞机底层的 `v_categorymedia` 视图中，节点 (cid) 与 媒体 (mid) 的绑定关系上额外承载了以下控制属性，需在未来迭代中补充：

| 映射属性 (Assoc Field) | 数据类型 | 作用与业务逻辑 |
| :--- | :--- | :--- |
| `categorymedia_price` | TEXT | 定义该媒体**在这个栏目节点下**的点播价格 (支持同影片不同频道不同收费) |
| `categorymedia_channel`| TEXT | 电视/电台频道的频道编号覆盖配置 |
| `categorymedia_accesstype`| TEXT | 访问类型控制 (免费试看/完全限制等) |
| `categorymedia_order` | INTEGER | 该内容在该栏目下的排序号 |

## 6. 用户体系 (User Management)

| 表 (Table) | 字段名 (Field Name) | 数据类型 (Data Type) | 是否必填 | 输入方式 | 默认值 | 取值范围/枚举值 | 业务规则/校验逻辑 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `users` | `username` | TEXT | Y | 文本输入 | - | - | 登录名 |
| `users` | `role` | TEXT | Y | 下拉单选 | - | `IFE_PROVIDER`, `AIRLINE`, `CSP` | 角色判定级别。IFE_PROVIDER 拥有最高权限 (Admin) |
| `users` | `company_id` | TEXT | N | 下拉单选 | - | - | 用于将用户的操作范围隔离在特定的航司或 CSP 内 |
