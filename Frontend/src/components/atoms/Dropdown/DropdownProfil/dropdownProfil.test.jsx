import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DropdownProfil from './index.jsx';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock de axios
jest.mock('axios');

// Mock de SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

// Simular variables de entorno para Jest
process.env.VITE_API_URL = "http://localhost:3000";

// Mock de i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('DropdownProfil Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          nama_pegawai: 'Sarai Leiva',
          hak_akses: 'pegawai',
        },
      },
    });

    // Configurar el mock de axios.get para que devuelva datos simulados
    axios.get.mockResolvedValue({
      data: {
        nama_pegawai: 'Sarai Leiva',
        hak_akses: 'pegawai',
        photo: 'sarai.jpg',
      },
    });
  });

  it('renders profile info and handles logout', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    // Espera a que el nombre aparezca en pantalla
    await waitFor(() => {
      expect(screen.getByText('Sarai Leiva')).toBeInTheDocument();
    });

    // Clic en el dropdown
    fireEvent.click(screen.getByText('Sarai Leiva'));

    // Clic en el botón de logout
    fireEvent.click(screen.getByText('dropdown.logout'));

    // Espera a que SweetAlert se invoque
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });
  });
});