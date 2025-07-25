# Admin Tools

Bulk user management tools for Clerk authentication system.

## User Management Scripts

### Core Admin Tools (Keep)
- `create-all-users.ts` - Bulk create users from config/members.json
- `list-all-users.ts` - List all users in the system  
- `delete-incorrect-users.ts` - Clean up incorrectly created users
- `verify-all-users.ts` - Verify user data and organization membership

### Usage
Access these tools via API endpoints:
- `GET /api/list-all-users` - View all users
- `POST /api/create-all-users` - Bulk create users
- `POST /api/verify-all-users` - Verify user setup

### Configuration
User data is sourced from `config/members.json`:
- Management users get `org:admin` role
- Working group users get `org:member` role
- All users added to Product Foundry AI organization

### Environment
Requires `CLERK_SECRET_KEY` in `.env` file.