// Create a proper chainable mock
const createChainableMock = () => {
  const mockChain = {
    select: jest.fn(function () {
      return this;
    }),
    insert: jest.fn(function () {
      return this;
    }),
    update: jest.fn(function () {
      return this;
    }),
    delete: jest.fn(function () {
      return this;
    }),
    eq: jest.fn(function () {
      return this;
    }),
    neq: jest.fn(function () {
      return this;
    }),
    gt: jest.fn(function () {
      return this;
    }),
    lt: jest.fn(function () {
      return this;
    }),
    gte: jest.fn(function () {
      return this;
    }),
    lte: jest.fn(function () {
      return this;
    }),
    single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    then: jest.fn(resolve => resolve({ data: [], error: null })),
  };

  // Make it thenable (promise-like)
  mockChain.then = jest.fn(resolve => Promise.resolve({ data: [], error: null }).then(resolve));

  return mockChain;
};

export const supabase = {
  from: jest.fn(() => createChainableMock()),

  auth: {
    getUser: jest.fn(() =>
      Promise.resolve({
        data: { user: { id: 'test-user', email: 'test@test.com' } },
        error: null,
      })
    ),
    getSession: jest.fn(() =>
      Promise.resolve({
        data: { session: null },
        error: null,
      })
    ),
    signInWithPassword: jest.fn(() =>
      Promise.resolve({
        data: { user: { id: 'test-user' }, session: {} },
        error: null,
      })
    ),
    signUp: jest.fn(() =>
      Promise.resolve({
        data: { user: { id: 'test-user' }, session: {} },
        error: null,
      })
    ),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
  },
};
