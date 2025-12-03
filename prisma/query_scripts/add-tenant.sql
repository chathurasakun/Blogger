-- Do not run this --
---------------------
-- Add tenant for tenanta.localhost:3004
INSERT INTO "Tenant" (id, name, domain, theme)
VALUES (
  gen_random_uuid(),
  'tenanta',
  'tenanta.localhost:3004',
  'emerald'
)
ON CONFLICT (domain) DO NOTHING;

-- Verify the tenant was added
SELECT id, name, domain, theme FROM "Tenant" WHERE domain = 'tenanta.localhost:3004';

-- You can follow this pattern
-- /opt/homebrew/opt/postgresql@16/bin/psql postgresql://blogger:bloggerpassword@localhost:5432/blogger -c 'SELECT * FROM "Session";'

