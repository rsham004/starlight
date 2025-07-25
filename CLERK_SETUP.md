# Clerk Authentication Setup Instructions

Following the official [Clerk Astro Quickstart](https://clerk.com/docs/quickstarts/astro)

## Prerequisites

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application in your Clerk dashboard
3. Choose "Astro" as your framework

## Installation & Configuration

### 1. Dependencies Already Installed
```bash
# Already completed:
npm install @clerk/astro @astrojs/node
```

### 2. Environment Variables
Create/update `.env` file with your Clerk keys:
```bash
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

**To get your keys:**
1. Go to your Clerk Dashboard
2. Select your application
3. Go to "API Keys" in the sidebar
4. Copy the "Publishable key" and "Secret key"

### 3. Configuration Files
The following files have been configured according to Clerk documentation:

**astro.config.mjs** - SSR adapter and Clerk integration:
```javascript
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [clerk()],
});
```

**src/middleware.ts** - Authentication middleware:
```typescript
import { clerkMiddleware } from '@clerk/astro/server';
export const onRequest = clerkMiddleware();
```

## Role Configuration in Clerk

### Set up User Roles

Following Clerk best practices, roles are stored in `public_metadata`:

1. In your Clerk dashboard, go to **Users & Authentication** > **Users**
2. For each user that needs special access, click on their profile
3. Go to the **Public metadata** tab
4. Add the following metadata structure:

**For Working Group Members:**
```json
{
  "roles": ["working-group"]
}
```

**For Management (includes working group access):**
```json
{
  "roles": ["management"]
}
```

**For Admin (Ravi - full system access):**
```json
{
  "roles": ["management", "admin"]
}
```

**Note:** Users with "management" role automatically get access to working group content as well.

### Member Email List

The following emails have been configured for working group access:
- abirathamir@gmail.com
- alex.coaton@gmail.com
- allison9y@gmail.com
- amirtha05032000@gmail.com
- arorarajat0912@gmail.com
- ashok@askaconsulting.com
- bharathssa16@gmail.com
- cathyofnz@gmail.com
- cgbarlow@gmail.com
- chainat@gmail.com
- clareivers@gmail.com
- d1643146364@gmail.com
- dandyhello@gmail.com
- daniel.pruessner@gmail.com
- dave.braendler@productfoundry.ai
- dilip.ladhani@gmail.com
- easybishal@gmail.com
- evanlee123@utexas.edu
- glenn.ramsey.nz@gmail.com
- gvenkat7@outlook.com
- kylejaycampbell@gmail.com
- mail@dkkim.com
- mark.egan@forgant.com
- martin@return2health.net
- meetup@complexity.com.au
- mick.hobart@gmail.com
- mohd.azeemuddin@gmail.com
- nedhorvath@utexas.edu
- nexus1234@gmail.com
- nigamayush6@gmail.com
- niraj411k@gmail.com
- nirankarjaiswar@gmail.com
- oliviadong2918@gmail.com
- onats.ong@gmail.com
- pappes@gmail.com
- pranavgoyal.work@gmail.com
- praveenchukkala07@gmail.com
- ravi.shamihoke@productfoundry.ai
- schnell18@gmail.com
- shahriarmdgolam@gmail.com
- shahsimoni891@gmail.com
- sharat@intuneai.com.au
- sillva@gmail.com
- susanwangds@gmail.com
- tomo@tomoLennox.com
- varad@neuralhiive.ai
- vignesh.nadarajah@gmail.com
- yakernz@gmail.com

## Access Levels

### Public Access
- No authentication required
- Access to all content in `/src/content/docs/` (excluding subdirectories)

### Working Group Access
- Requires authentication and "working-group" role
- Access to `/working-group/*` content
- Includes IP contribution guidelines and internal documentation

### Management Access
- Requires authentication and "management" role
- Access to `/management/*` content
- Full administrative capabilities

## Setting Up Admin Account (Ravi)

### How Clerk Authentication Works
Clerk doesn't use pre-set passwords. Instead, users create their own secure accounts through:
- Email verification
- Social login (Google, GitHub, etc.)
- Magic links
- Their own chosen password

### Steps to Set Up Ravi's Admin Account

1. **Option A - Ravi Creates Account:**
   - Ravi visits your site at `http://localhost:4321`
   - Clicks "Sign Up"
   - Uses email: `ravi.shamihoke@productfoundry.ai`
   - Creates his own secure password
   - Verifies email

2. **Option B - Admin Invitation (Recommended):**
   - In Clerk Dashboard → Users → "Invite Users"
   - Enter: `ravi.shamihoke@productfoundry.ai`
   - Ravi receives email invitation
   - Sets up his own password during first login

3. **After Account Creation - Assign Admin Role:**
   - Go to Clerk Dashboard → Users
   - Find Ravi's account
   - Click on his profile
   - Go to "Public metadata" tab
   - Add:
   ```json
   {
     "roles": ["management", "admin"]
   }
   ```

### Security Benefits
- No shared passwords
- Each user has unique, secure credentials
- Built-in email verification
- Password reset functionality
- Multi-factor authentication available

## Testing the Setup

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Authentication Flow
1. Visit your site at `http://localhost:4321`
2. Try accessing protected routes:
   - `/working-group` - Should redirect to sign-in if not authenticated
   - `/management` - Should redirect to sign-in if not authenticated
3. Sign up or sign in using the authentication buttons
4. After authentication, verify role-based access works correctly

### 3. Test Role-Based Access
1. Create test users in Clerk dashboard
2. Assign roles via public metadata
3. Test that users can only access appropriate sections

## Quick Setup Checklist

- [ ] Clerk account created and application configured
- [ ] Environment variables set in `.env` file
- [ ] User roles configured in Clerk dashboard public metadata
- [ ] Test users created with appropriate roles
- [ ] Authentication flow tested end-to-end

## Troubleshooting

**Common Issues:**
- **Build errors**: Ensure you have the Node.js adapter installed and SSR configured
- **Authentication not working**: Check environment variables are properly set
- **Role access denied**: Verify roles are set in `public_metadata` (not private metadata)
- **Middleware errors**: Ensure middleware is in `src/middleware.ts`

**Debug Steps:**
1. Check browser console for errors
2. Verify Clerk keys in dashboard match `.env` file
3. Test with a simple user without roles first
4. Check that user metadata is properly structured in Clerk dashboard