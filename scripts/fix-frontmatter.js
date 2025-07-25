import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';

function fixFrontmatter(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  
  if (!content.startsWith('---')) {
    return false; // No frontmatter to fix
  }
  
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return false;
  }
  
  let frontmatterContent = frontmatterMatch[1];
  const bodyContent = frontmatterMatch[2];
  
  try {
    // Parse YAML to check for issues
    const parsed = yaml.parse(frontmatterContent);
    
    // Fix null or empty descriptions
    if (!parsed.description || parsed.description === null) {
      parsed.description = "AI Product Development Wiki content";
    }
    
    // Fix null or empty tags
    if (!parsed.tags || parsed.tags === null) {
      parsed.tags = [];
    }
    
    // Regenerate clean YAML
    const cleanYaml = yaml.stringify(parsed, { 
      defaultStyle: parsed.description.includes('"') ? "'" : '"',
      doubleQuotedAsJSON: false 
    }).trim();
    
    const newContent = `---\n${cleanYaml}\n---\n${bodyContent}`;
    
    if (newContent !== content) {
      writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ Fixed frontmatter: ${filePath}`);
      return true;
    }
    
  } catch (error) {
    console.warn(`⚠️  YAML parse error in ${filePath}:`, error.message);
  }
  
  return false;
}

function processDirectory(dir) {
  const items = readdirSync(dir);
  let fixedCount = 0;
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixedCount += processDirectory(fullPath);
    } else if (item.endsWith('.md')) {
      if (fixFrontmatter(fullPath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

const contentDir = './src/content/docs';
console.log('🔧 Fixing frontmatter issues...');

const fixedCount = processDirectory(contentDir);
console.log(`✅ Fixed ${fixedCount} files`);