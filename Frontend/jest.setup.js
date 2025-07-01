import '@testing-library/jest-dom';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
globalThis.import = { meta: { env: { VITE_API_URL: 'http://localhost:3000' } } };
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

// Polyfill para testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock global para useCurrency
globalThis.mockUseCurrency = {
  currency: 'USD',
  setCurrency: jest.fn()
};

// Silencia todos los console de forma temporal
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});

});

