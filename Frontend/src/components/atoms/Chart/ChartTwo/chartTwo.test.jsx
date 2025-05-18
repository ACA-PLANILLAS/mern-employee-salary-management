import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ChartTwo from './index.jsx';

// Mock de ApexCharts
jest.mock('react-apexcharts', () => () => <div data-testid="mock-chart">Gráfico</div>);

// Mock de fetch (simula la respuesta de la API)
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          series: [6, 4], // valores simulados
        }),
    })
  );
});

// Mock de i18next con `withTranslation` y `i18n` (para el listener de cambio de idioma)
jest.mock('react-i18next', () => ({
  withTranslation: () => (Component) => {
    Component.defaultProps = {
      ...(Component.defaultProps || {}),
      t: (key) => {
        const traducciones = {
          'chartsTwo.title': 'Estado de Empleados',
          'chartsTwo.labels.permanent': 'Permanente',
          'chartsTwo.labels.temporary': 'Temporal',
          'chartsTwo.period.monthly': 'Mensual',
          'chartsTwo.period.yearly': 'Anual',
        };
        return traducciones[key] || key;
      },
      i18n: {
        on: jest.fn(),
        off: jest.fn(),
      },
    };
    return Component;
  },
}));

describe('Componente ChartTwo', () => {
  test('debe renderizar correctamente el gráfico y los datos', async () => {
    render(<ChartTwo />);

    expect(screen.getByText('Estado de Empleados')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();

    // Esperamos a que los valores de la API estén visibles
    await waitFor(() => {
      expect(screen.getByText('Permanente')).toBeInTheDocument();
      expect(screen.getByText('Temporal')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });
});
