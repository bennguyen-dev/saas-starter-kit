---
trigger: always_on
---

# AI Coding Rules - Next.js 14 Feature-based Architecture

## 🏗️ PROJECT STRUCTURE

**ALWAYS follow feature-based architecture:**
```
src/
├── shared/           # Shared utilities only
├── features/         # All business logic here
│   ├── auth/
│   ├── products/
│   ├── subscriptions/
│   └── [feature-name]/
└── app/             # Routes only
```

**Each feature MUST contain:**
- `components/` - UI components
- `hooks/` - Custom hooks  
- `lib/` - Business logic & API
- `types/` - TypeScript definitions
- `validations/` - Zod schemas
- `store/` - State management (if needed)
- `index.ts` - Feature exports

## 📋 CODING STANDARDS

### TypeScript
- Use `interface` for object shapes, `type` for unions/primitives
- Always export types from feature's `types/` folder
- Use generic types for reusable components
- Prefer `unknown` over `any`

### React Components
- Use function components with TypeScript
- Default export for page components, named exports for others
- Props interface must end with `Props`: `LoginFormProps`
- Use `React.FC` only when children manipulation needed

### Imports Organization
```typescript
// 1. React & Next.js
import React from 'react'
import { NextPage } from 'next'

// 2. External libraries
import { z } from 'zod'
import { useForm } from 'react-hook-form'

// 3. Internal - shared
import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'

// 4. Internal - features
import { useAuth } from '@/features/auth'
import { ProductCard } from '@/features/products'

// 5. Relative imports
import './styles.css'
```

## 🎨 UI & STYLING

### ShadCN Usage
- ONLY use ShadCN components from `@/shared/components/ui`
- Customize in feature components, NOT in base ShadCN files
- Use `cn()` utility for conditional classes
- Follow ShadCN naming: `button.tsx`, `dialog.tsx`

### Tailwind CSS
- Use utility classes, avoid custom CSS when possible
- Use CSS variables for theme colors
- Mobile-first responsive design: `sm:`, `md:`, `lg:`
- Group related classes: `"flex items-center justify-between"`

## 🔐 AUTHENTICATION (Auth.js)

### Auth Components
- Wrap protected routes with `<ProtectedRoute>`
- Use `useAuth()` hook, never access session directly
- Handle loading states for auth operations
- Redirect unauthenticated users to `/login`

### Auth Patterns
```typescript
// ✅ CORRECT
const { user, loading, signIn, signOut } = useAuth()

// ❌ WRONG - Don't use directly
const { data: session } = useSession()
```

## 🗄️ DATABASE (Prisma)

### Schema Rules
- Use `cuid()` for IDs
- Include `createdAt`, `updatedAt` for entities
- Use proper relations with foreign keys
- Add indexes for query performance

### Database Access
- ONLY access Prisma client through `@/shared/lib/db`
- Use transactions for multiple operations
- Handle errors with try/catch
- Use type-safe Prisma client methods

### API Routes
```typescript
// ✅ CORRECT Pattern
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = schema.parse(body)
    
    const result = await db.user.create({
      data: validatedData
    })
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
```

## 💳 PAYMENTS (Polar)

### Polar Integration
- All Polar logic in `features/subscriptions/`
- Use webhook handlers for subscription events
- Store Polar IDs in database for reference
- Handle subscription status changes properly

### Checkout Flow
```typescript
// ✅ CORRECT
const { createCheckout, loading } = usePolarCheckout()

const handleSubscribe = async () => {
  const checkout = await createCheckout({
    productId: 'prod_xxx',
    userId: user.id
  })
  // Redirect to Polar checkout
}
```

## 🎯 FEATURE DEVELOPMENT

### Feature Structure
```
features/example/
├── components/
│   ├── ExampleForm.tsx
│   ├── ExampleList.tsx
│   └── index.ts
├── hooks/
│   ├── use-example.ts
│   └── use-example-mutations.ts
├── lib/
│   ├── example-api.ts
│   └── example-utils.ts
├── types/
│   └── example.ts
├── validations/
│   └── example-schema.ts
└── index.ts
```

### Feature Exports (`index.ts`)
```typescript
// Components
export { ExampleForm } from './components/ExampleForm'
export { ExampleList } from './components/ExampleList'

// Hooks
export { useExample } from './hooks/use-example'

// Types
export type { Example } from './types/example'

// Validations
export { exampleSchema } from './validations/example-schema'
```

## 🔧 STATE MANAGEMENT

### Zustand Store Pattern
```typescript
// features/example/store/example-store.ts
interface ExampleState {
  items: Example[]
  loading: boolean
  addItem: (item: Example) => void
  removeItem: (id: string) => void
  fetchItems: () => Promise<void>
}

export const useExampleStore = create<ExampleState>((set, get) => ({
  items: [],
  loading: false,
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  fetchItems: async () => {
    set({ loading: true })
    try {
      const items = await fetchExampleItems()
      set({ items, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  }
}))
```

## 🔍 VALIDATION (Zod)

### Schema Patterns
```typescript
// features/example/validations/example-schema.ts
export const exampleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+')
})

export type ExampleInput = z.infer<typeof exampleSchema>
```

### Form Validation
```typescript
// Use with react-hook-form
const form = useForm<ExampleInput>({
  resolver: zodResolver(exampleSchema),
  defaultValues: { name: '', email: '', age: 18 }
})
```

## 🚀 PERFORMANCE

### Code Splitting
- Use dynamic imports for heavy components
- Lazy load routes with `React.lazy()`
- Split by features naturally

### Caching
- Use React Query/SWR for server state
- Implement proper cache invalidation
- Use Next.js built-in caching when possible

## 🧪 TESTING

### Test Structure
```
tests/
├── features/
│   ├── auth/
│   └── products/
├── shared/
└── __mocks__/
```

### Test Patterns
- Test components with user interactions
- Mock external APIs and services
- Test custom hooks with `renderHook()`
- Integration tests for critical flows

## 🚫 FORBIDDEN PRACTICES

**DON'T:**
- Put business logic in `app/` folder
- Import between features directly (use shared layer)
- Use `any` type without good reason
- Create God components (>300 lines)
- Skip error handling in API routes
- Hardcode sensitive values
- Use `useEffect` for data fetching (use React Query)
- Put styles in random places

**DO:**
- Keep features isolated and independent
- Use proper TypeScript types everywhere
- Handle loading and error states
- Validate all inputs with Zod
- Use proper error boundaries
- Follow consistent naming conventions
- Write self-documenting code
- Use proper git commit messages

## 📁 FILE NAMING

- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Utils: `kebab-case.ts`
- Types: `kebab-case.ts`
- API routes: `route.ts`
- Pages: `page.tsx`

## 🔄 ERROR HANDLING

```typescript
// API Routes
try {
  const result = await riskyOperation()
  return NextResponse.json(result)
} catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    { error: 'Something went wrong' },
    { status: 500 }
  )
}

// Components
const { data, error, loading } = useQuery({
  queryKey: ['example'],
  queryFn: fetchExample,
  onError: (error) => {
    toast.error('Failed to load data')
  }
})
```

Remember: **Features should be independent, predictable, and maintainable. Every piece of code should have a clear home and purpose.**