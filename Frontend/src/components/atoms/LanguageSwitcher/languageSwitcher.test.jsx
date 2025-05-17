import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from './index.jsx';
import '@testing-library/jest-dom';

// MOCK de react-i18next
jest.mock('react-i18next', () => {
  const changeLanguageMock = jest.fn();

  return {
    useTranslation: () => ({
      i18n: {
        language: 'es-419',
        changeLanguage: changeLanguageMock,
      },
    }),
    __esModule: true,
    changeLanguageMock,
  };
});

import { changeLanguageMock } from 'react-i18next';

describe('LanguageSwitcher component', () => {
  beforeEach(() => {
    changeLanguageMock.mockClear();
  });

  it('muestra el idioma actual y abre el menú al hacer clic', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('es')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /es/i }));
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Indonesio')).toBeInTheDocument();
  });

  it('cambia el idioma cuando se selecciona uno diferente', () => {
    render(<LanguageSwitcher />);
    
    fireEvent.click(screen.getByRole('button', { name: /es/i }));
    fireEvent.click(screen.getByText('English'));

    expect(changeLanguageMock).toHaveBeenCalledWith('en');
  });

  it('cierra el menú al hacer clic fuera', () => {
    render(
      <div>
        <LanguageSwitcher />
        <button data-testid="outside">Outside</button>
      </div>
    );

    fireEvent.click(screen.getByRole('button', { name: /es/i }));
    expect(screen.getByText('English')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });
});