import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  const baseUrl = 'http://localhost:4330';
  
  const results = {
    timestamp: new Date().toISOString(),
    systemStatus: {
      clerkSecretKey: !!secretKey,
      baseUrl: baseUrl
    },
    userTests: [] as any[],
    roleTests: [] as any[],
    accessTests: [] as any[],
    summary: {} as any
  };

  try {
    // Test 1: Get current users
    const usersResponse = await fetch('https://api.clerk.com/v1/users?limit=10', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const users = await usersResponse.json();
    
    if (Array.isArray(users)) {
      results.userTests = users.map(user => ({
        id: user.id,
        email: user.email_addresses?.[0]?.email_address,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        role: user.public_metadata?.role || 'public',
        created: new Date(user.created_at).toLocaleString()
      }));
    }

    // Test 2: Check role distribution
    const roleCount = {
      management: 0,
      working_group: 0,
      public: 0
    };
    
    results.userTests.forEach(user => {
      const role = user.role || 'public';
      if (role === 'management') roleCount.management++;
      else if (role === 'working_group') roleCount.working_group++;
      else roleCount.public++;
    });
    
    results.roleTests = {
      roleDistribution: roleCount,
      managementUsers: results.userTests.filter(u => u.role === 'management'),
      workingGroupUsers: results.userTests.filter(u => u.role === 'working_group'),
      publicUsers: results.userTests.filter(u => u.role === 'public' || !u.role)
    };

    // Test 3: Verify signup form functionality
    const formTestEmail = `form-verify-${Date.now()}@test.com`;
    const signupResponse = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Form',
        lastName: 'Verify',
        email: formTestEmail,
        password: 'TestPassword123!'
      })
    });
    
    const signupResult = await signupResponse.json();
    results.accessTests.push({
      test: 'Signup form API',
      success: signupResult.success,
      email: formTestEmail,
      userId: signupResult.userId,
      message: signupResult.message || signupResult.error
    });

    // Test 4: Check if pages exist
    const pagesToCheck = [
      '/signup-working',
      '/signup-debug',
      '/wiki/working-group/',
      '/wiki/management/'
    ];
    
    for (const page of pagesToCheck) {
      try {
        const response = await fetch(`${baseUrl}${page}`, { redirect: 'manual' });
        results.accessTests.push({
          test: `Page exists: ${page}`,
          exists: response.status !== 404,
          status: response.status,
          redirected: response.status === 302,
          location: response.headers.get('location')
        });
      } catch (error) {
        results.accessTests.push({
          test: `Page exists: ${page}`,
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Summary
    results.summary = {
      totalUsers: results.userTests.length,
      roleDistribution: roleCount,
      signupWorking: signupResult.success,
      protectedPagesExist: results.accessTests.filter(t => t.test.includes('wiki/')).every(t => t.exists),
      recommendations: []
    };

    if (roleCount.management === 0) {
      results.summary.recommendations.push('No management users found - assign management role to ravi.shamihoke@productfoundry.ai');
    }
    
    if (roleCount.working_group === 0) {
      results.summary.recommendations.push('No working group users found - create users with working group emails');
    }
    
    if (!signupResult.success) {
      results.summary.recommendations.push('Signup form not working - check API endpoint');
    }

    // Clean up test user if created
    if (signupResult.userId) {
      try {
        await fetch(`https://api.clerk.com/v1/users/${signupResult.userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          }
        });
        results.summary.testUserCleaned = true;
      } catch (error) {
        results.summary.testUserCleaned = false;
      }
    }

  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};