# [Airline Name] IFE CMS - Data Model and Structure Design In-Depth Analysis

## 1. Data Modeling Concept: Combining Technical and Business Metadata
In our actual implemented prototype, efficient business logic operations are achieved through a streamlined and highly cohesive SQLite structure. The underlying database highly references the real `.sql3` format of Panasonic MMA, ensuring data structures can be directly generated to communicate with airborne terminals.

- **One-Dimensional Management of UID and MID**: In the implemented `media` table, we use `uid` as the primary explicit logic, binding `mid` (the underlying media ID) within the same row of record, greatly reducing the complexity of table joins.

## 2. Core Subject Domain Model In-Depth Analysis (Current Schema)

### 2.1 Content Asset and Media Data Domain
This domain is the cornerstone of the entire system, recording the core metadata of all media assets.

- **`media` (Core Media Asset Table)**
  - `id` (PK): Auto-increment primary key inside the database.
  - `uid` / `mid`: Globally unique logical ID and Panasonic's underlying media mapping ID.
  - `title`, `duration`, `rating`: Core audiovisual business metadata.
  - `video_type`, `encoding`, `bitrate`, `aspect_ratio`: Physical technical parameter identifiers.
  - `sign_off_status`: Lifecycle approval status identifier (Pending / Full Sign-Off).

- **Extension Relation Tables**:
  - `media_systems`: Records the lifecycle of physical terminal models (e.g., S3Ki, eX3) that the media supports.
  - `media_metadata`: Handles **multilingual support**, storing specific internationalization translation data (short title, cast, synopsis).
  - `media_images`: Handles image mapping relationships. **`[Airborne New]`** Specifically supports the explosive increase of `size_category` from Phase 6c (e.g., `_11`, `_22` specific resolution prefixes).

### 2.2 Orchestration and Configuration Domain
Responsible for assembling scattered content entities into delivery collections with elegant navigation hierarchies and multi-environment adaptation strategies.

- **`categories` (Category Tree Node Table)**
  - `id` (PK), `parent_id` (FK): Supports infinitely deep self-referential tree structures.
  - `cid`: Panasonic's underlying native node numeric ID.
  - `media_type`: Supports type isolation like Video, Audio, etc.
  - `virtual`: Supports forming automatic routing virtual collection nodes through specific conditions (`propagation_data`).

- **`category_media` (Node Association Hub Table)**
  - **Core Refactoring Point**: Responsible for mounting `media` entities many-to-many under specific `categories`.
  - **`[Airborne New]` Customized Attributes**: Records `price` (VOD charge amount), `channel_num` (exclusive channel number), and `access_type` (PPV permission check) dedicated to each mapping pair, and uses `order_position` to implement the business persistence of drag-and-drop reordering.

- **Multi-Dimensional Topology Baseline Tree**:
  - `category_sets`: Top-level collection of category trees.
  - `profiles`: Terminal capability profile root node.
  - `sub_profiles`, `profile_routes`: Responsible for mounting complex flight segment cutting logic.
  - `media_configs`, `classes`: Manages specific authorization matrices for specific cabins (First, Business, Economy).

### 2.3 Internationalization and Dictionary Management (I18N & Dictionary)
- **`language_lookups` (Multilingual Dictionary Library)**
  - **`[Airborne New]` Core Mapping**: Standard dictionary table provided for multilingual extension.
  - Core fields include `name` (e.g., English), `iso_code` (e.g., eng), `label_lid` (e.g., 20401). Greatly reduces hardcoding conflicts when generating underlying SQL3 data packets.

### 2.4 User Permissions Domain (IAM)
- **`users`**
  - Manages the operator's RBAC role system (IFE_PROVIDER, AIRLINE, CSP), providing horizontal row-level isolation in data queries based on `company_id` (Data Scoping).
