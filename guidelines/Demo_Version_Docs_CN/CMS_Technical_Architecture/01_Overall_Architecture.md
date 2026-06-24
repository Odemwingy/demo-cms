# [Airline Name] IFE 内容管理平台（CMS）总体技术架构设计

## 1. 平台建设目标与业务范畴
面向 [Airline Name] 的机载娱乐系统（In-Flight Entertainment，简称 IFE），本方案旨在规划并构建一套统一的、高可靠的内容管理平台（Content Management System，CMS）。该平台主要实现对航空娱乐系统 (IFE) 的音视频媒体元数据进行深度管理，并支持基于多层级航线、舱位 (Class)、设备配置 (Media Config) 等复杂拓扑结构的分发与设置。

整体设计高度抽象了航空内容分发业务，解耦底层具体机型与硬件设备。

## 2. 核心设计理念：Profile / Cycle / Category 模型
本架构深度融入了主流行业标杆（如松下 MMA 平台）的工程设计思想，建立严密的业务层级：

### 2.1 Profile（终端能力档案）
Profile 是一切下游适配的基准。平台不直接与特定飞机或物理硬件进行数据绑定，而是建立抽象的 IFE Profile 体系。通过前端的 **Profile Setup** 模块，运维团队可以灵活编排航线 (Routes) 和设备配置 (Media Config)。

### 2.2 Cycle（发布周期基线）
航空业务具有强烈的周期性与批次性，Cycle 作为系统中最高级的版本控制单元被引入。一次 Cycle 代表一次完整的投放批次。

### 2.3 Category（栏目分类层级）
Category 决定了最终乘客在座位屏幕上看到的菜单与导航结构。
- **层次树结构**：平台支持创建多级 Category 树。
- **动态挂载**：内容实体不硬编码其显示位置，而是通过关联关系 (`category_media`) 挂载到 Category 上，并可以附加独立的收费 (Price) 与频道 (Channel) 配置。

## 3. 分层架构与系统拓扑设计
系统采用了现代全栈单体架构，以极轻量级的形式提供完整的业务闭环：

### 3.1 表现与交互层 (Frontend)
- **技术栈**：React 18 + TypeScript + Vite + Tailwind CSS。
- **核心组件**：采用 `PremiumLayout` 实现动态的显隐逻辑。在内容检索页（如 Status Sheet）展示分类树与航司筛选栏，在配置页自动隐藏以保持专注。
- **交互规范**：采用原生体验，例如全局多窗口搜索弹窗，以及无缝拖拽重排 (Drag and Drop) 排序等。

### 3.2 核心业务逻辑层 (Backend)
- **技术栈**：Node.js + Express。
- 提供全量的 RESTful API 支持前后端分离调用。包含对多语言字典库 (`language_lookups`) 的动态读取和数据挂载。

### 3.3 数据持久层 (Database)
- **技术栈**：SQLite 3 (`mma.db`)。
- 采用本地轻量级数据库满足高性能的增删改查。

### 3.4 DRM 加密系统对接 (独立模块)
- DRM（数字版权管理）作为高价值媒体保护的独立一环，将由专门的子系统开发并与本 CMS 对接。媒体的加密信息和解密密钥会通过标准化的接口与 CMS 分发流程融合。

## 4. 关键系统接口与集成蓝图
### 4.1 数据逆向工程与重构
- 目前系统支持通过 Node.js 脚本集直接解析并提取松下机载真实的 `.sql3` 与 `.har` 数据包，将其 1:1 映射至本平台的 SQLite 数据库中。

## 5. 数据库主题域规划概述
数据库（`schema.sql`）在逻辑上划分为核心主题域：
1. **用户与权限域**：`users` 表管控多角色访问。
2. **内容资产域**：`media` 表存储业务元数据及物理技术参数（通过 UID 分隔）。
3. **栏目与挂载域**：`categories` 和 `category_media` 交叉表存放树形节点与媒体的挂载及定价策略。
4. **多语言与字典域**：`language_lookups` 提供底层的 ISO 代码和 LID 映射。
5. **结构拓扑域**：`profiles`, `classes`, `sub_profiles`, `media_configs` 实现客舱硬件逻辑隔离。
