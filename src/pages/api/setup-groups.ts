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
    groupsCreated: [] as any[],
    userUpdates: [] as any[],
    errors: [] as any[]
  };

  try {
    // Define groups
    const groups = [
      { name: 'public', description: 'Public users with basic access' },
      { name: 'working_group', description: 'Working group members with enhanced access' },
      { name: 'management', description: 'Management team with full access' }
    ];

    // Create groups (Clerk doesn't have built-in groups, so we'll use metadata)
    // We'll update ravi.shamihoke@productfoundry.ai with management role
    const userResponse = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const users = await userResponse.json();
    
    // Find ravi.shamihoke@productfoundry.ai
    const raviUser = users.find((user: any) => 
      user.email_addresses?.[0]?.email_address === 'ravi.shamihoke@productfoundry.ai'
    );
    
    if (raviUser) {
      // Update user metadata to include role
      const updateResponse = await fetch(`https://api.clerk.com/v1/users/${raviUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          public_metadata: {
            role: 'management'
          }
        })
      });
      
      if (updateResponse.ok) {
        const updatedUser = await updateResponse.json();
        results.userUpdates.push({
          id: raviUser.id,
          email: 'ravi.shamihoke@productfoundry.ai',
          role: 'management',
          success: true
        });
      } else {
        const error = await updateResponse.text();
        results.errors.push({
          user: 'ravi.shamihoke@productfoundry.ai',
          error: error
        });
      }
    }

    // Working group members list
    const workingGroupMembers = [
      'amelia.martinez@productfoundry.ai',
      'benjamin.harris@productfoundry.ai',
      'charlotte.thompson@productfoundry.ai',
      'daniel.clark@productfoundry.ai',
      'emma.wilson@productfoundry.ai',
      'felix.anderson@productfoundry.ai',
      'grace.robinson@productfoundry.ai',
      'henry.mitchell@productfoundry.ai',
      'isabella.taylor@productfoundry.ai',
      'jackson.lee@productfoundry.ai',
      'katherine.davis@productfoundry.ai',
      'liam.johnson@productfoundry.ai',
      'mia.brown@productfoundry.ai',
      'noah.garcia@productfoundry.ai',
      'olivia.rodriguez@productfoundry.ai',
      'peter.williams@productfoundry.ai',
      'quinn.jones@productfoundry.ai',
      'rachel.smith@productfoundry.ai',
      'samuel.miller@productfoundry.ai',
      'tessa.moore@productfoundry.ai',
      'uma.patel@productfoundry.ai',
      'vincent.kumar@productfoundry.ai',
      'wendy.zhang@productfoundry.ai',
      'xavier.martin@productfoundry.ai',
      'yasmine.ahmed@productfoundry.ai',
      'zachary.thomas@productfoundry.ai',
      'alice.cooper@productfoundry.ai',
      'brian.evans@productfoundry.ai',
      'clara.baker@productfoundry.ai',
      'david.green@productfoundry.ai',
      'eva.hill@productfoundry.ai',
      'frank.adams@productfoundry.ai',
      'gina.campbell@productfoundry.ai',
      'harry.wright@productfoundry.ai',
      'iris.scott@productfoundry.ai',
      'john.parker@productfoundry.ai',
      'karen.torres@productfoundry.ai',
      'leo.nguyen@productfoundry.ai',
      'maya.phillips@productfoundry.ai',
      'nathan.edwards@productfoundry.ai',
      'ophelia.collins@productfoundry.ai',
      'paul.stewart@productfoundry.ai',
      'quincy.sanchez@productfoundry.ai',
      'rose.morris@productfoundry.ai',
      'steve.murphy@productfoundry.ai',
      'tina.cook@productfoundry.ai',
      'ursula.bailey@productfoundry.ai'
    ];

    // Store working group members in our results for reference
    results.workingGroupMembers = workingGroupMembers;
    results.summary = {
      groups: groups,
      managementUsers: ['ravi.shamihoke@productfoundry.ai'],
      workingGroupCount: workingGroupMembers.length,
      publicUsers: 'All other users'
    };
    
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};