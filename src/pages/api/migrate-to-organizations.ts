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
    steps: [] as any[],
    errors: [] as any[],
    summary: {} as any
  };

  const orgId = 'org_30MZadhJc6MCmbqQSWUmy54gTJq';

  try {
    // Step 1: Get all current users
    const usersResponse = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const users = await usersResponse.json();
    results.steps.push({
      step: 'Fetch all users',
      success: true,
      userCount: users.length
    });

    // Step 2: Process each user
    for (const user of users) {
      const email = user.email_addresses?.[0]?.email_address || '';
      
      if (!email) continue;
      
      // Determine role based on email
      let role = 'org:member';
      let appRole = 'public';
      
      if (email === 'ravi.shamihoke@productfoundry.ai') {
        role = 'org:admin';
        appRole = 'management';
      } else if (email.endsWith('@productfoundry.ai')) {
        appRole = 'working_group';
      }
      
      // Check if user is already in organization
      try {
        const membershipResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships`, {
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (membershipResponse.ok) {
          const memberships = await membershipResponse.json();
          const membershipList = memberships.data || memberships || [];
          const existingMembership = membershipList.find((m: any) => 
            m.public_user_data?.user_id === user.id
          );
          
          if (!existingMembership) {
            // Add user to organization
            const addResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user_id: user.id,
                role: role
              })
            });
            
            if (addResponse.ok) {
              const newMembership = await addResponse.json();
              results.steps.push({
                step: `Added ${email} to organization`,
                success: true,
                role: role,
                membershipId: newMembership.id
              });
            } else {
              const errorText = await addResponse.text();
              results.errors.push({
                step: `Add ${email} to organization`,
                error: errorText,
                status: addResponse.status
              });
            }
          } else {
            results.steps.push({
              step: `${email} already in organization`,
              success: true,
              existingRole: existingMembership.role
            });
          }
        }
      } catch (error) {
        results.errors.push({
          step: `Check membership for ${email}`,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      
      // Update user metadata
      try {
        const updateResponse = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            public_metadata: {
              ...user.public_metadata,
              role: appRole,
              organizationId: orgId,
              organizationRole: role
            }
          })
        });
        
        if (updateResponse.ok) {
          results.steps.push({
            step: `Updated metadata for ${email}`,
            success: true,
            appRole: appRole,
            orgRole: role
          });
        } else {
          const errorText = await updateResponse.text();
          results.errors.push({
            step: `Update metadata for ${email}`,
            error: errorText
          });
        }
      } catch (error) {
        results.errors.push({
          step: `Update metadata for ${email}`,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Step 3: Get final organization membership count
    const finalMembershipResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (finalMembershipResponse.ok) {
      const finalMemberships = await finalMembershipResponse.json();
      const membershipList = finalMemberships.data || finalMemberships || [];
      
      results.summary = {
        totalUsers: users.length,
        organizationMembers: membershipList.length,
        admins: membershipList.filter((m: any) => m.role === 'org:admin').length,
        members: membershipList.filter((m: any) => m.role === 'org:member').length,
        successfulUpdates: results.steps.filter(s => s.success).length,
        errors: results.errors.length
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