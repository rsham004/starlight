import type { APIRoute } from 'astro';
import { GitContentManager } from '../../../content/loaders/git-loader.js';

const gitManager = new GitContentManager('https://github.com/AI-Product-Development/wiki.git');

export const POST: APIRoute = async ({ request }) => {
  try {
    const { filePath, content, commitMessage, user } = await request.json();
    
    // Validate required fields
    if (!filePath || !content || !user?.name || !user?.email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: filePath, content, user.name, user.email'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate file path permissions
    const isChallengePath = filePath.startsWith('challenges/');
    const isCircleManagementPath = filePath.startsWith('Circle_Management/');
    
    if (!isChallengePath && !isCircleManagementPath) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Can only edit files in challenges/ or Circle_Management/ directories'
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Ensure .md extension
    const normalizedPath = filePath.endsWith('.md') ? filePath : `${filePath}.md`;
    
    // Generate commit message if not provided
    const finalCommitMessage = commitMessage || `Update ${normalizedPath} via web editor`;
    
    // Save to git
    await gitManager.saveFile(normalizedPath, content, finalCommitMessage, {
      name: user.name,
      email: user.email
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: `Successfully saved ${normalizedPath} to git repository`,
      filePath: normalizedPath
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error saving content to git:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};