import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormAddDataPegawai from './index';

// Mock de react-redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock de axios
jest.mock('axios');

// Mock de sweetalert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })), // Asegura que siempre se resuelva
}));

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children }) => <div>{children}</div>,
}));

// Mock de los componentes hijos
jest.mock('../../../../../components', () => ({
  Breadcrumb: () => <div>Breadcrumb Mock</div>,
  ButtonOne: ({ children, 'data-testid': dataTestId, type }) => <button data-testid={dataTestId} type={type || 'button'}>{children}</button>,
  ButtonTwo: ({ children, 'data-testid': dataTestId }) => <button data-testid={dataTestId}>{children}</button>,
}));

// Mock de Layout
jest.mock('../../../../../layout', () => ({ children }) => <div>{children}</div>);

// Mock de los iconos
jest.mock('react-icons/ai', () => ({
  AiOutlineClose: () => <span>CloseIcon</span>,
}));

jest.mock('react-icons/md', () => ({
  MdOutlineKeyboardArrowDown: () => <span>ArrowDownIcon</span>,
}));

// Mock de cualquier otro hook personalizado que uses en FormAddDataPegawai
// Por ejemplo, si usas useErrorMessage, necesitas mockearlo también
jest.mock('../../../../../hooks/useErrorMessage', () => ({
  useErrorMessage: () => jest.fn((msg) => `Error: ${msg}`),
}));

// Asegúrate de mockear también las llamadas de Redux actions si tu componente las usa
// Por ejemplo, si tienes una acción createDataPegawai que es una promesa
jest.mock('../../../../../config/redux/action', () => ({
  createDataPegawai: jest.fn(), // Mocks de acciones que devuelven promesas
  // ... otras acciones
}));


