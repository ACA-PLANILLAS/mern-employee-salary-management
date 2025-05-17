import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonThree from "./index.jsx";

describe("ButtonThree", () => {
  it("renderiza el texto correctamente", () => {
    render(<ButtonThree>Click aquí</ButtonThree>);
    expect(screen.getByText("Click aquí")).toBeInTheDocument();
  });

  it("aplica la clase personalizada", () => {
    render(<ButtonThree className="bg-red-500">Botón</ButtonThree>);
    const button = screen.getByText("Botón");
    expect(button).toHaveClass("bg-red-500");
  });

  it("ejecuta onClick al hacer clic", () => {
    const mockOnClick = jest.fn();
    render(<ButtonThree onClick={mockOnClick}>Presionar</ButtonThree>);
    const button = screen.getByText("Presionar");
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
