import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Plaid
jest.mock('plaid', () => ({
  Configuration: jest.fn(),
  PlaidApi: jest.fn(),
  PlaidEnvironments: {
    sandbox: 'sandbox',
    development: 'development',
    production: 'production',
  },
}))

// Mock Appwrite
jest.mock('node-appwrite', () => ({
  Client: jest.fn(),
  Account: jest.fn(),
  Databases: jest.fn(),
  ID: jest.fn(),
}))

// Mock Dwolla
jest.mock('dwolla-v2', () => ({
  Client: jest.fn(),
}))

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Doughnut: () => null,
  Line: () => null,
  Bar: () => null,
}))
