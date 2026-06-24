# [Airline Name] IFE Content Management Platform (CMS) Overall Technical Architecture Design

## 1. Platform Objectives and Business Scope
Targeting the In-Flight Entertainment (IFE) system of [Airline Name], this solution aims to plan and build a unified, highly reliable Content Management System (CMS). The platform is currently in the **core architecture implementation validation phase (MVP)**. It primarily manages audio-video media metadata for the IFE system and supports distribution and configuration based on complex topologies like Routes, Classes, and Media Configs.

The overall design highly abstracts the aviation content distribution business, decoupling the underlying specific aircraft models and hardware devices.

## 2. Core Design Philosophy: Profile / Cycle / Category Model
This architecture deeply integrates the engineering design philosophy of industry benchmarks (e.g., Panasonic MMA platform), establishing strict business hierarchies:

### 2.1 Profile (Terminal Capability Profile)
Profile is the baseline for all downstream adaptations. Through the frontend **Profile Setup** module, operations teams can flexibly orchestrate Routes and Media Configs.

### 2.2 Cycle (Release Cycle Baseline)
The aviation business has strong periodicity and batch characteristics. Cycle is introduced as the highest-level version control unit in the system. A Cycle represents a complete delivery batch.

### 2.3 Category (Column Classification Hierarchy)
Category determines the menu and navigation structure seen by passengers on their seat screens.
- **Hierarchical Tree Structure**: The platform supports the creation of multi-level Category trees.
- **Dynamic Mounting**: Content entities do not hardcode their display locations but are mounted to Categories via relational links (`category_media`), and can attach independent pricing (Price) and channel configurations.

## 3. Layered Architecture and System Topology (Current Implementation)
The system currently adopts a **modern full-stack monolithic architecture**, providing a complete business closed-loop in a highly lightweight form:

### 3.1 Presentation and Interaction Layer (Frontend)
- **Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS.
- **Core Components**: Uses `PremiumLayout` to implement dynamic visibility logic. The category tree and airline filter bar are displayed on content retrieval pages (like the Status Sheet) and automatically hidden on configuration pages to maintain focus.
- **Interaction Standards**: Adopts native experiences, such as a global multi-window search popup and seamless Drag and Drop sorting.

### 3.2 Core Business Logic Layer (Backend)
- **Tech Stack**: Node.js + Express.
- Provides full RESTful API support for frontend-backend separated calls. Includes dynamic reading and data mounting for the multilingual dictionary library (`language_lookups`).

### 3.3 Data Persistence Layer (Database)
- **Tech Stack**: SQLite 3 (`mma.db`).
- Uses a local lightweight database to meet high-performance CRUD requirements.

### 3.4 DRM Encryption System Integration (Independent Module)
- DRM (Digital Rights Management), as an independent link for protecting high-value media, will be developed by a dedicated subsystem and integrated with this CMS. Media encryption information and decryption keys will merge with the CMS distribution flow via standardized interfaces.

## 4. Key System Interfaces and Integration Blueprint
### 4.1 Data Reverse Engineering and Reconstruction
- The system currently supports parsing and extracting authentic Panasonic airborne `.sql3` and `.har` data packets directly via a set of Node.js scripts, mapping them 1:1 into the platform's SQLite database.

## 5. Database Subject Domain Planning Overview
The database (`schema.sql`) is logically divided into core subject domains:
1. **User and Permissions Domain**: `users` table manages multi-role access.
2. **Content Asset Domain**: `media` table stores business metadata and physical technical parameters (separated by UID).
3. **Category and Mount Domain**: `categories` and `category_media` intersection table store tree nodes, media mounts, and pricing strategies.
4. **Multilingual and Dictionary Domain**: `language_lookups` provides underlying ISO codes and LID mappings.
5. **Structural Topology Domain**: `profiles`, `classes`, `sub_profiles`, `media_configs` implement cabin hardware logical isolation.
