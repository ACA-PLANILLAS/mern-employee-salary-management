import '@testing-library/jest-dom';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
globalThis.import = { meta: { env: { VITE_API_URL: 'http://localhost:3000' } } };
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };