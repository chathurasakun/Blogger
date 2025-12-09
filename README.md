# Blogger

A Next.js-based multi-tenant SaaS application for creating and managing blogs with customizable themes, user authentication, and social features like blog posts.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Tailwind CSS** - Styling framework
- **bcryptjs** - Password hashing
- **React** - UI library
- **Cookie-based Auth** - Session management with secure cookies
- **Subdomain-based Tenant Resolution** - Multi-tenant routing via middleware.ts

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm

## Quick Start

### 1. Clone and Install

```bash
cd blogger
npm install
```

### 2. Configure Environment

```bash
cp .env.sample .env
```

Edit `.env` and set your `DATABASE_URL` (replace placeholders with your actual values):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blogger?schema=public"
```

> **Note:** Replace `user`, `password`, and `blogger` with your actual PostgreSQL username, password, and database name.

> **Note:** The `.env.sample` file provides additional guidance for setting up the database URL. Currently, the application uses a local PostgreSQL database.

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 4. Start the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm run start
```

The application will be available at `http://localhost:3000`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (includes Prisma client generation) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run db:health` | Test database connection |
| `npm run db:query` | Run SQL query scripts |

## Project Structure

```
blogger/
├── app/
│   ├── (base)/
│   │   └── page.tsx              # Home page
│   ├── api/
│   │   ├── login/               # Login API endpoint
│   │   ├── logout/              # Logout API endpoint
│   │   ├── posts/               # Posts API endpoints
│   │   │   ├── [id]/            # Individual post operations
│   │   │   │   ├── like/        # Like/unlike endpoint
│   │   │   │   └── route.ts     # GET, PUT, DELETE post
│   │   │   └── route.ts         # GET all, POST create
│   │   ├── signup/              # Signup API endpoint
│   │   └── tenant/
│   │       ├── settings/        # Tenant settings API
│   │       └── upload-logo/     # Logo upload API
│   ├── dashboard/               # Dashboard page (protected)
│   ├── tenant/
│   │   ├── login/               # Tenant login page
│   │   └── signup/              # Tenant signup page
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/
│   ├── atoms/                   # Basic UI components
│   │   ├── Button.tsx
│   │   ├── OptimizedImage.tsx
│   │   ├── TextArea.tsx
│   │   └── TextField.tsx
│   ├── molecules/               # Composite components
│   │   ├── AdminBadge.tsx
│   │   ├── BlogLogo.tsx
│   │   ├── DomainSelector.tsx
│   │   ├── Modal.tsx
│   │   ├── Popover.tsx
│   │   ├── PostCard.tsx
│   │   ├── PrimaryActionButton.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SecondaryActionButton.tsx
│   │   ├── SignOutButton.tsx
│   │   ├── TenantNotFound.tsx
│   │   └── TenantSelector.tsx
│   └── organisms/               # Complex components
│       ├── CreatePostContainer.tsx
│       ├── CreatePostForm.tsx
│       ├── Header.tsx
│       ├── LoginForm.tsx
│       ├── PostsContainer.tsx
│       ├── PostsList.tsx
│       ├── PostsSection.tsx
│       ├── SettingsContainer.tsx
│       ├── SettingsForm.tsx
│       └── SignUpForm.tsx
├── hooks/                       # Custom React hooks
│   ├── useCreatePost.ts
│   ├── useDeletePost.ts
│   ├── useLikePost.ts
│   ├── useLogin.ts
│   ├── useSignOut.ts
│   ├── useSignUp.ts
│   ├── useUpdatePost.ts
│   └── useUpdateTenantSettings.ts
├── lib/                         # Utility libraries
│   ├── auth.ts                  # Authentication utilities
│   ├── env.ts                   # Environment validation
│   ├── password.ts              # Password hashing utilities
│   ├── posts.ts                 # Post-related utilities
│   ├── prisma.ts                # Prisma client instance
│   ├── rate-limit.ts           # Rate limiting utilities
│   ├── tenants.ts               # Tenant utilities
│   ├── themes.ts                # Theme configuration
│   └── users.ts                 # User utilities
├── prisma/
│   ├── migrations/              # Database migrations
│   ├── query_scripts/           # SQL query scripts
│   ├── scripts/                 # Database utility scripts
│   ├── schema.prisma            # Database schema
│   └── test-db-connection.ts    # Database connection test
├── public/
│   └── uploads/
│       └── tenants/             # Tenant logo uploads
├── middleware.ts                # Next.js middleware for auth & tenant routing
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json
```

## Multi-Tenant Architecture

The application supports multi-tenancy through subdomain-based routing. Each tenant can have their own:
- Custom domain/subdomain
- Blog name and logo
- Theme customization
- Isolated user base and posts

### Development Setup

For local development, you can access different tenants using:
- `http://tenanta.localhost:3000`
- `http://tenantb.localhost:3000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |

Example (replace placeholders with your actual values):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/blogger?schema=public"
```

## Database Management

Make sure to add these to your database `Tenant table to setup few tenants to proceed.
```
tenanta.localhost:3004
tenantb.localhost:3004
```

### Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name
```

### Test Database Connection

```bash
npm run db:health
```

## Features

- **Multi-tenant Support** - Isolated tenant spaces with custom branding
- **User Authentication** - Secure login/signup with session management
- **Role-based Access** - Admin and member roles
- **Blog Management** - Create, read, update, and delete posts
- **Social Features** - Like posts
- **Theme Customization** - Multiple theme options per tenant
- **Logo Upload** - Custom logo upload for tenants
- **Search** - Search functionality for posts

## License

MIT
