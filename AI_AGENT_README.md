# AI Agent Configuration Guide

## Overview

AI Agent configuration files define how AI assistants (like Copilot, Antigraviry, Cursor) should behave, what information they should know, and how they should interact with your codebase. These files enhance AI responses by providing context, instructions, and project-specific knowledge.

---

## Configuration Files & Their Purpose

### 1. **agent.md**
Main agent configuration file at project root. Contains instructions and constraints for AI behavior.

**Key Information to Include:**
- Project guidelines and rules
- What NOT to do (restrictions)
- Behavioral expectations
- Permission requirements

**Example:**
```markdown
- Always ask for permission before making major changes
- Don't delete files without explicit approval
- Follow existing code style and conventions
- Prioritize code readability and maintainability
```

### 2. **.instructions.md**
Project-level instruction file for detailed behavioral guidelines.

**Key Information to Include:**
- Development standards
- Code organization principles
- Testing requirements
- Documentation expectations
- Git/commit conventions

### 3. **.prompt.md**
Custom system prompt that overrides defaults.

**Key Information to Include:**
- Role definition
- Context about the project type
- Response format preferences
- Output style guidelines

### 4. **copilot-instructions.md**
Extended instructions specifically for GitHub Copilot integration.

**Key Information to Include:**
- Language/framework specifics
- IDE-specific instructions
- Common tasks and workflows
- Quick references

### 5. **AGENTS.md** (if multiple agents)
Registry of multiple specialized agents.

**Key Information to Include:**
- Agent names and purposes
- Agent specializations
- Invocation rules
- Cross-agent communication

### 6. **SKILL.md** (in skill subdirectories)
Defines specialized skills or domain knowledge.

**Location:** `skills/{skill-name}/SKILL.md`

**Key Information to Include:**
- Skill description
- When to use this skill
- Prerequisites
- Related tools/APIs
- Examples

---

## What Information Should Be Included

### A. Project Context
```yaml
Project Type: Next.js Full-Stack Web Application
Tech Stack:
  - Frontend: React, TypeScript, Tailwind CSS
  - Backend: Node.js, API routes
  - Database: [Your DB]
  - Auth: [Auth system used]
  - UI Components: shadcn/ui
```

### B. Code Organization
```yaml
Key Directories:
  - /app: Next.js app router pages
  - /components: Reusable React components
  - /lib: Utilities, API clients, contexts, hooks
  - /styles: Global styles
  - /public: Static assets

Naming Conventions:
  - Components: PascalCase
  - Utilities: camelCase
  - Types: PascalCase with suffix (e.g., UserType)
  - Constants: UPPER_SNAKE_CASE
```

### C. Architecture Patterns
```yaml
- Component Structure: Follow component hierarchy
- State Management: React Context for auth, notifications
- API Communication: Centralized apiClient
- Error Handling: Standardized error boundaries
- Authentication: Auth context wrapper
```

### D. Behavioral Rules
```yaml
DO:
  - Check existing components before creating new ones
  - Use TypeScript strictly
  - Reuse shadcn/ui components
  - Follow ESLint rules
  - Test changes in browser

DON'T:
  - Delete files without permission
  - Hardcode API endpoints
  - Create duplicate components
  - Ignore TypeScript errors
  - Commit without review
```

### E. Common Commands
```yaml
Dependencies: pnpm
Build: pnpm build
Dev: pnpm dev
Test: pnpm test
Lint: pnpm lint
Type Check: pnpm type-check
```

### F. Integration Points
```yaml
- API Base: /lib/api/client.ts
- Auth Context: /lib/auth-context.tsx
- UI Components: /components/ui/*
- Hooks: /hooks/*
- Types: /lib/typzh.ts
```

---

## Best Practices for Agent Files

