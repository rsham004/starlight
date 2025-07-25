import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  };

  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Missing secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Test 1: Get current user count
  try {
    const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const users = await response.json();
    results.tests.push({
      test: 'Current Users Check',
      success: response.ok,
      userCount: Array.isArray(users) ? users.length : 0,
      users: Array.isArray(users) ? users.map(u => ({ 
        id: u.id, 
        email: u.email_addresses?.[0]?.email_address,
        created: u.created_at 
      })) : []
    });
  } catch (error) {
    results.tests.push({
      test: 'Current Users Check',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Direct API user creation with @productfoundry.ai
  const testEmail1 = `apitest-${Date.now()}@productfoundry.ai`;
  try {
    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: [testEmail1],
        password: 'TestPassword123!',
        first_name: 'Test',
        last_name: 'User',
        skip_password_checks: false,
        skip_password_requirement: false
      })
    });

    const responseData = await response.json();
    results.tests.push({
      test: 'API Creation @productfoundry.ai',
      email: testEmail1,
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      userCreated: response.ok ? responseData.id : null,
      error: !response.ok ? responseData : null
    });
  } catch (error) {
    results.tests.push({
      test: 'API Creation @productfoundry.ai',
      email: testEmail1,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Direct API user creation with @gmail.com
  const testEmail2 = `apitest-${Date.now()}@gmail.com`;
  try {
    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: [testEmail2],
        password: 'TestPassword123!',
        first_name: 'Gmail',
        last_name: 'Test',
        skip_password_checks: false,
        skip_password_requirement: false
      })
    });

    const responseData = await response.json();
    results.tests.push({
      test: 'API Creation @gmail.com',
      email: testEmail2,
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      userCreated: response.ok ? responseData.id : null,
      error: !response.ok ? responseData : null
    });
  } catch (error) {
    results.tests.push({
      test: 'API Creation @gmail.com',
      email: testEmail2,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 4: Direct API user creation with @example.com
  const testEmail3 = `apitest-${Date.now()}@example.com`;
  try {
    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: [testEmail3],
        password: 'TestPassword123!',
        first_name: 'Example',
        last_name: 'User',
        skip_password_checks: false,
        skip_password_requirement: false
      })
    });

    const responseData = await response.json();
    results.tests.push({
      test: 'API Creation @example.com',
      email: testEmail3,
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      userCreated: response.ok ? responseData.id : null,
      error: !response.ok ? responseData : null
    });
  } catch (error) {
    results.tests.push({
      test: 'API Creation @example.com',
      email: testEmail3,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 5: Get updated user count
  try {
    const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const users = await response.json();
    results.tests.push({
      test: 'Final User Count',
      success: response.ok,
      userCount: Array.isArray(users) ? users.length : 0,
      newUsers: Array.isArray(users) ? users.filter(u => 
        new Date(u.created_at) > new Date(Date.now() - 60000) // Last minute
      ).map(u => ({ 
        id: u.id, 
        email: u.email_addresses?.[0]?.email_address,
        created: u.created_at 
      })) : []
    });
  } catch (error) {
    results.tests.push({
      test: 'Final User Count',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};