import React from 'react';
import { render, screen } from '@testing-library/react';
import CardThree from './index.jsx'; // Ajusta si el path es distinto
import { useDispatch, useSelector } from 'react-redux';
import { getDataJabatan } from '../../../../config/redux/action';
import { useTranslation } from 'react-i18next';

// 🧪 Mocks para Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// 🧪 Mock para la acción Redux
jest.mock('../../../../config/redux/action', () => ({
  getDataJabatan: jest.fn(() => ({ type: 'GET_DATA_JABATAN' })),
}));

// 🧪 Mock para i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Simula una traducción retornando la clave
  }),
}));

describe('CardThree', () => {
  // 🔍 Prueba visual y de datos renderizados
  it('🧾 Renderiza correctamente y muestra la cantidad de cargos', () => {
    const mockDispatch = jest.fn();

    // Simular estado con 5 elementos de dataJabatan
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dataJabatan: { dataJabatan: [{}, {}, {}, {}, {}] },
      })
    );

    render(<CardThree />);

    // Valida número mostrado
    expect(screen.getByText('5')).toBeInTheDocument();

    // Valida que se muestra la clave traducida
    expect(screen.getByText('cards.positions')).toBeInTheDocument();
  });

  // 🔍 Prueba de comportamiento al montarse
  it('📤 Ejecuta dispatch de getDataJabatan al montarse', () => {
    const dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dataJabatan: { dataJabatan: [] },
      })
    );

    render(<CardThree />);

    // Valida que se haya llamado a getDataJabatan
    expect(dispatchMock).toHaveBeenCalledWith(getDataJabatan());
  });
});