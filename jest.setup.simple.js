import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: { id: 'test-user', emailAddresses: [{ emailAddress: 'test@example.com' }] },
    isLoaded: true,
  }),
  useAuth: () => ({
    isLoaded: true,
    userId: 'test-user',
    sessionId: 'test-session',
    getToken: jest.fn(),
  }),
  SignInButton: ({ children }) => children,
  SignUpButton: ({ children }) => children,
  UserButton: () => <div>User Button</div>,
}))

// Mock React-to-print
jest.mock('react-to-print', () => ({
  useReactToPrint: () => jest.fn(),
}))

// Environment variables
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-key'
process.env.CLERK_SECRET_KEY = 'test-secret'
process.env.NEON_DATABASE_URL = 'test-db-url'
