import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ChartOne from "./index";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../config/internalization/i18nTest";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        series: [
          { name: "Male", data: [10, 20, 30] },
          { name: "Female", data: [15, 25, 35] }
        ],
        labels: ["Jan", "Feb", "Mar"]
      }),
  })
);

// Mock de ReactApexChart para evitar errores de librería en test
jest.mock("react-apexcharts", () => () => (
  <div data-testid="mock-chart">Gráfico</div>
));

describe("Componente ChartOne", () => {
  test("debe renderizar correctamente el gráfico y los datos", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ChartOne />
      </I18nextProvider>
    );

    const maleLabel = i18n.t("chartsOne.dataMale");
    const femaleLabel = i18n.t("chartsOne.dataFemale");

    // Espera a que los textos traducidos estén presentes
    await waitFor(() => {
      expect(screen.getByText(maleLabel)).toBeInTheDocument();
      expect(screen.getByText(femaleLabel)).toBeInTheDocument();
    });

    // Verifica que el gráfico esté presente
    expect(screen.getByTestId("mock-chart")).toBeInTheDocument();
  });
});
