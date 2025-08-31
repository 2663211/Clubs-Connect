// jest.config.js
export const testEnvironment = 'jsdom';
export const setupFilesAfterEnv = ['@testing-library/jest-dom/extend-expect'];
export const transformIgnorePatterns =[
      "[/\\\\]node_modules[/\\\\].+[^esm]\\.(js|jsx|mjs|cjs|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ];