#!/usr/bin/env node
/**
 * Secure SQL query runner that uses DATABASE_URL from environment variables
 * Usage: npx tsx prisma/scripts/run-query.ts <path-to-sql-file>
 */

import { config } from "dotenv";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve } from "path";

// Load environment variables from .env file
config();

const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error("❌ Error: No SQL file specified");
  console.error("💡 Usage: npx tsx prisma/scripts/run-query.ts <path-to-sql-file>");
  process.exit(1);
}

const resolvedPath = resolve(process.cwd(), sqlFile);

if (!existsSync(resolvedPath)) {
  console.error(`❌ Error: SQL file not found: ${resolvedPath}`);
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ Error: DATABASE_URL environment variable is not set");
  console.error("💡 Please set it in your .env file or export it:");
  console.error("   export DATABASE_URL='postgresql://user:pass@host:port/db?schema=public'");
  process.exit(1);
}

try {
  // Remove query parameters from DATABASE_URL for psql (psql doesn't support ?schema=public)
  const urlWithoutQuery = databaseUrl.split("?")[0];
  
  // Use psql to execute the SQL file
  const psqlPath = "/opt/homebrew/opt/postgresql@16/bin/psql";
  execSync(`${psqlPath} "${urlWithoutQuery}" -f "${resolvedPath}"`, {
    stdio: "inherit",
  });
} catch (error) {
  console.error("❌ Error executing SQL file");
  process.exit(1);
}

