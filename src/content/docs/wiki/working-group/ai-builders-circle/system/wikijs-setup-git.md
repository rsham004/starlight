---
title: Wiki.js + Git sync setup
description: "AI Builders Circle documentation"
published: true
date: 2025-07-05T02:09:20.843Z
tags: 
editor: markdown
dateCreated: 2025-07-05T02:09:20.843Z
---

# Wiki.js Git Sync Setup Guide

## 🚀 Quick Start

1. **Provision a Linux VPS** (e.g., Ubuntu 20.04) and install Docker.

2. **Create required files**:

   ```bash
   mkdir -p /etc/wiki
   echo 'YOUR_DB_PASSWORD' > /etc/wiki/.db-secret
   chmod 600 /etc/wiki/.db-secret
   ```

3. **Create SSH key** for GitHub access:

   ```bash
   ssh-keygen -t ed25519 -f /etc/wiki/wiki-git-key -N ""
   chmod 600 /etc/wiki/wiki-git-key
   ```

4. **Add the public key** (`/etc/wiki/wiki-git-key.pub`) to your GitHub repo as a **Deploy Key with write access**.

5. **Create Docker network and volumes**:

   ```bash
   docker network create wikinet
   docker volume create wikijs-data
   docker volume create wikijs-db
   ```

6. **Start PostgreSQL**:

   ```bash
   docker run -d --name db \
     --network=wikinet \
     -e POSTGRES_DB=wiki \
     -e POSTGRES_PASSWORD=$(cat /etc/wiki/.db-secret) \
     -e POSTGRES_USER=wiki \
     -v wikijs-db:/var/lib/postgresql/data \
     postgres:13
   ```

7. **Start Wiki.js**:

   ```bash
   docker create \
     --name=wiki \
     -e LETSENCRYPT_DOMAIN=wiki.example.com \
     -e LETSENCRYPT_EMAIL=admin@example.com \
     -e SSL_ACTIVE=1 \
     -e DB_TYPE=postgres \
     -e DB_HOST=db \
     -e DB_PORT=5432 \
     -e DB_PASS_FILE=/etc/wiki/.db-secret \
     -e DB_USER=wiki \
     -e DB_NAME=wiki \
     -e UPGRADE_COMPANION=1 \
     -h wiki \
     --restart=unless-stopped \
     --network=wikinet \
     -p 80:3000 \
     -p 443:3443 \
     -v wikijs-data:/wiki/data \
     -v /etc/wiki/.db-secret:/etc/wiki/.db-secret:ro \
     -v /etc/wiki/wiki-git-key:/etc/wiki/wiki-git-key:ro \
     requarks/wiki:2

   docker start wiki
   ```

8. **Access Wiki.js** at `http://your-server-ip`, and complete the initial setup.

9. **Configure Git sync** in Wiki.js Admin UI:

   * Go to **Administration → Storage → Git**
   * URL: `git@github.com:your-org/wiki.git`
   * Branch: `main`
   * Private Key Path: `/etc/wiki/wiki-git-key`
   * Locale: Map `en` to `/`
   * Sync: "Push only" or "Two-way"
   * Click **Sync Now**

---

## 🔍 Detailed Setup

### 1. SSH Key Setup for Git Access

* Store the private key at `/etc/wiki/wiki-git-key`
* Make sure file permissions are correct: `chmod 600`
* Add public key to GitHub:

  * Navigate to the repository → Settings → Deploy keys
  * Add new key with **write access**

### 2. Docker Volumes

* `wikijs-data`: stores page content
* `wikijs-db`: persistent PostgreSQL data

### 3. Directory Layout

Once Wiki.js syncs content, files will appear in:

```bash
/wiki/data/repo/en/home.md
/wiki/data/repo/en/your-page.md
```

Use this layout if you're committing files manually.

### 4. Granting Git Access to Collaborators

To allow others (like Ravi) to sync:

#### Option A: GitHub Collaborators

* Add their GitHub account to your repo as a **collaborator**
* They use their own SSH key

#### Option B: Shared Deploy Key

* Share `/etc/wiki/wiki-git-key` contents securely
* They add the private key to `~/.ssh/id_ed25519`
* Add to SSH agent:

  ```bash
  eval `ssh-agent -s`
  ssh-add ~/.ssh/id_ed25519
  ```
* Clone repo using:

  ```bash
  git clone git@github.com:your-org/wiki.git
  ```

### 5. Manual Git Workflow (for contributors)

```bash
# Clone the repo
git clone git@github.com:your-org/wiki.git
cd wiki

# Create content
mkdir -p en/tutorials
vim en/tutorials/first-guide.md

# Add front matter
---
title: First Guide
published: true
---

# Commit and push
git add .
git commit -m "Add First Guide"
git push
```

### 6. Troubleshooting

* **Network Error / Sync fails**:

  * Ensure the private key path is correct and readable
  * Check container logs: `docker logs wiki --tail 100`

* **Pages not appearing in Git**:

  * Ensure they are published
  * Ensure the locale is mapped to Git
  * Run `Sync Now` manually in Admin UI

* **Git repo is empty**:

  * Confirm Wiki.js created `en/` directory in `/wiki/data/repo`
  * Confirm pages have proper front matter

---

## 🧪 Verification

* To confirm pages are syncing:

```bash
docker exec -it wiki sh
cd /wiki/data/repo
find . -name '*.md'
```

---

## 🧼 Cleaning Up

To remove everything:

```bash
docker stop wiki db
docker rm wiki db
docker volume rm wikijs-data wikijs-db
```

---

## ✅ You're Ready

You now have a self-hosted Wiki.js instance with secure GitHub sync, and the ability to collaborate across your team. Enjoy writing!
