import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const wikiDir = path.join(projectRoot, '.wiki-temp');
const docsDir = path.join(projectRoot, 'src', 'content', 'docs');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanDocsDir() {
  if (fs.existsSync(docsDir)) {
    fs.rmSync(docsDir, { recursive: true, force: true });
  }
  ensureDir(docsDir);
}

function cloneOrUpdateWiki() {
  if (fs.existsSync(wikiDir)) {
    console.log('Updating existing wiki...');
    execSync('git pull', { cwd: wikiDir, stdio: 'inherit' });
  } else {
    console.log('Cloning wiki...');
    execSync(`git clone https://github.com/AI-Product-Development/wiki.git "${wikiDir}"`, { stdio: 'inherit' });
  }
}

function convertWikiToAstro(filePath, relativePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract title from first heading or filename
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md').replace(/-/g, ' ');
  
  // Add or update frontmatter
  if (content.startsWith('---')) {
    // Extract existing frontmatter and content
    const parts = content.split('---').filter(Boolean);
    if (parts.length >= 2) {
      // Parse existing frontmatter to get title
      const frontmatterLines = parts[0].trim().split('\n');
      let existingTitle = title;
      for (const line of frontmatterLines) {
        if (line.startsWith('title:')) {
          existingTitle = line.substring(6).trim().replace(/^["']|["']$/g, '');
          break;
        }
      }
      // Use simplified frontmatter with existing title
      content = `---
title: ${existingTitle}
description: ${existingTitle}
---

${parts.slice(1).join('---')}`;
    }
  } else {
    content = `---
title: ${title}
description: ${title}
---

${content}`;
  }
  
  // Convert wiki links [[Page]] to relative links
  content = content.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
    const slug = p1.toLowerCase().replace(/\s+/g, '-');
    return `[${p1}](/${slug})`;
  });
  
  // Comment out image references that point to wiki\images
  content = content.replace(/!\[([^\]]*)\]\(wiki\\images\\[^)]+\)/g, '<!-- Image removed: $& -->');
  
  return content;
}

function syncWikiContent() {
  const wikiFiles = fs.readdirSync(wikiDir);
  
  wikiFiles.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(wikiDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const content = convertWikiToAstro(filePath, file);
        const outputFile = file.toLowerCase() === 'home.md' ? 'index.md' : file.toLowerCase();
        const outputPath = path.join(docsDir, outputFile);
        
        fs.writeFileSync(outputPath, content);
        console.log(`Synced: ${file} -> ${outputFile}`);
      }
    }
  });
}

function main() {
  console.log('Starting wiki sync...');
  
  try {
    cloneOrUpdateWiki();
    cleanDocsDir();
    syncWikiContent();
    console.log('Wiki sync completed successfully!');
  } catch (error) {
    console.error('Error syncing wiki:', error);
    process.exit(1);
  }
}

main();