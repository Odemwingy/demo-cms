# 1. Package Export and Release Architecture

The Package Release module handles all packaging logic before any data leaves the CMS. Its primary function is to transform scattered database records and media files into a single, standardized release package, perfectly compatible for parsing and reading by the target IFE terminals on the aircraft.

## 1.1 Current Packaging Implementation
Currently, the system is primarily based on lightweight SQLite storage. The system's "Release Package Export" at this stage mainly involves packaging the `categories` and `media` structures via backend Node.js scripts and outputting them as standardized JSON description files, which can be directly used for simulators or read by loading programs.

---

# 2. DRM Packaging Mechanism (Independent Module Integration)

To support real airline delivery requirements, the advanced encryption packaging logic has been stripped out into an independent development module to ensure system decoupling.

## 2.1 Offline DRM Encryption
High-value AVOD assets (such as theatrical blockbusters) must be processed through a dedicated DRM pipeline.
- The encryption engine is responsible for encrypting media blocks and issuing license key files with strict "License Windows".
- The CMS main system outputs instruction parameters to the DRM system through security strategy structures configured in `media_configs` and `profiles`.
- The final digital signature is bundled together with the encrypted package and dispatched to the fleet. This complex packaging flow is not implemented within the main CMS project but integrates and docks with the CMS export bus via standard Interface Control Documents (ICD).
