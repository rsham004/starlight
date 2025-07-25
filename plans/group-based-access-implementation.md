# Group-Based Access Implementation Plan

## Current Status

### ✅ What's Working
1. **Organization Exists**: "Product Foundry AI" (slug: product-foundry-ai)
2. **Admin User**: ravi.shamihoke@productfoundry.ai has org:admin role
3. **User Metadata Roles**: Currently using public_metadata for roles (public, working_group, management)
4. **Basic Access Control**: Middleware checks user roles for protected routes

### ❌ Issue Found
- **Organizations are disabled** in Clerk instance settings (`organizationsEnabled: false`)
- This means we cannot fully utilize Clerk's organization features

## Implementation Plan

### Option 1: Enable Organizations (Recommended)
**Prerequisites**: Enable organizations in Clerk Dashboard

1. **Enable Organizations in Clerk**
   - Go to Clerk Dashboard → Settings → Organizations
   - Enable organizations feature
   - Configure organization settings

2. **Migrate to Organization-Based Groups**
   ```typescript
   // Create organization roles
   - management: Full access to all content
   - working_group: Access to working group + public content  
   - public: Access to public content only
   ```

3. **Update User Management**
   - Add all working group members to "Product Foundry AI" organization
   - Assign appropriate roles within the organization
   - Remove user-level metadata roles

4. **Update Middleware**
   ```typescript
   // Check organization membership and roles
   const orgMembership = await clerkClient.organizations.getOrganizationMembershipList({
     organizationId: 'org_30MZadhJc6MCmbqQSWUmy54gTJq',
     userId: authResult.userId
   });
   ```

### Option 2: Continue with Current Metadata Approach (If Orgs Stay Disabled)

1. **Enhance Current System**
   - Keep using public_metadata for roles
   - Create admin interface to manage user roles
   - Add bulk user import for working group members

2. **Create Role Management API**
   ```typescript
   // API endpoints for role management
   - POST /api/admin/assign-role
   - GET /api/admin/users-by-role
   - POST /api/admin/bulk-import
   ```

3. **Add Features**
   - Role assignment on signup based on email domain
   - Admin dashboard for user management
   - Audit log for role changes

## Recommended Actions

### Immediate Steps
1. **Check Clerk Plan**: Organizations might require a paid plan
2. **Decision Point**: Enable organizations or enhance metadata approach
3. **Bulk Import**: Add remaining 46 working group members

### Implementation Timeline
- **Phase 1** (Now): Decision on approach
- **Phase 2** (1 day): Implement chosen approach
- **Phase 3** (1 day): Bulk import users and test
- **Phase 4** (1 day): Create admin interface

## Technical Implementation Details

### If Organizations Enabled:
```typescript
// 1. Create organization roles
const roles = [
  { key: 'management', name: 'Management', permissions: ['all'] },
  { key: 'working_group', name: 'Working Group', permissions: ['working_group', 'public'] },
  { key: 'member', name: 'Member', permissions: ['public'] }
];

// 2. Add users to organization with roles
await clerkClient.organizations.createOrganizationMembership({
  organizationId: 'org_30MZadhJc6MCmbqQSWUmy54gTJq',
  userId: 'user_id',
  role: 'working_group'
});

// 3. Update middleware to check org membership
const membership = await clerkClient.organizations.getOrganizationMembership({
  organizationId: 'org_30MZadhJc6MCmbqQSWUmy54gTJq',
  userId: userId
});
```

### If Continuing with Metadata:
```typescript
// 1. Bulk assign roles
const workingGroupEmails = [...]; // 47 emails
for (const email of workingGroupEmails) {
  const user = await clerkClient.users.getUserList({ emailAddress: email });
  if (user) {
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: { role: 'working_group' }
    });
  }
}

// 2. Create management UI
- User list with role filters
- Role assignment interface
- Bulk import from CSV
- Activity logs
```

## Benefits of Each Approach

### Organizations Approach
✅ Native Clerk feature
✅ Better scalability
✅ Built-in permissions system
✅ Organization-level settings
❌ May require paid plan
❌ Need to enable in settings

### Metadata Approach
✅ Works immediately
✅ No plan changes needed
✅ Simple implementation
❌ Manual role management
❌ Less scalable
❌ No built-in permissions

## Next Steps
1. Check if organizations can be enabled in your Clerk plan
2. Choose approach based on availability
3. Implement bulk user import
4. Create admin interface for role management