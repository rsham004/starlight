import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  
  if (!secretKey) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Server configuration error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await request.json();
    const { email, password, firstName, lastName } = formData;
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'All fields are required: email, password, first name, and last name' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if email is in working group list
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

    const isWorkingGroupMember = workingGroupMembers.includes(email.toLowerCase());
    const role = isWorkingGroupMember ? 'working_group' : 'public';

    // Use the EXACT same API call that works in our tests
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
        skip_password_requirement: false,
        public_metadata: {
          role: role
        }
      })
    });

    const responseData = await response.json();
    
    if (response.ok) {
      // Success - user created
      const userId = responseData.id;
      
      // Add user to organization
      const orgId = 'org_30MZadhJc6MCmbqQSWUmy54gTJq';
      const orgRole = email === 'ravi.shamihoke@productfoundry.ai' ? 'org:admin' : 'org:member';
      
      try {
        // Add to organization
        const orgResponse = await fetch(`https://api.clerk.com/v1/organizations/${orgId}/memberships`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${secretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            role: orgRole
          })
        });
        
        if (!orgResponse.ok) {
          console.error('Failed to add user to organization:', await orgResponse.text());
        }
      } catch (error) {
        console.error('Error adding user to organization:', error);
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Account created successfully!',
        userId: userId,
        email: email,
        role: role,
        organizationRole: orgRole
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Failed - return Clerk's error
      return new Response(JSON.stringify({
        success: false,
        error: responseData.errors?.[0]?.long_message || 'Failed to create account',
        details: responseData
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};