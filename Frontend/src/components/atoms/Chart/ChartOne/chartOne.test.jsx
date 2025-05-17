import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartOne from './index.jsx';

// Simulamos el componente de ApexCharts (para evitar errores en tests)
jest.mock('react-apexcharts', () => () => <div data-testid="mock-chart">Gráfico</div>);

// Simulamos las traducciones de i18next
jest.mock('react-i18next', () => ({
  withTranslation: () => (Component) => {
    Component.defaultProps = {
      ...Component.defaultProps,
      t: (key) => {
        const traducciones = {
          'chartsOne.dataMale': 'Hombres',
          'chartsOne.dataFemale': 'Mujeres',
          'chartsOne.viewOptions.day': 'Día',
          'chartsOne.viewOptions.week': 'Semana',
          'chartsOne.viewOptions.month': 'Mes',
        };
        return traducciones[key] || key;
      },
    };
    return Component;
  },
}));

describe('Componente ChartOne', () => {
  test('debe renderizar los textos y el gráfico correctamente', () => {
    render(<ChartOne />);

    // Verifica los textos de las leyendas
    expect(screen.getByText('Hombres')).toBeInTheDocument();
    expect(screen.getByText('Mujeres')).toBeInTheDocument();

    // Verifica que se renderiza el gráfico simulado
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();

    // Verifica los textos de rango de fechas
    expect(screen.getAllByText('14.04.2023 - 14.05.2023')[0]).toBeInTheDocument();

    // Verifica los botones de vista (día, semana, mes)
    expect(screen.getByText('Día')).toBeInTheDocument();
    expect(screen.getByText('Semana')).toBeInTheDocument();
    expect(screen.getByText('Mes')).toBeInTheDocument();
  });
});
