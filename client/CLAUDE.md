# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the **client** directory of a Laravel-Nuxt full-stack application. The main project
documentation is in the root `CLAUDE.md` file.

- **Client**: Nuxt 3 frontend (this directory) with TypeScript, Tailwind CSS
- **Server**: Laravel backend (`../` root directory) with Sanctum authentication and API routes

## Client-Specific Commands

```bash
# Development
npm run dev                          # Start Nuxt dev server (http://localhost:3000)
npm run build                        # Build for production
npm run generate                     # Generate static site
npm run preview                      # Preview production build

# Code Quality
npx eslint .                         # Run ESLint linting
npx nuxt typecheck                   # TypeScript type checking
npm run format                       # Format code with Prettier
```

## Client Architecture

### Icon System Implementation

- **Component**: `components/ui/Icon.vue` - Unified icon component with TypeScript support
- **Usage**: `<Icon name="i-heroicons-home" size="md" />` - Always use `i-heroicons-` prefix
- **Lookup**: `composables/heroicons.ts` - Centralized Heroicons import and mapping
- **Variants**: Supports both 'outline' (default) and 'solid' styles
- **Sizing**: xs, sm, md, lg, xl with consistent h-w classes

### Admin Component System

Located in `components/ui/admin/`:

**AdminSidebar.vue** - Main navigation component

- Responsive design with mobile/desktop states
- Collapsible sidebar with proper animations
- Uses `useAdminSidebar` composable for state management

**NavItem.vue** - Reusable navigation item

- Supports badges, tooltips, and expandable sub-menus
- Proper TypeScript interfaces for navigation data
- Conditional rendering based on collapsed/mobile states

**ProfileDropdown.vue** - User profile menu

- Configurable menu items with proper TypeScript types
- Dropdown positioning logic for collapsed/expanded states
- Event handling for logout and navigation actions

### Composable Architecture

**useAdminSidebar.ts** - Centralized sidebar state management

- Navigation configuration with proper Heroicon names
- Reactive state management (collapsed, mobile menu, dropdowns)
- Event handlers for resize, click outside, keyboard events
- Computed properties for CSS classes and visibility logic

### TypeScript Patterns

**Component Props**:

```typescript
interface Props {
  item: NavigationItem
  isCollapsed?: boolean
  isMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
  isMobile: false,
})
```

**Event Emissions**:

```typescript
const emit = defineEmits<{
  toggle: []
  'close-mobile': []
}>()
```

### UI Design System

- **Colors**: Custom Tailwind palette with primary (teal), neutral (slate), and status colors
- **Typography**: Public Sans font with custom sizing scale
- **Components**: Full set of reusable UI components in `components/ui/`
- **Animations**: Custom fade/slide animations and transitions
- **Spacing**: Extended Tailwind spacing scale for precise layouts

### Authentication Flow

- **Module**: `nuxt-auth-sanctum` for Laravel Sanctum integration
- **Mode**: Cookie-based authentication with CSRF protection
- **Endpoints**: Configured in `nuxt.config.ts` for login, logout, user data, CSRF
- **Redirects**: `/dashboard` after login, `/login` after logout
- **Middleware**: Route protection via `auth.ts` and `guest.ts`

### Development Guidelines

- **TypeScript Required**: All components use `<script setup lang="ts">` with proper interfaces
- **Icon Consistency**: Always use unified Icon component with `i-heroicons-` naming
- **Composable Pattern**: Extract business logic to composables for reusability
- **Component Structure**: Props validation, typed emits, computed properties
- **State Management**: Pinia stores available but prefer composables for component-specific state

### Configuration Files

- **nuxt.config.ts**: Main Nuxt configuration with TypeScript checking, security headers, Sanctum setup
- **tailwind.config.js**: Custom Tailwind configuration with extended design system
- **eslint.config.mjs**: ESLint configuration extending Nuxt defaults
- **package.json**: Dependencies including Heroicons, Zod validation, TypeScript support
