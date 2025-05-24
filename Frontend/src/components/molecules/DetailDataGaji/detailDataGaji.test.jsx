import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DetailDataGaji from "./index";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

// Mock de hooks personalizados
jest.mock("../../../hooks/useDisplayValue", () => ({
  useDisplayValue: () => (key) => key,
})); 

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

jest.mock('./../PrintPdf/PrintPdfLaporanGaji/index', () => () => <div>PDF Mock</div>);

jest.mock("../../../config/currency/useCurrencyByUser", () => () => ({
  toLocal: (val) => val.toString(),
  symbol: "$",
  currency: "USD",
}));

// Mock de axios
jest.mock("axios");

// Mock de react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(() => jest.fn()),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock de react-redux
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector({
      auth: {
        isError: false,
        user: { hak_akses: "admin" },
      },
    }),
}));

// Mock de i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        detailSalaryData: "Detalle de salario",
        fullName: "Nombre completo",
        documentType: "Tipo de documento",
        hireDate: "Fecha de contratación",
        position: "Puesto",
        accessLevel: "Nivel de acceso",
        month: "Mes",
        year: "Año",
        baseSalary: "Sueldo base",
        transportAllowance: "Subsidio de transporte",
        mealAllowance: "Subsidio de comida",
        grossSalary: "Salario bruto",
        absencePenalty: "Descuento por ausencias",
        step2_standardDeductions: "Deducciones estándar",
        step3_dynamicDeductions: "Deducciones dinámicas",
        subtotalInsurance: "Subtotal de seguro",
        subtotalRenta: "Subtotal renta",
        step5_totalDeductions: "Total deducciones",
        netSalary: "Salario neto",
      };
      return translations[key] || key;
    },
  }),
  withTranslation: () => (Component) => {
    Component.defaultProps = { ...(Component.defaultProps || {}), t: (key) => key };
    return Component;
  },
}));


// Mock del layout si es necesario
jest.mock("../../../layout", () => ({ children }) => <div>{children}</div>);

// Datos de prueba
const mockData = {
  attendanceId: 1,
  first_name: "Juan",
  middle_name: "Carlos",
  last_name: "Pérez",
  second_last_name: null,
  maiden_name: "Gómez",
  document_type: "DUI",
  dui_or_nit: "12345678-9",
  hire_date: "2022-01-01",
  nama_jabatan: "Ingeniero",
  hak_akses: "admin",
  month: "Enero",
  year: 2025,
  gaji_pokok: 500,
  tj_transport: 100,
  uang_makan: 50,
  salarioBruto: 650,
  castigo_ausencias: 20,
  subtotalStandarDeductions: 30,
  subtotalDynamicDeductions: 40,
  total: 560,
  detallesDeducciones: [
    { type: "STA", nama_potongan: "ISS", valueDeducted: 20 },
    { type: "STA", nama_potongan: "AFP", valueDeducted: 10 },
    {
      type: "DIN",
      from: 0,
      until: 472,
      valueDeducted: 40,
    },
  ],
};
describe("DetailDataGaji", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra mensaje de carga inicialmente", () => {
    useParams.mockReturnValue({ id: "1" });
    axios.get.mockResolvedValueOnce({ data: [] }); // parameters
    axios.get.mockResolvedValueOnce({ data: null }); // data_gaji_pegawai

    render(<DetailDataGaji />);
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  test("renderiza los datos cuando están disponibles", async () => {
    useParams.mockReturnValue({ id: "1" });

    axios.get.mockImplementation((url) => {
      if (url.includes("/parameters")) {
        return Promise.resolve({
          data: [{ type: "PMON", value: 1 }],
        });
      } else if (url.includes("/data_gaji_pegawai")) {
        return Promise.resolve({ data: mockData });
      }
      return Promise.reject(new Error("URL desconocida"));
    });

    await act(async () => {
      render(<DetailDataGaji />);
    });

    await waitFor(() => {
      expect(screen.getByText("Nombre completo:")).toBeInTheDocument();
    });

    expect(screen.getByText("Juan Carlos Pérez Gómez")).toBeInTheDocument();
    expect(screen.getByText("Ingeniero")).toBeInTheDocument();
    expect(screen.getByText("$650")).toBeInTheDocument();
    expect(screen.getByText(/560/)).toBeInTheDocument();
    expect(screen.getByText("Tramo 1 (0 – 472)")).toBeInTheDocument();
  });
});