import { existsSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import path from 'path';
import { GitContentManager } from './src/content/loaders/git-loader.js';

const REPO_URL = 'https://github.com/AI-Product-Development/wiki.git';
const CONTENT_DIR = './src/content/docs';

console.log('🔄 Syncing content from GitHub wiki via API...');

try {
  // Initialize GitContentManager
  const manager = new GitContentManager(REPO_URL);
  
  // Clean up existing content
  if (existsSync(CONTENT_DIR)) {
    rmSync(CONTENT_DIR, { recursive: true, force: true });
  }
  // Ensure src/content directory exists first
  const contentParentDir = './src/content';
  if (!existsSync(contentParentDir)) {
    mkdirSync(contentParentDir, { recursive: true });
  }
  mkdirSync(CONTENT_DIR, { recursive: true });
  
  // Get repository contents via GitHub API
  console.log('📥 Fetching repository contents via GitHub API...');
  const contents = await manager.makeGitHubAPIRequest(`/repos/${manager.owner}/${manager.repo}/contents/`);
  
  // API-based recursive directory processing
  async function processDirectoryAPI(path = '', targetDir = CONTENT_DIR) {
    const items = await manager.makeGitHubAPIRequest(`/repos/${manager.owner}/${manager.repo}/contents/${path}`);
    
    for (const item of items) {
      if (item.type === 'dir') {
        // Create directory
        const dirPath = join(targetDir, item.name);
        mkdirSync(dirPath, { recursive: true });
        
        // Recursively process subdirectory
        const subPath = path ? `${path}/${item.name}` : item.name;
        await processDirectoryAPI(subPath, dirPath);
        
      } else if (item.type === 'file' && item.name.endsWith('.md')) {
        // Process markdown files
        console.log(`📄 Processing: ${item.path}`);
        let content = await manager.readFile(item.path);
        
        // Fix image paths to point to GitHub raw URLs
        content = content.replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          (match, alt, src) => {
            if (src.startsWith('http')) {
              return match; // Already absolute URL
            }
            // Convert relative paths to GitHub raw URLs
            const githubRawUrl = `https://raw.githubusercontent.com/AI-Product-Development/wiki/main/${src}`;
            return `![${alt}](${githubRawUrl})`;
          }
        );
        
        // Ensure frontmatter exists
        if (!content.startsWith('---')) {
          const title = path.basename(item.name, '.md').replace(/[_-]/g, ' ');
          const frontmatter = `---
title: "${title}"
description: "AI Product Development Wiki content"
---

`;
          content = frontmatter + content;
        } else {
          // Fix existing frontmatter to ensure required fields
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          if (frontmatterMatch) {
            let frontmatterContent = frontmatterMatch[1];
            const bodyContent = frontmatterMatch[2];
            
            // Parse and fix YAML frontmatter
            const lines = frontmatterContent.split('\n');
            const fixedLines = [];
            let hasDescription = false;
            
            for (const line of lines) {
              if (line.startsWith('description:')) {
                hasDescription = true;
                const value = line.substring('description:'.length).trim();
                if (!value || value === 'null' || value === '') {
                  fixedLines.push('description: "AI Product Development Wiki content"');
                } else {
                  fixedLines.push(line);
                }
              } else if (line.startsWith('tags:')) {
                const value = line.substring('tags:'.length).trim();
                if (!value || value === 'null' || value === '') {
                  fixedLines.push('tags: []');
                } else {
                  fixedLines.push(line);
                }
              } else {
                fixedLines.push(line);
              }
            }
            
            if (!hasDescription) {
              fixedLines.push('description: "AI Product Development Wiki content"');
            }
            
            content = `---\n${fixedLines.join('\n')}\n---\n${bodyContent}`;
          }
        }
        
        const targetPath = join(targetDir, item.name);
        writeFileSync(targetPath, content, 'utf-8');
        console.log(`✅ Processed: ${item.name}`);
      }
    }
  }
  
  // Process the content via API
  await processDirectoryAPI();
  
  console.log('✅ Content sync completed successfully!');
  
} catch (error) {
  console.error('❌ Content sync failed:', error.message);
  process.exit(1);
}