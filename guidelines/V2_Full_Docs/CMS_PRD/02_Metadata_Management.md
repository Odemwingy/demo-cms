# 1. Core Metadata Architecture Definition

The CMS adopts a highly scalable, rigorously validated metadata architecture specifically customized for the data packet specifications of Panasonic In-Flight Entertainment systems.

## 1.1 Consolidation of Business Metadata and Technical Metadata
In the current MVP system, we uniformly manage business information (title, category) and technical information (bitrate, encoding) within the `media` core entity.

| Core Field | Source Description |
| :--- | :--- |
| **UID / MID** | Clicking the UID supports jumping directly to the specific details page for that media (`/metadata/video`) within a native popup. |
| **Title and Multilingual** | Driven by the underlying `language_lookups` dictionary table for multilingual support. |
| **Category Belonging** | Dynamically mounts media into the infinitely deep left-side tree via `category_media`. |
| **Runtime Duration** | Real duration extracted and cleaned from authentic `.har` data. |
| **Image Specifications** | Fully compatible with the explosive increase in image specs from Phase 6c (e.g., `_11`, `_22` spec prefixes). |

---

# 2. Goal-Oriented Operation Flows
The CMS UI is designed around standardization and high efficiency. Currently, the system provides blazing-fast retrieval and configuration interactions.

## 2.1 Operation Flow: Native Multi-Column Global Search
**Goal:** Achieve millisecond-level retrieval across the full database, highly consistent with Panasonic's native interaction style.
- **Current Status**: The system does not use a conventional dropdown search; instead, it highly replicates the original **independent popup view** (`SearchResultsView`). It supports quick data positioning across multiple columns like Title and UID, significantly increasing the spatial feel of the operation area.

## 2.2 Dynamic Layout and Focus Mode
- **PremiumLayout Visibility Logic**: The system possesses intelligent component judgment capabilities. Where core metadata presentation is involved (e.g., Status Sheet), the side category tree and top filter bar are automatically shown. When performing system-level configurations like Profile, these components are automatically hidden, ensuring business personnel can focus on their operations.
