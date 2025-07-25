# Pending Issues List

## Project: Starlight Wiki Sync

### Issue #1: Missing Images in Wiki Content
**Date Identified**: 2025-07-25
**Severity**: High
**Description**: Wiki content references images that don't exist in the local repository
**Files Affected**:
- `src/content/docs/core-values.md` - References `wiki\images\conscious_learning.jpg` and `wiki\images\learning_research.jpg`

**Proposed Solutions**:
1. Download images from the wiki repository during sync
2. Comment out or remove image references during sync
3. Replace with placeholder images

**Status**: Pending

---

### Issue #2: 404 Error on Development Server
**Date Identified**: 2025-07-25
**Severity**: High
**Description**: Development server returns 404 error due to missing image references
**Root Cause**: Build fails when Astro tries to resolve image paths that don't exist

**Proposed Solutions**:
1. Fix image references in sync script
2. Add image handling to wiki sync process
3. Configure Astro to handle missing images gracefully

**Status**: Pending

---

### Issue #3: Markdown Syntax Warning
**Date Identified**: 2025-07-25
**Severity**: Low
**Description**: Warning about unknown language "|" in markdown-style-guide.md
**Error**: `[astro-expressive-code] Error while highlighting code block using language "|"`

**Proposed Solutions**:
1. Update sync script to properly handle code block language identifiers
2. Map unknown languages to "txt" during sync

**Status**: Pending

---

## Notes for Future Reference
- Wiki sync script location: `/scripts/sync-wiki.js`
- Content directory: `/src/content/docs/`
- Temporary wiki clone: `/.wiki-temp/`