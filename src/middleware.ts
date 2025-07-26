import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Define routes that require authentication for editing
const isEditRoute = createRouteMatcher([
  '/edit/(.*)',
  '/api/edit/(.*)'
]);

// Define routes with specific access controls
const isCircleManagementRoute = createRouteMatcher([
  '/Circle_Management/(.*)',
  '/wiki/Circle_Management/(.*)'
]);

// Organization ID for Product Foundry AI
const ORGANIZATION_ID = 'org_30MZadhJc6MCmbqQSWUmy54gTJq';

export const onRequest = clerkMiddleware(async (auth, context, next) => {
  const { pathname } = new URL(context.request.url);
  const method = context.request.method;
  
  // Always make auth available for all routes
  const authResult = await auth();
  
  // Public read access to /challenges (no auth required)
  if (pathname.includes('/challenges') && method === 'GET') {
    return next();
  }
  
  // Check if it's an edit operation or restricted content
  if (isEditRoute(context.request) || isCircleManagementRoute(context.request)) {
    if (!authResult?.userId) {
      // Not logged in - redirect to sign-in for edit operations
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
    
    if (!isMember) {
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
            <p>You must be a member of the Product Foundry AI organization to edit content.</p>
            <p><a href="/">← Back to Home</a></p>
          </body>
        </html>
      `, { 
        status: 403,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Check Circle_Management access (management only)
    if (isCircleManagementRoute(context.request)) {
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
              <p>Circle Management content is restricted to management team members only.</p>
              <p><a href="/challenges">← View Challenges</a></p>
            </body>
          </html>
        `, { 
          status: 403,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Working group and management can edit /challenges
    // Management can also edit /Circle_Management (handled above)
  }
  
  return next();
});