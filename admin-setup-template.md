# Admin Setup Instructions for Ravi

## Quick Setup Steps

### 1. Send This Message to Ravi:
```
Hi Ravi,

The AI Product Development Wiki is now set up with Clerk authentication. 

To access your admin account:
1. Visit: http://localhost:4321 (or the live site URL)
2. Click "Sign Up" 
3. Use your admin email: [ADMIN_EMAIL]
4. Create a secure password of your choice
5. Verify your email

Once you sign up, I'll assign you admin privileges in the Clerk dashboard.

Your admin access will include:
- Full management dashboard
- User role management
- Access to all wiki sections
- Administrative functions

Let me know when you've completed the signup!
```

### 2. After Ravi Signs Up:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to Users
3. Find admin account (`[ADMIN_EMAIL]`)
4. Click on his profile
5. Go to "Public metadata" tab
6. Add this JSON:
```json
{
  "roles": ["management", "admin"]
}
```
7. Save changes

### 3. Alternative - Use Clerk Invitations:
If you prefer to send an official invitation:
1. Clerk Dashboard → Users → "Invite Users"
2. Enter: `[ADMIN_EMAIL]`
3. Ravi gets an email invitation
4. He clicks the link and sets up his password
5. You then assign the admin roles as above

## Admin Privileges
With the admin role, Ravi will have access to:
- `/management/*` - Full admin dashboard
- `/working-group/*` - All working group content  
- All public wiki content
- User management capabilities (when implemented)