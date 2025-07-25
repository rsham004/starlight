import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Missing secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get ALL users without limit to see the real count
    const response = await fetch('https://api.clerk.com/v1/users?limit=100&order_by=-created_at', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const users = await response.json();
    
    const results = {
      timestamp: new Date().toISOString(),
      success: response.ok,
      totalUsers: Array.isArray(users) ? users.length : 0,
      recentUsers: Array.isArray(users) ? users.slice(0, 10).map(user => ({
        id: user.id,
        email: user.email_addresses?.[0]?.email_address,
        firstName: user.first_name,
        lastName: user.last_name,
        created: user.created_at,
        createdAgo: Math.round((Date.now() - new Date(user.created_at).getTime()) / 1000 / 60) + ' minutes ago'
      })) : [],
      
      // Look specifically for our test users
      frontendTestUsers: Array.isArray(users) ? users.filter(user => {
        const email = user.email_addresses?.[0]?.email_address || '';
        return email.includes('frontend-test-') || 
               email.includes('apitest-') ||
               email.includes('servertest') ||
               email.includes('test@');
      }).map(user => ({
        id: user.id,
        email: user.email_addresses?.[0]?.email_address,
        firstName: user.first_name,
        lastName: user.last_name,
        created: user.created_at,
        createdAgo: Math.round((Date.now() - new Date(user.created_at).getTime()) / 1000 / 60) + ' minutes ago'
      })) : []
    };
    
    // Check for the specific users we just created
    const targetUsers = [
      'user_30MiA160fIhvxEnnoe3tuVNbsWH',
      'user_30MiACSWE90fZF5UB4cjhHP1uKw'
    ];
    
    results.targetUserCheck = {};
    for (const userId of targetUsers) {
      try {
        const userResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          results.targetUserCheck[userId] = {
            exists: true,
            email: userData.email_addresses?.[0]?.email_address,
            created: userData.created_at
          };
        } else {
          results.targetUserCheck[userId] = {
            exists: false,
            error: `HTTP ${userResponse.status}`
          };
        }
      } catch (error) {
        results.targetUserCheck[userId] = {
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
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