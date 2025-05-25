import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getMe } from "../../../config/redux/action";
import Layout from "../../../layout";
import { Breadcrumb, ButtonOne, ButtonTwo } from "../../../components";
import { TfiPrinter } from "react-icons/tfi";
import { useTranslation } from "react-i18next";
import { useDisplayValue } from "../../../hooks/useDisplayValue";
import useCurrencyByUser from "../../../config/currency/useCurrencyByUser";
import React from "react";

// import { API_URL } from '@/config/env';
import { API_URL } from "@/config/env";

const DetailDataGaji = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataGajiDetail");

  const { toLocal, symbol, currency } = useCurrencyByUser();

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

  // Obtener datos de usuario logueado
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Redirecciones si no está logueado o no es admin
  useEffect(() => {
    if (isError) return navigate("/login");
    if (user && user.hak_akses !== "admin") return navigate("/dashboard");
  }, [isError, user, navigate]);

  // Fetch detalle de una asistencia
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

  if (!data) {
    return (
      <Layout>
        <p className="p-6">{t("loading")}</p>
      </Layout>
    );
  }

  // Filtrar deducciones por tipo
  const seguros = data.detallesDeducciones.filter((d) => d.type === "STA");
  const rentas = data.detallesDeducciones.filter((d) => d.type === "DIN");

  // Calcular totales al momento
  const totalSeguro = seguros
    .reduce((sum, d) => sum + d.valueDeducted, 0)
    .toFixed(2);
  const totalRenta = rentas
    .reduce((sum, d) => sum + d.valueDeducted, 0)
    .toFixed(2);

  // Navegar a impresión
  const onSubmitPrint = () => {
    navigate(`/print-employee-receipt/${data.attendanceId}`);
  };

  // Construir nombre completo
  const fullName = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.second_last_name,
    data.maiden_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Layout>
      <Breadcrumb pageName={t("detailSalaryData")} />
      <Link to="/data-gaji">
        <ButtonTwo>{t("back")}</ButtonTwo>
      </Link>

      <div className="mt-6 rounded-sm border bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* --- Datos del Empleado --- */}
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">{t("employeeInfo")}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p>
                <strong>{t("fullName")}:</strong> {fullName}
              </p>
              <p>
                <strong>{t("documentType")}:</strong> {data.document_type} –{" "}
                {data.dui_or_nit}
              </p>
              <p>
                <strong>{t("hireDate")}:</strong> {data.hire_date}
              </p>
            </div>
            <div>
              <p>
                <strong>{t("position")}:</strong> {data.nama_jabatan}
              </p>
              <p>
                <strong>{t("accessLevel")}:</strong> {data.hak_akses}
              </p>
              <p>
                <strong>{t("month")}:</strong> {data.month}
              </p>
              <p>
                <strong>{t("year")}:</strong> {data.year}
              </p>
            </div>
          </div>
        </section>

        <h2 className="mb-4 mt-4 pb-4 text-center text-xl font-semibold">
          {getDisplayValue(tipoBoleta)}
        </h2>

        {/* --- DESGLOSE PASO A PASO DEL SALARIO --- */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            {t("salaryBreakdownStepByStep")}
          </h2>

          {/* Paso 1: Ingresos */}
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">{t("step1_income")}</h3>
            <table className="mb-2 w-full table-auto">
              <thead>
                <tr className="bg-gray-2 dark:bg-meta-4">
                  <th className="px-4 py-2 text-left">{t("description")}</th>
                  <th className="px-4 py-2 text-right">{t("amount")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">{t("baseSalary")}</td>
                  <td className="px-4 py-2 text-right">
                    {symbol}
                    {toLocal(data.gaji_pokok)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">{t("transportAllowance")}</td>
                  <td className="px-4 py-2 text-right">
                    {symbol}
                    {toLocal(data.tj_transport)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">{t("mealAllowance")}</td>
                  <td className="px-4 py-2 text-right">
                    {symbol}
                    {toLocal(data.uang_makan)}
                  </td>
                </tr>
                <tr className="bg-green-50 font-semibold">
                  <td className="px-4 py-2">{t("grossSalary")}</td>
                  <td className="px-4 py-2 text-right">
                    {symbol}
                    {toLocal(data.salarioBruto)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Paso 2: Penalización por Ausencias */}
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">
              {t("step4_absencePenalty")}
            </h3>
            <p>
              {symbol}
              {toLocal(data.castigo_ausencias)}
            </p>
          </div>

          {/* Paso3: Deducciones Estándar (ISS/AFF) */}
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">
              {t("step2_standardDeductions")}
            </h3>
            <table className="mb-2 w-full table-auto">
              <thead>
                <tr className="bg-gray-2 dark:bg-meta-4">
                  <th className="px-4 py-2 text-left">{t("deduction")}</th>
                  <th className="px-4 py-2 text-right">{t("amount")}</th>
                </tr>
              </thead>
              <tbody>
                {seguros.map((d, i) => (
                  <tr key={`sta-${i}`}>
                    <td className="px-4 py-2">- {d.nama_potongan}</td>
                    <td className="text-red-500 px-4 py-2 text-right">
                      {symbol}
                      {toLocal(d.valueDeducted.toFixed(2))}
                    </td>
                  </tr>
                ))}
                <tr className="bg-red-50 font-semibold">
                  <td className="px-4 py-2">{t("subtotalInsurance")}</td>
                  <td className="px-4 py-2 text-right">
                    {symbol}
                    {toLocal(totalSeguro)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Paso 4: Deducciones por Renta */}
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">
              {t("step3_dynamicDeductions")}
            </h3>
            <table className="mb-2 w-full table-auto">
              <thead>
                <tr className="bg-gray-2 dark:bg-meta-4">
                  <th className="px-4 py-2 text-left">{t("range")}</th>
                  <th className="px-4 py-2 text-right">{t("amount")}</th>
                </tr>
              </thead>
              <tbody>
                {rentas.map((d, i) => (
                  <tr key={`din-${i}`}>
                    <td className="px-4 py-2">
                      Tramo {i + 1} ({d.from} – {d.until})
                    </td>
                    <td className="text-red-500 px-4 py-2 text-right">
                      {symbol}
                      {toLocal(d.valueDeducted.toFixed(2))}
                    </td>
                  </tr>
                ))}
                <tr className="bg-red-50 font-semibold">
                  <td className="px-4 py-2">{t("subtotalRenta")}</td>
                  <td className="px-4 py-2 text-right">
                    {symbol}
                    {toLocal(totalRenta)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Paso 5: Total Deducciones */}
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">
              {t("step5_totalDeductions")}
            </h3>
            <p>
              {symbol}
              {toLocal(
                parseFloat(data.subtotalStandarDeductions) +
                  parseFloat(data.subtotalDynamicDeductions) +
                  parseFloat(data.castigo_ausencias)
              )}
            </p>
          </div>

          {/* Resultado final: Salario Neto */}
          <div className="text-right">
            <p className="text-lg font-bold">
              {t("netSalary")}: {symbol}
              {toLocal(data.total)}
            </p>
          </div>

          <div className="mt-6 text-right">
            <a
              href={`/print-employee-receipt/${data.attendanceId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ButtonOne onClick={() => {}}>
                {t("printSalarySlip")}{" "}
                <TfiPrinter className="ml-2 inline-block" />
              </ButtonOne>
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DetailDataGaji;
