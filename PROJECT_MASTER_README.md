# 📚 PROJECT MASTER README

**Last Updated**: May 5, 2026  
**Version**: 0.1.6  
**Status**: 🚀 Active Development

---

## ⚠️ IMPORTANT: READ THIS FIRST!

This README is the **single source of truth** for the entire project. Every AI agent must:

1. ✅ **Read this file FIRST** before making any changes
2. ✅ **Check page/API status** before starting work
3. ✅ **Update this file** when adding/removing pages or APIs
4. ✅ **Mark progress** in the API Integration TODO
5. ✅ **Document changes** so work can be picked up if an agent fails

**If you're here because a previous agent stopped**: Check the "🚦 Current Status" section and "API Integration TODO" to understand what's in progress.

---

## 📋 PROJECT OVERVIEW

**Project Name**: B2B Marketplace Platform  
**Type**: Next.js 14+ Full-Stack Application  
**Tech Stack**: React 18, TypeScript, Next.js (App Router), Tailwind CSS, shadcn/ui  
**Database**: [Backend API - see integration section]  
**Auth**: JWT/Session-based (check `/lib/auth-context.tsx`)

### Key Features
- Multi-role system: Buyers, Manufacturers, Admins
- Product catalog & management
- RFQ (Request for Quote) system
- Messaging/Chat system
- Supplier directory & comparison
- Admin dashboard with comprehensive controls
- Two-factor authentication
- Notifications system
- Subscription/Payment handling

---

## 🏗️ PROJECT STRUCTURE

```
readywithfixes/
├── app/                              # Next.js App Router
│   ├── (adminDashboard)/
│   │   └── admin/                   # Admin section (protected)
│   ├── (auth)/
│   │   └── auth/                    # Authentication pages
│   ├── (manufacturerDashboard)/
│   │   └── dashboard/               # Manufacturer dashboard
│   ├── (public)/                    # Public pages (no auth required)
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── for-buyers/
│   │   ├── for-manufacturers/
│   │   ├── help/
│   │   ├── industries/
│   │   ├── messages/
│   │   ├── pricing/
│   │   ├── privacy/
│   │   ├── products/
│   │   ├── rfq/
│   │   ├── search/
│   │   ├── suppliers/
│   │   ├── terms/
│   │   ├── test-payment/
│   │   └── verification/
│   ├── (userDashboard)/
│   │   └── dashboard/               # Buyer/User dashboard
│   ├── api/                         # API routes
│   │   ├── buyer/
│   │   └── products/
│   ├── cookies/                     # Cookie page
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   ├── not-found.tsx               # 404 page
│   └── globals.css
│
├── components/                      # React Components
│   ├── ui/                         # shadcn/ui base components
│   ├── auth/                       # Auth-related components
│   ├── admin/                      # Admin-specific components
│   ├── home/                       # Homepage sections
│   ├── account/                    # User account components
│   ├── chat/                       # Messaging components
│   ├── products/                   # Product-related components
│   ├── suppliers/                  # Supplier-related components
│   ├── payment/                    # Payment components
│   ├── reviews/                    # Review components
│   ├── settings/                   # Settings components
│   ├── layout/                     # Header, footer, etc.
│   ├── manufacturers/
│   ├── industries/
│   ├── report/
│   ├── notifications-dropdown.tsx
│   ├── theme-provider.tsx
│   ├── icon-picker.tsx
│   └── dynamic-icon.tsx
│
├── lib/                            # Utilities & Logic
│   ├── api/                        # API Clients & Utilities
│   │   ├── client.ts              # Centralized API client
│   │   ├── auth.ts                # Auth endpoints
│   │   ├── products.ts            # Product API
│   │   ├── rfqs.ts                # RFQ API
│   │   ├── messagzh.ts            # Messaging API
│   │   ├── notifications.ts       # Notifications API
│   │   ├── admin-*.ts             # Admin-specific APIs
│   │   ├── manufacturer-*.ts      # Manufacturer-specific APIs
│   │   ├── buyer-*.ts             # Buyer-specific APIs
│   │   ├── errors.ts              # Error handling
│   │   └── ...
│   ├── roles/                     # Role-based access
│   ├── i18n/                      # Internationalization
│   ├── data/                      # Static data
│   ├── auth-context.tsx           # Auth state management
│   ├── favorites-context.tsx      # Favorites state
│   ├── subscription-context.tsx   # Subscription state
│   ├── notifications-context.tsx  # Notifications state
│   ├── typzh.ts                   # Shared TypeScript types
│   ├── utils.ts                   # Utility functions
│   ├── google-identity.ts
│   ├── register-success-storage.ts
│   └── echo.ts
│
├── hooks/                         # Custom React Hooks
│   ├── use-mobile.ts
│   ├── use-notifications.ts
│   ├── use-toast.ts
│   └── ...
│
├── public/                        # Static assets
│   └── images/
│
├── styles/                        # Global styles
│   └── globals.css
│
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── next.config.mjs               # Next.js config
├── postcss.config.mjs            # PostCSS config
├── components.json                # shadcn/ui config
├── agent.md                       # AI Agent instructions
├── AI_AGENT_README.md            # Agent configuration guide
└── PROJECT_MASTER_README.md      # THIS FILE
```

