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

    // Mock del API
    axios.get.mockResolvedValue({
      data: {
        nama_pegawai: 'Sarai Leiva',
        hak_akses: 'pegawai',
        photo: 'sarai.jpg',
      },
    });
  });

  it('renders profile info and handles logout (TC-021, TC-027)', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sarai Leiva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sarai Leiva'));
    fireEvent.click(screen.getByText('dropdown.logout'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });
  });

  it('renders settings link correctly (TC-022)', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sarai Leiva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sarai Leiva'));

    await waitFor(() => {
      const settingsLink = screen.getByText('dropdown.settings');
      expect(settingsLink.closest('a')).toHaveAttribute('href', '/ubah-password-pegawai');
    });
  });

  it('renders the image source correctly (TC-023)', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const img = screen.getByAltText('Profil');
      expect(img).toHaveAttribute('src', expect.stringContaining('sarai.jpg'));
    });
  });

  it('closes the dropdown when clicking outside (TC-DP-004)', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <DropdownProfil />
            <button data-testid="outside-button">Outside</button>
          </div>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sarai Leiva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sarai Leiva'));

    await waitFor(() => {
      expect(screen.getByText('dropdown.logout')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('outside-button'));

    await waitFor(() => {
      expect(screen.queryByText('dropdown.logout')).not.toBeInTheDocument();
    });
  });

  it('closes the dropdown when pressing Escape (TC-025)', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sarai Leiva')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sarai Leiva'));

    await waitFor(() => {
      expect(screen.getByText('dropdown.logout')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape', keyCode: 27 });

    await waitFor(() => {
      expect(screen.queryByText('dropdown.logout')).not.toBeInTheDocument();
    });
  });

  it('does not crash if API fails (TC-026)', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    // Verificamos que el componente no se rompa y que no se muestre el nombre del usuario
    await waitFor(() => {
      expect(screen.queryByText('Sarai Leiva')).not.toBeInTheDocument();
    });
  });

  it('uses correct translation keys (TC-028)', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Sarai Leiva'));
    });

    expect(screen.getByText('dropdown.settings')).toBeInTheDocument();
    expect(screen.getByText('dropdown.logout')).toBeInTheDocument();
  });

  it('does not open dropdown if user is null (TC-029)', async () => {
    store = mockStore({
      auth: {
        user: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText('dropdown.logout')).not.toBeInTheDocument();
  });

  it('dispatches logout and reset (TC-030)', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DropdownProfil />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Sarai Leiva'));
    });

    fireEvent.click(screen.getByText('dropdown.logout'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });

    const actions = store.getActions();
    expect(actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'user/logoutUser/pending' }),
        expect.objectContaining({ type: 'auth/reset' }),
        expect.objectContaining({ type: 'user/logoutUser/fulfilled' }),
      ])
    );
  });
});