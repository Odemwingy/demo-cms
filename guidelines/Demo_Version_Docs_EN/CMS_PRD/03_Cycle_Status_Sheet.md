# 1. Core Operation Module: Status Sheet
The Status Sheet is the most frequently used core component in the system, responsible for centrally presenting all content and their metadata configuration status within a specific distribution Cycle.

## 1.1 Core Interface and Layout
The Status Sheet (`HomeView.tsx`) is designed as a high-density information console.
- **Left Global Tree**: Allows operations personnel to quickly filter and locate column categories based on a tree structure.
- **Top Filter Bar**: Provides large-dimension filtering for Airlines and Cycles.
- **Dynamic Visibility Mechanism**: To maintain business focus, when a user jumps out of content management and enters pure system configuration pages, the global tree and filter bar will automatically hide.

## 1.2 Drag & Drop Reordering Interaction
Addressing the strict sorting presentation requirements of Panasonic airborne screens, we implemented native HTML5 drag-and-drop reordering functionality in the Status Sheet:
- **Trigger Mechanism**: Users can long-press the drag handle in front of a list row to shift it up or down.
- **Status Activation**: Once the order changes, the blue box operation area in the upper right corner (e.g., `SAVE`, `RESET` buttons) will automatically activate from a grayed-out state.
- **Data Persistence**: After the user clicks `SAVE`, the underlying system will update the `order_position` field in the `category_media` association table, ensuring that the set order is strictly followed the next time it's entered or when a package is exported.
