# Claude Agent Instructions for Starlight Wiki

## System Architecture
This is a Starlight documentation site that syncs content from a private GitHub wiki repository using API-based operations. Clerk auth. No other technology to be utilised unless required by this stack.

## Do not bypass instructions

## Repository Management Rules

### ❌ NEVER DO:
- **Use only agreed technology starlight and Clerk no other technology** using `git clone`
- **DO NOT clone repositories locally** using `git clone`
- **DO NOT create temporary directories** like `.git-content-cache`, `.wiki-temp`, `.wiki-sync`
- **DO NOT use execSync with git commands** for repository operations
- **DO NOT pull or push using local git operations**

### ✅ ALWAYS DO:
- **Use GitHub API exclusively** for all repository operations
- **Use GitContentManager class** which implements API-based operations
- **Keep operations stateless** - no local repository state
- **Use WIKI_CONTENT_ACCESS_TOKEN** for authentication
- **Create git issues and update them for all problems and tasks** using `gh command`

## Content Management Flow

### Correct Pattern:
1. **Content Creation/Editing**: Frontend → API Endpoint → GitContentManager → GitHub API → Repository
2. **Content Sync**: GitHub API → sync-content.mjs → Local src/content/docs/
3. **No intermediate clones or temporary repositories**

### GitContentManager Usage:
```javascript
// ✅ Correct: API-based operations
const manager = new GitContentManager('https://github.com/AI-Product-Development/wiki.git');
await manager.saveFile(filePath, content, commitMessage, author);
await manager.readFile(filePath);
await manager.deleteFile(filePath, commitMessage, author);
```

### Content Sync:
```bash
# ✅ Correct: Direct API-based sync
WIKI_CONTENT_ACCESS_TOKEN="..." node sync-content.mjs
```

## Authentication
- **Primary Token**: `WIKI_CONTENT_ACCESS_TOKEN` for wiki repository access
- **Fallback Token**: `GITHUB_TOKEN` (codespace token)
- **Clerk Integration**: For user authentication and authorization

## Directory Structure to Maintain:
```
src/
├── content/
│   ├── docs/ (synced from repository)
│   └── loaders/
│       └── git-loader.js (API-based manager)
├── pages/
│   └── api/
│       └── edit/ (editing endpoints)
└── middleware.ts (authentication)
```

## Testing Guidelines
- Use TDD
- Always test via front end
- Testnavigation user experience and aestheticss to be expensive like a ad agency
- Test API operations without creating repository clones
- Use direct GitHub API calls for verification
- Do not Simulate authenticated users but use real API calls with proper Clerk context and ensure users are created in clerk always verify and subsequently delte test data
- Verify content appears in both repository and local sync

## Performance Notes
- API operations are faster than git clones
- cleanup of temporary directories and test artefacts needed
- Stateless operations prevent sync conflicts
- Direct repository operations via GitHub API

## Security
- All operations use proper authentication tokens
- No local git credentials needed
- API operations are logged and auditable
- Clerk middleware enforces proper authorization

---

**Remember**: This system is designed to be fully API-based. Any suggestion to clone repositories or create temporary git directories should be rejected in favor of GitHub API operations.