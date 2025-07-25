import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const baseUrl = 'http://localhost:4330';
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  };

  // Test 1: Access public page without auth
  try {
    const response = await fetch(`${baseUrl}/wiki/`);
    results.tests.push({
      test: 'Public page without auth',
      url: '/wiki/',
      expectedAccess: true,
      actualAccess: response.ok,
      status: response.status,
      success: response.ok
    });
  } catch (error) {
    results.tests.push({
      test: 'Public page without auth',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Access working group page without auth
  try {
    const response = await fetch(`${baseUrl}/wiki/working-group/`, {
      redirect: 'manual'
    });
    results.tests.push({
      test: 'Working group page without auth',
      url: '/wiki/working-group/',
      expectedAccess: false,
      actualAccess: response.ok && response.status !== 302,
      status: response.status,
      redirectLocation: response.headers.get('location'),
      success: response.status === 302 // Should redirect to sign-in
    });
  } catch (error) {
    results.tests.push({
      test: 'Working group page without auth',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Access management page without auth
  try {
    const response = await fetch(`${baseUrl}/wiki/management/`, {
      redirect: 'manual'
    });
    results.tests.push({
      test: 'Management page without auth',
      url: '/wiki/management/',
      expectedAccess: false,
      actualAccess: response.ok && response.status !== 302,
      status: response.status,
      redirectLocation: response.headers.get('location'),
      success: response.status === 302 // Should redirect to sign-in
    });
  } catch (error) {
    results.tests.push({
      test: 'Management page without auth',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 4: Create a working group member
  const workingGroupEmail = 'amelia.martinez@productfoundry.ai';
  try {
    const response = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Amelia',
        lastName: 'Martinez',
        email: workingGroupEmail,
        password: 'TestPassword123!'
      })
    });
    const data = await response.json();
    results.tests.push({
      test: 'Create working group member',
      email: workingGroupEmail,
      success: data.success === true,
      status: response.status,
      userId: data.userId,
      message: data.message || data.error,
      assignedRole: data.role || 'Check in Clerk dashboard'
    });
  } catch (error) {
    results.tests.push({
      test: 'Create working group member',
      email: workingGroupEmail,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 5: Create a public user
  const publicEmail = 'publicuser@example.com';
  try {
    const response = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Public',
        lastName: 'User',
        email: publicEmail,
        password: 'TestPassword123!'
      })
    });
    const data = await response.json();
    results.tests.push({
      test: 'Create public user',
      email: publicEmail,
      success: data.success === true,
      status: response.status,
      userId: data.userId,
      message: data.message || data.error,
      assignedRole: data.role || 'Check in Clerk dashboard'
    });
  } catch (error) {
    results.tests.push({
      test: 'Create public user',
      email: publicEmail,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};