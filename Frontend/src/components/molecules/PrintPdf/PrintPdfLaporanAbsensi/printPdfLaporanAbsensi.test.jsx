import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PrintPdfLaporanAbsensi from "./index";
import { BrowserRouter } from "react-router-dom";
import * as reactToPrint from "react-to-print";

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
  }));
// Mocks generales
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        attendanceReport: "Reporte de asistencia",
        back: "Volver",
        month: "Mes",
        year: "Año",
        nik: "NIK",
        employeeName: "Nombre del empleado",
        position: "Posición",
        present: "Presente",
        sick: "Enfermo",
        alpha: "Injustificado",
        finance: "Finanzas",
        signature: "Firma",
        printedOn: "Impreso en",
      };
      return translations[key] || key;
    },
  }),
  withTranslation: () => (Component) => Component,
}));

// ✅ Mock react-redux completamente
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((fn) =>
    fn({
      auth: {
        isError: false,
        user: { hak_akses: "admin" },
      },
      laporanAbsensi: {
        dataLaporanAbsensi: [
          {
            nik: "EMP001",
            nama_pegawai: "Juan Pérez",
            jabatan_pegawai: "Programador",
            hadir: 20,
            sakit: 2,
            alpha: 1,
          },
        ],
      },
    })
  ),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    search: "?month=Junio&year=2025",
  }),
}));

// Mock de impresión
jest.spyOn(reactToPrint, "useReactToPrint").mockImplementation(() => jest.fn());

describe("PrintPdfLaporanAbsensi Component", () => {
  test("renders attendance report and table data", () => {
    render(
      <BrowserRouter>
        <PrintPdfLaporanAbsensi />
      </BrowserRouter>
    );

    // Verifica títulos y botones
    expect(screen.getAllByText("Reporte de asistencia")[0]).toBeInTheDocument();
    expect(screen.getByText("Volver")).toBeInTheDocument();

    // Verifica datos de la tabla
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("Programador")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByText("1")[1]).toBeInTheDocument();
  });
});