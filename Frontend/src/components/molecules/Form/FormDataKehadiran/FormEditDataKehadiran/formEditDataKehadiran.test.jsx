jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ id: "123" }), // mockeamos el ID
    useNavigate: () => jest.fn(),
  }));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormEditDataKehadiran from "../FormEditDataKehadiran";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import Swal from "sweetalert2";

// Mocks
jest.mock("axios");
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
  }));
jest.mock("../../../../../config/currency/useCurrencyByUser", () => () => ({
  toLocal: (val) => val,
  toUSD: (val) => val,
  symbol: "$",
  currency: "USD",
  rate: 1,
}));
jest.mock("../../../../../config/currency/CurrencyContext", () => ({
  useCurrency: () => ({
    currency: "USD",
    setCurrency: jest.fn(),
  }),
}));
jest.mock("../../../../../config/redux/action", () => ({
  getMe: () => jest.fn(),
}));
jest.mock("../../../../../hooks/useErrorMessage", () => ({
  useErrorMessage: () => (msg) => msg,
}));
jest.mock("../../../../../hooks/useDisplayValue", () => ({
  useDisplayValue: () => (label) => label,
}));
jest.mock("react-i18next", () => {
  const reactI18next = jest.requireActual("react-i18next");
  return {
    ...reactI18next,
    useTranslation: () => ({
      t: (key) => key,
      i18n: { language: "en" },
    }),
    withTranslation: () => (Component) => Component,
  };
});

// Utilidades
const mockStore = configureStore([thunk]);
const store = mockStore({
  auth: {
    isError: false,
    user: { hak_akses: "admin" },
  },
});

// Wrapper para renderizar el componente
const renderWithProviders = (ui) =>
  render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );

describe("FormEditDataKehadiran Component", () => {
  beforeEach(async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        id: 123,
        nik: "EMP001",
        nama_pegawai: "Juan Pérez",
        nama_jabatan: "Programador",
        jenis_kelamin: "Laki-laki",
        hadir: 5,
        sakit: 1,
        alpha: 0,
        worked_hours: 40,
        additional_payments: 100,
        vacation_payments: 50,
        vacation_days: 2,
        comment_01: "01",
        comment_02: "00",
      },
    });

    renderWithProviders(<FormEditDataKehadiran />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Juan Pérez")).toBeInTheDocument();
    });
  });

  test("updates data successfully", async () => {
    const hadirInput = screen.getByLabelText("hadir");
    fireEvent.change(hadirInput, { target: { value: "7" } });

    axios.patch.mockResolvedValueOnce({}); // simula éxito

    const submitBtn = screen.getByText(/update/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(axios.patch).toHaveBeenCalledWith(
            expect.stringContaining("/data_kehadiran/update"),
            expect.objectContaining({ hadir: "7" }) // o parseInt si lo conviertes
            );

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ icon: "success" })
      );
    });
  });
});