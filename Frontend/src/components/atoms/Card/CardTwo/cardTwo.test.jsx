import React from 'react';
import { render, screen } from '@testing-library/react';
import CardTwo from './index.jsx'; 

// 🧪 Mock de i18n (useTranslation)
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Simula que la función t retorna el key mismo
  }),
}));

describe('CardTwo', () => {
  it('muestra el número fijo y la traducción del administrador', () => {
    // 🔍 Renderiza el componente
    render(<CardTwo />);

    // ✅ Verifica que se muestre el número "1"
    expect(screen.getByText('1')).toBeInTheDocument();

    // ✅ Verifica que se muestre el texto traducido (mockeado como el key)
    expect(screen.getByText('cards.admin')).toBeInTheDocument();
  });
});