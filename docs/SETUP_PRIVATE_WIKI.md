# Setting Up Private Wiki Repository Access

This guide explains how to configure GitHub Actions to access a private wiki repository.

## Problem

The wiki repository (`https://github.com/AI-Product-Development/wiki`) is private, so the default `GITHUB_TOKEN` in GitHub Actions cannot access it.

## Solution: Personal Access Token (PAT)

### Step 1: Create a Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name: e.g., "Starlight Wiki Sync"
4. Set expiration (recommend 90 days with rotation)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Click "Generate token"
7. **IMPORTANT**: Copy the token immediately (you won't see it again!)

### Step 2: Add Token to Repository Secrets

1. Go to your repository: https://github.com/rsham004/starlight
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `WIKI_ACCESS_TOKEN`
5. Value: Paste your Personal Access Token
6. Click "Add secret"

### Step 3: Test the Workflow

1. Go to Actions tab
2. Select "Sync Wiki Content" workflow
3. Click "Run workflow" → "Run workflow"
4. Monitor the run for success

## Alternative Solutions

### Option 1: Deploy Keys (More Secure)
- Generate SSH key pair
- Add public key to wiki repo as deploy key with read access
- Add private key as secret in starlight repo
- Update sync script to use SSH URL

### Option 2: GitHub App
- Create a GitHub App with repository access
- Install on both repositories
- Use app token for authentication

### Option 3: Make Wiki Repository Public
- If content is not sensitive, consider making the wiki repo public
- No authentication needed for public repos

## Troubleshooting

### Error: "fatal: could not read Username"
- Token is not being passed correctly
- Check secret name matches: `WIKI_ACCESS_TOKEN`

### Error: "Permission denied"
- Token doesn't have correct permissions
- Ensure `repo` scope is selected

### Error: "Repository not found"
- Token doesn't have access to the organization
- User creating token must have access to the wiki repo

## Security Best Practices

1. **Rotate tokens regularly** (every 90 days)
2. **Use minimal permissions** (only `repo` scope needed)
3. **Monitor token usage** in GitHub settings
4. **Consider using GitHub App** for production
5. **Never commit tokens** to the repository

## Workflow Configuration

The workflows are already configured to use the token:

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.WIKI_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
```

This configuration:
- Uses `WIKI_ACCESS_TOKEN` if available
- Falls back to `GITHUB_TOKEN` if not set
- Works for both public and private repositories