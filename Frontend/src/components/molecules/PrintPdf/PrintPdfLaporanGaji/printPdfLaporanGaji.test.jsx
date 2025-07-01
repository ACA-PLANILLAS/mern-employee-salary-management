import React from "react";
import { render, screen } from "@testing-library/react";
import PrintPdfLaporanGaji from "./index";
import { BrowserRouter } from "react-router-dom";
import * as reactToPrint from "react-to-print";

// Mock useTranslation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        printSalaryReport: "Imprimir reporte de salario",
        back: "Volver",
        salaryList: "Lista de salarios",
        month: "Mes",
        year: "Año",
        nik: "NIK",
        employeeName: "Nombre del empleado",
        position: "Posición",
        salary: "Salario base",
        transportAllowance: "Transporte",
        mealAllowance: "Alimentación",
        deduction: "Deducción",
        totalSalary: "Total",
        finance: "Finanzas",
        signature: "Firma",
        printedOn: "Impreso el",
      };
      return translations[key] || key;
    },
  }),
  withTranslation: () => (Component) => Component,
}));

// Mock redux
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) =>
    selector({
      auth: {
        isError: false,
        user: { hak_akses: "admin" },
      },
      laporanGaji: {
        dataLaporanGaji: [
          {
            nik: "EMP123",
            nama_pegawai: "María Gómez",
            jabatan_pegawai: "Diseñadora",
            gaji_pokok: 5000000,
            tj_transport: 300000,
            uang_makan: 250000,
            potongan: 200000,
            total_gaji: 5350000,
          },
        ],
      },
    })
  ),
}));

// Mock router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    search: "?month=Mayo&year=2025",
  }),
}));

// Mock printing
jest.spyOn(reactToPrint, "useReactToPrint").mockImplementation(() => jest.fn());

describe("PrintPdfLaporanGaji Component", () => {
  test("renders salary report data correctly", () => {
    render(
      <BrowserRouter>
        <PrintPdfLaporanGaji />
      </BrowserRouter>
    );

    // Verifica encabezados
    expect(screen.getByText("Imprimir reporte de salario")).toBeInTheDocument();
    expect(screen.getByText("Volver")).toBeInTheDocument();
    expect(screen.getByText("Lista de salarios")).toBeInTheDocument();
    expect(screen.getByText("Mes")).toBeInTheDocument();
    expect(screen.getByText("Año")).toBeInTheDocument();

    // Verifica contenido de la tabla
    expect(screen.getByText("María Gómez")).toBeInTheDocument();
    expect(screen.getByText("EMP123")).toBeInTheDocument();
    expect(screen.getByText("Diseñadora")).toBeInTheDocument();
    expect(screen.getByText("Rp. 5000000")).toBeInTheDocument();
    expect(screen.getByText("Rp. 300000")).toBeInTheDocument();
    expect(screen.getByText("Rp. 250000")).toBeInTheDocument();
    expect(screen.getByText("Rp. 200000")).toBeInTheDocument();
    expect(screen.getByText("Rp. 5350000")).toBeInTheDocument();
  });
});