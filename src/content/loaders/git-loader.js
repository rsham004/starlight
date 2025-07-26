export class GitContentManager {
  constructor(repoUrl) {
    this.repoUrl = repoUrl;
    this.token = process.env.WIKI_CONTENT_ACCESS_TOKEN || process.env.GITHUB_TOKEN;
    
    // Extract owner and repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)(?:\.git)?/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    this.owner = match[1];
    this.repo = match[2];
    this.apiBase = 'https://api.github.com';
  }

  async makeGitHubAPIRequest(endpoint, method = 'GET', body = null) {
    const url = `${this.apiBase}${endpoint}`;
    const options = {
      method,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Starlight-Wiki-Integration'
      }
    };

    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    console.log(`GitHub API: ${method} ${url}`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async saveFile(filePath, content, commitMessage, author) {
    try {
      // Get current file SHA if it exists (for updates)
      let sha = null;
      try {
        const existingFile = await this.makeGitHubAPIRequest(`/repos/${this.owner}/${this.repo}/contents/${filePath}`);
        sha = existingFile.sha;
      } catch (error) {
        // File doesn't exist, that's okay for new files
        if (!error.message.includes('404')) {
          throw error;
        }
      }

      // Prepare the commit data
      const commitData = {
        message: commitMessage,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        branch: 'main',
        committer: {
          name: author.name,
          email: author.email
        },
        author: {
          name: author.name,
          email: author.email
        }
      };

      // Include SHA for updates
      if (sha) {
        commitData.sha = sha;
      }

      // Create/update the file via GitHub API
      const result = await this.makeGitHubAPIRequest(
        `/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        'PUT',
        commitData
      );

      console.log(`Successfully saved via GitHub API: ${filePath}`);
      return { success: true, filePath, sha: result.content.sha };
      
    } catch (error) {
      console.error('Error saving file via GitHub API:', error);
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  async deleteFile(filePath, commitMessage, author) {
    try {
      // Get current file SHA (required for deletion)
      const existingFile = await this.makeGitHubAPIRequest(`/repos/${this.owner}/${this.repo}/contents/${filePath}`);
      
      // Prepare the deletion data
      const deleteData = {
        message: commitMessage,
        sha: existingFile.sha,
        committer: {
          name: author.name,
          email: author.email
        },
        author: {
          name: author.name,
          email: author.email
        }
      };

      // Delete the file via GitHub API
      await this.makeGitHubAPIRequest(
        `/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        'DELETE',
        deleteData
      );

      console.log(`Successfully deleted via GitHub API: ${filePath}`);
      return { success: true, filePath };
      
    } catch (error) {
      console.error('Error deleting file via GitHub API:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async readFile(filePath) {
    try {
      const fileData = await this.makeGitHubAPIRequest(`/repos/${this.owner}/${this.repo}/contents/${filePath}`);
      
      // Decode base64 content
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      return content;
    } catch (error) {
      console.error('Error reading file via GitHub API:', error);
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }
}