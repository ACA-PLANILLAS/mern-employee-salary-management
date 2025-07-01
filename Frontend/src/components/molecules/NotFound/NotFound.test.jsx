import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "./index";
import { BrowserRouter } from "react-router-dom";

// Mock del componente ButtonThree
jest.mock("../../atoms", () => ({
  ButtonThree: ({ children }) => <button data-testid="ButtonThree">{children}</button>,
}));

// Mock de i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "sorryMessage": "Lo sentimos, la página no existe.",
        "backToHome": "Volver al Inicio",
      };
      return translations[key] || key;
    },
  }),
}));

describe("NotFound Component", () => {
  test("renders 404 title, sorry message, and button", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    // Verifica el título 404
    expect(screen.getByText("404")).toBeInTheDocument();

    // Verifica el mensaje traducido
    expect(screen.getByText("Lo sentimos, la página no existe.")).toBeInTheDocument();

    // Verifica el botón
    const button = screen.getByTestId("ButtonThree");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Volver al Inicio");

    // Verifica el ícono FaHome dentro del botón
    expect(button.querySelector("svg")).toBeInTheDocument();

    // Verifica que el botón esté dentro de un enlace a "/"
    const link = button.closest("a");
    expect(link).toHaveAttribute("href", "/");
  });
});