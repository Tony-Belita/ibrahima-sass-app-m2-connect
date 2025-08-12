import '@testing-library/jest-dom/jest-globals'

// Mock environment variables for tests
process.env.NEON_DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.RESEND_API_KEY = 'test_resend_key'
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test_clerk_key'
process.env.CLERK_SECRET_KEY = 'test_clerk_secret'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => ({ userId: 'test-user-id' })),
  currentUser: jest.fn(() => ({ id: 'test-user-id', emailAddresses: [{ emailAddress: 'test@example.com' }] })),
  useUser: jest.fn(() => ({ user: { id: 'test-user-id' }, isLoaded: true })),
  useAuth: jest.fn(() => ({ userId: 'test-user-id', isLoaded: true })),
  ClerkProvider: ({ children }) => children,
  SignInButton: ({ children }) => children,
  SignOutButton: ({ children }) => children,
  UserButton: () => <div>User Button</div>,
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  client: {
    disconnect: jest.fn(),
  },
  facture: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  client: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  bankInfo: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}))

// Global test helpers
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.fetch = jest.fn()

// Suppress console warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
