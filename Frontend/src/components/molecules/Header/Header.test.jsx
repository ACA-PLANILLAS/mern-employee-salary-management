import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './index';
import { BrowserRouter } from 'react-router-dom';

// Mocks de los componentes usados dentro del Header
jest.mock('../../../components', () => ({
  DropdownProfil: () => <div data-testid="DropdownProfil" />,
  DarkModeSwitcher: () => <div data-testid="DarkModeSwitcher" />,
  CurrencySwitcher: () => <div data-testid="CurrencySwitcher" />,
}));

jest.mock('../../atoms/LanguageSwitcher', () => () => <div data-testid="LanguageSwitcher" />);

describe('Header component', () => {
  const setup = (sidebarOpen = false) => {
    const setSidebarOpen = jest.fn();
    render(
      <BrowserRouter>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </BrowserRouter>
    );
    return { setSidebarOpen };
  };

  test('renders logo and all switchers', () => {
    setup();

    expect(screen.getByAltText('Logo SiPeKa')).toBeInTheDocument();
    expect(screen.getByTestId('CurrencySwitcher')).toBeInTheDocument();
    expect(screen.getByTestId('LanguageSwitcher')).toBeInTheDocument();
    expect(screen.getByTestId('DarkModeSwitcher')).toBeInTheDocument();
    expect(screen.getByTestId('DropdownProfil')).toBeInTheDocument();
  });

  test('clicking sidebar button triggers setSidebarOpen', () => {
    const { setSidebarOpen } = setup(false);

    const sidebarButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sidebarButton);

    expect(setSidebarOpen).toHaveBeenCalledWith(true);
  });

  test('does not throw error if sidebarOpen is true', () => {
    setup(true);

    expect(screen.getByAltText('Logo SiPeKa')).toBeInTheDocument();
  });
});