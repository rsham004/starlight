import type { APIRoute } from 'astro';
import { GitContentManager } from '../../../content/loaders/git-loader.js';

const gitManager = new GitContentManager('https://github.com/AI-Product-Development/wiki.git');

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { filePath, commitMessage, user } = await request.json();
    
    // Validate required fields
    if (!filePath || !user?.name || !user?.email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: filePath, user.name, user.email'
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
        error: 'Can only delete files in challenges/ or Circle_Management/ directories'
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Ensure .md extension
    const normalizedPath = filePath.endsWith('.md') ? filePath : `${filePath}.md`;
    
    // Generate commit message if not provided
    const finalCommitMessage = commitMessage || `Delete ${normalizedPath} via web editor`;
    
    // Delete from git
    await gitManager.deleteFile(normalizedPath, finalCommitMessage, {
      name: user.name,
      email: user.email
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: `Successfully deleted ${normalizedPath} from git repository`,
      filePath: normalizedPath
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error deleting content from git:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};