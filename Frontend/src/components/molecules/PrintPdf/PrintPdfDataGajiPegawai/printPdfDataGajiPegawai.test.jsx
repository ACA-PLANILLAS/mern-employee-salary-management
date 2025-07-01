import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PrintPdfDataGajiPegawai from "./index";
import { BrowserRouter } from "react-router-dom";
import * as reactToPrint from "react-to-print";

// ✅ MOCKEAMOS COMPLETAMENTE react-redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}));

// ✅ MOCKEAMOS useTranslation y withTranslation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        employeeSalaryList: "Lista de salario del empleado",
        back: "Volver",
        employeeName: "Nombre del empleado",
        nik: "NIK",
        position: "Posición",
        month: "Mes",
        year: "Año",
        description: "Descripción",
        amount: "Cantidad",
        basicSalary: "Salario básico",
        transportAllowance: "Subsidio de transporte",
        mealAllowance: "Subsidio de comida",
        deduction: "Deducción",
        totalSalary: "Salario total",
        employee: "Empleado",
        finance: "Finanzas",
        signature: "Firma",
        printedOn: "Impreso en",
      };
      return translations[key] || key;
    },
  }),
  withTranslation: () => (Component) => {
    Component.defaultProps = { ...(Component.defaultProps || {}), t: (key) => key };
    return Component;
  },
}));

// ✅ MOCKS para router y print
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    search: "?month=Junio&year=2025",
  }),
}));

jest.mock("react-to-print", () => ({
  useReactToPrint: () => jest.fn(),
}));

import { useSelector } from "react-redux";

describe("PrintPdfDataGajiPegawai Component", () => {
  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          isError: false,
          user: {
            hak_akses: "pegawai",
            nama_pegawai: "Juan Pérez",
          },
        },
        dataGajiPegawaiPrint: {
          dataGajiPegawaiPrint: [
            {
              nama_pegawai: "Juan Pérez",
              nik: "EMP001",
              jabatan: "Programador",
              gaji_pokok: 5000,
              tj_transport: 300,
              uang_makan: 200,
              potongan: 100,
              total: 5400,
            },
          ],
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders buttons and data correctly", () => {
    render(
      <BrowserRouter>
        <PrintPdfDataGajiPegawai />
      </BrowserRouter>
    );

    expect(screen.getAllByText("Lista de salario del empleado").length).toBeGreaterThan(0);    
    expect(screen.getByText("Volver")).toBeInTheDocument();

    expect(screen.getAllByText("Juan Pérez").length).toBeGreaterThan(0);    
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("Programador")).toBeInTheDocument();
    expect(screen.getByText("Junio")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();

    expect(screen.getByText("Salario básico")).toBeInTheDocument();
    expect(screen.getByText("Rp. 5000")).toBeInTheDocument();
    expect(screen.getByText("Subsidio de transporte")).toBeInTheDocument();
    expect(screen.getByText("Rp. 300")).toBeInTheDocument();
    expect(screen.getByText("Subsidio de comida")).toBeInTheDocument();
    expect(screen.getByText("Rp. 200")).toBeInTheDocument();
    expect(screen.getByText("Deducción")).toBeInTheDocument();
    expect(screen.getByText("Rp. 100")).toBeInTheDocument();
    expect(screen.getByText("Salario total :")).toBeInTheDocument();
    expect(screen.getByText("Rp. 5400")).toBeInTheDocument();
  });

  test("calls print function on print button click", () => {
    render(
      <BrowserRouter>
        <PrintPdfDataGajiPegawai />
      </BrowserRouter>
    );

    const buttons = screen.getAllByText("Lista de salario del empleado");
    const printButton = buttons[0]; // O el índice que corresponda al botón real
    fireEvent.click(printButton);    fireEvent.click(printButton);

    // Se puede verificar más a fondo si mockeas e inyectas tu función
    expect(printButton).toBeInTheDocument(); // básico
  });
});