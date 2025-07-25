import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Missing secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const results = {
    timestamp: new Date().toISOString(),
    organizations: [] as any[],
    organizationDetails: {} as any,
    memberships: [] as any[],
    errors: [] as any[]
  };

  try {
    // Get all organizations
    const orgsResponse = await fetch('https://api.clerk.com/v1/organizations?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!orgsResponse.ok) {
      const errorText = await orgsResponse.text();
      results.errors.push({
        endpoint: 'organizations',
        status: orgsResponse.status,
        error: errorText
      });
    } else {
      const orgsData = await orgsResponse.json();
      results.organizations = orgsData.data || orgsData || [];
      
      // Look for Product Foundry AI organization
      const productFoundryOrg = results.organizations.find(org => 
        org.name === 'Product Foundry AI' || 
        org.slug === 'product-foundry-ai'
      );
      
      if (productFoundryOrg) {
        // Get detailed organization info
        const orgDetailResponse = await fetch(`https://api.clerk.com/v1/organizations/${productFoundryOrg.id}`, {
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (orgDetailResponse.ok) {
          results.organizationDetails = await orgDetailResponse.json();
          
          // Get organization memberships
          const membershipsResponse = await fetch(`https://api.clerk.com/v1/organizations/${productFoundryOrg.id}/memberships?limit=100`, {
            headers: {
              'Authorization': `Bearer ${secretKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (membershipsResponse.ok) {
            const membershipsData = await membershipsResponse.json();
            results.memberships = membershipsData.data || membershipsData || [];
          } else {
            const errorText = await membershipsResponse.text();
            results.errors.push({
              endpoint: 'organization memberships',
              status: membershipsResponse.status,
              error: errorText
            });
          }
        } else {
          const errorText = await orgDetailResponse.text();
          results.errors.push({
            endpoint: 'organization details',
            status: orgDetailResponse.status,
            error: errorText
          });
        }
      } else {
        results.organizationDetails = {
          found: false,
          message: 'Product Foundry AI organization not found'
        };
      }
    }
    
    // Also check if organizations are enabled in the Clerk instance
    const instanceResponse = await fetch('https://api.clerk.com/v1/instance', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (instanceResponse.ok) {
      const instanceData = await instanceResponse.json();
      results.instanceSettings = {
        organizationsEnabled: instanceData.organization_settings?.enabled || false,
        maxAllowedMemberships: instanceData.organization_settings?.max_allowed_memberships,
        settings: instanceData.organization_settings
      };
    }
    
  } catch (error) {
    results.errors.push({
      general: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};