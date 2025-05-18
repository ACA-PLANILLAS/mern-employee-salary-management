import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import DefaultDashboard from './index.jsx';
import axios from 'axios';

// Mock de axios
jest.mock('axios');

// Mock del Layout y componentes hijos para simplificar
jest.mock('../../../layout', () => ({ children }) => <div>{children}</div>);
jest.mock('../../../components', () => ({
  CardOne: () => <div>CardOne</div>,
  CardTwo: () => <div>CardTwo</div>,
  CardThree: () => <div>CardThree</div>,
  CardFour: () => <div>CardFour</div>,
  ChartOne: () => <div>ChartOne</div>,
  ChartTwo: () => <div>ChartTwo</div>,
  Breadcrumb: () => <div>Breadcrumb</div>,
}));

const mockStore = configureStore([]);

describe('DefaultDashboard - integración', () => {
  test('muestra datos del empleado si el usuario es pegawai', async () => {
    const mockUser = {
      nama_pegawai: 'Sarai Leiva',
      hak_akses: 'pegawai',
    };

    const store = mockStore({
      auth: { user: mockUser },
    });

    const mockResponse = {
      nik: '123456789',
      nama_pegawai: 'Sarai Leiva',
      tanggal_masuk: '2023-01-01',
      jabatan: 'Desarrolladora',
      photo: 'sarai.jpg',
    };

    axios.get.mockResolvedValue({ data: mockResponse });

    render(
      <Provider store={store}>
        <DefaultDashboard />
      </Provider>
    );

    expect(screen.getByText('Breadcrumb')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/Selamat Datang di SiPeKa Anda Login Sebagai Pegawai/i)
      ).toBeInTheDocument();

      expect(screen.getByText(/Nama Pegawai/)).toBeInTheDocument();
      expect(screen.getByText(/Sarai Leiva/)).toBeInTheDocument();
      expect(screen.getByText(/123456789/)).toBeInTheDocument();
      expect(screen.getByText(/Desarrolladora/)).toBeInTheDocument();
    });
  });
});