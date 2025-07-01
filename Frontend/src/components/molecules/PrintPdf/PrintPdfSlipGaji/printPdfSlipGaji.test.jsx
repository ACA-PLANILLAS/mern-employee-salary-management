import React from "react";
import { render, screen } from "@testing-library/react";
import PrintPdfSlipGaji from "./index";
import { BrowserRouter } from "react-router-dom";
import * as reactToPrint from "react-to-print";

// Mock useTranslation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        printSalarySlip: "Imprimir slip de salario",
        back: "Volver",
        salaryList: "Slip de salario",
        employeeName: "Nombre del empleado",
        nik: "NIK",
        position: "Posición",
        month: "Mes",
        year: "Año",
        description: "Descripción",
        amount: "Cantidad",
        salary: "Salario base",
        transportAllowance: "Transporte",
        mealAllowance: "Alimentación",
        deduction: "Deducción",
        totalSalary: "Total",
        employee: "Empleado",
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
      slipGaji: {
        dataSlipGaji: [
          {
            nik: "EMP456",
            jabatan: "Ingeniero",
            gaji_pokok: 4000000,
            tj_transport: 200000,
            uang_makan: 150000,
            potongan: 100000,
            total: 4250000,
          },
        ],
      },
    })
  ),
}));

// Mock react-router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    search: "?month=Junio&year=2025&name=Juan Pérez",
  }),
}));

// Mock react-to-print
jest.spyOn(reactToPrint, "useReactToPrint").mockImplementation(() => jest.fn());

describe("PrintPdfSlipGaji Component", () => {
  test("renders salary slip content", () => {
    render(
      <BrowserRouter>
        <PrintPdfSlipGaji />
      </BrowserRouter>
    );

    // Encabezados
    expect(screen.getByText("Imprimir slip de salario")).toBeInTheDocument();
    expect(screen.getByText("Volver")).toBeInTheDocument();
    expect(screen.getByText("Slip de salario")).toBeInTheDocument();

    // Datos generales
    expect(screen.getByText("Nombre del empleado")).toBeInTheDocument();
    expect(screen.getAllByText("Juan Pérez")[0]).toBeInTheDocument();
    expect(screen.getByText("EMP456")).toBeInTheDocument();
    expect(screen.getByText("Ingeniero")).toBeInTheDocument();
    expect(screen.getByText("Junio")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();

    // Detalles de la tabla
    expect(screen.getByText("Salario base")).toBeInTheDocument();
    expect(screen.getByText("Rp. 4000000")).toBeInTheDocument();
    expect(screen.getByText("Transporte")).toBeInTheDocument();
    expect(screen.getByText("Rp. 200000")).toBeInTheDocument();
    expect(screen.getByText("Alimentación")).toBeInTheDocument();
    expect(screen.getByText("Rp. 150000")).toBeInTheDocument();
    expect(screen.getByText("Deducción")).toBeInTheDocument();
    expect(screen.getByText("Rp. 100000")).toBeInTheDocument();
    const totalCell = screen.getAllByText((_, el) => el.textContent.includes("Total"));
    expect(totalCell[0]).toBeInTheDocument(); // o selecciona el índice correcto si hay más de uno
    expect(screen.getByText("Rp. 4250000")).toBeInTheDocument();

    // Firmas
    expect(screen.getAllByText("Finanzas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Firma").length).toBeGreaterThan(0);
    const printedOnElements = screen.getAllByText((_, element) =>
        element.textContent.includes("Impreso el")
      );
      expect(printedOnElements.length).toBeGreaterThanOrEqual(2);
  });
});