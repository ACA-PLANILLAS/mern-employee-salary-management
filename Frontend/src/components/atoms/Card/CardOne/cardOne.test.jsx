import React from 'react';
import { render, screen } from '@testing-library/react';
import CardOne from './index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getDataPegawai } from '../../../../config/redux/action';
import { useTranslation } from 'react-i18next';

// ✅ Mock de react-redux para interceptar useDispatch y useSelector
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// ✅ Mock de la acción getDataPegawai para evitar llamadas reales
jest.mock('../../../../config/redux/action', () => ({
  getDataPegawai: jest.fn(), // Puede simular { type: 'GET_DATA' } si se necesita
}));

// ✅ Mock de i18next para evitar configuración de internacionalización
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Devuelve simplemente el texto de la clave
  }),
}));

describe('🧪 CardOne Component', () => {
  const dispatchMock = jest.fn(); // Simulamos el dispatch

  beforeEach(() => {
    // 👉 Cuando useDispatch se use, devolverá dispatchMock
    useDispatch.mockReturnValue(dispatchMock);

    // 👉 Simulamos el selector de Redux con datos falsos
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dataPegawai: {
          dataPegawai: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], // Simulamos 4 empleados
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // 🔁 Limpiamos mocks después de cada prueba
  });

  it('🧾 Renderiza correctamente y muestra la cantidad de empleados', () => {
    render(<CardOne />); // 🖼️ Renderizamos el componente

    // 🔢 Verificamos que el número 4 (empleados) esté presente
    expect(screen.getByText('4')).toBeInTheDocument();

    // 🌍 Verificamos que la clave de traducción se muestre (cards.employees)
    expect(screen.getByText('cards.employees')).toBeInTheDocument();
  });

  it('📤 Ejecuta dispatch de getDataPegawai al montarse', () => {
    render(<CardOne />); // Renderizamos nuevamente

    // ✅ Verificamos que dispatch fue llamado con la acción getDataPegawai
    expect(dispatchMock).toHaveBeenCalledWith(getDataPegawai());

    // ✅ Aseguramos que se llamó solo una vez
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });
});