# Project Agent Configuration

## Core Behavioral Rules

### Permission-Based
- ⛔ **DON'T delete anything** without explicit approval
- 🚫 **ASK permission** before each major change
- ✅ Proceed with small fixes and documentation

### Code Standards
- Use **TypeScript strictly** (no `any` types)
- Follow **existing code patterns** in the project
- Prioritize **code readability** over cleverness
- Check for **existing components** before creating new ones
- Use **shadcn/ui components** from `/components/ui`

## Project Type
Next.js 14+ Full-Stack B2B Marketplace Platform

## Tech Stack
- **Frontend**: React 18, TypeScript, Next.js App Router, Tailwind CSS
- **Components**: shadcn/ui library
- **State**: React Context (Auth, Favorites, Subscriptions, Notifications)
- **API**: Centralized apiClient in `/lib/api/client`
- **Styling**: Tailwind CSS + PostCSS

## Key Directory Structure
```
/app                    → Pages and routes (with route groups)
/components
  ├── /ui              → shadcn/ui base components
  ├── /auth            → Auth-related components
  ├── /admin           → Admin-specific components
  ├── /home            → Homepage sections
  └── ...              → Other feature components
/lib
  ├── /api             → API utilities and clients
  ├── /roles           → Role management
  ├── /i18n            → Internationalization
  ├── auth-context.tsx → Authentication state
  ├── typzh.ts         → Shared TypeScript types
  └── utils.ts         → Helper utilities
/hooks                  → Custom React hooks
/styles                 → Global styles
```

## Code Organization Rules

### Components
- Location: `/components/{feature}/{component-name}.tsx`
- Naming: PascalCase
- Export with index if needed
- Use hooks from `/hooks`
- Import types from `/lib/typzh.ts`

### Pages & Routes
- Location: `/app/(route-group)/feature/page.tsx`
- Use route groups like: `(adminDashboard)`, `(auth)`, `(public)`
- Server components by default (mark `use client` if needed)

### API Communication
```typescript
import { apiClient } from "@/lib/api/client"
// Use centralized client for all API calls
```

### Authentication
```typescript
import { useAuth } from "@/lib/auth-context"
const { user, isAuthenticated } = useAuth()
```

## What NOT To Do ❌
- Don't hardcode values (use environment variables)
- Don't create duplicate components
- Don't ignore TypeScript errors
- Don't use inline styles
- Don't make breaking changes to shared utilities
- Don't commit to main without review
- Don't modify package.json carelessly

## Common Workflows

### Adding a New Page
1. Create folder: `/app/(group)/feature/`
2. Add `page.tsx` with route
3. Use existing layouts
4. Import types from `/lib/typzh.ts`

### Creating a Component
1. Check `/components/ui` first
2. Create: `/components/feature/component-name.tsx`
3. Export as default
4. Add prop types
5. Use Tailwind for styling

### Making API Calls
1. Use `apiClient` from `/lib/api/client`
2. Handle errors properly
3. Use `useToast()` for user feedback
4. Type responses with interfaces

## Restrictions & Sensitive Areas
- 🔒 **Don't modify**: `.env.local`, `tsconfig.json` (without approval)
- 🔐 **Be careful with**: Authentication flows, role-based access
- ⚠️ **Ask first**: Database migrations, schema changes
- 📝 **Document**: New API endpoints, utility functions

## Before You Start
1. Read the codebase context
2. Check existing patterns
3. Run `pnpm dev` to test
4. Look for similar implementations
5. Verify TypeScript compiles

## Useful Commands
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm type-check   # Check TypeScript
```

---

**Last Updated**: May 5, 2026