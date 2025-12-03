# Prisma Directory Structure

This directory contains database-related files for the Blogger application.

## Structure

```
prisma/
├── schema.prisma          # Prisma schema definition
├── migrations/            # Database migration files (auto-generated)
├── query_scripts/         # SQL query scripts for development/debugging
│   ├── query-users.sql   # User and session queries
│   └── add-tenant.sql    # Tenant management queries
└── scripts/               # Utility scripts
    ├── run-query.ts      # Secure SQL query runner
    └── test-db-connection.ts  # Database health check
```

## Security Best Practices

### ✅ Safe to Commit
- **Read-only queries** (SELECT statements)
- **Utility scripts** that use environment variables
- **Schema definitions** and migrations

### ❌ Never Commit
- **Hardcoded credentials** (passwords, API keys)
- **Connection strings with passwords** in source code
- **Destructive operations** (DROP, DELETE without WHERE) unless in migrations
- **Sensitive data** or production data

### 🔒 Using Environment Variables

All database connections should use the `DATABASE_URL` environment variable:

```bash
# In .env file (not committed to git)
DATABASE_URL=*********************
```

## Running SQL Scripts

### Option 1: Using npm script (recommended)
```bash
npm run db:query
```

### Option 2: Direct execution
```bash
npx tsx prisma/scripts/run-query.ts prisma/query_scripts/query-users.sql
```

### Option 3: Using psql directly (if DATABASE_URL is set)
```bash
psql "$DATABASE_URL" -f prisma/query_scripts/query-users.sql
```

## Database Health Check

Check database connection and statistics:
```bash
npm run db:health
```