---

## 📄 PAGES & API INTEGRATION STATUS

### 🏠 PUBLIC PAGES (No Authentication Required)

| Page | Route | API Integration | Status | Notes |
|------|-------|-----------------|--------|-------|
| Home | `/` | ✅ Integrated | Complete | Uses product & supplier APIs |
| About | `/about` | ❌ Not Needed | Complete | Static content |
| Products | `/products` | ✅ Integrated | Complete | Product listing & search |
| Search | `/search` | ✅ Integrated | Complete | Product/supplier search |
| Suppliers | `/suppliers` | ✅ Integrated | Complete | Supplier directory |
| Industries | `/industries` | ✅ Integrated | ✅ Complete | Industry listing |
| For Buyers | `/for-buyers` | ❌ Not Needed | Complete | Static content |
| For Manufacturers | `/for-manufacturers` | ❌ Not Needed | Complete | Static content |
| RFQ | `/rfq` | ✅ Integrated | Complete | RFQ creation & listing |
| Pricing | `/pricing` | ❌ Not Needed | Complete | Static pricing info |
| FAQ | `/faq` | ✅ Integrated | Complete | FAQ listing |
| Contact | `/contact` | ⚠️ Partial | In Progress | Form submission needs backend |
| Help | `/help` | ❌ Not Needed | Complete | Static help content |
| Blog | `/blog` | ⚠️ Partial | Not Started | Needs CMS integration |
| Privacy | `/privacy` | ❌ Not Needed | Complete | Static legal page |
| Terms | `/terms` | ❌ Not Needed | Complete | Static legal page |
| Test Payment | `/test-payment` | ✅ Integrated | Testing | PayPal integration test |
| Verification | `/verification` | ✅ Integrated | In Progress | Email verification flow |
| Messages | `/messages` | ✅ Integrated | Complete | Public messaging setup |

### 🔐 AUTH PAGES (Authentication Routes)

| Page | Route | API Integration | Status | Notes |
|------|-------|-----------------|--------|-------|
| Login | `/auth` | ✅ Integrated | Complete | Email/social login |
| Register | `/auth` | ✅ Integrated | Complete | User registration |
| Social Auth Complete | Modal | ✅ Integrated | Complete | Social profile completion |

### 👤 USER DASHBOARD (Buyer/User Routes)

| Page | Route | API Integration | Status | Notes |
|------|-------|-----------------|--------|-------|
| Dashboard | `/dashboard` | ✅ Integrated | Complete | User home page |
| Profile Settings | `/dashboard/settings` | ✅ Integrated | Complete | User profile management |
| Messages | `/dashboard/messages` | ✅ Integrated | Complete | Chat system |
| Favorites | `/dashboard/favorites` | ✅ Integrated | Complete | Saved products/suppliers |
| RFQ History | `/dashboard/rfqs` | ✅ Integrated | Complete | User RFQs |
| Orders | `/dashboard/orders` | ⚠️ Partial | Planned | Order management needed |
| Subscriptions | `/dashboard/subscriptions` | ✅ Integrated | Complete | Subscription management |

### 🏭 MANUFACTURER DASHBOARD (Manufacturer Routes)

| Page | Route | API Integration | Status | Notes |
|------|-------|-----------------|--------|-------|
| Dashboard | `/dashboard` | ✅ Integrated | Complete | Manufacturer home |
| Products | `/dashboard/products` | ✅ Integrated | Complete | Product catalog management |
| Catalog | `/dashboard/catalog` | ✅ Integrated | Complete | Catalog management |
| RFQs | `/dashboard/rfqs` | ✅ Integrated | Complete | RFQ responses |
| Reviews | `/dashboard/reviews` | ✅ Integrated | Complete | Manufacturer reviews |
| Settings | `/dashboard/settings` | ✅ Integrated | Complete | Profile & preferences |
| Messages | `/dashboard/messages` | ✅ Integrated | Complete | Communication |
| Subscriptions | `/dashboard/subscriptions` | ✅ Integrated | Complete | Plan management |

