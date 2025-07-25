import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const baseUrl = 'http://localhost:4330'; // Adjust if needed
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  };

  // Test 1: Get initial user count
  try {
    const response = await fetch(`${baseUrl}/api/clerk-test`);
    const data = await response.json();
    results.tests.push({
      test: 'Initial User Count',
      success: response.ok,
      userCount: data.apiTest?.userCount || 0,
      status: response.status
    });
  } catch (error) {
    results.tests.push({
      test: 'Initial User Count',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Test frontend signup API endpoint directly
  const testUser = {
    firstName: 'Frontend',
    lastName: 'TestUser',
    email: `frontend-test-${Date.now()}@productfoundry.ai`,
    password: 'TestPassword123!'
  };

  try {
    const response = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    results.tests.push({
      test: 'Frontend Signup API',
      email: testUser.email,
      success: data.success,
      status: response.status,
      userId: data.userId || null,
      message: data.message || data.error,
      response: data
    });
  } catch (error) {
    results.tests.push({
      test: 'Frontend Signup API',
      email: testUser.email,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Create another test user with different domain
  const testUser2 = {
    firstName: 'Gmail',
    lastName: 'Frontend',
    email: `frontend-test-${Date.now()}@gmail.com`,
    password: 'TestPassword123!'
  };

  try {
    const response = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser2)
    });

    const data = await response.json();
    results.tests.push({
      test: 'Frontend Signup @gmail.com',
      email: testUser2.email,
      success: data.success,
      status: response.status,
      userId: data.userId || null,
      message: data.message || data.error,
      response: data
    });
  } catch (error) {
    results.tests.push({
      test: 'Frontend Signup @gmail.com',
      email: testUser2.email,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 4: Get final user count
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

  try {
    const response = await fetch(`${baseUrl}/api/clerk-test`);
    const data = await response.json();
    results.tests.push({
      test: 'Final User Count',
      success: response.ok,
      userCount: data.apiTest?.userCount || 0,
      status: response.status
    });
  } catch (error) {
    results.tests.push({
      test: 'Final User Count',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 5: Validation test - missing fields
  try {
    const response = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Test',
        // Missing lastName, email, password
      })
    });

    const data = await response.json();
    results.tests.push({
      test: 'Validation Test (Missing Fields)',
      success: !data.success, // Should fail validation
      expectedFailure: true,
      status: response.status,
      message: data.error
    });
  } catch (error) {
    results.tests.push({
      test: 'Validation Test (Missing Fields)',
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