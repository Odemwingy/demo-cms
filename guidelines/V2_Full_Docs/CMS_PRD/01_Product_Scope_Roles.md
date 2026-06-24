# 1. Product Scope and System Positioning

## 1.1 Product Positioning
This Content Management System (CMS) is a core operations platform specifically designed for the In-Flight Entertainment (IFE) content lifecycle. Currently, the platform is in the **MVP validation phase**, primarily implementing content metadata management, Route and device configuration (Profile Setup), and visual content orchestration based on the Panasonic MMA specifications.

## 1.2 Target Audience and Applicable Scope
- **Target Users**: The platform is aimed at serving airline content operations teams, release and maintenance teams, and third-party Content Service Providers (CSPs).
- **System Boundaries**: This CMS handles ground-side content management and configuration mapping; it does not involve the direct rendering of the onboard player UI.

## 1.3 Core Product Value
1. **Autonomy and Data Sovereignty**: Achieves complete localization of the onboard content pipeline, supporting a custom tree structure category editor (Tree Builder) and global search.
2. **Fine-Grained Orchestration**: Achieves extremely high degrees of freedom in route and cabin targeted delivery through Profile, Route, Class, and Category Builder.

## 1.4 Functional Development Boundaries and External Integration
To maintain the CMS's lightweight and pure nature as an orchestration and scheduling hub for metadata, the following development boundaries and exclusions are explicitly defined:
- **Native Development Scope**: Apart from external integrations and explicitly excluded modules, this CMS will natively develop all core process mechanisms, such as organizational permission management, complex cycle workflow approvals (sign-off lock version), and automated package validation.
- **Integration with External Media Asset Management (MAM) Platforms**: This CMS will **NOT natively develop** the management of heavy physical files (e.g., uploads, transcoding orchestration, technical format quality checks, DRM encryption packaging, and resumable massive distribution). Instead, the CMS provides standardized interfaces to associate and bind the processing results (media files) from the external MAM system at the Metadata level, strictly using **unique File IDs and unique file names**.
- **Explicit Exclusions**: Business requirements related to the synchronization of external operational data (e.g., flight routes, fleet tail numbers, organization sync) and heavy report analytics and monitoring (e.g., playback analytics, fault monitoring, alarm rules) are entirely excluded from this system's planning and development scope.

---

# 2. Access Control and Role System
Currently, the system implements basic role routing isolation on the frontend via `AuthContext.tsx`.

## 2.1 Role Model
1. **Content Editor/Provider (IFE_PROVIDER / CSP)**: Granted the right to add, edit, and preview content records. The data domain is restricted to the content they are responsible for.
2. **Airline Operations Manager (AIRLINE)**: Coordinates the category tree structure and defines complex visibility rules. Enjoys global permissions over business orchestration.

## 2.2 Tenant Data Isolation Strategy
Through different login roles and `company_id`, the system frontend provides isolated interface experiences. The backend synchronously limits the ability to improperly pull or tamper with core data belonging to non-tenant users.
