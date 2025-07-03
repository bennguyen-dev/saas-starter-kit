---
trigger: always_on
---

# AI Coding Rules - Next.js 15 Feature-based Architecture

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
- `services/` - Business logic
- `repositories/` - Data access
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

## 🔧 BACKEND ARCHITECTURE

### Feature Backend Structure
```
features/products/
├── services/
│   └── product-service.ts    # Business logic
├── repositories/
│   └── product-repository.ts # Data access
├── types/
│   └── product.ts
└── validations/
    └── product-schema.ts
```

### Service Layer Pattern
```typescript
// features/products/services/product-service.ts
import { ProductRepository } from '../repositories/product-repository'
import { AppError } from '@/shared/lib/error-handler'

export class ProductService {
  static async addProduct(data: CreateProductInput) {
    // Business logic validation
    if (data.price <= 0) {
      throw new AppError('Price must be positive', 400, 'INVALID_PRICE')
    }

    return await ProductRepository.create(data)
  }
}
```

### Repository Layer Pattern
```typescript
// features/products/repositories/product-repository.ts
import { db } from '@/shared/lib/db'

export class ProductRepository {
  static async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    return await db.product.create({
      data: { ...data, id: cuid() }
    })
  }

  static async findById(id: string) {
    return await db.product.findUnique({ where: { id } })
  }
}
```

### API Route Pattern
```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { ProductService } from '@/features/products/services/product-service'
import { createProductSchema } from '@/features/products/validations/product-schema'
import { handleApiError } from '@/shared/lib/error-handler'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createProductSchema.parse(body)
    
    const product = await ProductService.addProduct(validatedData)
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Error Handling
```typescript
// shared/lib/error-handler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    )
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error && error.message.includes('Unique constraint')) {
    return NextResponse.json(
      { error: 'Resource already exists' },
      { status: 409 }
    )
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

## 🎨 UI & STYLING

### ShadCN Usage
- ONLY use ShadCN components from `@/shared/components/ui`
- Customize in feature components, NOT in base ShadCN files
- Use `cn()` utility for conditional classes

### Tailwind CSS V4
- Use utility classes, avoid custom CSS when possible
- Use CSS variables for theme colors
- Mobile-first responsive design: `sm:`, `md:`, `lg:`

## 🔐 AUTHENTICATION (Auth.js)

### Auth Components
- Wrap protected routes with `<ProtectedRoute>`
- Use `useAuth()` hook, never access session directly
- Handle loading states for auth operations

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

## 💳 PAYMENTS (Polar)

### Polar Integration
- All Polar logic in `features/subscriptions/`
- Use webhook handlers for subscription events
- Store Polar IDs in database for reference

### Checkout Flow
```typescript
const { createCheckout, loading } = usePolarCheckout()

const handleSubscribe = async () => {
  const checkout = await createCheckout({
    productId: 'prod_xxx',
    userId: user.id
  })
}
```

## 🎯 FEATURE DEVELOPMENT

### Feature Exports (`index.ts`)
```typescript
// Components
export { ExampleForm } from './components/ExampleForm'

// Hooks
export { useExample } from './hooks/use-example'

// Services
export { ExampleService } from './services/example-service'

// Types
export type { Example } from './types/example'

// Validations
export { exampleSchema } from './validations/example-schema'
```

## 🔧 STATE MANAGEMENT

### Zustand Store Pattern
```typescript
interface ExampleState {
  items: Example[]
  loading: boolean
  addItem: (item: Example) => void
  fetchItems: () => Promise<void>
}

export const useExampleStore = create<ExampleState>((set, get) => ({
  items: [],
  loading: false,
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
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

## 🚫 FORBIDDEN PRACTICES

**DON'T:**
- Put business logic in `app/` folder
- Import between features directly (use shared layer)
- Use `any` type without good reason
- Create God components (>300 lines)
- Skip error handling in API routes
- Hardcode sensitive values
- Use `useEffect` for data fetching (use React Query)

**DO:**
- Keep features isolated and independent
- Use proper TypeScript types everywhere
- Handle loading and error states
- Validate all inputs with Zod
- Use proper error boundaries
- Follow service/repository pattern for backend

## 📁 FILE NAMING

- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Services: `kebab-case-service.ts`
- Repositories: `kebab-case-repository.ts`
- Utils: `kebab-case.ts`
- Types: `kebab-case.ts`
- API routes: `route.ts`
- Pages: `page.tsx`

## 🔄 BACKEND PRINCIPLES

- **API routes** chỉ làm routing, delegate logic cho services
- **Services** chứa business logic, không trực tiếp access DB
- **Repositories** handle DB operations, return domain objects
- **Validation** ở API layer, reuse schemas
- **Error handling** sử dụng `handleApiError()` cho consistency

Remember: **Features should be independent, predictable, and maintainable. Every piece of code should have a clear home and purpose.**