import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Missing secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { email, password, firstName = 'Test', lastName = 'User' } = await request.json();
    
    // Test 1: Direct API call to create user
    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: [email],
        password: password,
        first_name: firstName,
        last_name: lastName,
        skip_password_checks: false,
        skip_password_requirement: false
      })
    });

    const responseData = await response.json();
    
    return new Response(JSON.stringify({
      test: 'Direct Backend API Creation',
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      userCreated: response.ok ? responseData.id : null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      test: 'Direct Backend API Creation',
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};