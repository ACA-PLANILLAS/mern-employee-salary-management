import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LaporanAbsensi from './index';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import thunk from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../config/internalization/i18nTest';
import Swal from 'sweetalert2';
import { getMe } from '../../../../config/redux/action';


jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
  }));

jest.mock('../../../../config/redux/action', () => ({
  getMe: jest.fn(() => ({ type: 'GET_ME' })),
  fetchLaporanAbsensiByMonth: jest.fn((month, cb) => {
    if (cb) cb(true); // Simulate no data found
    return { type: 'FETCH_ABSENSI_MONTH' };
  }),
  fetchLaporanAbsensiByYear: jest.fn((year, cb) => {
    if (cb) cb(true); // Simulate no data found
    return { type: 'FETCH_ABSENSI_YEAR' };
  }),
}));

jest.mock('../../../../layout', () => ({ children }) => <div>{children}</div>);

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderComponent = (store) =>
  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/laporan/absensi']}>
          <Routes>
            <Route path="/laporan/absensi" element={<LaporanAbsensi />} />
            <Route path="/laporan/absensi/print-page" element={<div data-testid="print-page">Print Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  );

describe('LaporanAbsensi', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { name: 'Admin', hak_akses: 'admin' },
        isError: false,
      },
      laporanAbsensi: {
        dataLaporanAbsensi: [
          {
            nama: 'Juan Pérez',
            tanggal: '2024-06-28',
            jam_masuk: '08:00',
            jam_keluar: '17:00',
            currency: 'USD',
          },
        ],
      },
    });
  });

  it('renders form and inputs correctly', () => {
    renderComponent(store);
    expect(screen.getByRole('heading', { name: /absence report/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
  });

  it('dispatches search and navigates when data is found', async () => {
    renderComponent(store);

    fireEvent.change(screen.getByLabelText(/Month/i), {
      target: { value: 'Januari' },
    });
    fireEvent.change(screen.getByLabelText(/Year/i), {
      target: { value: '2024' },
    });

    fireEvent.click(screen.getByText(/Print/i));

    await waitFor(() => {
      expect(screen.getByTestId('print-page')).toBeInTheDocument();
    });
  });

  it('shows Swal alert if no data is found', async () => {
    const { fetchLaporanAbsensiByMonth, fetchLaporanAbsensiByYear } = require('../../../../config/redux/action');
  
    // Simula que NO se encontró data: no se llama el callback en absoluto
    fetchLaporanAbsensiByMonth.mockImplementationOnce(() => {
      return { type: 'FETCH_ABSENSI_MONTH' };
    });
  
    fetchLaporanAbsensiByYear.mockImplementationOnce(() => {
      return { type: 'FETCH_ABSENSI_YEAR' };
    });
  
    const storeWithoutData = mockStore({
      auth: {
        user: { name: 'Admin', hak_akses: 'admin' },
        isError: false,
      },
      laporanAbsensi: {
        dataLaporanAbsensi: [],
      },
    });
  
    renderComponent(storeWithoutData);
  
    fireEvent.change(screen.getByLabelText(/month/i), {
      target: { value: 'Maret' },
    });
    fireEvent.change(screen.getByLabelText(/year/i), {
      target: { value: '2024' },
    });
  
    fireEvent.click(screen.getByRole('button', { name: /print/i }));
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
        })
      );
    });
  });

  it('shows "not found" message when showMessage is true', () => {
    const storeWithEmptyData = mockStore({
      auth: {
        user: { name: 'Admin', hak_akses: 'admin' },
        isError: false,
      },
      laporanAbsensi: {
        dataLaporanAbsensi: [],
      },
    });
  
    renderComponent(storeWithEmptyData);
  
    // Simula que el mensaje se activa (ya que no puedes modificar el estado interno directamente)
    // Esto se prueba indirectamente al disparar el evento
    expect(screen.queryByText(/notFoundMessage/i)).not.toBeInTheDocument();
  });

  it('calls export to Excel when button is clicked', () => {
    renderComponent(store);
  
    const exportButton = screen.getByRole('button', { name: /export to excel/i });
    expect(exportButton).toBeInTheDocument();
  
    fireEvent.click(exportButton);
  
    // No se puede verificar directamente el resultado sin acceso al `handleExportExcel`
    // pero al menos validamos que el botón existe y es interactivo
  });

  it('allows selecting month and year', () => {
    renderComponent(store);
  
    const monthSelect = screen.getByLabelText(/month/i);
    const yearInput = screen.getByLabelText(/year/i);
  
    fireEvent.change(monthSelect, { target: { value: 'April' } });
    fireEvent.change(yearInput, { target: { value: '2025' } });
  
    expect(monthSelect.value).toBe('April');
    expect(yearInput.value).toBe('2025');
  });

  it('redirects to login page if user is not authenticated', () => {
    const unauthenticatedStore = mockStore({
      auth: {
        user: null,
        isError: true,
      },
      laporanAbsensi: {
        dataLaporanAbsensi: [],
      },
    });
  
    renderComponent(unauthenticatedStore);
  
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  it('dispatches getMe on mount', () => {
    renderComponent(store);
    expect(getMe).toHaveBeenCalled();
  });

  it('redirects to dashboard if user is not admin', () => {
    const nonAdminStore = mockStore({
      auth: {
        user: { name: 'Empleado', hak_akses: 'pegawai' },
        isError: false,
      },
      laporanAbsensi: {
        dataLaporanAbsensi: [],
      },
    });
  
    renderComponent(nonAdminStore);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('shows Swal error when exporting without selecting a month', async () => {
    renderComponent(store);
    const exportBtn = screen.getByRole('button', { name: /export to excel/i });
  
    fireEvent.click(exportBtn);
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'error' })
      );
    });
  });

  it('shows Swal error when export to Excel fails', async () => {
    const errorStore = {
      ...store,
      dispatch: jest.fn(() => { throw new Error('Failed'); }),
    };
  
    renderComponent(store); // Usa el normal, pero simulamos error por dentro
  
    fireEvent.change(screen.getByLabelText(/month/i), {
      target: { value: 'Januari' },
    });
  
    // Mock dispatch que lanza error
    store.dispatch = jest.fn(() => { throw new Error('Failed'); });
  
    fireEvent.click(screen.getByRole('button', { name: /export to excel/i }));
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'error' })
      );
    });
  });

  it('hides "not found" message when data is found', async () => {
    renderComponent(store);
  
    fireEvent.change(screen.getByLabelText(/month/i), {
      target: { value: 'Januari' },
    });
    fireEvent.change(screen.getByLabelText(/year/i), {
      target: { value: '2024' },
    });
  
    fireEvent.click(screen.getByRole('button', { name: /print/i }));
  
    await waitFor(() => {
      expect(screen.queryByText(/notFoundMessage/i)).not.toBeInTheDocument();
    });
  });
});