### ⚙️ ADMIN DASHBOARD (Admin-Only Routes)

| Page | Route | API Integration | Status | Notes |
|------|-------|-----------------|--------|-------|
| Dashboard | `/admin` | ✅ Integrated | Complete | Admin overview |
| Users Management | `/admin/users` | ✅ Integrated | Complete | User list, suspend ❌ (commented out) |
| Suppliers | `/admin/suppliers` | ✅ Integrated | Complete | Supplier management |
| Products | `/admin/products` | ✅ Integrated | Complete | Product moderation |
| Manufacturers | `/admin/manufacturers` | ✅ Integrated | Complete | Manufacturer management |
| Manufacturer Registrations | `/admin/manufacturer-registrations` | ✅ Integrated | Complete | Registration approval |
| RFQs | `/admin/rfqs` | ✅ Integrated | Complete | RFQ monitoring |
| Reviews | `/admin/reviews` | ✅ Integrated | Complete | Review moderation |
| Messages | `/admin/messages` | ✅ Integrated | Complete | Message monitoring |
| FAQs | `/admin/faq` | ✅ Integrated | Complete | FAQ management |
| Pricing Plans | `/admin/pricing` | ✅ Integrated | Complete | Plan configuration |
| Subscriptions | `/admin/subscriptions` | ✅ Integrated | Complete | Subscription monitoring |
| Quick Filters | `/admin/filters` | ✅ Integrated | Complete | Filter management |
| Industries | `/admin/industries` | ✅ Integrated | Complete | Industry management |
| Site Settings | `/admin/site-settings` | ✅ Integrated | In Progress | Global settings |
| Analytics | `/admin/analytics` | ⚠️ Partial | Planned | Analytics dashboard |
| Insights | `/admin/insights` | ⚠️ Partial | Planned | Business insights |
| Reports | `/admin/reports` | ⚠️ Partial | Planned | Admin reports |
| Certificate Types | `/admin/certificatetype` | ❌ Not Integrated | Not Started | Certificate management - API needed |
| Contact Requests | `/admin/contact` | ⚠️ Partial | Planned | Contact form submissions |
| Promotions | `/admin/promotions` | ⚠️ Partial | Planned | Promotion management |

---

## 🔌 API INTEGRATION POINTS

### Centralized API Client
**Location**: `/lib/api/client.ts`

```typescript
import { apiClient } from "@/lib/api/client"

// All API calls go through this centralized client
// Handles auth, errors, and request/response formatting
```

### Available API Modules

| Module | File | Endpoints | Status |
|--------|------|-----------|--------|
| Auth | `auth.ts` | login, register, logout, verify | ✅ Complete |
| Products | `products.ts` | list, get, search, filter | ✅ Complete |
| RFQs (User) | `rfqs.ts` | create, list, get, update | ✅ Complete |
| RFQs (Admin) | `admin-rfqs.ts` | monitor, filter, stats | ✅ Complete |
| RFQs (Buyer) | `buyer-rfqs.ts` | my rfqs, analytics | ✅ Complete |
| RFQs (Manufacturer) | `manufacturer-rfqs.ts` | responses, quotes | ✅ Complete |
| Messages | `messagzh.ts` | create, list, search, notify | ✅ Complete |
| Notifications | `notifications.ts` | fetch, mark read, settings | ✅ Complete |
| Account | `account.ts` | profile, settings, preferences | ✅ Complete |
| Two-Factor | `two-factor.ts` | enable, disable, verify | ✅ Complete |
| Admin Products | `admin-products.ts` | moderate, review, manage | ✅ Complete |
| Admin Pricing | `admin-pricing.ts` | plans, tiers, pricing | ✅ Complete |
| Admin Manufacturer Registrations | `admin-manufacturer-registrations.ts` | approve, reject, review | ✅ Complete |
| Admin FAQ | `admin-faqs.ts` | create, edit, delete | ✅ Complete |
| Admin Quick Filters | `admin-quick-filters.ts` | manage filters | ✅ Complete |
| Manufacturer Catalogs | `manufacturer-catalogs.ts` | create, update, manage | ✅ Complete |
| Manufacturer Products | `manufacturer-products.ts` | list, manage | ✅ Complete |
| Categories | `categorizh.ts` | list, get, filter | ✅ Complete |
| Currencies | `currencizh.ts` | list, exchange rates | ✅ Complete |

