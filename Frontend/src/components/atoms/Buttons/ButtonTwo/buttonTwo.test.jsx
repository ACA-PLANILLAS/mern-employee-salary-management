import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonTwo from "./index.jsx";

describe("ButtonTwo", () => {
  it("renderiza correctamente con children", () => {
    render(<ButtonTwo>Eliminar</ButtonTwo>);
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  it("ejecuta la función onClick al hacer clic", () => {
    const handleClick = jest.fn();
    render(<ButtonTwo onClick={handleClick}>Eliminar</ButtonTwo>);
    const button = screen.getByText("Eliminar");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("aplica la clase personalizada", () => {
    render(<ButtonTwo className="bg-yellow-500">Eliminar</ButtonTwo>);
    const button = screen.getByText("Eliminar");
    expect(button).toHaveClass("bg-yellow-500");
  });
});
