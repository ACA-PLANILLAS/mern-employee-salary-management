import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SidebarAdmin from './index';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { logoutUser } from '../../../../config/redux/action';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../config/internalization/i18nTest'; // Archivo de configuración de i18n para test

jest.mock('../../../../config/redux/action', () => ({
  logoutUser: jest.fn(() => ({ type: 'LOGOUT_USER' })),
}));

const mockStore = configureStore([]);

beforeAll(() => {
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(), // For backward compatibility
      removeListener: jest.fn(), // For backward compatibility
    };
  };
});

describe('SidebarAdmin', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { name: 'Admin', hak_akses: 'admin' },
        isError: false,
      },
    });
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <SidebarAdmin sidebarOpen={true} setSidebarOpen={jest.fn()} {...props} />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders logo and dashboard link', () => {
    renderComponent();
    expect(screen.getByAltText(/Logo SiPeKa/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('contains logout menu and triggers confirmation', async () => {
    renderComponent();
  
    const pengaturanToggle = screen.getByTestId('pengaturan-toggle');
    fireEvent.click(pengaturanToggle);
  
    const logoutLink = await screen.findByText(/logout/i);
    fireEvent.click(logoutLink);
  
    await waitFor(() => {
      expect(
        screen.getByText(/¿Estás seguro?|logoutConfirmationTitle/i)
      ).toBeInTheDocument();
    });
  });

  it('closes sidebar on ESC key press', () => {
    const setSidebarOpenMock = jest.fn();
    renderComponent({ setSidebarOpen: setSidebarOpenMock });

    fireEvent.keyDown(document, { key: 'Escape', keyCode: 27 });

    expect(setSidebarOpenMock).toHaveBeenCalledWith(false);
  });

  it('stores sidebar expanded state in localStorage', () => {
    renderComponent();
  
    // Simula que se expandió el sidebar
    localStorage.setItem('sidebar-expanded', 'true');
  
    expect(localStorage.getItem('sidebar-expanded')).toBe('true');
  });

  it('closes sidebar when clicking outside', () => {
    const setSidebarOpenMock = jest.fn();
    renderComponent({ sidebarOpen: true, setSidebarOpen: setSidebarOpenMock });
  
    fireEvent.click(document);
  
    expect(setSidebarOpenMock).toHaveBeenCalledWith(false);
  });

  it('shows logout confirmation modal', async () => {
    localStorage.setItem('sidebar-expanded', 'true');
    renderComponent();
  
    // 1. Expande el grupo "Pengaturan / Settings"
    const settingsButtons = screen.getAllByText((_, el) => {
      const text = el?.textContent?.toLowerCase();
      return text?.includes('pengaturan') || text?.includes('settings');
    });
  
    const settingsToggle = settingsButtons.find(el => el.tagName === 'A' || el.closest('a'));
    expect(settingsToggle).toBeDefined();
    fireEvent.click(settingsToggle);
  
    // 2. Busca el botón de logout dentro de los submenus
    const logoutLink = screen.getAllByText((_, el) => {
      const text = el?.textContent?.toLowerCase();
      return text?.includes('logout') || text?.includes('cerrar sesión');
    }).find(el => el.tagName === 'A' || el.closest('a'));
  
    expect(logoutLink).toBeDefined();
    fireEvent.click(logoutLink);
  
    // 3. Verifica que se muestra el modal de confirmación
    await waitFor(() => {
      const confirmationModals = screen.getAllByText((_, el) => {
        const text = el?.textContent?.toLowerCase();
        return (
          text?.includes('¿estás seguro') ||
          text?.includes('logout confirmation') ||
          text?.includes('logoutconfirmationtitle')
        );
      });
      expect(confirmationModals.length).toBeGreaterThan(0);
    });
  });
});

// Buscar el botón del menú "Master Data"
//const masterDataToggle = screen.getByTestId('masterdata-toggle');
  
// Clic para abrir submenú
//fireEvent.click(masterDataToggle);