---

## 🚦 CURRENT STATUS

### ✅ COMPLETED
- [x] Authentication system (login, register, social auth)
- [x] Product listing & search
- [x] RFQ creation & management
- [x] Messaging/Chat system
- [x] User & Manufacturer dashboards
- [x] Admin dashboard basics
- [x] User management
- [x] Supplier management
- [x] Two-factor authentication
- [x] Notification system
- [x] Payment integration (PayPal - test mode)

### 🚧 IN PROGRESS
- [ ] Blog system (CMS integration needed)
- [ ] Advanced analytics dashboard
- [ ] Business insights module
- [ ] Advanced reporting
- [ ] Contact form backend
- [ ] Site settings UI completion
- [ ] Email notifications

### 📋 PLANNED/TODO
- [ ] Mobile app version
- [ ] API rate limiting
- [ ] Advanced search filters
- [ ] Data export features
- [ ] Bulk operations for admin
- [ ] Advanced user segmentation
- [ ] Recommendation engine

---

## 📝 API INTEGRATION TODO

**Instructions**: 
- Mark API integrations as they're completed
- Add ✅ when fully integrated and tested
- Mark ⚠️ if partial or needs revision
- Mark ❌ if broken or commented out
- Include date when status changes

### Admin Pages Needing Integration

- [ ] **Blog System** - `/admin/blog`
  - Status: ❌ Not Started
  - Needed: Blog CRUD API, CMS integration
  - Assigned To: -
  - Due: -

- [ ] **Analytics Dashboard** - `/admin/analytics`
  - Status: ⚠️ Partial
  - Needed: Analytics data API, chart integration
  - Assigned To: -
  - Due: -

- [ ] **Insights Module** - `/admin/insights`
  - Status: ❌ Not Started
  - Needed: Business insights API
  - Assigned To: -
  - Due: -

- [ ] **Reports Module** - `/admin/reports`
  - Status: ❌ Not Started
  - Needed: Report generation API
  - Assigned To: -
  - Due: -

- [ ] **Contact Form Processing** - `/admin/contact`
  - Status: ⚠️ Backend needed
  - Needed: Contact submission handling, email sending
  - Assigned To: -
  - Due: -

- [ ] **Promotions Manager** - `/admin/promotions`
  - Status: ❌ Not Started
  - Needed: Promotion CRUD API
  - Assigned To: -
  - Due: -

- [ ] **Certificate Types Management** - `/admin/certificatetype`
  - Status: ❌ Not Started
  - Needed: Certificate type CRUD API, validation
  - Assigned To: -
  - Due: -

### Public Pages Needing Integration

- [ ] **Blog** - `/blog`
  - Status: ❌ Not Started
  - Needed: Blog listing API, CMS integration
  - Assigned To: -
  - Due: -

### User Dashboard - Future Features

- [ ] **Orders Page** - `/dashboard/orders`
  - Status: ❌ Not Started
  - Needed: Order management API
  - Assigned To: -
  - Due: -

### Known Issues & Fixes

- [x] **User Suspend Button** - Commented out (May 5, 2026)
  - Location: `/app/(adminDashboard)/admin/users/page.tsx`
  - Reason: Hiding from UI pending implementation
  - File: Marked with `{/* ... */}` comment block

---

## 🎯 WORKFLOW FOR AI AGENTS

### ✅ BEFORE YOU START WORK:

1. **Read** this entire README
2. **Check** the page/API status table above
3. **Look for** your task in the API Integration TODO
4. **Verify** the technology stack in your task
5. **Check** related files in `/lib/api/`

### 📝 WHEN ADDING A NEW PAGE:

1. Create the page component in `/app/(group)/feature/page.tsx`
2. **Update this README immediately**:
   - Add row to appropriate table (PUBLIC/AUTH/USER/MANUFACTURER/ADMIN)
   - Set API Integration status (✅/⚠️/❌)
   - Set Status (Complete/In Progress/Not Started)
   - Add any notes
3. Create/update API client in `/lib/api/` if needed
4. Test the page thoroughly
5. Document any issues

### ➕ WHEN ADDING A NEW API:

1. Create file in `/lib/api/feature.ts`
2. Export functions following existing patterns
3. **Update this README**:
   - Add row to API Integration Points table
   - Include endpoints and status
4. Update relevant pages to use the new API
5. Document any new types in `/lib/typzh.ts`

### ❌ WHEN REMOVING/DEPRECATING:

