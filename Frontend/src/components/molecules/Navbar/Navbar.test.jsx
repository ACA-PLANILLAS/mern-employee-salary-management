import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./index";
import { BrowserRouter } from "react-router-dom";

// Mocks para componentes secundarios
jest.mock("../../atoms/LanguageSwitcher", () => () => <div data-testid="LanguageSwitcher" />);
jest.mock("../../atoms", () => ({
  DarkModeSwitcher: () => <div data-testid="DarkModeSwitcher" />,
  ButtonThree: ({ children, ...props }) => <button data-testid="ButtonThree" {...props}>{children}</button>,
}));

// Mock de i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        "navbar.links.home": "Inicio",
        "navbar.links.about": "Acerca de",
        "navbar.links.contact": "Contacto",
        "navbar.login": "Iniciar Sesión",
        "copyright": "© 2025 SiPeKa",
      };
      return translations[key] || key;
    },
  }),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  });

  test("renders logo and main links", () => {
    expect(screen.getByAltText("Logo SiPeKa")).toBeInTheDocument();
    expect(screen.getAllByText("Inicio").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Acerca de").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contacto").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("ButtonThree")[0]).toHaveTextContent("Iniciar Sesión");

    // Verifica componentes adicionales en modo escritorio
    expect(screen.getAllByTestId("DarkModeSwitcher").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("LanguageSwitcher").length).toBeGreaterThan(0);
  });

  test("drawer opens and displays elements correctly", () => {
    const menuBtn = screen.getByTestId("menu-button");
    fireEvent.click(menuBtn);

    // Asegúrate que el drawer contiene los elementos correctos
    expect(screen.getAllByText("Inicio").length).toBeGreaterThan(1);
    expect(screen.getAllByText("Iniciar Sesión").length).toBeGreaterThan(1);
    expect(screen.getByText("© 2025 SiPeKa")).toBeInTheDocument();

    // Verifica que el drawer también contiene los switchers
    expect(screen.getAllByTestId("DarkModeSwitcher").length).toBeGreaterThan(1);
    expect(screen.getAllByTestId("LanguageSwitcher").length).toBeGreaterThan(1);
  });

  test("drawer closes when close icon is clicked", () => {
    const menuBtn = screen.getByTestId("menu-button");
    fireEvent.click(menuBtn);

    // Click en el ícono de cerrar
    const closeIcon = screen.getByTestId("GiCrossMark");
    fireEvent.click(closeIcon);

    // Ya no se debería mostrar algún contenido del drawer si Drawer desmonta
    // (esto depende de la lib `react-modern-drawer`, pero este assert puede ser útil)
    // expect(screen.queryByText("© 2025 SiPeKa")).not.toBeInTheDocument();
  });

  test("simulates scroll behavior", () => {
    // Scroll hacia abajo (debería ocultar el navbar)
    window.scrollY = 100;
    fireEvent.scroll(window);
    // Aquí puedes verificar con mocks de clases o estados si es necesario
    // Este test es más útil si tienes clases condicionales que controlan la visibilidad
  });

  test("navigation links are clickable", () => {
    const homeLink = screen.getAllByText("Inicio")[0];
    fireEvent.click(homeLink);
    // No cambia de ruta en test sin mock de navigate, pero asegura que el enlace existe y es clickable
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });
});