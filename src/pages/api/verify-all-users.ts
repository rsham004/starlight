import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  const orgId = 'org_30MZadhJc6MCmbqQSWUmy54gTJq';
  
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Missing secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const results = {
    timestamp: new Date().toISOString(),
    organizationStats: {} as any,
    usersByRole: {} as any,
    workingGroupMembers: [] as any[],
    summary: {} as any
  };

  try {
    // Get organization members
    const orgMembersResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships?limit=100`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (orgMembersResponse.ok) {
      const orgData = await orgMembersResponse.json();
      const members = orgData.data || orgData || [];
      
      results.organizationStats = {
        totalMembers: members.length,
        admins: members.filter((m: any) => m.role === 'org:admin').length,
        members: members.filter((m: any) => m.role === 'org:member').length
      };
      
      // Extract working group members
      results.workingGroupMembers = members
        .filter((m: any) => m.public_user_data?.identifier?.includes('@productfoundry.ai'))
        .map((m: any) => ({
          email: m.public_user_data.identifier,
          name: `${m.public_user_data.first_name} ${m.public_user_data.last_name}`,
          role: m.role,
          userId: m.public_user_data.user_id
        }))
        .sort((a: any, b: any) => a.email.localeCompare(b.email));
    }

    // Get all users to check metadata
    const usersResponse = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      
      // Group users by role
      results.usersByRole = {
        management: [],
        working_group: [],
        public: []
      };
      
      for (const user of users) {
        const email = user.email_addresses?.[0]?.email_address || '';
        const metadata = user.public_metadata || {};
        const role = metadata.role || 'public';
        
        const userInfo = {
          email: email,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          role: role,
          organizationId: metadata.organizationId,
          organizationRole: metadata.organizationRole,
          hasCorrectMetadata: metadata.organizationId === orgId
        };
        
        if (role === 'management') {
          results.usersByRole.management.push(userInfo);
        } else if (role === 'working_group') {
          results.usersByRole.working_group.push(userInfo);
        } else {
          results.usersByRole.public.push(userInfo);
        }
      }
    }

    // Summary
    results.summary = {
      totalUsersInSystem: results.usersByRole.management.length + 
                         results.usersByRole.working_group.length + 
                         results.usersByRole.public.length,
      totalOrgMembers: results.organizationStats.totalMembers,
      workingGroupInOrg: results.workingGroupMembers.length,
      managementUsers: results.usersByRole.management.length,
      workingGroupUsers: results.usersByRole.working_group.length,
      publicUsers: results.usersByRole.public.length,
      allWorkingGroupHaveAccess: results.usersByRole.working_group.length === 47,
      defaultPassword: 'Welcome@ProductFoundry2025!'
    };

  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};