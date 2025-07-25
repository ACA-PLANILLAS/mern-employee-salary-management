import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../config/internalization/i18nTest"; // Usa el i18n de testing
import Banner from "./index.jsx";
import React from 'react';

import { MemoryRouter } from "react-router-dom";

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  // otros métodos si los usas
}));

describe("Banner component", () => {
  beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg) => {
    if (
      msg.includes('act(...)') ||
      msg.includes('not wrapped in act') ||
      msg.includes('Warning:')
    ) {
      return;
    }
    console.error(msg);
  });
  jest.spyOn(console, 'warn').mockImplementation((msg) => {
    if (
      msg.includes('navigate() in a React.useEffect') ||
      msg.includes('Warning:')
    ) {
      return;
    }
    console.warn(msg);
  });
});

  test("renders translated content", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Banner />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Sistem Penggajian Karyawan Online/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/PT. Humpuss Karbometil Selulosa/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Sebuah platform perusahaan untuk mengelola proses penggajian karyawan secara efisien dan terintegrasi melalui platform digital./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
