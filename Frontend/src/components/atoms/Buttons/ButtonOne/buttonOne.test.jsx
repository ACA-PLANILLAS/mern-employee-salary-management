// src/components/atoms/ButtonOne/buttonOne.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonOne from "./index.jsx";

describe("ButtonOne", () => {
  it("muestra el texto de los children correctamente", () => {
    render(<ButtonOne>Haz clic aquí</ButtonOne>);
    expect(screen.getByText("Haz clic aquí")).toBeInTheDocument();
  });

  it("aplica la clase personalizada", () => {
    render(<ButtonOne className="bg-red-500">Botón</ButtonOne>);
    const button = screen.getByText("Botón");
    expect(button).toHaveClass("bg-red-500");
  });

  it("dispara el evento onClick cuando se hace clic", () => {
    const handleClick = jest.fn();
    render(<ButtonOne onClick={handleClick}>Clic</ButtonOne>);
    fireEvent.click(screen.getByText("Clic"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
