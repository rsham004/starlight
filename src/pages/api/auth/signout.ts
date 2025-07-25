import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ redirect, cookies }) => {
  // Clear all possible Clerk session cookies
  const clerkCookies = [
    '__session',
    '__client_uat', 
    '__clerk_db_jwt',
    '__clerk-db-jwt',
    '__clerk_session',
    '__clerk_refresh_token',
    '__clerk_client_uat'
  ];
  
  clerkCookies.forEach(cookieName => {
    cookies.delete(cookieName, { path: '/' });
    cookies.delete(cookieName, { path: '/', domain: '.localhost' });
  });
  
  // Return success response
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};