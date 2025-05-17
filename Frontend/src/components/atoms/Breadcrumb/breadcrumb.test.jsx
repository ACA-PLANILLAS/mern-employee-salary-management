import React from "react";
import { render, screen } from "@testing-library/react";
import Breadcrumb from "./index.jsx";
import { MemoryRouter } from "react-router-dom";

// Mock de react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "navigation.dashboard": "Dashboard"
      };
      return translations[key] || key;
    }
  })
}));

describe("Breadcrumb", () => {
  const pageName = "Usuarios";

  it("muestra el breadcrumb con el nombre de página correcto", () => {
    render(
      <MemoryRouter>
        <Breadcrumb pageName={pageName} />
      </MemoryRouter>
    );

    // Título renderizado
    expect(screen.getByRole("heading", { name: pageName })).toBeInTheDocument();

    // Link a dashboard traducido
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();

    // Segundo item del breadcrumb
    const items = screen.getAllByText(pageName);
    expect(items).toHaveLength(2); // h2 y li
  });
});
