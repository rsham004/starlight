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
    // Get all users
    const usersResponse = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const users = await usersResponse.json();
    
    const userList = users.map((user: any) => ({
      id: user.id,
      email: user.email_addresses?.[0]?.email_address || '',
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      role: user.public_metadata?.role || 'unknown'
    }));
    
    return new Response(JSON.stringify({
      totalUsers: users.length,
      users: userList
    }, null, 2), {
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