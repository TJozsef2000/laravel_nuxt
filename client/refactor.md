# Recommended Nuxt 3/Vue 3 Architecture

## Project Structure

```
/app
├── components/              # Reusable UI components
│   ├── base/               # Atomic components
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseModal.vue
│   │   ├── BaseTable.vue
│   │   └── index.ts
│   ├── forms/              # Form components
│   │   ├── LoginForm.vue
│   │   ├── ContactForm.vue
│   │   └── index.ts
│   ├── layout/             # Layout-specific components
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── AppFooter.vue
│   │   └── index.ts
│   └── ui/                 # Business UI components
│       ├── ProductCard.vue
│       ├── UserProfile.vue
│       ├── DataTable.vue
│       └── index.ts
├── layouts/                # App-wide layouts
│   ├── default.vue         # Main app layout
│   ├── auth.vue           # Authentication pages
│   ├── dashboard.vue       # Admin/dashboard layout
│   └── minimal.vue         # Clean layout (landing, etc.)
├── pages/                  # Route-driven pages (Nuxt auto-routes)
│   ├── index.vue          # Homepage
│   ├── auth/
│   │   ├── login.vue
│   │   ├── register.vue
│   │   └── forgot-password.vue
│   ├── dashboard/
│   │   ├── index.vue
│   │   ├── profile.vue
│   │   └── settings.vue
│   ├── products/
│   │   ├── index.vue
│   │   └── [id].vue
│   └── [...slug].vue      # Catch-all
├── composables/            # Vue composables (state, API hooks, utilities)
│   ├── auth/
│   │   ├── useAuth.ts     # Authentication state & methods
│   │   ├── useUser.ts     # User data & profile management
│   │   └── index.ts
│   ├── api/
│   │   ├── useApi.ts      # Base API composable
│   │   ├── useProducts.ts # Product-specific API hooks
│   │   ├── useUsers.ts    # User-specific API hooks
│   │   └── index.ts
│   ├── ui/
│   │   ├── useModal.ts    # Modal state management
│   │   ├── useToast.ts    # Toast notifications
│   │   ├── usePagination.ts
│   │   └── index.ts
│   └── utils/
│       ├── useDebounce.ts
│       ├── useLocalStorage.ts
│       ├── useValidation.ts
│       └── index.ts
├── stores/                 # Global state (without Pinia)
│   ├── auth.ts            # Authentication state
│   ├── app.ts             # App-wide state (theme, locale, etc.)
│   ├── cart.ts            # Shopping cart state
│   └── index.ts
├── services/               # API services (REST/GraphQL clients)
│   ├── api.ts             # Base API client configuration
│   ├── auth.service.ts    # Authentication API calls
│   ├── users.service.ts   # User-related API calls
│   ├── products.service.ts # Product-related API calls
│   └── index.ts
├── types/                  # TypeScript interfaces/types
│   ├── api/
│   │   ├── auth.ts        # Auth DTOs and responses
│   │   ├── users.ts       # User DTOs and responses
│   │   ├── products.ts    # Product DTOs and responses
│   │   └── index.ts
│   ├── components/
│   │   ├── base.ts        # Base component props
│   │   ├── forms.ts       # Form-related types
│   │   └── index.ts
│   └── global.ts          # Global types and interfaces
├── utils/                  # Helpers (formatters, validators, constants)
│   ├── constants.ts
│   ├── formatters.ts
│   ├── validators.ts
│   ├── helpers.ts
│   └── index.ts
├── middleware/             # Nuxt route guards
│   ├── auth.ts            # Authentication middleware
│   ├── guest.ts           # Guest-only middleware
│   ├── admin.ts           # Admin role check
│   └── permissions.ts     # Permission-based access
├── assets/                 # Global styles, fonts, images
│   ├── scss/
│   │   ├── abstracts/     # Variables, mixins
│   │   ├── base/          # Reset, typography
│   │   ├── components/    # Component styles
│   │   └── main.scss
│   ├── images/
│   └── fonts/
└── public/                 # Static files
    ├── favicon.ico
    ├── robots.txt
    └── images/
```

## Data Flow Architecture

### 1. Pages (Route Entry Points)

Pages define routes and orchestrate data flow by importing composables/stores and triggering services.

```vue
<!-- pages/products/index.vue -->
<template>
    <div>
        <ProductFilters @filter="handleFilter"/>
        <ProductGrid
            :products="products"
            :loading="loading"
        />
        <BasePagination
            v-model="pagination.page"
            :total="pagination.total"
            @change="fetchProducts"
        />
    </div>
</template>

<script setup lang="ts">
    // Import composables and stores
    const {products, loading, fetchProducts, filterProducts} = useProducts()
    const {pagination} = usePagination()

    // Page metadata
    definePageMeta({
        title: 'Products',
        layout: 'default'
    })

    // Initial data fetch
    await fetchProducts()

    const handleFilter = (filters: ProductFilters) => {
        filterProducts(filters)
    }
</script>
```

### 2. Services (API Layer)

Services wrap API calls and return typed DTOs. No business logic here - pure data fetching.

```typescript
// services/products.service.ts
import type {Product, ProductFilters, PaginatedResponse} from '~/types'

export class ProductsService {
    private api = useApiClient()

    async getProducts(params?: ProductFilters): Promise<PaginatedResponse<Product>> {
        return await this.api.get<PaginatedResponse<Product>>('/products', {params})
    }

    async getProduct(id: string): Promise<Product> {
        return await this.api.get<Product>(`/products/${id}`)
    }

    async createProduct(data: Partial<Product>): Promise<Product> {
        return await this.api.post<Product>('/products', data)
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        return await this.api.put<Product>(`/products/${id}`, data)
    }

    async deleteProduct(id: string): Promise<void> {
        await this.api.delete(`/products/${id}`)
    }
}

// Export singleton instance
export const productsService = new ProductsService()
```