### ✅ DO
- **Be Specific**: Use concrete examples and edge cases
- **Keep It Updated**: Sync with actual project changes
- **Organize Logically**: Group related information
- **Use Frontmatter**: Add metadata for tool processing
- **Link to Code**: Reference specific files when relevant
- **Document Constraints**: Clearly state limitations
- **Version Control**: Track changes with git

### ❌ DON'T
- Overload with unnecessary details
- Use outdated information
- Mix multiple concerns in one section
- Make instructions ambiguous
- Forget to validate instructions work
- Lock files away from team access

---

## YAML Frontmatter (Optional but Recommended)

Include metadata at the top of agent files:

```yaml
---
scope: "project" # or "file", "skill"
language: "typescript"
frameworks: ["react", "next-js"]
tools: ["api-client", "auth-context", "ui-components"]
lastUpdated: "2026-05-05"
author: "team"
---
```

---

## Example Agent.md Structure for This Project

```markdown
# Project Agent Configuration

## Project Type
Next.js Full-Stack B2B Marketplace Platform

## Core Rules
1. **Permission-Based**: Ask before deleting or major refactors
2. **Type Safety**: Always use TypeScript, no `any` types
3. **Component Reuse**: Check /components/ui before creating new UI
4. **API Standardization**: Use apiClient from /lib/api/client
5. **State Management**: Use React Context (auth, notifications, subscriptions)

## Tech Stack
- React 18 + TypeScript
- Next.js 14+ with App Router
- Tailwind CSS for styling
- shadcn/ui component library
- TanStack Query (if used)

## Key Directories & Responsibilities
- `/app`: Page layouts and routes
- `/components`: Reusable UI components
- `/lib`: Business logic, API, utilities, contexts
- `/hooks`: Custom React hooks
- `/styles`: Global CSS

## Code Standards
- ESLint + Prettier configured
- File naming: lowercase with hyphens (components-folder/)
- Component naming: PascalCase
- Always export types from lib/typzh.ts

## Common Tasks
1. Adding a new page: Create folder in /app, add page.tsx
2. Creating a component: Add to /components with index export
3. API calls: Use apiClient from /lib/api/client
4. Auth: Check useAuth() from /lib/auth-context

## Restrictions
- Don't modify package.json without approval
- Don't commit to main/master directly
- Don't hardcode values (use env vars or config)
- Don't ignore TypeScript errors
```

---

## File Interaction Flow

```
copilot-instructions.md (General guidelines)
        ↓
.instructions.md (Detailed standards)
        ↓
agent.md (Project-specific rules)
        ↓
SKILL.md (Domain-specific knowledge)
        ↓
Code Changes (Applied by AI)
```

---

## Checklist: What To Include

- [ ] Project type and tech stack
- [ ] Directory structure and organization
- [ ] Naming conventions
- [ ] Code style guidelines
- [ ] Key architectural patterns
- [ ] Authentication/authorization info
- [ ] API/endpoint documentation
- [ ] Component library details
- [ ] Environment variables needed
- [ ] Build and deployment process
- [ ] Git workflow expectations
- [ ] Restricted/sensitive areas
- [ ] Common pitfalls to avoid
- [ ] Team communication guidelines
- [ ] Testing expectations
- [ ] Performance considerations

---

## For This Project Specifically

Key information to add to your **agent.md**:

1. **Admin Dashboard Layout**: Multiple route groups
2. **User Roles**: Buyer, Manufacturer, Admin
3. **API Patterns**: Use apiClient in /lib/api/client
4. **Context System**: Auth, Favorites, Subscriptions, Notifications
5. **UI Library**: shadcn/ui components in /components/ui
6. **Page Structure**: Route-based organization with (groups)
7. **Internationalization**: Check for i18n setup in /lib/i18n

---

## Resources

- [GitHub Copilot Instructions](https://docs.github.com/en/copilot/customizing-copilot)
- [VS Code Customization](https://code.visualstudio.com/docs/editor/custom-instructions)
- [Agent Development Best Practices](https://docs.anthropic.com/en/docs/build-a-chat-bot)

