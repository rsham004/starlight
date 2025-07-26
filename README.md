# AI Product Development Wiki - Starlight Documentation Site

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

A modern, secure documentation site powered by Astro Starlight with role-based access control and API-based content management.

## 🚀 Features

- **🔐 Role-Based Access Control**: Secure authentication with working group and management tiers
- **🌐 API-Based Content Management**: No local git operations - all content management via GitHub API
- **⚡ Real-Time Content Sync**: Automated synchronization from private wiki repository
- **✏️ Web-Based Editing**: Create and edit content directly through the interface
- **🛡️ Security-First Design**: No exposed email addresses or sensitive data in repository
- **📱 Responsive Design**: Built with modern web standards

## 🏗️ Architecture

### Security & Access Control
- **Public Access**: Read-only access to `/challenges` content
- **Working Group (46 members)**: Read/edit access to challenges content
- **Management (2 members)**: Full access to challenges + Circle_Management content
- **Zero PII Exposure**: No email addresses or sensitive data in codebase

### Content Management Flow
```
Frontend → API Endpoint → GitContentManager → GitHub API → Repository
```
- **No Local Git Operations**: All repository interactions via GitHub API
- **Stateless Operations**: No temporary directories or local clones
- **Secure Token Management**: Environment-based authentication

### Key Components
- **GitContentManager**: API-based content operations (`src/content/loaders/git-loader.js`)
- **Role Middleware**: Authentication and authorization (`src/middleware.ts`)
- **Content Sync**: Automated sync script (`sync-content.mjs`)
- **Edit API**: Secure content management endpoints (`src/pages/api/edit/`)

## 📁 Project Structure

```
.
├── .github/workflows/    # Automated content sync
├── config/              # Configuration templates (no sensitive data)
├── src/
│   ├── components/      # Authentication & UI components
│   ├── content/
│   │   ├── loaders/     # API-based content management
│   │   └── docs/        # Synced content (git-ignored)
│   ├── pages/
│   │   └── api/         # Secure API endpoints
│   └── middleware.ts    # Role-based access control
├── SECURITY_MEASURES.md # Security audit documentation
├── .env.example        # Environment variable template
└── sync-content.mjs    # API-based sync script
```

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `node sync-content.mjs`   | Manually sync content from wiki repository       |

## 🔧 Setup

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Fill in your actual values
   ```

3. **Required Environment Variables**
   - `PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
   - `CLERK_SECRET_KEY` - Clerk server-side operations
   - `WIKI_CONTENT_ACCESS_TOKEN` - GitHub API access to private wiki
   - `ADMIN_EMAIL` - Administrator email address

4. **Initial Content Sync**
   ```bash
   node sync-content.mjs
   npm run dev
   ```

## 🔐 Authentication & Security

### Role-Based Access
- **Public Users**: Read-only access to challenges
- **Working Group**: Edit challenges content
- **Management**: Full system access

### Security Features
- ✅ **No PII in Repository**: Email addresses secured via environment variables
- ✅ **API-Only Operations**: No local git operations or temporary files
- ✅ **Token-Based Authentication**: Secure GitHub API integration
- ✅ **Role Validation**: Server-side permission checking
- ✅ **GDPR Compliant**: No hardcoded personal information

### Protected Routes
- `/Circle_Management/*` - Management only
- `/api/edit/*` - Authenticated users only
- Edit operations require appropriate role permissions

## 🔄 Content Synchronization

### Automated Sync (GitHub Actions)
- **Scheduled**: Every 15 minutes
- **Manual Trigger**: Via GitHub Actions workflow dispatch
- **Secure**: Uses encrypted tokens and API-only operations

### Content Editing
1. **Web Interface**: Edit content directly in the browser
2. **API Validation**: Server-side validation and security checks
3. **GitHub API**: Direct commits to source repository
4. **Author Tracking**: Git history preserves author information

## 🧹 Project Status

### ✅ Recently Completed
- **Security Audit**: Removed all exposed email addresses
- **Test Cleanup**: Removed all test artifacts and temporary files
- **API Migration**: Converted from git operations to GitHub API
- **Access Control**: Implemented comprehensive role-based permissions
- **Documentation**: Added security measures and architecture documentation

### 🛡️ Security Measures
- Email addresses moved to secure environment variables
- Test files and artifacts completely removed
- GitIgnore patterns prevent sensitive data commits
- API-based operations eliminate security risks from local git operations

## 📚 Documentation

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
- [Clerk Authentication](https://clerk.com/docs)
- [Security Measures](./SECURITY_MEASURES.md)

## 🎨 Next Phase: Frontend Visual Design

This project is ready for frontend visual design work. The backend architecture, security, and content management systems are complete and production-ready.

## 📄 License

This project is part of the AI Product Development initiative.