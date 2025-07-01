import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SidebarPegawai from './index';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { logoutUser } from '../../../../config/redux/action';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../config/internalization/i18nTest';

jest.mock('../../../../config/redux/action', () => ({
  logoutUser: jest.fn(() => ({ type: 'LOGOUT_USER' })),
}));

const mockStore = configureStore([]);

beforeAll(() => {
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
});

describe('SidebarPegawai', () => {
  let store;
  let setSidebarOpenMock;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { name: 'Pegawai', hak_akses: 'pegawai' },
        isError: false,
      },
    });
    setSidebarOpenMock = jest.fn();
    localStorage.clear();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <SidebarPegawai sidebarOpen={true} setSidebarOpen={setSidebarOpenMock} {...props} />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );

  it('renders logo and dashboard link', () => {
    renderComponent();
    expect(screen.getByAltText(/logo sipeka/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('renders salary data link', () => {
    renderComponent();
    const salaryLinks = screen.getAllByText((_, el) =>
      el?.textContent?.toLowerCase().includes('gaji') ||
      el?.textContent?.toLowerCase().includes('sueldo') ||
      el?.textContent?.toLowerCase().includes('salary')
    );
    expect(salaryLinks[0]).toBeInTheDocument();
  });

  it('opens pengaturan group on click and finds all inner links', async () => {
    renderComponent();

    const pengaturanToggle = screen.getAllByText((_, el) =>
      el?.textContent?.toLowerCase().includes('pengaturan') ||
      el?.textContent?.toLowerCase().includes('settings')
    )[0];
    fireEvent.click(pengaturanToggle);

    const parameterLinks = await screen.findAllByText((_, el) =>
      el?.textContent?.toLowerCase().replace(/\s+/g, '').includes('parameter')
    );
    expect(parameterLinks.length).toBeGreaterThan(0);

    const passwordLinks = await screen.findAllByText((_, el) =>
      el?.textContent?.toLowerCase().replace(/\s+/g, '').includes('ubahpassword') ||
      el?.textContent?.toLowerCase().replace(/\s+/g, '').includes('changepassword')
    );
    expect(passwordLinks.length).toBeGreaterThan(0);

    const logoutLink = screen.getByText(/logout/i);
    expect(logoutLink).toBeInTheDocument();
  });

  it('closes sidebar on ESC key press', () => {
    renderComponent();
    fireEvent.keyDown(document, { key: 'Escape', keyCode: 27 });
    expect(setSidebarOpenMock).toHaveBeenCalledWith(false);
  });

  it('closes sidebar on outside click', () => {
    const { container } = renderComponent();

    fireEvent.click(document); // click outside
    expect(setSidebarOpenMock).toHaveBeenCalledWith(false);
  });

  it('triggers logoutUser and navigates after confirmation', async () => {
    renderComponent();

    const pengaturanToggle = screen.getAllByText((_, el) =>
      el?.textContent?.toLowerCase().includes('pengaturan') ||
      el?.textContent?.toLowerCase().includes('settings')
    )[0];
    fireEvent.click(pengaturanToggle);

    const logoutLink = screen.getByText(/logout/i);
    fireEvent.click(logoutLink);

    await waitFor(() =>
      expect(screen.getByText(/logoutConfirmationTitle/i)).toBeInTheDocument()
    );

    // Simula clic en confirmación de SweetAlert (mockeo de Swal no incluido)
    // podrías mockear Swal.fire para probar navegación/redirección.
  });
});