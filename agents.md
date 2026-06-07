# 🤝 Project Agent Configuration

**Last Updated**: May 5, 2026  
**Version**: 0.1.6

---

## 👥 TEAM COMPOSITION & ROLES

### Team Members
- **Backend Developer**: Laravel/PHP Developer
  - Responsible for: Backend APIs, database design, server-side logic
  - Technology: Laravel framework, Laravel Echo for real-time
  
- **Frontend Developer**: Senior Frontend Developer (User)
  - Responsible for: React/Next.js UI, API integration, frontend modifications
  - Technology: React, TypeScript, Next.js
  - **You are integrating all APIs and making modifications as needed**

- **Client**: Based in **Israel** 🇮🇱
  - **IMPORTANT**: Client is very strict about code quality, stability, and changes
  - Requires careful, well-tested implementations
  - Does not approve unnecessary changes or risky modifications

---

## ⚠️ CRITICAL: PERMISSION-BASED WORKFLOW

### 🚫 STRICT REQUIREMENTS (READ CAREFULLY!)

**You MUST ask permission BEFORE any of these actions:**

1. ❌ **DELETING** any files, components, functions, or code
2. ❌ **INSTALLING** new packages or dependencies
3. ❌ **UNINSTALLING** any existing packages
4. ❌ **MODIFYING** `package.json`, `tsconfig.json`, `next.config.mjs`
5. ❌ **CHANGING** authentication flow or security-related code
6. ❌ **REMOVING** API endpoints or integrations
7. ❌ **UPDATING** major dependencies without testing
8. ❌ **RESTRUCTURING** folders or moving files
9. ❌ **MODIFYING** `.env.local` or environment variables
10. ❌ **COMMENTING OUT** features without documenting reason

**These actions require explicit approval from the frontend developer (user).**

### ✅ ALLOWED WITHOUT ASKING

- ✅ Bug fixes (document the issue first)
- ✅ Adding new components or pages (following existing patterns)
- ✅ Integrating APIs that are already available from backend
- ✅ Small UI improvements or styling tweaks
- ✅ Updating documentation/README files
- ✅ Adding comments to clarify code
- ✅ TypeScript error fixes
- ✅ Code formatting and linting

---

## 📋 PROJECT OVERVIEW

### Project Type
**Next.js 14+ Full-Stack B2B Marketplace Platform**

### Architecture
```
Frontend (This Repository) ← API Integration ← Backend (Laravel)
    ↓
React 18 + TypeScript
Next.js App Router
shadcn/ui Components
Tailwind CSS
```

### Integration Pattern
- **Frontend**: Consumes APIs from Laravel backend
- **Backend**: Provides REST APIs with Laravel Echo for real-time updates
- **Communication**: Centralized API client in `/lib/api/client.ts`
- **Real-time**: WebSockets via Laravel Echo + Pusher.js

---

## 💻 COMPLETE TECHNOLOGY STACK

### Core Framework
- **Next.js** (v16.1.6) - Full-stack React framework with App Router
- **React** (v19.2.4) - UI library with hooks
- **React DOM** (v19.2.4) - React rendering for web
- **TypeScript** (v5.7.3) - Static typing for JavaScript

### UI Component Library
- **shadcn/ui** - Component library built on Radix UI
  - Full suite of components via Radix UI:
    - Accordion, Alert Dialog, Alert, Aspect Ratio, Avatar
    - Checkbox, Collapsible, Context Menu, Dialog, Dropdown Menu
    - Hover Card, Label, Menubar, Navigation Menu, Popover
    - Progress, Radio Group, Scroll Area, Select, Separator
    - Slider, Slot, Switch, Tabs, Toast, Toggle, Toggle Group, Tooltip

### Styling & CSS
- **Tailwind CSS** (v4.2.0) - Utility-first CSS framework
- **Tailwind CSS PostCSS** (v4.2.0) - PostCSS plugin for Tailwind
- **PostCSS** (v8.5) - CSS transformations
- **Autoprefixer** (v10.4.20) - Vendor prefixes for CSS
- **Tailwind Merge** (v3.3.1) - Merge Tailwind classes
- **tw-animate-css** (v1.3.3) - Animation utilities

