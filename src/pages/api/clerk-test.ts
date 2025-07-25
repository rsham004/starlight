import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  const results = {
    hasSecretKey: !!secretKey,
    hasPublishableKey: !!publishableKey,
    secretKeyFormat: secretKey ? secretKey.substring(0, 10) + '...' : 'missing',
    publishableKeyFormat: publishableKey ? publishableKey.substring(0, 20) + '...' : 'missing',
    apiTest: null as any
  };
  
  // Test direct API call to Clerk
  if (secretKey) {
    try {
      const response = await fetch('https://api.clerk.com/v1/users?limit=1', {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      results.apiTest = {
        status: response.status,
        statusText: response.statusText,
        success: response.ok
      };
      
      if (response.ok) {
        const data = await response.json();
        results.apiTest.userCount = data.length || 0;
        results.apiTest.firstUser = data[0] ? {
          id: data[0].id,
          email: data[0].email_addresses?.[0]?.email_address
        } : null;
      } else {
        const errorText = await response.text();
        results.apiTest.error = errorText;
      }
      
    } catch (error) {
      results.apiTest = {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};