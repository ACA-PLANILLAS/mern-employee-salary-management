import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FormAddDataJabatan from './index';
import '@testing-library/jest-dom';

// 1. Mock de componentes hijos problemáticos
jest.mock('../../../../atoms/CurrencySwitcher/index', () => () => (
  <div data-testid="currency-switcher-mock">USD</div>
));

jest.mock('../../../PrintPdf/PrintPdfLaporanGaji/index', () => () => <div>PDF Mock</div>);

// 2. Mock de librerías externas
jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
        const translations = {
            formAddJobTitle: "Job Title Data Form",
            jobTitle: "Job Title",
            basicSalary: "Basic Salary",
            transportAllowance: "Transport Allowance",
            mealAllowance: "Meal Allowance",
            enterJobTitle: "Enter job title",
            enterBasicSalary: "Enter basic salary",
            enterTransportAllowance: "Enter transport allowance",
            enterMealAllowance: "Enter meal allowance",
            save: "Save",
            back: "Back",
            success: "Successful",
            error: "Failed",
            requiredAndGreaterThanZero: "This field is required and must be greater than zero",
            invalidFormat: "Invalid format. Use only numbers with up to 2 decimal places",
            invalidMoneyFields: "Check monetary fields, only positive numeric values are allowed",
            allFieldsRequired: "All fields are required",
            errorOccurred: "An error occurred",
        };
        return translations[key] || key;
        },
        i18n: {
        language: 'en',
        changeLanguage: jest.fn(),
        }
    }),
    withTranslation: () => (Component) => {
      Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
      return Component;
    },
    Trans: ({ children }) => children
  }));

// 3. Mock de hooks de currency
jest.mock('../../../../../config/currency/currencyStore', () => ({
  useCurrency: () => ({
    currency: 'USD',
    setCurrency: jest.fn()
  }),
  getCurrentRate: () => 1,
  getSymbol: () => '$'
}));

jest.mock('../../../../../config/currency/useCurrencyByUser', () => () => ({
  currency: 'USD',
  symbol: '$',
  toUSD: (value) => value
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Renderizado básico', () => {
  let store;
  let history;

  beforeEach(() => {
    history = createMemoryHistory();
    store = mockStore({
      auth: {
        isError: false,
        user: { hak_akses: 'admin' }
      }
    });
  });

  test('Renderiza los campos principales', () => {
    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <FormAddDataJabatan />
        </HistoryRouter>
      </Provider>
    );
  
    expect(screen.getByTestId('currency-switcher-mock')).toBeInTheDocument();
  
    // Ahora usamos expresión regular flexible
    expect(screen.getByPlaceholderText(/enter job title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter basic salary/i)).toBeInTheDocument();
    
  });
  
});