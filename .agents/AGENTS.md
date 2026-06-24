# Envee CMS (MMA) Data Extraction Strategy

The Panasonic MMA system uses an AJAX-heavy architecture. When a user switches tabs (e.g., from `File Info` to `Series/Episode Info`), the URL does not change. Instead, the page fetches an HTML fragment from the server and injects it into the DOM. SingleFile (and similar page-saving tools) only captures the DOM state at the exact moment of saving, missing the hidden or un-fetched tabs.

## Extraction Rule
To fully extract the data structure for Envee CMS:

1. **Use SingleFile HTML for Base Structure & Default Tab:**
   - The saved static `.html` files reliably contain the main structure and the content of the currently active tab (usually `File Info` or `Other Info`).
   - Extract `label`, `dt`, `input`, and `select` fields from these files.

2. **Use HAR Files for Dynamic Tabs:**
   - For tabs that load dynamically (`Series/Episode Info`, `Soundtracks/Subs`, `Metadata`, `Images`, `Categories`), the data is inside the HAR files generated during the browsing session.
   - Look for the following API endpoints in the HAR files:
     - `/mma/metadata/get-group-view` (Series/Episode Info)
     - `/mma/video/getsoundtrack` (Soundtracks)
     - `/mma/video/getsubtitle` (Subtitles)
     - `/mma/metadata/get-metadata-view` (Multi-language Metadata)
     - `/mma/other/get-other-info` (Other Info attributes)
     - `/mma/other/qcdata` (QC data)
   - The response bodies of these endpoints contain the exact HTML fragments with all form fields. Parse these JSON/HTML responses to extract the missing `input`, `select`, and `dt`/`label` fields.

3. **Fallback:**
   - If both HTML and HAR are missing a specific section, refer to user-provided screenshots to reconstruct the UI and data schema.
