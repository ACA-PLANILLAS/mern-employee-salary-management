import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useDisplayValue } from "../../../../hooks/useDisplayValue";
import useCurrencyByUser from "../../../../config/currency/useCurrencyByUser";

import { API_URL } from "@/config/env";
import { ButtonOne } from "../../../atoms";

const PrintPdfBoleta = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { t } = useTranslation("print");
  const getDisplayValue = useDisplayValue();

  const [parametros, setParametros] = useState([]);
  const [tipoBoleta, setTipoBoleta] = useState("");

  const { toLocal, symbol, currency } = useCurrencyByUser();

  useEffect(() => {
    const fetchParametros = async () => {
      try {
        const res = await axios.get(`${API_URL}/parameters`);
        setParametros(res.data);

        const pmon = res.data.find((p) => p.type === "PMON");

        console.log("pmon.value", pmon.value)
        if (pmon) {
          switch (pmon.value) {
            case "1":
              setTipoBoleta("boleta_mensual");
              break;
            case "2":
              setTipoBoleta("boleta_quincenal");
              break;
            case "4":
              setTipoBoleta("boleta_semanal");
              break;
            default:
              setTipoBoleta("boleta_desconocido");
          }
        }
      } catch (err) {
        console.error("Error cargando parámetros:", err);
      }
    };

    fetchParametros();
  }, []);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await axios.get(`${API_URL}/data_gaji_pegawai/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetalle();
  }, [id]);

  if (!data) return <p>{t("loading")}</p>;

  const seguros = data.detallesDeducciones.filter((d) => d.type === "STA");
  const rentas = data.detallesDeducciones.filter((d) => d.type === "DIN");

  const totalSeguro = seguros
    .reduce((sum, d) => sum + d.valueDeducted, 0)
    .toFixed(2);
  const totalRenta = rentas
    .reduce((sum, d) => sum + d.valueDeducted, 0)
    .toFixed(2);
  const totalDeducciones = (
    parseFloat(totalSeguro) + parseFloat(totalRenta)
  ).toFixed(2);

  const fullName = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.second_last_name,
    data.maiden_name,
  ]
    .filter(Boolean)
    .join(" ");

  const today = new Date();
  const fechaFormateada = today.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="flex gap-3 bg-white p-6 text-center dark:bg-meta-4">
        <ButtonOne onClick={handlePrint}>{t("print")}</ButtonOne>
      </div>

      <br />
      <div
        ref={componentRef}
        style={{
          padding: "20px",
          fontFamily: "Arial",
          width: "700px",
          margin: "0 auto",
          border: "1px solid #000",
        }}
      >
        <div style={{ textAlign: "right" }}>
          {t("receiptNumber")}: <strong>____________________</strong>
        </div>
        <h3 style={{ textAlign: "left" }}>
          {t("receivedFrom")} <strong>{data.nombreEmpresa}</strong>
        </h3>
        <p>
          {t("concept")}: <strong>{getDisplayValue(tipoBoleta)}</strong>
        </p>
        {/* <p>{t("period")}: <strong>01 al 30 de abril de {data.year}</strong></p> */}
        <p>
          {t("workedDays")}: <strong>{data.hadir}</strong>
        </p>

        <br />
        <table width="100%" style={{ marginTop: "10px", marginBottom: "10px" }}>
          <tbody>
            <tr>
              <td>
                <strong>{t("earnedSalary")}</strong>
              </td>
              <td>
                {symbol}
                {toLocal(data.salarioBruto)}
              </td>
              <td>
                <strong>{t("isss")}</strong>
              </td>
              <td>
                {symbol}
                {toLocal(totalSeguro)}
              </td>
            </tr>
            <tr>
              <td>{t("extraPayments")}</td>
              <td>{symbol} -</td>
              <td>{t("isr")}</td>
              <td>
                {symbol}
                {toLocal(totalRenta)}
              </td>
            </tr>

            <tr>
              <td>{t("vacationPayments")}</td>
              <td>{symbol} -</td>
              <td>{t("totalDeductions")}</td>
              <td>
                {symbol}
                {toLocal(totalDeducciones)}
              </td>
            </tr>

            <tr>
              <td>( - ) {t("absencesPenalty")}</td>
              <td>{symbol} -</td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td>( - ) {t("totalDeductions")}</td>
              <td>
                {symbol}
                {toLocal(data.totalDeductions)}
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <strong>{t("netToReceive")}</strong>
              </td>
              <td>
                <strong>
                  {symbol}
                  {toLocal(data.total)}
                </strong>
              </td>
              {/* <td>{t("totalDeductions")}</td>
              <td>${totalDeducciones}</td> */}
            </tr>

            {/* <tr>
              <td>{t("vacations")}</td>
              <td>$ -</td>
              <td>{t("totalDeductions")}</td>
              <td>${totalDeducciones}</td>
            </tr> */}
            {/* <tr>
              <td>{t("annualIndemnization")}</td>
              <td>$ -</td>
            </tr>
            
            <tr>
              <td><strong>{t("netToReceive")}</strong></td>
              <td><strong>${data.total}</strong></td>
            </tr> */}
          </tbody>
        </table>

        <p>
          {t("placeDate")}: {data.ubicacionEmpresa}, {fechaFormateada}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <div>
            ___________________________
            <br />
            {t("authorized")}
          </div>
          <div>
            ___________________________
            <br />
            {t("employeeCode")}: {data.id}
            <br />
            {t("position")}: {data.nama_jabatan}
            <br />
            {t("dui")}: {data.dui_or_nit}
          </div>
        </div>

        <div style={{ marginTop: "30px", borderTop: "1px solid black" }}>
          <p>
            <strong>{t("officeUse")}</strong>
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{t("observations")}</strong>
              <br />
              A-
              <br />
              B-
            </div>
            <div>{t("accounting")}</div>
            <div>{t("audit")}</div>
          </div>
        </div>
      </div>

      <br />
    </div>
  );
};

export default PrintPdfBoleta;