1. Mark as ⚠️ DEPRECATED in status table
2. **Update this README** with reason & date
3. List alternative solution if available
4. Note which pages are affected
5. Give 1-2 week notice before actual removal

### 🔧 WHEN FIXING A BUG:

1. Document the bug: location, description, impact
2. Make the fix
3. **Update this README** if it affects any integration status
4. Note the fix in Comments section below

---

## 🏗️ TECH STACK REFERENCE

```
Frontend:
  - React 18+ (hooks-based)
  - TypeScript (strict mode)
  - Next.js 14+ (App Router)
  - Tailwind CSS (utility-first)
  - shadcn/ui (component library)
  - React Hook Form (form management)
  - Zod (schema validation)
  - TanStack utilities

State Management:
  - React Context (auth, favorites, subscriptions, notifications)
  - Local state with useState
  - localStorage for persistence

UI/UX:
  - Radix UI primitives (via shadcn)
  - Lucide icons
  - Dark/Light theme support
  - Responsive design

Utilities:
  - Echo (real-time notifications)
  - Google Identity (social auth)
  - PayPal (payments - testing mode)
  - Playwright (testing)
```

---

## 🔗 IMPORTANT FILES TO KNOW

| File | Purpose | Notes |
|------|---------|-------|
| `/lib/api/client.ts` | Central API client | All HTTP requests go through here |
| `/lib/auth-context.tsx` | Auth state | Authentication & user info |
| `/lib/typzh.ts` | Type definitions | Shared TypeScript interfaces |
| `/lib/utils.ts` | Utilities | Helper functions |
| `/hooks/use-toast.ts` | Toast notifications | User feedback system |
| `/app/layout.tsx` | Root layout | Global layout, theme provider |
| `/next.config.mjs` | Next.js config | Environment & build config |
| `agent.md` | AI Agent rules | Rules & guidelines for agents |

---

## 📞 COMMON COMMANDS

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm type-check      # Check TypeScript compilation

# Database/Migration (if applicable)
# [Add your database commands here]

# Testing
pnpm test            # Run tests
pnpm test:watch     # Watch mode
```

---

## 🚨 CRITICAL RULES

### ⛔ DO NOT
- ❌ Delete or modify files in `/lib/api/client.ts` without approval
- ❌ Change authentication flow without updating `/lib/auth-context.tsx`
- ❌ Hardcode API endpoints (use apiClient)
- ❌ Create duplicate components (check `/components/ui` first)
- ❌ Ignore TypeScript errors
- ❌ Commit directly to main branch

### ✅ DO
- ✅ Ask for permission before major changes
- ✅ Update this README for all page/API changes
- ✅ Use existing patterns and components
- ✅ Document your work as you go
- ✅ Test in browser before committing
- ✅ Check for similar implementations first

---

## 📋 NOTES & COMMENTS

### 🔴 SUSPENDED/DISABLED FEATURES

**User Suspend Button**
- Date: May 5, 2026
- Location: `/app/(adminDashboard)/admin/users/page.tsx` (lines 499, 578, 725)
- Status: ❌ Commented out
- Reason: Pending implementation/review
- Re-enable when: [TBD]

### 💡 DEVELOPMENT INSIGHTS

- The project uses route groups to organize pages by access level
- All API calls must go through `/lib/api/client.ts`
- Component library (shadcn/ui) provides consistent UI
- Context API manages global state (auth, favorites, etc.)
- Types should be added to `/lib/typzh.ts`

### ⏰ RECENT CHANGES

**May 5, 2026**:
- Commented out Suspend button in Users admin page
- Created AI Agent README guide
- Created this Master README

---

## 🤝 TEAM COLLABORATION

If you're taking over from another agent:
1. Check "🚦 Current Status" section
2. Look at "📝 API Integration TODO" for assigned tasks
3. Read "🏗️ TECH STACK REFERENCE"
4. Check "🚨 CRITICAL RULES"
5. Update README with your progress

When handing off to another agent:
1. Mark your work status clearly
2. Update the TODO list
3. Leave notes in "📋 NOTES & COMMENTS"
4. Ensure all files are committed

---

## 📞 SUPPORT

For questions about:
- **Page structure**: Check the tables above
- **API integration**: Look at `/lib/api/` directory
- **Component usage**: Check `/components/` and `/lib/typzh.ts`
- **Agent instructions**: See `agent.md`
- **Agent configuration**: See `AI_AGENT_README.md`

---

**Remember**: This README is **LIVING DOCUMENTATION**. Update it constantly as you work. Future agents depend on it! 🚀
