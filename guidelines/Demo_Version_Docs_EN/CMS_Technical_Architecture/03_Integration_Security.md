# [Airline Name] IFE CMS - Media Integration and Security Compliance Architecture

## 1. Heterogeneous Systems and External Global Integration Architecture
As the brain and ground central control hub for aviation media content, the CMS possesses ecological integration capabilities, smoothly and seamlessly completing data exchanges with upstream and downstream heterogeneous systems under the prerequisites of ensuring operational isolation and network security.

### 1.1 Current Full-Stack Integration Mode
- **Frontend-Backend Separation and Cross-Origin Integration**: The frontend cross-origin integrates directly with the backend Express RESTful API (`localhost:3001`) via the Vite-configured proxy server (`localhost:2881`).
- **Incremental Baseline Synchronization of Configurations and Resources**: One-way synchronization control for the airborne IFE environment. The CMS focuses on orchestrating abstract logical structures (including the Category tree of the configuration hierarchy and the combination relationships of content). Currently, the system simulates airborne packet delivery by directly loading SQLite `.db` files.

### 1.2 Interface Messages and Communication Specification Standardization
A preliminary identity and permission verification mechanism has been established via `AuthContext.tsx`, supporting dynamic routing and data isolation on the page end based on `role` (IFE_PROVIDER, AIRLINE, CSP).

## 2. DRM Encryption and Digital Rights Control Matrix (Independent Module)
Given that [Airline Name] needs to regularly introduce high-value blockbuster movies from top global theater chains and studios, Hollywood studios and top copyright owners often have extremely demanding security and compliance requirements for their intellectual assets.

### 2.1 Offline Authorization Packaging and Lifecycle Management
- The peculiarity of the aviation business is that terminals are often in a completely physically disconnected network environment. To address this pain point, Offline DRM Packaging technology will be developed and integrated as a completely independent module.
- Encrypted media blocks and digital licenses are bundled together into distribution packages and sent to the fleet. Currently, we have designed security structures like `media_configs` at the database layer to lay the logical groundwork for the independent access of the DRM packaging module.

## 3. Global Information Security System and Airline Compliance Architecture
### 3.1 Current Authentication Model
- Adopts local role session verification based on `AuthContext`, implementing basic data flow protection.

### 3.2 Aviation Data Structure Compliance
- All architectural designs (such as the combination of UID/MID, Data Scoping) are built with the goal of fully complying with the security review of aviation flight operation data.
