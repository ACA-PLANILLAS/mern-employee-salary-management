import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormAddDataKehadiran from "../FormAddDataKehadiran";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import Swal from "sweetalert2";

// ✅ MOCKS (deben ir antes del import del componente)

jest.mock("axios");
jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

jest.mock("../../../../../config/currency/useCurrencyByUser", () => () => ({
    toLocal: (val) => val,
    toUSD: (val) => val,
    symbol: "$",
    currency: "USD",
  }));

jest.mock('../../../../../config/currency/CurrencyContext', () => ({
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

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: (key) => key,
      i18n: { language: "en" }, // Properly mock the i18n object with language property
    }),
    withTranslation: () => (Component) => {
      Component.defaultProps = { ...(Component.defaultProps || {}), t: (key) => key };
      return Component;
    },
  }));

// Store
const mockStore = configureStore([thunk]);

// Datos ficticios
const mockPegawai = [
  {
    id: 1,
    nik: "EMP001",
    nama_pegawai: "Juan Pérez",
    jabatan: "Programador",
    jenis_kelamin: "Laki-laki",
  },
];

const mockKehadiran = [];

// Utilidad para renderizar con provider y router
const renderWithProviders = (ui, store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("FormAddDataKehadiran Component", () => {
  let store;

  beforeEach(async () => {
    store = mockStore({
      auth: {
        isError: false,
        user: { hak_akses: "admin" },
      },
    });

    axios.get.mockImplementation((url) => {
      if (url.includes("/data_pegawai")) return Promise.resolve({ data: mockPegawai });
      if (url.includes("/data_kehadiran")) return Promise.resolve({ data: mockKehadiran });
    });

    renderWithProviders(<FormAddDataKehadiran />, store);

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/data_pegawai"))
    );
  });

  test("shows success if all data is valid", async () => {
    const allTextInputs = screen.getAllByRole("textbox");
    fireEvent.change(allTextInputs[0], { target: { value: "100" } }); // el primero es el input de additional payments

    axios.post.mockResolvedValueOnce({}); // simulamos éxito

    const submitBtn = screen.getByText(/save/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
        })
      );
    });
  });
  
});