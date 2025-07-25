import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Missing secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const results = {
    timestamp: new Date().toISOString(),
    usersDeleted: [] as any[],
    usersKept: [] as any[],
    errors: [] as any[]
  };

  try {
    // Get all users
    const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const users = await response.json();
    
    if (!Array.isArray(users)) {
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process each user
    for (const user of users) {
      const email = user.email_addresses?.[0]?.email_address || '';
      
      // Keep ravi.shamihoke@productfoundry.ai
      if (email === 'ravi.shamihoke@productfoundry.ai') {
        results.usersKept.push({
          id: user.id,
          email: email,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim()
        });
        continue;
      }
      
      // Delete all test users
      if (email.includes('test') || 
          email.includes('apitest') || 
          email.includes('frontend-test') ||
          email.includes('manual-test') ||
          email.includes('form-test') ||
          email.includes('servertest')) {
        
        try {
          const deleteResponse = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${secretKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (deleteResponse.ok) {
            results.usersDeleted.push({
              id: user.id,
              email: email,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim()
            });
          } else {
            const error = await deleteResponse.text();
            results.errors.push({
              id: user.id,
              email: email,
              error: error
            });
          }
        } catch (error) {
          results.errors.push({
            id: user.id,
            email: email,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      } else {
        // Keep non-test users
        results.usersKept.push({
          id: user.id,
          email: email,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim()
        });
      }
    }
    
    results.summary = {
      totalUsers: users.length,
      deleted: results.usersDeleted.length,
      kept: results.usersKept.length,
      errors: results.errors.length
    };
    
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};