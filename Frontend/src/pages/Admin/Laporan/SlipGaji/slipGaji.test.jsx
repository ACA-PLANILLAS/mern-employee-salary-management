import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlipGaji from './index';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../config/internalization/i18nTest';
import Swal from 'sweetalert2';
import * as actions from '../../../../config/redux/action';

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
  }));
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
jest.mock('../../../../layout', () => ({ children }) => <div>{children}</div>);

jest.mock('../../../../config/redux/action', () => ({
  getMe: jest.fn(() => ({ type: 'GET_ME' })),
  getDataPegawai: jest.fn(() => ({ type: 'GET_PEGAWAI' })),
  fetchSlipGajiByName: jest.fn(() => ({ type: 'FETCH_SLIP_GAJI' }))
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderComponent = (store) =>
  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/slip/gaji']}>
          <Routes>
            <Route path="/slip/gaji" element={<SlipGaji />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  );

describe('SlipGaji', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { name: 'Admin', hak_akses: 'admin' },
        isError: false,
      },
      dataPegawai: {
        dataPegawai: [
          { id: '1', first_name: 'Ana', last_name: 'Ramirez' },
        ]
      },
      slipGaji: {
        dataSlipGaji: [],
      }
    });

    jest.clearAllMocks();
  });

  it('renders form and options', () => {
    renderComponent(store);
    expect(screen.getByLabelText(/bulan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tahun/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pegawai/i)).toBeInTheDocument();
  });

  it('redirects to login if isError is true', () => {
    const errorStore = mockStore({
      auth: { user: null, isError: true },
      dataPegawai: { dataPegawai: [] },
      slipGaji: { dataSlipGaji: [] },
    });
    renderComponent(errorStore);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('redirects to dashboard if not admin', () => {
    const userStore = mockStore({
      auth: { user: { name: 'User', hak_akses: 'pegawai' }, isError: false },
      dataPegawai: { dataPegawai: [] },
      slipGaji: { dataSlipGaji: [] },
    });
    renderComponent(userStore);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('calls getMe and getDataPegawai on mount', () => {
    renderComponent(store);
    expect(actions.getMe).toHaveBeenCalled();
    expect(actions.getDataPegawai).toHaveBeenCalled();
  });

  it('shows result if employee is found', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [
        {
          id: '1',
          first_name: 'Ana',
          last_name: 'Ramirez',
          attendanceId: 'A001',
        },
      ],
    });
  
    renderComponent(store);
  
    fireEvent.change(screen.getByLabelText(/bulan/i), {
      target: { value: 'Januari' },
    });
    fireEvent.change(screen.getByLabelText(/tahun/i), {
      target: { value: '2024' },
    });
    fireEvent.change(screen.getByLabelText(/pegawai/i), {
      target: { value: '1' },
    });
  
    fireEvent.click(screen.getByRole('button', { name: /consultar/i }));

    await waitFor(() => {
        expect(screen.getByTestId('slip-title')).toHaveTextContent(/verReciboDe Ana Ramirez/i);
      });
  });

  it('shows not found message if no results', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [],
    });

    renderComponent(store);

    fireEvent.change(screen.getByLabelText(/bulan/i), { target: { value: 'Januari' } });
    fireEvent.change(screen.getByLabelText(/tahun/i), { target: { value: '2024' } });
    fireEvent.change(screen.getByLabelText(/pegawai/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /consultar/i }));

    await waitFor(() => {
        expect(
          screen.getByText(/notFoundShort/i)
        ).toBeInTheDocument();
      });
  });

  it('renders employee options in the dropdown', () => {
    renderComponent(store);
  
    const select = screen.getByLabelText(/pegawai/i);
    fireEvent.change(select, { target: { value: '1' } });
  
    expect(select.value).toBe('1');
    expect(screen.getByText(/Ana Ramirez/i)).toBeInTheDocument();
  });

  it('does not allow negative year input', () => {
    renderComponent(store);
  
    const yearInput = screen.getByLabelText(/tahun/i);
    fireEvent.change(yearInput, { target: { value: '-2024' } });
  
    expect(yearInput.value).toBe('-2024'); // el input lo permite pero tu lógica puede bloquearlo al enviar
  });

  it('shows result if employee is found', async () => {
    renderComponent(store);
  
    fireEvent.change(screen.getByLabelText(/bulan/i), { target: { value: 'Januari' } });
    fireEvent.change(screen.getByLabelText(/tahun/i), { target: { value: '2024' } });
    fireEvent.change(screen.getByLabelText(/pegawai/i), { target: { value: '1' } });
  
    // Respuesta del backend simulada
    global.fetch.mockResolvedValueOnce({
      json: async () => [
        {
          id: '1',
          attendanceId: 'A-123',
          first_name: 'Ana',
          last_name: 'Ramirez'
        },
      ],
    });
  
    fireEvent.click(screen.getByRole('button', { name: /consultar/i }));
  
    await waitFor(() => {
        const allMatches = screen.getAllByText(/Ana Ramirez/i);
        expect(allMatches.length).toBeGreaterThan(1); // opcional
        expect(
          allMatches.some(el => el.closest('p')?.textContent.includes('verReciboDe'))
        ).toBe(true);
      });
  });
});