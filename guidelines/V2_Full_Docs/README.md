# 航空 IFE 内容管理平台 (CMS) V2 完整核心文档集

欢迎查阅 CMS V2 的长篇全栈技术方案与产品需求说明书 (PRD) 合集。
本套文档完全提取自真实生产环境下的企业级 CMS 系统需求（总篇幅超过 8 万字，提炼后约 3.5 万字核心干货），并且经过了彻底的业务泛化清洗（移除了特定航司的隐私信息）与非核心模块剥离（移除了冗余的电商和广告模块）。

> [!NOTE]
> 本套文档在架构上**完全对齐**了机载娱乐系统的行业标杆规范（即 Panasonic MMA 数据层级与锁版体系）。能够直接作为开发团队重构、外包招标、或者 AI 学习理解航空数字媒体供应链系统的重要参考依据。

## 目录结构向导

本目录总共拆分为两个子模块，分别面向技术研发团队与产品业务团队：

### 📁 CMS_Technical_Architecture (技术架构方案)
本目录深入探讨系统底层设计与数据流转规则：
*   **[01_Overall_Architecture.md](CMS_Technical_Architecture/01_Overall_Architecture.md)**：系统顶层设计、多端交互逻辑，以及结合了松下 MMA 的 `Cycle`、`Profile` 等层级组织结构。
*   **[02_Data_Models.md](CMS_Technical_Architecture/02_Data_Models.md)**：底层数据建模，详细说明业务唯一 ID (UID) 与物理媒体介质 ID (MID) 的双主键解耦设计与数据库字典级定义。
*   **[03_Integration_Security.md](CMS_Technical_Architecture/03_Integration_Security.md)**：安全防线、DRM (数字版权管理)、多路并发转码集群规范以及与外部内容商(CSP) 的 API 对接标准。

### 📁 CMS_PRD (产品需求文档)
本目录采用高度严谨的 **[场景 -> 前提条件 -> 动作表格 -> 后置状态]** 标准化文档写作法进行编制：
*   **[01_Product_Scope_Roles.md](CMS_PRD/01_Product_Scope_Roles.md)**：功能边界划分与极其复杂的企业级航空 RBAC (基于角色的访问控制) 与互斥权限矩阵。
*   **[02_Metadata_Management.md](CMS_PRD/02_Metadata_Management.md)**：海量音视频及游戏元数据字段的标准定义、多语言化配置逻辑及校验闭环。
*   **[03_Cycle_Status_Sheet.md](CMS_PRD/03_Cycle_Status_Sheet.md)**：航空业标志性的高频调度业务核心。详述两阶段锁版 (Two-Stage Lock) 审批管线与变更请求 (CR) 的强制执行路径。
*   **[04_Package_Release.md](CMS_PRD/04_Package_Release.md)**：导出流程规范、数百项离线包一致性检测 (Integrity Check) 策略，以及完整的取证级审计日志追溯。

## 如何阅读
*   **如果您是技术架构师**：请重点关注 `CMS_Technical_Architecture/02_Data_Models.md` 和 `03_Integration_Security.md` 中关于数据解耦和加解密分发的部分。
*   **如果您是业务分析师/产品经理**：请深入研究 `CMS_PRD/03_Cycle_Status_Sheet.md`，这是航空娱乐系统与普通视频网站后台在内容排期逻辑上的本质区别。

---
*版本说明：V2.0*  
*核心领域：AVOD (音视频点播) 与 Games (游戏)*
