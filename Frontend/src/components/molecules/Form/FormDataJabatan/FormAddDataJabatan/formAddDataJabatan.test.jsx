import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormAddDataJabatan from './index.jsx';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../../config/internalization/i18nTest.js';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useCurrency } from '../../../../../config/currency/currencyStore';

jest.mock('../../../../../config/currency/currencyStore', () => ({
  useCurrency: () => ({
    currency: 'USD',
    setCurrency: jest.fn(),
  }),
  getCurrentRate: () => 1,
  getSymbol: () => '$',
}));

jest.mock('../../../../../config/currency/useCurrencyByUser', () => () => ({
  currency: 'USD',
  symbol: '$',
  toUSD: (value) => value,
}));

jest.mock('../../../../atoms/CurrencySwitcher/index', () => () => (
  <div data-testid="currency-switcher-mock">USD</div>
));

jest.mock('axios');
jest.mock('sweetalert2', () => ({ fire: jest.fn() }));

beforeEach(() => {
  Swal.fire.mockClear();
});

jest.mock('../../../../../config/redux/action', () => ({
  getMe: jest.fn(() => () => Promise.resolve()),
  createDataJabatan: jest.fn(() => () => Promise.resolve({ message: 'Success' })),
}));

jest.mock('../../../../../hooks/useErrorMessage', () => ({
  useErrorMessage: () => (msg) => msg,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockStore = configureStore([thunk]);
const store = mockStore({
  auth: { isError: false, user: { hak_akses: 'admin' } },
});

const renderWithProviders = (ui) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
      </MemoryRouter>
    </Provider>
  );
  function forceInputValue(input, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

// Helper para forzar valor en inputs controlados
function setNativeValue(element, value) {
  const { set } = Object.getOwnPropertyDescriptor(element, 'value') || {};
  const prototype = Object.getPrototypeOf(element);
  const prototypeSet = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

  if (set) {
    set.call(element, value);
  } else if (prototypeSet) {
    prototypeSet.call(element, value);
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('FormAddDataJabatan Component', () => {
  beforeEach(() => {
    Swal.fire.mockClear();
  });

  it('renders all form fields and buttons', () => {
    renderWithProviders(<FormAddDataJabatan />);

    expect(screen.getByPlaceholderText(/enter job title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter basic salary/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter transport allowance/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter meal allowance/i)).toBeInTheDocument();
    expect(screen.getByText(/save/i)).toBeInTheDocument();
    expect(screen.getByText(/back/i)).toBeInTheDocument();
  });

  it('shows error if salary is zero', async () => {
    renderWithProviders(<FormAddDataJabatan />);

    fireEvent.change(screen.getByPlaceholderText(/enter job title/i), {
      target: { value: 'Developer' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter basic salary/i), {
      target: { value: '0' },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'error' })
      );
    });
  });

  it('does not accept negative salary input', async () => {
    renderWithProviders(<FormAddDataJabatan />);
  
    const salaryInput = screen.getByPlaceholderText(/enter basic salary/i);
    fireEvent.change(salaryInput, { target: { value: '-500' } });
  
    // Esperar que el valor del input siga siendo vacío (o no -500)
    await waitFor(() => {
      expect(salaryInput.value).not.toBe('-500');
    });
  });

  it('does not accept non-numeric allowance input', async () => {
    renderWithProviders(<FormAddDataJabatan />);
  
    const transportInput = screen.getByPlaceholderText(/enter transport allowance/i);
    fireEvent.change(transportInput, { target: { value: 'abc' } });
  
    await waitFor(() => {
      expect(transportInput.value).not.toBe('abc');
    });
  });

  it('submits valid data and shows success', async () => {
    renderWithProviders(<FormAddDataJabatan />);

    fireEvent.change(screen.getByPlaceholderText(/enter job title/i), {
      target: { value: 'Manager' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter basic salary/i), {
      target: { value: '1500' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter transport allowance/i), {
      target: { value: '200' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter meal allowance/i), {
      target: { value: '100' },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'success' })
      );
    });
  });
});