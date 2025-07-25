import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/wiki/working-group/(.*)',
  '/wiki/management/(.*)',
  '/working-group/(.*)',
  '/management/(.*)'
]);

// Organization ID for Product Foundry AI
const ORGANIZATION_ID = 'org_30MZadhJc6MCmbqQSWUmy54gTJq';

export const onRequest = clerkMiddleware(async (auth, context, next) => {
  const { pathname } = new URL(context.request.url);
  
  // Check if it's a protected route
  if (isProtectedRoute(context.request)) {
    const authResult = await auth();
    
    if (!authResult?.userId) {
      // Not logged in - redirect to sign-in
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/sign-in'
        }
      });
    }
    
    // Get user details including organization membership
    const user = authResult.sessionClaims;
    const userRole = user?.publicMetadata?.role || 'public';
    const organizationRole = user?.publicMetadata?.organizationRole || '';
    
    // Check if user is member of the organization
    const isMember = user?.publicMetadata?.organizationId === ORGANIZATION_ID;
    
    // Check access based on route
    if (pathname.includes('/management/')) {
      // Only management (org:admin) can access
      if (organizationRole !== 'org:admin' && userRole !== 'management') {
        return new Response(`
          <html>
            <head>
              <title>Access Denied</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #dc3545; }
                a { color: #007bff; text-decoration: none; }
              </style>
            </head>
            <body>
              <h1>Access Denied</h1>
              <p>This content is restricted to management team members only.</p>
              <p><a href="/">← Back to Home</a></p>
            </body>
          </html>
        `, { 
          status: 403,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    } else if (pathname.includes('/working-group/')) {
      // Management and working group members can access
      if (!isMember || userRole === 'public') {
        return new Response(`
          <html>
            <head>
              <title>Access Denied</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #dc3545; }
                a { color: #007bff; text-decoration: none; }
              </style>
            </head>
            <body>
              <h1>Access Denied</h1>
              <p>This content is restricted to working group members only.</p>
              <p>You must be a member of the Product Foundry AI organization to access this content.</p>
              <p><a href="/">← Back to Home</a></p>
            </body>
          </html>
        `, { 
          status: 403,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
  }
  
  return next();
});