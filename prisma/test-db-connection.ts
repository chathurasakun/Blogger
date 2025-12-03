import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Tenant } from "../lib/tenants";

// Load environment variables from .env file
config();

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Testing database connection...\n");
  console.log("Connection URL: postgresql://blogger:***@localhost:5432/blogger\n");

  try {
    // Test connection by running a simple query
    await prisma.$connect();
    console.log("✅ Database connection successful!\n");

    // Get database info
    const tenantCount = await prisma.tenant.count();
    const userCount = await prisma.user.count();
    const sessionCount = await prisma.session.count();

    console.log("📊 Database Statistics:");
    console.log(`   Tenants: ${tenantCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Sessions: ${sessionCount}\n`);

    // List all tenants
    if (tenantCount > 0) {
      const tenants = await prisma.tenant.findMany({
        select: {
          id: true,
          name: true,
          domain: true,
          theme: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      console.log("📋 Tenants in database:");
      tenants.forEach((tenant: Tenant, index: number) => {
        console.log(`   ${index + 1}. ${tenant.name} (${tenant.domain}) - Theme: ${tenant.theme}`);
      });
    }

    console.log("\n✅ Database is up and running!");
  } catch (error: any) {
    console.error("❌ Database connection failed!");
    console.error("\nError details:");
    console.error(`   Message: ${error.message}`);

    if (error.code === "ECONNREFUSED") {
      console.error("\n💡 Possible issues:");
      console.error("   - PostgreSQL server is not running");
      console.error("   - Wrong port (expected: 5432)");
      console.error("   - Server is not listening on localhost");
    } else if (error.code === "P1001") {
      console.error("\n💡 Possible issues:");
      console.error("   - Cannot reach database server");
      console.error("   - Check if PostgreSQL is running: brew services list (on macOS)");
    } else if (error.code === "P1000") {
      console.error("\n💡 Possible issues:");
      console.error("   - Authentication failed");
      console.error("   - Check username/password");
      console.error("   - Check if database 'blogger' exists");
    }

    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("❌ Unexpected error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

