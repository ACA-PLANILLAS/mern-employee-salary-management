import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CurrencySwitcher from './index.jsx';
import { CurrencyProvider } from '../../../config/currency/CurrencyContext';

jest.mock('../../../config/currency/currency_config.json', () => ({
  base_currency: 'USD',
  currencies: {
    USD: {
      name: 'United States Dollar',
      symbol: '$',
      backup_rate: 1,
    },
    SVC: {
      name: 'Salvadoran Colón',
      symbol: '₡',
      backup_rate: 8.75,
    },
    EUR: {
      name: 'Euro',
      symbol: '€',
      backup_rate: 0.93,
    },
  },
}));

const renderWithContext = () => {
  return render(
    <CurrencyProvider>
      <CurrencySwitcher />
    </CurrencyProvider>
  );
};

describe('CurrencySwitcher', () => {
  test('muestra y cierra el dropdown con las monedas correctamente', () => {
    renderWithContext();

    const triggerButton = screen.getByRole('button', {
      name: /SVC/,
    });

    // Abre el dropdown
    fireEvent.click(triggerButton);

    expect(
      screen.getByText( /USD - United States Dollar/)
    ).toBeVisible();
    expect(
      screen.getByText(/SVC - Salvadoran Colón/)
    ).toBeVisible();
    expect(
      screen.getByText(/EUR - Euro/ )
    ).toBeVisible();

    // Cierra el dropdown
    fireEvent.click(triggerButton);

    // Selecciona el contenedor del dropdown usando el texto de una moneda
    const usdButton = screen.getByText(/USD - United States Dollar/);
    const dropdown = usdButton.closest('div');

    // Verifica que el dropdown esté oculto (tenga clase 'hidden')
    expect(dropdown).toHaveClass('hidden');
  });

  test('cambia la moneda al seleccionar otra opción', () => {
    renderWithContext();
  
    const [triggerButton] = screen.getAllByRole('button', {
      name: /SVC/,
    });
  
    fireEvent.click(triggerButton);
  
    const usdOption = screen.getByRole('button', {
      name: /USD - United States Dollar/,
    });
  
    fireEvent.click(usdOption);
  
    const updatedTrigger = screen.getAllByRole('button', {
      name: /USD/,
    })[0];
  
    expect(updatedTrigger).toBeInTheDocument();
  });
});