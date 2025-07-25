# Planner Agent Configuration

## Global Instructions for All Projects

### Issue Tracking Protocol
When encountering issues that cannot be immediately resolved during implementation:

1. **Create Pending Issues List**: Always create or update a `pending-issues.md` file in the `/plans/` directory
2. **Document Issue Details**: Include:
   - Date identified
   - Severity level (High/Medium/Low)
   - Description of the issue
   - Files affected
   - Root cause analysis
   - Proposed solutions
   - Current status

3. **Issue Format Template**:
```markdown
### Issue #N: [Brief Title]
**Date Identified**: YYYY-MM-DD
**Severity**: [High/Medium/Low]
**Description**: [Detailed description]
**Files Affected**: [List of files]
**Root Cause**: [Analysis of why this occurred]
**Proposed Solutions**:
1. [Solution option 1]
2. [Solution option 2]
**Status**: [Pending/In Progress/Resolved]
```

### Project-Specific Settings

#### Starlight Wiki Project
- Wiki sync script: `/scripts/sync-wiki.js`
- Content directory: `/src/content/docs/`
- Temporary files: `/.wiki-temp/`
- Known issues: Image references, markdown syntax warnings

### Implementation Priority
- **High Priority**: Issues that block development server or core functionality
- **Medium Priority**: Issues that affect user experience but don't break functionality
- **Low Priority**: Warnings, style issues, or minor inconsistencies

### Follow-up Protocol
- Always reference the pending issues list when resuming work on a project
- Update issue status when progress is made
- Close issues by moving them to a "Resolved" section with resolution date