const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Fournir le chemin vers l'application Next.js pour charger next.config.js et les fichiers .env
  dir: './',
})

// ajouter une configuration personnalisée
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/globals.css',
    '!src/app/layout.tsx',
    '!src/middleware.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
}

// createJestConfig est exporté de cette manière pour s'assurer que next/jest peut charger la configuration Next.js qui est asynchrone
module.exports = createJestConfig(customJestConfig)
