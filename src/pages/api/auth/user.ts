import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (locals.auth) {
      const { userId, user } = await locals.auth();
      
      if (userId) {
        const email = user?.emailAddresses?.[0]?.emailAddress || '';
        const role = user?.publicMetadata?.role || 'public';
        
        return new Response(JSON.stringify({
          userId,
          email,
          role
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
    
    // Not authenticated
    return new Response(JSON.stringify({ userId: null }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Auth middleware not working, return not authenticated
    return new Response(JSON.stringify({ userId: null }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};