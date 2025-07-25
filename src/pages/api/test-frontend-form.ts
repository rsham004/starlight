import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const baseUrl = 'http://localhost:4330';
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  };

  // Test 1: Check if frontend signup page loads
  try {
    const response = await fetch(`${baseUrl}/signup-working`);
    results.tests.push({
      test: 'Frontend page loads',
      success: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type')
    });
  } catch (error) {
    results.tests.push({
      test: 'Frontend page loads',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Check if API endpoint is accessible
  try {
    const response = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    results.tests.push({
      test: 'API endpoint accessible',
      success: response.status === 400, // Should fail validation
      status: response.status,
      message: data.error || data.message
    });
  } catch (error) {
    results.tests.push({
      test: 'API endpoint accessible',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Test with complete data
  const testEmail = `form-test-${Date.now()}@productfoundry.ai`;
  try {
    const response = await fetch(`${baseUrl}/api/frontend-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Form',
        lastName: 'Test',
        email: testEmail,
        password: 'TestPassword123!'
      })
    });
    const data = await response.json();
    results.tests.push({
      test: 'Form submission with valid data',
      email: testEmail,
      success: data.success === true,
      status: response.status,
      userId: data.userId,
      message: data.message || data.error
    });
  } catch (error) {
    results.tests.push({
      test: 'Form submission with valid data',
      email: testEmail,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};