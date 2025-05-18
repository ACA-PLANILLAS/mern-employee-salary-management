import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DetailDataGaji from './index.jsx';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './../../../config/internalization/i18nTest';

jest.mock('axios');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('DetailDataGaji', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { hak_akses: 'admin' },
        isError: false,
      },
    });

    // Mock para /parameters
    axios.get.mockImplementation((url) => {
      if (url.includes('/parameters')) {
        return Promise.resolve({
          data: [{ type: 'PMON', value: 1 }],
        });
      }

      if (url.includes('/data_gaji_pegawai/')) {
        return Promise.resolve({
          data: {
            first_name: 'John',
            middle_name: '',
            last_name: 'Doe',
            second_last_name: '',
            maiden_name: '',
            document_type: 'DUI',
            dui_or_nit: '12345',
            hire_date: '2023-01-01',
            nama_jabatan: 'Developer',
            hak_akses: 'admin',
            month: 'May',
            year: '2025',
            gaji_pokok: 5000000,
            tj_transport: 500000,
            uang_makan: 300000,
            salarioBruto: 5800000,
            castigo_ausencias: 0,
            subtotalStandarDeductions: 200000,
            subtotalDynamicDeductions: 0,
            total: 5600000,
            attendanceId: 99,
            detallesDeducciones: [
              {
                type: 'STA',
                nama_potongan: 'ISSS',
                valueDeducted: 200000,
              },
            ],
          },
        });
      }

      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  it('renderiza datos y registra en consola al imprimir', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // Espiar console.log

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/data-gaji/detail/JohnDoe']}>
          <Routes>
            <Route
              path="/data-gaji/detail/:id"
              element={
                <I18nextProvider i18n={i18n}>
                  <DetailDataGaji />
                </I18nextProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Esperamos a que se rendericen los datos
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/2025/i)).toBeInTheDocument();
      expect(screen.getByText(/May/i)).toBeInTheDocument();
    });

    // Botón de impresión
    const printButton = screen.getByRole('button', { name: /Print Salary Slip/i });
    expect(printButton).toBeInTheDocument();

    // Simular click
    fireEvent.click(printButton);

    // Verificar que se ejecutó el console.log
    expect(logSpy).toHaveBeenCalledWith("Imprimir boleta de:", 99);

    logSpy.mockRestore(); // Limpiar espía
  });
});
