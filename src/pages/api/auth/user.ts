import type { APIRoute } from 'astro';
import { clerkClient } from '@clerk/astro/server';

export const GET: APIRoute = async (context) => {
  const { locals } = context;
  
  try {
    if (locals.auth) {
      const { userId } = await locals.auth();
      
      if (userId) {
        try {
          // Fetch complete user data from Clerk backend
          const user = await clerkClient(context).users.getUser(userId);
          
          const email = user?.emailAddresses?.[0]?.emailAddress || '';
          const firstName = user?.firstName || '';
          const lastName = user?.lastName || '';
          
          // Handle roles from publicMetadata - check both formats
          const metadataRoles = user?.publicMetadata?.roles || [];
          const singleRole = user?.publicMetadata?.role;
          let roles = [];
          let primaryRole = 'public';
          
          // Collect all roles
          if (Array.isArray(metadataRoles) && metadataRoles.length > 0) {
            roles = metadataRoles;
          } else if (singleRole) {
            roles = [singleRole];
          }
          
          // Determine primary role based on hierarchy
          if (roles.includes('admin')) {
            primaryRole = 'admin';
          } else if (roles.includes('management')) {
            primaryRole = 'management';
          } else if (roles.includes('working-group')) {
            primaryRole = 'working_group';  
          } else if (roles.length > 0) {
            primaryRole = roles[0];
          }
          
          const responseData = {
            userId,
            email,
            role: primaryRole,
            roles: roles,
            firstName,
            lastName
          };
        
          
          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (clerkError) {
          // Fallback to basic response if Clerk backend fails
          return new Response(JSON.stringify({
            userId,
            email: '',
            role: 'public',
            firstName: '',
            lastName: '',
            error: 'Failed to fetch complete user data'
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
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