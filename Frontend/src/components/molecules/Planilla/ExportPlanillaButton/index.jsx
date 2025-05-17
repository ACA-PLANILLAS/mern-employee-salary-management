import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { OBSERVATION_CODES } from "../../../../shared/Const";
import { ButtonOne } from "../../../atoms";
import { TfiPrinter } from "react-icons/tfi";

export default function ExportPlanillaButton({ data, month, year }) {
  // Cabecera “bonita” para Excel (objetos JSON)
  const excelHeader = [
    "DUI/NIT del Empleador",
    "Número patronal ISSS",
    "Período Mes-Año",
    "Correlativo Centro de Trabajo ISSS",
    "Número de Documento",
    "Tipo de Documento",
    "Número de Afiliación ISSS",
    "Institución Previsional",
    "Primer Nombre",
    "Segundo Nombre",
    "Primer Apellido",
    "Segundo Apellido",
    "Apellido de Casada",
    "Salario",
    "Pago Adicional",
    "Monto de Vacación",
    "Días",
    "Horas",
    "Días de Vacación",
    "Código de Observación 01",
    "Código de Observación 02",
  ];

  const csvHeader = excelHeader.join(";");

  const getObsLabel = (code) => {
    const found = OBSERVATION_CODES.find((o) => o.code === code);
    return found ? found.label : code;
  };

  const handleExport = (format) => {
    if (format === "xlsx") {
      const rows = data.map((row) => ({
        [excelHeader[0]]: "TODO: DUI/NIT empleador",
        [excelHeader[1]]: "TODO: número patronal ISSS",
        [excelHeader[2]]: `${month}-${year}`,
        [excelHeader[3]]: "TODO: correlativo CT ISSS",
        [excelHeader[4]]: row.attendanceId,
        [excelHeader[5]]: row.document_type,
        [excelHeader[6]]: row.isss_affiliation_number,
        [excelHeader[7]]: row.pension_institution_code,
        [excelHeader[8]]: row.first_name,
        [excelHeader[9]]: row.middle_name,
        [excelHeader[10]]: row.last_name,
        [excelHeader[11]]: row.second_last_name,
        [excelHeader[12]]: row.maiden_name,
        [excelHeader[13]]: row.salarioEmpleo,
        [excelHeader[14]]: row.additional_payments,
        [excelHeader[15]]: row.vacation_payments,
        [excelHeader[16]]: row.hadir,
        [excelHeader[17]]: row.worked_hours,
        [excelHeader[18]]: row.vacation_days,
        [excelHeader[19]]: getObsLabel(row.comment_01),
        [excelHeader[20]]: getObsLabel(row.comment_02),
      }));

      // Generar Sheet y Workbook
      const ws = XLSX.utils.json_to_sheet(rows, { header: excelHeader });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Planilla");

      // Escribir y guardar
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `planilla-${month}-${year}.xlsx`
      );
    } else {
      // CSV plano con ; y códigos sin traducir
      const lines = [csvHeader];
      data.forEach((row) => {
        const cols = [
          "TODO: DUI/NIT empleador",
          "TODO: número patronal ISSS",
          `${month}-${year}`,
          "TODO: correlativo CT ISSS",
          row.attendanceId,
          row.document_type,
          row.isss_affiliation_number,
          row.pension_institution_code,
          row.first_name,
          row.middle_name,
          row.last_name,
          row.second_last_name,
          row.maiden_name,
          row.salarioEmpleo,
          row.additional_payments,
          row.vacation_payments,
          row.hadir,
          row.worked_hours,
          row.vacation_days,
          row.comment_01,
          row.comment_02,
        ];
        lines.push(cols.join(";"));
      });

      const blob = new Blob([lines.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, `planilla-${month}-${year}.csv`);
    }
  };

  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <ButtonOne
        type="button"
        onClick={() => handleExport("xlsx")}
        className="py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 flex w-full items-center justify-center space-x-2 rounded-lg text-white"
      >
        Exportar Excel
        <TfiPrinter />
      </ButtonOne>

      <ButtonOne
        type="button"
        onClick={() => handleExport("csv")}
        className="py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 flex w-full items-center justify-center space-x-2 rounded-lg text-white"
      >
        Exportar CSV
        <TfiPrinter />
      </ButtonOne>
    </div>
  );
}
