import { render, screen, fireEvent } from '@testing-library/react';
import DropdownDefault from './index.jsx';

describe('DropdownDefault', () => {
  it('muestra los botones Edit y Delete al hacer clic en el botón de menú', () => {
    render(<DropdownDefault />);

    // Hacer clic en el botón que abre el menú
    const toggleButton = screen.getByTestId('menu-toggle-button');
    fireEvent.click(toggleButton);

    // Verifica que los botones Edit y Delete están presentes
    expect(screen.getByTestId('menu-edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('menu-delete-button')).toBeInTheDocument();
  });
});