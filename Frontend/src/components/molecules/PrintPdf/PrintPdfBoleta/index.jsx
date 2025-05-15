import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useDisplayValue } from "../../../../hooks/useDisplayValue";

const API_URL = import.meta.env.VITE_API_URL;

const PrintPdfBoleta = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { t } = useTranslation("print");
  const getDisplayValue = useDisplayValue();

  const [parametros, setParametros] = useState([]);
  const [tipoBoleta, setTipoBoleta] = useState("");

  useEffect(() => {
    const fetchParametros = async () => {
      try {
        const res = await axios.get(`${API_URL}/parameters`);
        setParametros(res.data);

        const pmon = res.data.find((p) => p.type === "PMON");
        if (pmon) {
          switch (pmon.value) {
            case 1:
              setTipoBoleta("boleta_mensual");
              break;
            case 2:
              setTipoBoleta("boleta_quincenal");
              break;
            case 4:
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
      <button onClick={handlePrint}>{t("print")}</button>

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
        <h3 style={{ textAlign: "center" }}>{t("receivedFrom")}</h3>
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
              <td>${data.gaji_pokok}</td>
              <td>
                <strong>{t("isss")}</strong>
              </td>
              <td>${totalSeguro}</td>
            </tr>
            <tr>
              <td>{t("extraHours")}</td>
              <td>$ -</td>
              <td>{t("isr")}</td>
              <td>${totalRenta}</td>
            </tr>
            <tr>
              <td>( - ) {t("totalDeductions")}</td>
              <td>${data.totalDeductions}</td>
              {/* <td>{t("otherDiscounts")}</td>
              <td>$ -</td> */}
              <td>{t("totalDeductions")}</td>
              <td>${totalDeducciones}</td>
            </tr>
            <tr>
              <td>
                <strong>{t("netToReceive")}</strong>
              </td>
              <td>
                <strong>${data.total}</strong>
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
          {t("placeDate")}: San Salvador, {fechaFormateada}
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
    </div>
  );
};

export default PrintPdfBoleta;
