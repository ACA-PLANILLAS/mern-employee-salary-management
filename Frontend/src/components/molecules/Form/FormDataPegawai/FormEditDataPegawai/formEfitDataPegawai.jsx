import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormEditDataPegawai from './index';

// Mocks generales
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ children }) => <div>{children}</div>,
}));

jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

jest.mock('../../../../../config/redux/action', () => ({
  getMe: jest.fn(),
}));

jest.mock('../../../../../layout', () => ({ children }) => <div>{children}</div>);
jest.mock('../../../../../components', () => ({
  Breadcrumb: () => <div>Breadcrumb</div>,
  ButtonOne: ({ children }) => <button>{children}</button>,
  ButtonTwo: ({ children }) => <button>{children}</button>,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

jest.mock('../../../../../hooks/useErrorMessage', () => ({
  useErrorMessage: () => (msg) => msg,
}));

describe('FormEditDataPegawai', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockParams = { id: '1' };

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useParams.mockReturnValue(mockParams);
    useNavigate.mockReturnValue(mockNavigate);
    
    useSelector.mockImplementation((callback) => {
      return callback({
        auth: {
          isError: false,
          user: { hak_akses: 'admin' },
        },
      });
    });

    // Mock de las respuestas de la API
    axios.get.mockImplementation((url) => {
      if (url.includes('data_jabatan')) {
        return Promise.resolve({
          data: [
            { id: 1, nama_jabatan: 'Manager' },
            { id: 2, nama_jabatan: 'Developer' },
          ],
        });
      }
      if (url.includes('pension_institutions')) {
        return Promise.resolve({
          data: {
            data: [
              { code: 'AFP1', name: 'AFP Confía' },
              { code: 'AFP2', name: 'AFP Crecer' },
            ],
          },
        });
      }
      if (url.includes('data_pegawai')) {
        return Promise.resolve({
          data: {
            dui_or_nit: '12345678-9',
            document_type: 'DUI',
            isss_affiliation_number: '987654321',
            pension_institution_code: 'AFP1',
            first_name: 'Juan',
            last_name: 'Perez',
            jenis_kelamin: 'laki-laki',
            hire_date: '2020-01-01T00:00:00.000Z',
            status: 'karyawan tetap',
            positionHistory: [{ position: { id: 1 } }],
            username: 'jperez',
            hak_akses: 'admin',
            url: 'http://example.com/photo.jpg',
          },
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    axios.patch.mockResolvedValue({
      data: { msg: 'Employee updated successfully' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar correctamente y cargar los datos', async () => {
    render(<FormEditDataPegawai />);

    // Verificar que se hagan las llamadas a la API
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
    });

    // Verificar que los campos se llenen con los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Perez')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12345678-9')).toBeInTheDocument();
    });
  });

  test('debe manejar cambios en los campos del formulario', async () => {
    render(<FormEditDataPegawai />);

    await waitFor(() => {
      const firstNameInput = screen.getByLabelText('firstName *');
      fireEvent.change(firstNameInput, { target: { value: 'Carlos' } });
      expect(firstNameInput.value).toBe('Carlos');

      const lastNameInput = screen.getByLabelText('lastName *');
      fireEvent.change(lastNameInput, { target: { value: 'Gomez' } });
      expect(lastNameInput.value).toBe('Gomez');

      const genderSelect = screen.getByLabelText('jenisKelamin *');
      fireEvent.change(genderSelect, { target: { value: 'perempuan' } });
      expect(genderSelect.value).toBe('perempuan');
    });
  });

  test('debe validar el formulario antes de enviar', async () => {
    render(<FormEditDataPegawai />);

    await waitFor(() => {
      const submitButton = screen.getByText('simpan');
      fireEvent.click(submitButton);
    });

    // Como ya están los campos llenos (por el mock), no debería mostrar errores
    expect(Swal.fire).not.toHaveBeenCalledWith({
      icon: 'error',
      title: 'gagal',
      text: expect.stringContaining('fieldRequired'),
    });
  });

  test('debe enviar el formulario correctamente', async () => {
    render(<FormEditDataPegawai />);

    // Esperar a que los datos se carguen
    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    });

    // Rellenar campos requeridos que podrían faltar
    fireEvent.change(screen.getByLabelText('password *'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText('confPassword *'), { 
      target: { value: 'password123' } 
    });

    // Simular envío del formulario
    const form = screen.getByTestId('edit-employee-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining('data_pegawai/1'),
        expect.any(Object),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
    });
  });

  test('debe manejar errores al enviar el formulario', async () => {
    // Mock de respuesta de error
    axios.patch.mockRejectedValueOnce({
      response: { 
        data: { msg: 'Error al actualizar' } 
      }
    });

    render(<FormEditDataPegawai />);

    // Esperar a que los datos se carguen
    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    });

    // Rellenar campos requeridos
    fireEvent.change(screen.getByLabelText('password *'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText('confPassword *'), { 
      target: { value: 'password123' } 
    });

    // Simular envío del formulario
    const form = screen.getByTestId('edit-employee-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'gagal',
        text: 'Error al actualizar', // Ahora debería coincidir
        confirmButtonText: 'Ok',
      });
    });
  });


  test('debe redirigir si el usuario no es admin', async () => {
    useSelector.mockImplementationOnce((callback) => {
      return callback({
        auth: {
          isError: false,
          user: { hak_akses: 'pegawai' },
        },
      });
    });

    render(<FormEditDataPegawai />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});