### 3. Stores (Global State without Pinia)

Keep app state using Vue 3's reactive system.

```typescript
// stores/auth.ts
import type {User, LoginCredentials} from '~/types'

// Global reactive state
const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)
const loading = ref(false)

// Auth store composable
export const useAuthStore = () => {
    const login = async (credentials: LoginCredentials): Promise<void> => {
        loading.value = true
        try {
            const response = await authService.login(credentials)
            user.value = response.user

            // Store token
            const tokenCookie = useCookie('auth-token', {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
            tokenCookie.value = response.token

        } finally {
            loading.value = false
        }
    }

    const logout = async (): Promise<void> => {
        await authService.logout()
        user.value = null

        // Clear token
        const tokenCookie = useCookie('auth-token')
        tokenCookie.value = null

        await navigateTo('/auth/login')
    }

    const fetchUser = async (): Promise<void> => {
        if (!isAuthenticated.value) return

        try {
            user.value = await authService.getProfile()
        } catch (error) {
            // Token might be expired
            await logout()
        }
    }

    return {
        user: readonly(user),
        isAuthenticated,
        loading: readonly(loading),
        login,
        logout,
        fetchUser
    }
}
```

### 4. Components (Dumb, Reusable UI)

Components are purely presentational - no API calls inside.

```vue
<!-- components/ui/ProductCard.vue -->
<template>
    <div class="product-card">
        <img :src="product.image" :alt="product.name"/>

        <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ formatCurrency(product.price) }}</p>
            <p class="description">{{ product.description }}</p>
        </div>

        <div class="actions">
            <BaseButton @click="$emit('addToCart', product)">
                Add to Cart
            </BaseButton>
            <BaseButton
                variant="outline"
                @click="$emit('viewDetails', product)"
            >
                View Details
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type {Product} from '~/types'

    interface Props {
        product: Product
    }

    interface Emits {
        addToCart: [product: Product]
        viewDetails: [product: Product]
    }

    defineProps<Props>()
    defineEmits<Emits>()

    // Use utility composable
    const {formatCurrency} = useFormatters()
</script>
```

### 5. Composables (Reusable Logic)

Composables contain reusable stateful logic and API hooks.

```typescript
// composables/api/useProducts.ts
export const useProducts = () => {
    const products = ref<Product[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchProducts = async (filters?: ProductFilters): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const response = await productsService.getProducts(filters)
            products.value = response.data
        } catch (err) {
            error.value = 'Failed to fetch products'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const createProduct = async (data: Partial<Product>): Promise<Product | null> => {
        loading.value = true
        try {
            const newProduct = await productsService.createProduct(data)
            products.value.unshift(newProduct)
            return newProduct
        } catch (err) {
            error.value = 'Failed to create product'
            return null
        } finally {
            loading.value = false
        }
    }

    const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
        const index = products.value.findIndex(p => p.id === id)
        if (index === -1) return

        try {
            const updated = await productsService.updateProduct(id, data)
            products.value[index] = updated
        } catch (err) {
            error.value = 'Failed to update product'
        }
    }

    const deleteProduct = async (id: string): Promise<void> => {
        try {
            await productsService.deleteProduct(id)
            const index = products.value.findIndex(p => p.id === id)
            if (index > -1) {
                products.value.splice(index, 1)
            }
        } catch (err) {
            error.value = 'Failed to delete product'
        }
    }

    return {
        products: readonly(products),
        loading: readonly(loading),
        error: readonly(error),
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct
    }
}
```

## Key Configuration Files

### Nuxt Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    devtools: {enabled: true},

    css: ['~/assets/scss/main.scss'],

    modules: [
        '@nuxtjs/tailwindcss',
        '@vueuse/nuxt'
    ],

    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000/api'
        }
    },

    // Auto-import configuration
    imports: {
        dirs: [
            'composables/**',
            'stores/**',
            'services/**',
            'utils/**'
        ]
    },

    // Component auto-import
    components: [
        {
            path: '~/components',
            pathPrefix: false
        }
    ]
})
```

### API Client Setup

```typescript
// services/api.ts
export const useApiClient = () => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    return $fetch.create({
        baseURL: config.public.apiBaseUrl,

        onRequest({options}) {
            const token = useCookie('auth-token')
            if (token.value) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token.value}`
                }
            }
        },

        onResponseError({response}) {
            if (response.status === 401) {
                authStore.logout()
            }
        }
    })
}
```

## Benefits of This Architecture

1. **Clear Separation**: Each layer has a single responsibility
2. **No Pinia Overhead**: Uses Vue 3's built-in reactivity
3. **Type Safety**: Full TypeScript integration
4. **Testable**: Each layer can be unit tested independently
5. **Scalable**: Easy to add new features and maintain
6. **Performance**: Lightweight without unnecessary abstractions
7. **Developer Experience**: Auto-imports and clear file organization

## Usage Patterns

### Adding a New Feature

1. Define types in `types/`
2. Create service in `services/`
3. Build composable in `composables/`
4. Create components in `components/`
5. Add pages in `pages/`
6. Set up global state in `stores/` if needed

### Best Practices

- Keep components dumb and reusable
- Put business logic in composables
- Use services only for API calls
- Leverage TypeScript for better DX
- Follow consistent naming conventions
- Use auto-imports to reduce boilerplate

This architecture provides excellent maintainability while staying true to Vue 3 and Nuxt 3 principles!
