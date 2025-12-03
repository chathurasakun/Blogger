-- Query to see all users in the database
SELECT * FROM "User";

-- Query to see all users with their tenant information (more useful)
SELECT 
    u.id,
    u.email,
    u."tenantId",
    t.name AS tenant_name,
    t.domain AS tenant_domain,
    t.theme AS tenant_theme
FROM "User" u
LEFT JOIN "Tenant" t ON u."tenantId" = t.id
ORDER BY t.name, u.email;

-- Count users per tenant
SELECT 
    t.name AS tenant_name,
    t.domain AS tenant_domain,
    COUNT(u.id) AS user_count
FROM "Tenant" t
LEFT JOIN "User" u ON t.id = u."tenantId"
GROUP BY t.id, t.name, t.domain
ORDER BY t.name;

-- Query to see all sessions
SELECT * FROM "Session";

-- Query to see all sessions with user and tenant information
SELECT 
    s.id AS session_id,
    s."userId",
    u.email AS user_email,
    s."tenantId",
    t.name AS tenant_name,
    t.domain AS tenant_domain,
    s."expiresAt",
    CASE 
        WHEN s."expiresAt" > NOW() THEN 'Active'
        ELSE 'Expired'
    END AS status
FROM "Session" s
LEFT JOIN "User" u ON s."userId" = u.id
LEFT JOIN "Tenant" t ON s."tenantId" = t.id
ORDER BY s."expiresAt" DESC;

