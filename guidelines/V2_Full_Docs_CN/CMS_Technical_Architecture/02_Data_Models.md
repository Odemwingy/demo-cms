# [Airline Name] IFE CMS - 数据模型与结构设计深度解析

## 1. 数据建模理念：技术与业务元数据的结合
通过精简且高内聚的 SQLite 结构实现了业务逻辑的高效运转。数据库底层高度参照了 Panasonic MMA 的真实 `.sql3` 格式，保障了可以直接生成与机载终端通讯的数据结构。

- **UID 与 MID 的一维化管理**：我们在落地的 `media` 表中，采用 `uid` 作为主要外显逻辑，将 `mid`（底层媒体号）以同一行记录的方式进行绑定，极大降低了联表查询的复杂性。

## 2. 核心主题域模型深度剖析

### 2.1 内容资产与媒体数据域 (Content Asset Domain)
此域是整个系统的基石，记录了所有媒体资产的核心元数据。

- **`media`（核心媒体资产表）**
  - `id` (PK): 数据库内部的自增主键。
  - `uid` / `mid`: 全局唯一的逻辑编号与松下底层的媒体映射编号。
  - `title`, `duration`, `rating`: 核心影视业务元数据。
  - `video_type`, `encoding`, `bitrate`, `aspect_ratio`: 物理技术参数标识。
  - `sign_off_status`: 生命周期审批状态标识（Pending / Full Sign-Off）。

- **扩展关联表**：
  - `media_systems`: 记录媒体支持适配的物理终端型号（如 S3Ki, eX3 等）的生命周期。
  - `media_metadata`: 处理**多语言支持**，存放具体的国际化翻译数据（短标题、演职员表、简介）。
  - `media_images`: 处理图片映射关系。**`[机载新增]`** 特别支持了 Phase 6c 暴增的 `size_category`（如 `_11`, `_22` 等细分分辨率）。

### 2.2 编排与发布配置域 (Orchestration & Configuration Domain)
负责将闲散的内容实体组装为具有优美导航层次、具备多环境适配策略的投放集合。

- **`categories`（栏目树节点表）**
  - `id` (PK), `parent_id` (FK): 支撑无限深度的自引用树状结构。
  - `cid`: 松下底层的原生节点数字编号。
  - `media_type`: 支持 Video, Audio 等类型隔离。
  - `virtual`: 支持通过特定的条件（`propagation_data`）形成自动路由的虚拟集合节点。

- **`category_media`（节点关联枢纽表）**
  - **核心重构点**：负责将 `media` 实体多对多挂载到特定 `categories` 栏目下。
  - **`[机载新增]` 定制化属性**：记录每一对映射专用的 `price`（点播收费金额）、`channel_num`（专属频道号）以及 `access_type`（PPV权限判定），并用 `order_position` 实现拖拽重排的业务持久化。

- **多维拓扑基准树**：
  - `category_sets`: 分类树的顶级集合。
  - `profiles`: 终端能力档案根节点。
  - `sub_profiles`, `profile_routes`: 负责复杂的航段切割逻辑挂载。
  - `media_configs`, `classes`: 管理针对具体舱位（First, Business, Economy）的特殊授权矩阵。

### 2.3 国际化与字典管理 (I18N & Dictionary)
- **`language_lookups`（多语言字典库）**
  - **`[机载新增]` 核心映射**：针对多语言扩展提供的标准字典表。
  - 核心字段包括 `name` (如 English), `iso_code` (如 eng), `label_lid` (如 20401)。极大降低了生成底层 SQL3 数据包时的硬编码冲突。

### 2.4 用户权限域 (IAM)
- **`users`**
  - 管理操作员的 RBAC 角色体系（IFE_PROVIDER, AIRLINE, CSP），根据 `company_id` 提供数据查询上的横向行级别隔离（Data Scoping）。