describe('FormAddDataPegawai', () => {
  const mockDispatch = jest.fn();
  const mockSelector = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Asegúrate de que esto esté al principio del beforeEach
    
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(mockSelector);

    // Mock del estado inicial del selector
    mockSelector.mockImplementation((callback) => {
      return callback({
        auth: {
          isError: false,
          user: { role: 'admin' },
        },
      });
    });

    // Mock de las respuestas de axios para los catálogos
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
      // **IMPORTANTE:** Si llega una URL no cubierta, resuelve con un array vacío o un objeto por defecto
      // en lugar de rechazar, para evitar UnhandledPromiseRejection si el componente no lo maneja.
      // O puedes rechazar con un error específico si sabes que el componente lo atrapará.
      console.warn(`Axios.get no mockeado para URL: ${url}`); // Advertencia para URLs no esperadas
      return Promise.resolve({ data: [] }); // O { data: {} } dependiendo de lo que espere el componente
    });

    // Mock de axios.post (o .patch, .put, etc.) si tu componente los usa
    // Si tu componente hace un POST al enviar el formulario, también necesitas mockearlo
    axios.post.mockResolvedValue({ data: { msg: 'success' } });
    axios.patch.mockResolvedValue({ data: { msg: 'success' } });
    axios.put.mockResolvedValue({ data: { msg: 'success' } });
  });

  // El afterEach lo puedes mantener para limpiar si prefieres, pero beforeEach.clearAllMocks()
  // ya hace gran parte del trabajo para mocks de Jest.
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('debe renderizar correctamente', async () => {
    // Usar 'act' si hay useEffects o actualizaciones de estado asíncronas
    await act(async () => {
      render(
        <Router>
          <FormAddDataPegawai />
        </Router>
      );
    });
    
    // Verificar que se rendericen los elementos principales
    expect(screen.getByText('Breadcrumb Mock')).toBeInTheDocument();
    expect(screen.getByText('formAddDataPegawai')).toBeInTheDocument();
    
    // Verificar campos obligatorios
    expect(screen.getByLabelText('documentType *')).toBeInTheDocument();
    expect(screen.getByLabelText('duiOrNit *')).toBeInTheDocument();
    expect(screen.getByLabelText('firstName *')).toBeInTheDocument();
    expect(screen.getByLabelText('lastName *')).toBeInTheDocument();
    expect(screen.getByLabelText('username *')).toBeInTheDocument();
    expect(screen.getByLabelText('password *')).toBeInTheDocument();
    expect(screen.getByLabelText('confPassword *')).toBeInTheDocument();
    expect(screen.getByLabelText('hakAkses *')).toBeInTheDocument();
    
    // Verificar que se carguen los catálogos
    await waitFor(() => {
      // Expectativas sobre axios.get: 2 llamadas, una para data_jabatan, otra para pension_institutions
      expect(axios.get).toHaveBeenCalledTimes(2); 
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('data_jabatan'));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('pension_institutions'));
    });
  });

  it('debe manejar cambios en los campos del formulario', async () => {
    await act(async () => {
      render(
        <Router>
          <FormAddDataPegawai />
        </Router>
      );
    });

    // Simular cambios en los campos
    const duiInput = screen.getByLabelText('duiOrNit *');
    fireEvent.change(duiInput, { target: { value: '12345678-9' } });
    expect(duiInput.value).toBe('12345678-9');

    const firstNameInput = screen.getByLabelText('firstName *');
    fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
    expect(firstNameInput.value).toBe('Juan');

    const lastNameInput = screen.getByLabelText('lastName *');
    fireEvent.change(lastNameInput, { target: { value: 'Perez' } });
    expect(lastNameInput.value).toBe('Perez');

    const usernameInput = screen.getByLabelText('username *');
    fireEvent.change(usernameInput, { target: { value: 'jperez' } });
    expect(usernameInput.value).toBe('jperez');

    const passwordInput = screen.getByLabelText('password *');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');

    const confPasswordInput = screen.getByLabelText('confPassword *');
    fireEvent.change(confPasswordInput, { target: { value: 'password123' } });
    expect(confPasswordInput.value).toBe('password123');

    // Seleccionar opciones de dropdown
    const documentTypeSelect = screen.getByLabelText('documentType *');
    fireEvent.change(documentTypeSelect, { target: { value: 'DUI' } });
    expect(documentTypeSelect.value).toBe('DUI');

    // Si 'jenisKelamin *' y 'status *' son selectores de HTML, getByLabelText funciona bien.
    // Si son componentes custom, podrías necesitar un data-testid o un rol diferente.
    const genderSelect = screen.getByLabelText('jenisKelamin *');
    fireEvent.change(genderSelect, { target: { value: 'laki-laki' } });
    expect(genderSelect.value).toBe('laki-laki');

    const statusSelect = screen.getByLabelText('status *');
    fireEvent.change(statusSelect, { target: { value: 'karyawan tetap' } });
    expect(statusSelect.value).toBe('karyawan tetap');

    const accessSelect = screen.getByLabelText('hakAkses *');
    fireEvent.change(accessSelect, { target: { value: 'admin' } });
    expect(accessSelect.value).toBe('admin');
  });

  it('debe manejar la carga de una imagen', async () => {
    await act(async () => {
      render(
        <Router>
          <FormAddDataPegawai />
        </Router>
      );
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('uploadFoto');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByAltText('Foto')).toBeInTheDocument();
      expect(screen.getByText('CloseIcon')).toBeInTheDocument();
    });
  });

  it('debe manejar la cancelación de la imagen', async () => {
    await act(async () => {
      render(
        <Router>
          <FormAddDataPegawai />
        </Router>
      );
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('uploadFoto');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      const closeButton = screen.getByText('CloseIcon');
      fireEvent.click(closeButton);
      expect(screen.queryByAltText('Foto')).not.toBeInTheDocument();
    });
  });

  it('debe mostrar errores cuando se envía el formulario sin datos requeridos', async () => {
    await act(async () => {
      render(
        <Router>
          <FormAddDataPegawai />
        </Router>
      );
    });

    const submitButton = screen.getByText('simpan');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'gagal',
        text: expect.stringContaining('fieldRequired'), // Usar expect.stringContaining si el texto es dinámico
      });
    });
  });

  it('debe mostrar error cuando las contraseñas no coinciden', async () => {
    await act(async () => {
      render(
        <Router>
          <FormAddDataPegawai />
        </Router>
      );
    });

    // Llenar algunos campos requeridos para llegar a la validación de contraseña
    fireEvent.change(screen.getByLabelText('documentType *'), { target: { value: 'DUI' } });
    fireEvent.change(screen.getByLabelText('duiOrNit *'), { target: { value: '12345678-9' } });
    fireEvent.change(screen.getByLabelText('pensionInstitutionCode *'), { target: { value: 'AFP1' } });
    fireEvent.change(screen.getByLabelText('isssAffiliationNumber *'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('firstName *'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText('lastName *'), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText('jenisKelamin *'), { target: { value: 'laki-laki' } });
    fireEvent.change(screen.getByLabelText('hire_date'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText('status *'), { target: { value: 'karyawan tetap' } });
    fireEvent.change(screen.getByLabelText('jabatan *'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('username *'), { target: { value: 'jperez' } });

    // Contraseñas que no coinciden
    fireEvent.change(screen.getByLabelText('password *'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('confPassword *'), { target: { value: 'differentpassword' } });

    // Simular carga de imagen (si es un campo que activaría la validación)
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('uploadFoto'), { target: { files: [file] } });

    const submitButton = screen.getByText('simpan');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'gagal',
        text: 'passwordMismatch',
      });
    });
  });

  it('debe enviar el formulario correctamente cuando todos los campos están completos', async () => {
    // Mock de la acción createDataPegawai para que resuelva exitosamente
    mockDispatch.mockReturnValue(Promise.resolve({ payload: { msg: 'success' } })); // Asumiendo que retorna un objeto con payload.msg
    axios.post.mockResolvedValueOnce({ data: { msg: 'success' } }); // Mock de la llamada POST que hace el componente

    await act(async () => {
      render(
        <Router>
          <FormAddDataPegawai />
        </Router>
      );
    });

    // Llenar campos requeridos
    fireEvent.change(screen.getByLabelText('documentType *'), { target: { value: 'DUI' } });
    fireEvent.change(screen.getByLabelText('duiOrNit *'), { target: { value: '12345678-9' } });
    fireEvent.change(screen.getByLabelText('pensionInstitutionCode *'), { target: { value: 'AFP1' } });
    fireEvent.change(screen.getByLabelText('isssAffiliationNumber *'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('firstName *'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText('lastName *'), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText('jenisKelamin *'), { target: { value: 'laki-laki' } });
    fireEvent.change(screen.getByLabelText('hire_date'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText('status *'), { target: { value: 'karyawan tetap' } });
    fireEvent.change(screen.getByLabelText('jabatan *'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('username *'), { target: { value: 'jperez' } });
    fireEvent.change(screen.getByLabelText('password *'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('confPassword *'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('hakAkses *'), { target: { value: 'admin' } });

    // Simular carga de imagen
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('uploadFoto'), { target: { files: [file] } });

    const submitButton = screen.getByText('simpan');
    await act(async () => { // Envolver la acción que dispara la promesa
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      // Si tu acción de Redux usa axios.post, también espera que se llame axios.post
      // expect(axios.post).toHaveBeenCalled(); // Descomenta si usas axios.post directamente en la acción

      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'berhasil',
        text: expect.any(String), // O el mensaje específico que esperas
        showConfirmButton: false,
        timer: 1500,
      });
      // expect(mockNavigate).toHaveBeenCalledWith('/data-pegawai'); // Si navega después del éxito
    });
  });

  it('debe manejar errores al enviar el formulario', async () => {
    // Mock de la acción createDataPegawai para que falle
    mockDispatch.mockReturnValue(Promise.reject({ response: { data: { msg: 'error message' } }}));
    // Mockear axios.post para que también falle
    axios.post.mockRejectedValueOnce({ response: { data: { msg: 'error message from api' } }});


    await act(async () => {
      render(
        <Router>
          <FormAddDataPegawai />
        </Router>
      );
    });

    // Llenar campos requeridos para llegar al envío
    fireEvent.change(screen.getByLabelText('documentType *'), { target: { value: 'DUI' } });
    fireEvent.change(screen.getByLabelText('duiOrNit *'), { target: { value: '12345678-9' } });
    fireEvent.change(screen.getByLabelText('pensionInstitutionCode *'), { target: { value: 'AFP1' } });
    fireEvent.change(screen.getByLabelText('isssAffiliationNumber *'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('firstName *'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText('lastName *'), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText('jenisKelamin *'), { target: { value: 'laki-laki' } });
    fireEvent.change(screen.getByLabelText('hire_date'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText('status *'), { target: { value: 'karyawan tetap' } });
    fireEvent.change(screen.getByLabelText('jabatan *'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('username *'), { target: { value: 'jperez' } });
    fireEvent.change(screen.getByLabelText('password *'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('confPassword *'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('hakAkses *'), { target: { value: 'admin' } });

    // Simular carga de imagen
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('uploadFoto'), { target: { files: [file] } });

    const submitButton = screen.getByText('simpan');
    await act(async () => { // Envolver la acción que dispara la promesa
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'gagal',
        text: expect.any(String), // O el mensaje de error específico
        confirmButtonText: 'Ok',
      });
      // expect(mockNavigate).not.toHaveBeenCalled(); // Si no debe navegar en caso de error
    });
  });
});