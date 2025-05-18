import React from 'react';
import { render, screen } from '@testing-library/react';
import CardThree from './index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getDataJabatan } from '../../../../config/redux/action';
import { useTranslation } from 'react-i18next';

// Mocks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../../config/redux/action', () => ({
  getDataJabatan: jest.fn(() => ({ type: 'GET_DATA_JABATAN' })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('CardThree', () => {
  it('🧾 Renderiza correctamente y muestra la cantidad de cargos', () => {
    const mockDispatch = jest.fn();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dataJabatan: {
          dataJabatan: [{}, {}, {}, {}, {}],
        },
      })
    );

    render(<CardThree />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('cards.positions')).toBeInTheDocument();
  });

  it('📤 Ejecuta dispatch de getDataJabatan al montarse', () => {
    const dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dataJabatan: {
          dataJabatan: [],
        },
      })
    );

    render(<CardThree />);

    expect(dispatchMock).toHaveBeenCalledWith(getDataJabatan());
  });
});
