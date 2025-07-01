import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PrintPdfBoleta from "./index";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Mocks necesarios
jest.mock("axios");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => ({
      print: "Imprimir",
      loading: "Cargando...",
      receiptNumber: "Recibo N°",
      receivedFrom: "Recibí de",
      concept: "Concepto",
      workedDays: "Días trabajados",
      earnedSalary: "Sueldo devengado",
      isss: "ISSS",
      extraHours: "Horas extras",
      isr: "ISR",
      totalDeductions: "Total Deducciones",
      netToReceive: "Neto a Recibir",
      placeDate: "Lugar y fecha",
      authorized: "Autorizado por",
      employeeCode: "Código del empleado",
      position: "Puesto",
      dui: "DUI o NIT",
      officeUse: "Uso exclusivo de oficina",
      observations: "Observaciones",
      accounting: "Contabilidad",
      audit: "Auditoría",
    }[key] || key),
  }),
}));

jest.mock("react-to-print", () => ({
  useReactToPrint: () => jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
}));

jest.mock("../../../../hooks/useDisplayValue", () => ({
  useDisplayValue: () => () => "Boleta Mensual",
}));

jest.mock("../../../../config/currency/useCurrencyByUser", () => ({
  __esModule: true,
  default: () => ({
    toLocal: (value) => Number(value).toLocaleString("es-SV", { minimumFractionDigits: 2 }),
    symbol: "$",
    currency: "USD",
  }),
}));

describe("PrintPdfBoleta Component", () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/parameters")) {
        return Promise.resolve({
          data: [{ type: "PMON", value: 1 }],
        });
      }
      if (url.includes("/data_gaji_pegawai/123")) {
        return Promise.resolve({
          data: {
            id: 123,
            first_name: "Juan",
            middle_name: "Carlos",
            last_name: "Pérez",
            second_last_name: "",
            maiden_name: "",
            hadir: 22,
            gaji_pokok: 500,
            totalDeductions: 50,
            total: 450,
            nama_jabatan: "Programador",
            dui_or_nit: "12345678-9",
            detallesDeducciones: [
              { type: "STA", valueDeducted: 20 },
              { type: "DIN", valueDeducted: 30 },
            ],
          },
        });
      }
    });
  });

  test("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <PrintPdfBoleta />
      </BrowserRouter>
    );
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  test("renders boleta data after API call", async () => {
    render(
      <BrowserRouter>
        <PrintPdfBoleta />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Recibo N°:")).toBeInTheDocument();
    });

    expect(screen.getByText("Boleta Mensual")).toBeInTheDocument();
    expect(screen.getByText("Días trabajados:")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();

    expect(screen.getByText("$500.00")).toBeInTheDocument(); // Sueldo
    expect(screen.getByText("$20.00")).toBeInTheDocument(); // ISSS
    expect(screen.getByText("$30.00")).toBeInTheDocument(); // ISR
    expect(screen.getAllByText("$50.00").length).toBeGreaterThan(1); // Total Deducciones
    expect(screen.getByText("$450.00")).toBeInTheDocument(); // Neto a recibir

    expect(
        screen.getByText(/Código del empleado:\s*123/)
      ).toBeInTheDocument();       
    expect(screen.getByText(/Puesto:\s*Programador/)).toBeInTheDocument();
    expect(screen.getByText(/DUI o NIT:/i)).toBeInTheDocument();
    expect(screen.getByText(/12345678-9/)).toBeInTheDocument();
    expect(screen.getByText("Contabilidad")).toBeInTheDocument();
    expect(screen.getByText("Auditoría")).toBeInTheDocument();
  });
});