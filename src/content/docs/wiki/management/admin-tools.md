---
title: Admin Tools & Controls
description: Administrative tools and system controls for management team
---

# ⚙️ Administrative Tools & Controls

Management-only administrative interface and system controls.

## User Management Tools

### Current System Status
- **Total Users**: 48
- **Management**: 2 users (org:admin)
- **Working Group**: 46 users (org:member)
- **Organization**: Product Foundry AI

### Admin Actions
- User role modifications
- Organization membership management
- Access control configuration
- Audit log reviews

## System Configuration

### Environment Settings
```
CLERK_SECRET_KEY: [REDACTED]
ORGANIZATION_ID: org_30MZadhJc6MCmbqQSWUmy54gTJq
```

### API Endpoints (Management Only)
- `/api/admin/users` - User management
- `/api/admin/roles` - Role assignment
- `/api/admin/audit` - Security audit logs
- `/api/admin/config` - System configuration

## Security Monitoring

### Recent Access Attempts
- Failed login attempts: 0
- Unauthorized access attempts: 0
- Permission escalation attempts: 0

### Access Control Tests
This page serves as a test for our access control system:

1. **Management users** should see this content ✅
2. **Working group members** should be blocked ❌
3. **Public users** should be blocked ❌

---

## 🧪 Test Instructions

To verify access control is working:

1. **Log in as a management user** → Should see this page
2. **Log in as a working group member** → Should get "Access Denied"
3. **Access without login** → Should redirect to sign-in

**Security Note**: If non-management users can see this page, immediate security review required!

---

*Administrative access verified: [TIMESTAMP]*