# AI Product Development Wiki - Starlight Documentation Site

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

A modern documentation site powered by Astro Starlight that synchronizes content from the AI Product Development Wiki repository.

## 🚀 Features

- **Automated Content Sync**: Content automatically syncs from the [AI Product Development Wiki](https://github.com/AI-Product-Development/wiki.git) repository
- **GitHub Actions Integration**: Scheduled syncs every 15 minutes and webhook support for real-time updates
- **Clerk Authentication**: Secure user authentication and access control
- **Content Editing API**: Edit and create wiki content directly through the web interface
- **Dynamic Content Loading**: No local content storage - everything loads from the source repository

## 🛠️ Architecture

### Content Flow
1. Wiki content is stored in `https://github.com/AI-Product-Development/wiki.git`
2. GitHub Actions sync content to `src/content/docs/` (git-ignored)
3. Build process generates static site with synchronized content
4. Edit API endpoints commit changes back to the source wiki repository

### Key Components
- **Content Sync**: `sync-content.mjs` - Clones wiki repo and processes markdown files
- **Frontmatter Fix**: `scripts/fix-frontmatter.js` - Ensures YAML frontmatter is valid
- **GitHub Actions**: `.github/workflows/sync-content.yml` - Automated sync workflow
- **Edit API**: `src/pages/api/edit/` - Endpoints for content management

## 📁 Project Structure

```
.
├── .github/workflows/    # GitHub Actions for content sync
├── public/              # Static assets
├── scripts/             # Utility scripts
├── src/
│   ├── assets/          # Images and media
│   ├── components/      # Astro components
│   ├── content/
│   │   ├── config.ts    # Content collection config
│   │   └── docs/        # Synced wiki content (git-ignored)
│   ├── pages/
│   │   └── api/         # API endpoints
│   └── middleware.ts    # Authentication middleware
├── astro.config.mjs
├── sync-content.mjs     # Content sync script
└── package.json
```

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `node sync-content.mjs`   | Manually sync content from wiki repository       |
| `node scripts/fix-frontmatter.js` | Fix YAML frontmatter issues              |

## 🔧 Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run content sync: `node sync-content.mjs`
5. Start dev server: `npm run dev`

## 🔄 Content Synchronization

### Automatic Sync
Content automatically syncs via GitHub Actions:
- **Scheduled**: Every 15 minutes
- **Webhook**: On wiki repository updates
- **Manual**: Via GitHub Actions workflow dispatch

### Manual Sync
```bash
node sync-content.mjs
node scripts/fix-frontmatter.js
```

## 🔐 Authentication

This site uses Clerk for authentication. Protected routes include:
- Content editing endpoints
- Admin tools

## 📝 Content Editing

Users with appropriate permissions can edit content through the web interface. Changes are:
1. Validated for proper frontmatter
2. Committed to the source wiki repository
3. Author information preserved in git history

### Edit Restrictions
- Only files in `challenges/` and `Circle_Management/` directories can be edited
- All content must have valid YAML frontmatter
- Required fields: `title`, `description`

## 🚨 Important Notes

- The `src/content/docs/` directory is git-ignored as content comes from external repo
- Build artifacts (`dist/`, `.astro/`) are git-ignored
- Temporary sync directories (`.wiki-sync/`, `.git-content-cache/`) are git-ignored
- Always run `fix-frontmatter.js` after syncing to ensure valid YAML

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
- [Clerk Documentation](https://clerk.com/docs)

## 📄 License

This project is part of the AI Product Development initiative.