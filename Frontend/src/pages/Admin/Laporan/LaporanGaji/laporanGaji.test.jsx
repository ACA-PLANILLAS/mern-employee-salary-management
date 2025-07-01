import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LaporanGaji from './index';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../config/internalization/i18nTest';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

jest.mock('../../../../layout', () => ({ children }) => <div>{children}</div>);

jest.mock('../../../../config/redux/action', () => ({
  getMe: jest.fn(() => ({ type: 'GET_ME' })),
  fetchLaporanGajiByMonth: jest.fn((month, cb) => {
    if (cb) cb(true);
    return { type: 'FETCH_GAJI_MONTH' };
  }),
  fetchLaporanGajiByYear: jest.fn((year, cb) => {
    if (cb) cb(true);
    return { type: 'FETCH_GAJI_YEAR' };
  }),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderComponent = (store) =>
  render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={['/laporan/gaji']}>
          <Routes>
            <Route path="/laporan/gaji" element={<LaporanGaji />} />
            <Route path="/laporan/gaji/print-page" element={<div data-testid="print-page">Print Page</div>} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </Provider>
  );

describe('LaporanGaji', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { name: 'Admin', hak_akses: 'admin' },
        isError: false,
      },
      laporanGaji: {
        dataLaporanGaji: [
          { nama: 'Pedro', gaji: 3000, tanggal: '2024-06-01' },
        ],
      },
    });
  });

  it('renders form correctly', () => {
    renderComponent(store);
    
    fireEvent.change(screen.getByLabelText(/Month/i), {
        target: { value: 'Januari' },
      });
      fireEvent.change(screen.getByLabelText(/Year/i), {
        target: { value: '2024' },
      });
  });

  it('dispatches search and navigates when data found', async () => {
    renderComponent(store);

    fireEvent.change(screen.getByLabelText(/month/i), {
      target: { value: 'Januari' },
    });
    fireEvent.change(screen.getByLabelText(/year/i), {
      target: { value: '2024' },
    });

    fireEvent.click(screen.getByTestId('print-button'));

    await waitFor(() => {
      expect(screen.getByTestId('print-page')).toBeInTheDocument();
    });
  });

  it('shows Swal alert if no data found', async () => {
    const { fetchLaporanGajiByMonth, fetchLaporanGajiByYear } = require('../../../../config/redux/action');
    fetchLaporanGajiByMonth.mockImplementationOnce(() => ({ type: 'FETCH_GAJI_MONTH' }));
    fetchLaporanGajiByYear.mockImplementationOnce(() => ({ type: 'FETCH_GAJI_YEAR' }));

    const storeWithoutData = mockStore({
      auth: {
        user: { name: 'Admin', hak_akses: 'admin' },
        isError: false,
      },
      laporanGaji: {
        dataLaporanGaji: [],
      },
    });

    renderComponent(storeWithoutData);

    fireEvent.change(screen.getByLabelText(/month/i), {
      target: { value: 'Maret' },
    });
    fireEvent.change(screen.getByLabelText(/year/i), {
      target: { value: '2024' },
    });

    fireEvent.click(screen.getByTestId('print-button'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
        })
      );
    });
  });

  it('shows Swal error when exporting without selecting month', async () => {
    renderComponent(store);
    fireEvent.click(screen.getByRole('button', { name: /excel/i }));
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'error' })
      );
    });
  });

  it('redirects to dashboard if user is not admin', () => {
    const nonAdminStore = mockStore({
      auth: {
        user: { name: 'Pegawai', hak_akses: 'pegawai' },
        isError: false,
      },
      laporanGaji: {
        dataLaporanGaji: [],
      },
    });
    renderComponent(nonAdminStore);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('redirects to login if isError is true', () => {
    const errorStore = mockStore({
      auth: {
        user: null,
        isError: true,
      },
      laporanGaji: {
        dataLaporanGaji: [],
      },
    });
    renderComponent(errorStore);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('calls getMe on mount', () => {
    const { getMe } = require('../../../../config/redux/action');
    renderComponent(store);
    expect(getMe).toHaveBeenCalled();
  });


  it('exports Excel when month is selected', async () => {
    const { fetchLaporanGajiByMonth } = require('../../../../config/redux/action');
    renderComponent(store);

    fireEvent.change(screen.getByLabelText(/month/i), { target: { value: 'Januari' } });

    fireEvent.click(screen.getByRole('button', { name: /excel/i }));

    await waitFor(() => {
        expect(fetchLaporanGajiByMonth).toHaveBeenCalledWith('Januari', expect.any(Function));
        expect(fileSaver.saveAs).toHaveBeenCalled();
    });
  });

  it('shows Swal when export throws error', async () => {
    const { fetchLaporanGajiByMonth } = require('../../../../config/redux/action');
    fetchLaporanGajiByMonth.mockImplementationOnce(() => {
        throw new Error('Simulated error');
    });
    
    renderComponent(store);
    
    fireEvent.change(screen.getByLabelText(/month/i), { target: { value: 'Maret' } });
    
    fireEvent.click(screen.getByRole('button', { name: /excel/i }));
    
    await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error' }));
    });
  });

  it('does not submit form if month and year are empty', async () => {
    renderComponent(store);
    
    fireEvent.click(screen.getByTestId('print-button'));
    
    await waitFor(() => {
        // Asegúrate que no se navegue (Print Page no debería existir)
        expect(screen.queryByTestId('print-page')).not.toBeInTheDocument();
    });
  });

});