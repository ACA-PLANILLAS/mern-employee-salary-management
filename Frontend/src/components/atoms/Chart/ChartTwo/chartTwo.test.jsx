import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartTwo from './index.jsx';

// Simulamos el componente de ApexCharts (para evitar errores al renderizar en tests)
jest.mock('react-apexcharts', () => () => <div data-testid="mock-chart">Gráfico</div>);

// Simulamos las traducciones de i18next
jest.mock('react-i18next', () => ({
  withTranslation: () => (Component) => {
    Component.defaultProps = {
      ...Component.defaultProps,
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
    };
    return Component;
  },
}));

describe('Componente ChartTwo', () => {
  test('debe renderizar el título y el gráfico correctamente', () => {
    render(<ChartTwo />);

    // Verificamos que se muestra el título traducido
    expect(screen.getByText('Estado de Empleados')).toBeInTheDocument();

    // Verificamos que se renderiza el gráfico simulado
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();

    // Verificamos que se muestran las etiquetas de los datos
    expect(screen.getAllByText('Permanente')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Temporal')[0]).toBeInTheDocument();

    // Verificamos que se renderizan las opciones del select
    expect(screen.getByText('Mensual')).toBeInTheDocument();
    expect(screen.getByText('Anual')).toBeInTheDocument();

    // Verificamos que los valores de los datos estén visibles
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
