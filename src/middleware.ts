import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Define route matchers for different access levels
const isWorkingGroupRoute = createRouteMatcher(['/working-group(.*)']);
const isManagementRoute = createRouteMatcher(['/management(.*)']);
const isProtectedRoute = createRouteMatcher(['/working-group(.*)', '/management(.*)']);

export const onRequest = clerkMiddleware(async (auth, context, next) => {
  // Allow public routes to pass through
  if (!isProtectedRoute(context.request)) {
    return next();
  }

  const { userId, sessionClaims } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    return context.redirect('/sign-in');
  }

  // Get user roles from Clerk public metadata
  const userRoles = sessionClaims?.public_metadata?.roles as string[] || [];
  
  // Check management access
  if (isManagementRoute(context.request)) {
    if (!userRoles.includes('management')) {
      return new Response('Access Denied - Management role required', { status: 403 });
    }
  }
  
  // Check working group access
  if (isWorkingGroupRoute(context.request)) {
    if (!userRoles.includes('working-group') && !userRoles.includes('management')) {
      return new Response('Access Denied - Working group membership required', { status: 403 });
    }
  }

  return next();
});