### Form Handling & Validation
- **React Hook Form** (v7.54.1) - Performant forms with hooks
- **@hookform/resolvers** (v3.9.1) - Validation resolvers for Hook Form
- **Zod** (v3.24.1) - TypeScript-first schema validation

### HTTP & API
- **Axios** (v1.14.0) - HTTP client for API requests
- **Laravel Echo** (v2.3.4) - Laravel WebSocket real-time channel
- **Pusher JS** (v8.5.0) - WebSocket library for real-time updates

### UI Components & Icons
- **Lucide React** (v0.564.0) - Icon library with 500+ icons
- **React Icons** (v5.6.0) - Additional icon sets (FontAwesome, Bootstrap, etc.)
- **Class Variance Authority** (v0.7.1) - CSS-in-JS component variants

### Data & Utilities
- **Date FNS** (v4.1.0) - Date manipulation and formatting
- **React Day Picker** (v9.13.2) - Date picker component
- **CLSX** (v2.1.1) - Conditional className utilities
- **Vaul** (v1.1.2) - Drawer component library

### Carousel & Sliders
- **Embla Carousel React** (v8.6.0) - Carousel/slider component
- **React Resizable Panels** (v2.1.7) - Resizable panel layouts
- **Recharts** (v2.15.0) - React charting library

### Drag & Drop
- **dnd-kit Core** (v6.3.1) - Headless drag-and-drop system
- **dnd-kit Sortable** (v10.0.0) - Sortable functionality for dnd-kit
- **dnd-kit Utilities** (v3.2.2) - Utilities for dnd-kit

### User Input & Notifications
- **Input OTP** (v1.4.2) - OTP input component
- **Sonner** (v1.7.1) - Toast notification library
- **SweetAlert2** (v11.26.24) - Beautiful alert dialogs
- **CMDK** (v1.1.1) - Command menu/command palette

### Internationalization & Localization
- **React FlagPack** (v2.0.6) - Country flag icons and components

### Theming
- **Next Themes** (v0.4.6) - Dark/light theme support

### Analytics & Monitoring
- **Vercel Analytics** (v1.6.1) - Analytics from Vercel

### Development Tools
- **@types/node** (v22) - TypeScript types for Node.js
- **@types/react** (v19.2.14) - TypeScript types for React
- **@types/react-dom** (v19.2.3) - TypeScript types for React DOM
- **ESLint** - Code linting (configured in project)

---

## 🏗️ PROJECT STRUCTURE

```
/app                    → Next.js pages and routes (with route groups)
/components
  ├── /ui              → shadcn/ui base components
  ├── /auth            → Authentication components
  ├── /admin           → Admin-specific components
  ├── /home            → Homepage sections
  └── ...              → Other feature-specific components
/lib
  ├── /api             → API clients and utilities
  │   ├── client.ts   → Centralized API client (ALL requests through here)
  │   ├── auth.ts     → Authentication endpoints
  │   ├── admin-*.ts  → Admin-specific APIs
  │   └── ...         → Other API modules
  ├── /roles          → Role management utilities
  ├── /i18n           → Internationalization setup
  ├── auth-context.tsx → Authentication state management
  ├── favorites-context.tsx → Favorites state
  ├── subscription-context.tsx → Subscription state
  ├── notifications-context.tsx → Notifications state
  ├── typzh.ts        → Shared TypeScript interfaces
  ├── utils.ts        → Helper utilities
  └── ...
/hooks                  → Custom React hooks
/styles                 → Global CSS styles
/public                 → Static assets
```

---

## Core Behavioral Rules

### Code Standards
- Use **TypeScript strictly** (no `any` types)
- Follow **existing code patterns** in the project
- Prioritize **code readability** over cleverness
- Check for **existing components** before creating new ones
- Use **shadcn/ui components** from `/components/ui`
- Always use **centralized API client** at `/lib/api/client.ts`

