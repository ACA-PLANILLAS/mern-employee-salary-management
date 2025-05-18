// src/components/DetailDataGaji/DetailDataGaji.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DetailDataGaji from './index.jsx';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './../../../config/internalization/i18nTest';  // <-- importamos i18n configurado para test

jest.mock('axios');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('DetailDataGaji Integration Test', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { hak_akses: 'admin' },
        isError: false,
      },
    });
  });

  it('muestra datos de la nómina y permite navegar a impresión', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{
        tahun: '2025',
        bulan: 'May',
        nik: '12345',
        nama_pegawai: 'John Doe',
        jabatan: 'Developer',
        gaji_pokok: '5000000',
        tj_transport: '500000',
        uang_makan: '300000',
        potongan: '200000',
        total: '5600000',
      }],
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/data-gaji/detail/JohnDoe']}>
          <Routes>
            <Route
              path="/data-gaji/detail/:name"
              element={
                <I18nextProvider i18n={i18n}>
                  <DetailDataGaji />
                </I18nextProvider>
              }
            />
            <Route path="/laporan/slip-gaji/print-page" element={<div>Print Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Esperar que los datos se muestren en pantalla
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('12345')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('May')).toBeInTheDocument();
      expect(screen.getByText('2025')).toBeInTheDocument();
      expect(screen.getByText('Rp. 5000000')).toBeInTheDocument();
    });

    // Verificar que el botón de imprimir existe y hacer click
    const printButton = screen.getByRole('button', { name: /Print Salary Slip/i });
    expect(printButton).toBeInTheDocument();

    fireEvent.click(printButton);

    // Verificar que la navegación a la página de impresión funciona
    await waitFor(() => {
      expect(screen.getByText('Print Page')).toBeInTheDocument();
    });
  });
});