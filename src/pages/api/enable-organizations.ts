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
    errors: [] as any[]
  };

  try {
    // Step 1: Get current instance settings
    const instanceResponse = await fetch('https://api.clerk.com/v1/instance', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (instanceResponse.ok) {
      const instanceData = await instanceResponse.json();
      results.steps.push({
        step: 'Get instance settings',
        success: true,
        currentSettings: {
          organizationsEnabled: instanceData.organization_settings?.enabled || false,
          maxAllowedMemberships: instanceData.organization_settings?.max_allowed_memberships
        }
      });
    }

    // Step 2: Update instance to enable organizations
    const updateResponse = await fetch('https://api.clerk.com/v1/instance', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        organization_settings: {
          enabled: true,
          max_allowed_memberships: 100,
          creator_role: 'org:admin',
          member_default_role: 'org:member'
        }
      })
    });

    if (updateResponse.ok) {
      const updatedData = await updateResponse.json();
      results.steps.push({
        step: 'Enable organizations',
        success: true,
        newSettings: updatedData.organization_settings
      });
    } else {
      const errorText = await updateResponse.text();
      results.errors.push({
        step: 'Enable organizations',
        error: errorText,
        status: updateResponse.status
      });
    }

    // Step 3: Create organization roles if needed
    const orgId = 'org_30MZadhJc6MCmbqQSWUmy54gTJq';
    
    // Check existing roles
    const rolesResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/roles`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (rolesResponse.ok) {
      const rolesData = await rolesResponse.json();
      results.steps.push({
        step: 'Check organization roles',
        success: true,
        existingRoles: rolesData.data || rolesData || []
      });
    }

    // Step 4: Add users to organization
    const users = [
      { email: 'ravi.shamihoke@productfoundry.ai', role: 'org:admin' },
      { email: 'amelia.martinez@productfoundry.ai', role: 'org:member' },
      { email: 'publicuser@example.com', role: 'org:member' }
    ];

    for (const userToAdd of users) {
      // First, find the user
      const userSearchResponse = await fetch(`https://api.clerk.com/v1/users?email_address=${userToAdd.email}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (userSearchResponse.ok) {
        const userData = await userSearchResponse.json();
        const user = Array.isArray(userData) ? userData[0] : userData.data?.[0];
        
        if (user) {
          // Check if user is already a member
          const membershipCheckResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships?user_id=${user.id}`, {
            headers: {
              'Authorization': `Bearer ${secretKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (membershipCheckResponse.ok) {
            const membershipData = await membershipCheckResponse.json();
            const existingMembership = (membershipData.data || membershipData || []).find((m: any) => m.public_user_data?.user_id === user.id);
            
            if (existingMembership) {
              results.steps.push({
                step: `User ${userToAdd.email} already member`,
                success: true,
                membership: existingMembership
              });
            } else {
              // Add user to organization
              const addMemberResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${secretKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  user_id: user.id,
                  role: userToAdd.role
                })
              });

              if (addMemberResponse.ok) {
                const membershipData = await addMemberResponse.json();
                results.steps.push({
                  step: `Add ${userToAdd.email} to organization`,
                  success: true,
                  membership: membershipData
                });
              } else {
                const errorText = await addMemberResponse.text();
                results.errors.push({
                  step: `Add ${userToAdd.email} to organization`,
                  error: errorText,
                  status: addMemberResponse.status
                });
              }
            }
          }
        }
      }
    }

    // Step 5: Update user metadata to include organization membership
    for (const userToUpdate of users) {
      const userSearchResponse = await fetch(`https://api.clerk.com/v1/users?email_address=${userToUpdate.email}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (userSearchResponse.ok) {
        const userData = await userSearchResponse.json();
        const user = Array.isArray(userData) ? userData[0] : userData.data?.[0];
        
        if (user) {
          // Update public metadata to reflect organization membership
          const role = userToUpdate.role === 'org:admin' ? 'management' : 
                       userToUpdate.email.includes('@productfoundry.ai') ? 'working_group' : 'public';
          
          const updateUserResponse = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${secretKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              public_metadata: {
                role: role,
                organizationId: orgId,
                organizationRole: userToUpdate.role
              }
            })
          });

          if (updateUserResponse.ok) {
            results.steps.push({
              step: `Update metadata for ${userToUpdate.email}`,
              success: true,
              role: role,
              organizationRole: userToUpdate.role
            });
          } else {
            const errorText = await updateUserResponse.text();
            results.errors.push({
              step: `Update metadata for ${userToUpdate.email}`,
              error: errorText
            });
          }
        }
      }
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