### Code Organization Rules

#### Components
- Location: `/components/{feature}/{component-name}.tsx`
- Naming: PascalCase
- Export as default
- Import types from `/lib/typzh.ts`
- Use hooks from `/hooks`

#### Pages & Routes
- Location: `/app/(route-group)/feature/page.tsx`
- Use route groups: `(adminDashboard)`, `(auth)`, `(public)`, `(userDashboard)`, `(manufacturerDashboard)`
- Server components by default
- Mark with `use client` only when needed for interactivity

#### API Communication
```typescript
import { apiClient } from "@/lib/api/client"
// NEVER hardcode API endpoints
// ALWAYS use centralized client for consistency
```

#### State Management
```typescript
import { useAuth } from "@/lib/auth-context"
const { user, isAuthenticated } = useAuth()
```

---

## ❌ WHAT NOT TO DO

- ❌ Hardcode API endpoints (use env variables or centralized client)
- ❌ Create duplicate components (check `/components/ui` first)
- ❌ Ignore TypeScript errors
- ❌ Use inline styles (use Tailwind CSS instead)
- ❌ Make breaking changes to shared utilities
- ❌ Commit directly to main/master branch
- ❌ Delete or remove code without documenting why
- ❌ Install packages without permission
- ❌ Modify package.json carelessly
- ❌ Change authentication flow without approval

---

## Common Workflows

### Adding a New Page
1. Ask permission if it's a major change
2. Create folder: `/app/(group)/feature/`
3. Add `page.tsx` with route
4. Import types from `/lib/typzh.ts`
5. Test in browser
6. Update `PROJECT_MASTER_README.md`

### Creating a Component
1. Check `/components/ui` first for existing components
2. Create: `/components/feature/component-name.tsx`
3. Export as default
4. Define prop types with TypeScript interfaces
5. Use Tailwind CSS for styling
6. Test with different states

### Integrating an API
1. Check if API client exists in `/lib/api/`
2. Use `apiClient` from `/lib/api/client.ts`
3. Handle errors properly with try-catch
4. Use `useToast()` for user feedback
5. Type responses with interfaces from `/lib/typzh.ts`
6. Update `PROJECT_MASTER_README.md` with integration status

---

## 🔐 Restricted & Sensitive Areas

- 🔒 `.env.local` - Environment variables (don't modify without permission)
- 🔒 `tsconfig.json` - TypeScript configuration
- 🔒 `next.config.mjs` - Next.js configuration
- 🔒 `package.json` - Dependencies (any changes need approval)
- 🔐 `/lib/auth-context.tsx` - Authentication logic
- 🔐 `/lib/api/client.ts` - Centralized API client
- ⚠️ Database migrations or schema changes
- ⚠️ Security-related code modifications

---

## 📞 Before You Start

1. ✅ Read `PROJECT_MASTER_README.md`
2. ✅ Check existing patterns in the codebase
3. ✅ Run `pnpm dev` to test locally
4. ✅ Look for similar implementations
5. ✅ Verify TypeScript compiles without errors
6. ✅ Test in browser before committing

---

## 🛠️ Useful Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint and check code quality
pnpm type-check      # Check TypeScript compilation

# Package Management (REQUIRES PERMISSION)
pnpm add             # Install new package
pnpm remove          # Uninstall package
```

---

## 🚨 CRITICAL REMINDERS

1. **ASK FIRST** before deleting, installing, or modifying core files
2. **Document everything** - Update README when making changes
3. **Test thoroughly** - Always test in browser before committing
4. **Read existing code** - Follow patterns already in the codebase
5. **Client is strict** - Quality matters, be careful with changes
6. **Use centralized API client** - Never make direct fetch calls
7. **Type everything** - No `any` types in TypeScript
8. **Be respectful of existing code** - Don't delete without reason

**Remember**: The client (Israel) is very particular about code quality and stability. Work carefully! 🎯

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