import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  const orgId = 'org_30MZadhJc6MCmbqQSWUmy54gTJq';
  
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Missing secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const results = {
    timestamp: new Date().toISOString(),
    created: [] as any[],
    skipped: [] as any[],
    errors: [] as any[],
    summary: {} as any
  };

  // All 47 working group members
  const workingGroupMembers = [
    { email: 'amelia.martinez@productfoundry.ai', firstName: 'Amelia', lastName: 'Martinez' },
    { email: 'benjamin.harris@productfoundry.ai', firstName: 'Benjamin', lastName: 'Harris' },
    { email: 'charlotte.thompson@productfoundry.ai', firstName: 'Charlotte', lastName: 'Thompson' },
    { email: 'daniel.clark@productfoundry.ai', firstName: 'Daniel', lastName: 'Clark' },
    { email: 'emma.wilson@productfoundry.ai', firstName: 'Emma', lastName: 'Wilson' },
    { email: 'felix.anderson@productfoundry.ai', firstName: 'Felix', lastName: 'Anderson' },
    { email: 'grace.robinson@productfoundry.ai', firstName: 'Grace', lastName: 'Robinson' },
    { email: 'henry.mitchell@productfoundry.ai', firstName: 'Henry', lastName: 'Mitchell' },
    { email: 'isabella.taylor@productfoundry.ai', firstName: 'Isabella', lastName: 'Taylor' },
    { email: 'jackson.lee@productfoundry.ai', firstName: 'Jackson', lastName: 'Lee' },
    { email: 'katherine.davis@productfoundry.ai', firstName: 'Katherine', lastName: 'Davis' },
    { email: 'liam.johnson@productfoundry.ai', firstName: 'Liam', lastName: 'Johnson' },
    { email: 'mia.brown@productfoundry.ai', firstName: 'Mia', lastName: 'Brown' },
    { email: 'noah.garcia@productfoundry.ai', firstName: 'Noah', lastName: 'Garcia' },
    { email: 'olivia.rodriguez@productfoundry.ai', firstName: 'Olivia', lastName: 'Rodriguez' },
    { email: 'peter.williams@productfoundry.ai', firstName: 'Peter', lastName: 'Williams' },
    { email: 'quinn.jones@productfoundry.ai', firstName: 'Quinn', lastName: 'Jones' },
    { email: 'rachel.smith@productfoundry.ai', firstName: 'Rachel', lastName: 'Smith' },
    { email: 'samuel.miller@productfoundry.ai', firstName: 'Samuel', lastName: 'Miller' },
    { email: 'tessa.moore@productfoundry.ai', firstName: 'Tessa', lastName: 'Moore' },
    { email: 'uma.patel@productfoundry.ai', firstName: 'Uma', lastName: 'Patel' },
    { email: 'vincent.kumar@productfoundry.ai', firstName: 'Vincent', lastName: 'Kumar' },
    { email: 'wendy.zhang@productfoundry.ai', firstName: 'Wendy', lastName: 'Zhang' },
    { email: 'xavier.martin@productfoundry.ai', firstName: 'Xavier', lastName: 'Martin' },
    { email: 'yasmine.ahmed@productfoundry.ai', firstName: 'Yasmine', lastName: 'Ahmed' },
    { email: 'zachary.thomas@productfoundry.ai', firstName: 'Zachary', lastName: 'Thomas' },
    { email: 'alice.cooper@productfoundry.ai', firstName: 'Alice', lastName: 'Cooper' },
    { email: 'brian.evans@productfoundry.ai', firstName: 'Brian', lastName: 'Evans' },
    { email: 'clara.baker@productfoundry.ai', firstName: 'Clara', lastName: 'Baker' },
    { email: 'david.green@productfoundry.ai', firstName: 'David', lastName: 'Green' },
    { email: 'eva.hill@productfoundry.ai', firstName: 'Eva', lastName: 'Hill' },
    { email: 'frank.adams@productfoundry.ai', firstName: 'Frank', lastName: 'Adams' },
    { email: 'gina.campbell@productfoundry.ai', firstName: 'Gina', lastName: 'Campbell' },
    { email: 'harry.wright@productfoundry.ai', firstName: 'Harry', lastName: 'Wright' },
    { email: 'iris.scott@productfoundry.ai', firstName: 'Iris', lastName: 'Scott' },
    { email: 'john.parker@productfoundry.ai', firstName: 'John', lastName: 'Parker' },
    { email: 'karen.torres@productfoundry.ai', firstName: 'Karen', lastName: 'Torres' },
    { email: 'leo.nguyen@productfoundry.ai', firstName: 'Leo', lastName: 'Nguyen' },
    { email: 'maya.phillips@productfoundry.ai', firstName: 'Maya', lastName: 'Phillips' },
    { email: 'nathan.edwards@productfoundry.ai', firstName: 'Nathan', lastName: 'Edwards' },
    { email: 'ophelia.collins@productfoundry.ai', firstName: 'Ophelia', lastName: 'Collins' },
    { email: 'paul.stewart@productfoundry.ai', firstName: 'Paul', lastName: 'Stewart' },
    { email: 'quincy.sanchez@productfoundry.ai', firstName: 'Quincy', lastName: 'Sanchez' },
    { email: 'rose.morris@productfoundry.ai', firstName: 'Rose', lastName: 'Morris' },
    { email: 'steve.murphy@productfoundry.ai', firstName: 'Steve', lastName: 'Murphy' },
    { email: 'tina.cook@productfoundry.ai', firstName: 'Tina', lastName: 'Cook' },
    { email: 'ursula.bailey@productfoundry.ai', firstName: 'Ursula', lastName: 'Bailey' }
  ];

  try {
    // First check existing users to avoid duplicates
    const existingUsersResponse = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const existingUsers = await existingUsersResponse.json();
    const existingEmails = new Set(
      existingUsers.map((user: any) => user.email_addresses?.[0]?.email_address?.toLowerCase())
    );

    // Process each working group member
    for (const member of workingGroupMembers) {
      try {
        // Skip if user already exists
        if (existingEmails.has(member.email.toLowerCase())) {
          results.skipped.push({
            email: member.email,
            reason: 'User already exists'
          });
          continue;
        }

        // Create user with metadata
        const createUserResponse = await fetch('https://api.clerk.com/v1/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email_address: [member.email],
            password: 'Welcome@ProductFoundry2025!',
            first_name: member.firstName,
            last_name: member.lastName,
            skip_password_checks: false,
            skip_password_requirement: false,
            public_metadata: {
              role: 'working_group',
              organizationId: orgId,
              organizationRole: 'org:member'
            }
          })
        });

        if (createUserResponse.ok) {
          const newUser = await createUserResponse.json();
          
          // Add user to organization
          const addToOrgResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${secretKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: newUser.id,
              role: 'org:member'
            })
          });

          if (addToOrgResponse.ok) {
            results.created.push({
              email: member.email,
              userId: newUser.id,
              name: `${member.firstName} ${member.lastName}`,
              addedToOrg: true
            });
          } else {
            const orgError = await addToOrgResponse.text();
            results.created.push({
              email: member.email,
              userId: newUser.id,
              name: `${member.firstName} ${member.lastName}`,
              addedToOrg: false,
              orgError: orgError
            });
          }
        } else {
          const errorData = await createUserResponse.json();
          results.errors.push({
            email: member.email,
            error: errorData.errors?.[0]?.long_message || 'Failed to create user',
            details: errorData
          });
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        results.errors.push({
          email: member.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Get final stats
    const finalUsersResponse = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const finalUsers = await finalUsersResponse.json();
    const finalOrgMembersResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships?limit=100`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const finalOrgMembers = await finalOrgMembersResponse.json();
    const orgMembersList = finalOrgMembers.data || finalOrgMembers || [];

    results.summary = {
      totalWorkingGroupMembers: workingGroupMembers.length,
      created: results.created.length,
      skipped: results.skipped.length,
      errors: results.errors.length,
      totalUsersInSystem: finalUsers.length,
      totalOrgMembers: orgMembersList.length,
      workingGroupInOrg: orgMembersList.filter((m: any) => 
        m.public_user_data?.identifier?.includes('@productfoundry.ai')
      ).length
    };

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