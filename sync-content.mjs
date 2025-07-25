import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import path from 'path';

const REPO_URL = 'https://github.com/AI-Product-Development/wiki.git';
const TEMP_DIR = './.wiki-sync';
const CONTENT_DIR = './src/content/docs';

console.log('🔄 Syncing content from GitHub wiki...');

try {
  // Clean up existing temp directory
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  
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
  
  // Clone the repository
  console.log('📥 Cloning repository...');
  execSync(`git clone --depth 1 ${REPO_URL} ${TEMP_DIR}`, { stdio: 'inherit' });
  
  // Copy and process markdown files
  console.log('📝 Processing markdown files...');
  
  function processDirectory(sourceDir, targetDir) {
    if (!existsSync(sourceDir)) return;
    
    const items = readdirSync(sourceDir);
    
    for (const item of items) {
      const sourcePath = join(sourceDir, item);
      const targetPath = join(targetDir, item);
      const stat = statSync(sourcePath);
      
      if (stat.isDirectory()) {
        // Skip .git directory
        if (item === '.git') continue;
        
        mkdirSync(targetPath, { recursive: true });
        processDirectory(sourcePath, targetPath);
      } else if (item.endsWith('.md')) {
        // Process markdown files
        let content = readFileSync(sourcePath, 'utf-8');
        
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
          const title = path.basename(item, '.md').replace(/[_-]/g, ' ');
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
        
        writeFileSync(targetPath, content, 'utf-8');
        console.log(`✅ Processed: ${item}`);
      }
    }
  }
  
  // Process the content
  processDirectory(TEMP_DIR, CONTENT_DIR);
  
  // Clean up temp directory
  rmSync(TEMP_DIR, { recursive: true, force: true });
  
  console.log('✅ Content sync completed successfully!');
  
} catch (error) {
  console.error('❌ Content sync failed:', error.message);
  process.exit(1);
}