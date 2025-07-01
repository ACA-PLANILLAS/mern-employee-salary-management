// ✅ Mock framer-motion antes de cualquier importación
jest.mock('framer-motion', () => {
    const React = require('react');
    return {
      __esModule: true,
      motion: {
        div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
      },
      AnimatePresence: ({ children }) => <>{children}</>,
    };
  });
  
  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import About from './index';
  import { MemoryRouter } from 'react-router-dom';
  import { I18nextProvider } from 'react-i18next';
  
  // ✅ Usa un mock real de i18n compatible
  import i18n from '../../config/internalization/i18nTest';
  
  // ✅ Mock completo de componentes que no necesitas probar
  jest.mock('../../components', () => ({
    Navbar: () => <div data-testid="navbar">MockNavbar</div>,
    Footer: () => <div data-testid="footer">MockFooter</div>,
  }));
  
  jest.mock('../../components/atoms', () => ({
    BottomLine: () => <div data-testid="bottom-line">MockBottomLine</div>,
  }));
  
  describe('About Page', () => {
    const renderWithRouter = (route = '/about') =>
      render(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={[route]}>
            <About />
          </MemoryRouter>
        </I18nextProvider>
      );
  
    it('renders the Navbar always', () => {
      renderWithRouter();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  
    it('renders heading and titles from translation', () => {
      renderWithRouter();
      expect(screen.getByText('about.heading')).toBeInTheDocument();
      expect(screen.getByText('about.titleLine1')).toBeInTheDocument();
      expect(screen.getByText('about.titleLine2')).toBeInTheDocument();
    });
  
    it('renders about text paragraphs', () => {
      renderWithRouter();
      expect(screen.getByText('about.text1')).toBeInTheDocument();
      expect(screen.getByText('about.text2')).toBeInTheDocument();
    });
  
    it('renders Footer only when not on home page', () => {
      renderWithRouter('/about');
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  
    it('does not render Footer on home page', () => {
      renderWithRouter('/');
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    });
  });