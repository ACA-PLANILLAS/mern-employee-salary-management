import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormEditDataJabatan from './index.jsx';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../../../config/internalization/i18nTest.js';
import Swal from 'sweetalert2';
import axios from 'axios';

jest.mock('axios');
jest.mock('sweetalert2', () => ({ fire: jest.fn() }));
jest.mock('../../../../../config/redux/action', () => ({
  getMe: jest.fn(() => () => Promise.resolve()),
}));
jest.mock('../../../../../hooks/useErrorMessage', () => ({
  useErrorMessage: () => (msg) => msg,
}));
jest.mock('../../../../../config/currency/useCurrencyByUser', () => () => ({
  currency: 'USD',
  symbol: '$',
  toUSD: (value) => value,
}));
jest.mock('../../../../../config/currency/CurrencyContext', () => ({
  useCurrency: () => ({ currency: 'USD', setCurrency: jest.fn() }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

const mockStore = configureStore([thunk]);
const store = mockStore({
  auth: { isError: false, user: { hak_akses: 'admin' } },
});

const renderWithProviders = (ui) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
      </MemoryRouter>
    </Provider>
  );

describe('FormEditDataJabatan Component', () => {
  beforeEach(() => {
    Swal.fire.mockClear();
  });

  it('renders form with prefilled values', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        nama_jabatan: 'Manager',
        gaji_pokok: 1000,
        tj_transport: 200,
        uang_makan: 100,
      },
    });

    renderWithProviders(<FormEditDataJabatan />);
    const jobTitleInput = await screen.findByTestId('job-title-input');
    expect(jobTitleInput.value).toBe('Manager');
  });

  it('shows error when salary is 0', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        nama_jabatan: 'Test',
        gaji_pokok: 0,
        tj_transport: 0,
        uang_makan: 0,
      },
    });

    renderWithProviders(<FormEditDataJabatan />);
    const jobTitleInput = await screen.findByTestId('job-title-input');
    const submitButton = await screen.findByTestId('submit-button');

    fireEvent.change(jobTitleInput, { target: { value: 'Test' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'error' })
      );
    });
  });

  it('shows error when basic salary has invalid format', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        nama_jabatan: 'Developer',
        gaji_pokok: 1000,
        tj_transport: 200,
        uang_makan: 100,
      },
    });

    renderWithProviders(<FormEditDataJabatan />);
    const jobTitleInput = await screen.findByTestId('job-title-input');
    const salaryInput = screen.getByPlaceholderText(/basic salary/i); // usa tu placeholder original
    const submitButton = await screen.findByTestId('submit-button');

    fireEvent.change(jobTitleInput, { target: { value: 'Developer' } });
    fireEvent.change(salaryInput, { target: { value: '-500' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'error' })
      );
    });
  });

  it('shows error when allowances have invalid format', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        nama_jabatan: 'Analyst',
        gaji_pokok: 1000,
        tj_transport: 200,
        uang_makan: 100,
      },
    });

    renderWithProviders(<FormEditDataJabatan />);
    const jobTitleInput = await screen.findByTestId('job-title-input');
    const transportInput = screen.getByPlaceholderText(/transport allowance/i);
    const mealInput = screen.getByPlaceholderText(/meal allowance/i);
    const submitButton = await screen.findByTestId('submit-button');

    fireEvent.change(jobTitleInput, { target: { value: 'Analyst' } });
    fireEvent.change(transportInput, { target: { value: 'abc' } });
    fireEvent.change(mealInput, { target: { value: '123abc' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'error' })
      );
    });
  });

  it('submits valid data successfully', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        nama_jabatan: 'Manager',
        gaji_pokok: 1000,
        tj_transport: 200,
        uang_makan: 100,
      },
    });

    axios.patch.mockResolvedValueOnce({ data: { msg: 'Data updated successfully' } });

    renderWithProviders(<FormEditDataJabatan />);
    const jobTitleInput = await screen.findByTestId('job-title-input');
    const submitButton = await screen.findByTestId('submit-button');

    fireEvent.change(jobTitleInput, { target: { value: 'New Manager' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: 'success' })
      );
    });
  });
});