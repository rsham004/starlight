import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  const baseUrl = 'http://localhost:4330';
  const orgId = 'org_30MZadhJc6MCmbqQSWUmy54gTJq';
  
  const results = {
    timestamp: new Date().toISOString(),
    organizationTests: [] as any[],
    accessTests: [] as any[],
    userTests: [] as any[],
    summary: {} as any
  };

  try {
    // Test 1: Get organization details
    const orgResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (orgResponse.ok) {
      const orgData = await orgResponse.json();
      results.organizationTests.push({
        test: 'Organization exists',
        success: true,
        organization: {
          name: orgData.name,
          slug: orgData.slug,
          membersCount: orgData.members_count
        }
      });
    }

    // Test 2: Get organization memberships
    const membershipsResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (membershipsResponse.ok) {
      const membershipsData = await membershipsResponse.json();
      const memberships = membershipsData.data || membershipsData || [];
      
      results.organizationTests.push({
        test: 'Organization memberships',
        success: true,
        totalMembers: memberships.length,
        members: memberships.map((m: any) => ({
          email: m.public_user_data?.identifier,
          role: m.role,
          roleName: m.role_name,
          userId: m.public_user_data?.user_id
        }))
      });
    }

    // Test 3: Test access to protected routes
    const routesToTest = [
      { path: '/wiki/', expectedAccess: 'public', description: 'Public wiki page' },
      { path: '/wiki/working-group/', expectedAccess: 'working_group', description: 'Working group content' },
      { path: '/wiki/management/', expectedAccess: 'management', description: 'Management content' }
    ];
    
    for (const route of routesToTest) {
      try {
        const response = await fetch(`${baseUrl}${route.path}`, {
          redirect: 'manual'
        });
        
        results.accessTests.push({
          route: route.path,
          description: route.description,
          requiredAccess: route.expectedAccess,
          status: response.status,
          accessible: response.status === 200,
          redirected: response.status === 302,
          location: response.headers.get('location')
        });
      } catch (error) {
        results.accessTests.push({
          route: route.path,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Test 4: Check user metadata
    const usersResponse = await fetch('https://api.clerk.com/v1/users?limit=10', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      
      for (const user of users) {
        const email = user.email_addresses?.[0]?.email_address || '';
        const metadata = user.public_metadata || {};
        
        results.userTests.push({
          email: email,
          role: metadata.role,
          organizationId: metadata.organizationId,
          organizationRole: metadata.organizationRole,
          isInOrg: metadata.organizationId === orgId
        });
      }
    }

    // Test 5: Create a test working group user
    const testEmail = `test-wg-${Date.now()}@productfoundry.ai`;
    const signupResponse = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'WorkingGroup',
        email: testEmail,
        password: 'TestPassword123!'
      })
    });
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      results.userTests.push({
        test: 'Create working group user',
        success: true,
        email: testEmail,
        userId: signupData.userId,
        assignedRole: signupData.role,
        organizationRole: signupData.organizationRole
      });
      
      // Clean up test user
      if (signupData.userId) {
        await fetch(`https://api.clerk.com/v1/users/${signupData.userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          }
        });
      }
    }

    // Summary
    const orgMembers = results.organizationTests.find(t => t.test === 'Organization memberships');
    results.summary = {
      organizationActive: true,
      totalMembers: orgMembers?.totalMembers || 0,
      admins: orgMembers?.members?.filter((m: any) => m.role === 'org:admin').length || 0,
      workingGroupMembers: orgMembers?.members?.filter((m: any) => m.role === 'org:member' && m.email?.includes('@productfoundry.ai')).length || 0,
      publicMembers: orgMembers?.members?.filter((m: any) => m.role === 'org:member' && !m.email?.includes('@productfoundry.ai')).length || 0,
      protectedRoutesWorking: results.accessTests.filter(t => t.requiredAccess !== 'public' && t.redirected).length > 0,
      recommendations: []
    };
    
    if (results.summary.totalMembers < 47) {
      results.summary.recommendations.push(`Add remaining ${47 - results.summary.workingGroupMembers} working group members`);
    }
    
  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};