import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getMe } from "../../../config/redux/action";
import Layout from "../../../layout";
import { Breadcrumb, ButtonOne, ButtonTwo } from "../../../components";
import { TfiPrinter } from "react-icons/tfi";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

const DetailDataGaji = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataGajiDetail");

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
    navigate(
      `/laporan/slip-gaji/print-page?month=${data.month}&year=${data.year}&name=${id}`
    );
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
                <strong>{t("nik")}:</strong> {data.nik}
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

        {/* --- Desglose Salario y Deducciones --- */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t("salaryBreakdown")}</h2>

          {/* Tabla de ingresos */}
          <table className="mb-6 w-full table-auto">
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
                  Rp. {data.salarioEmpleo}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">{t("transportAllowance")}</td>
                <td className="px-4 py-2 text-right">
                  Rp. {data.tj_transport}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">{t("mealAllowance")}</td>
                <td className="px-4 py-2 text-right">Rp. {data.uang_makan}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">
                  {t("grossProratedSalary")}
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  Rp. {data.salarioBruto}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="mb-6 w-full table-auto">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4">
                <th className="px-4 py-2 text-left">{t("description")}</th>
                <th className="px-4 py-2 text-left">{t("percentage")}</th>
                <th className="px-4 py-2 text-right">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {/* Deducciones tipo STA */}
              {seguros.map((d, i) => (
                <tr key={`sta-${i}`}>
                  <td className="border px-4 py-2">- {d.nama_potongan}</td>
                  <td className="border px-4 py-2">% {d.jml_potongan * 100}</td>
                  <td className="text-red-500 border px-4 py-2 text-right">
                    Rp. {d.valueDeducted.toFixed(2)}
                  </td>
                </tr>
              ))}
              {seguros.length > 0 && (
                <tr className="bg-red-50 font-medium">
                  <td className="border px-4 py-2">{t("subtotalInsurance")}</td>
                  <td className="border px-4 py-2"></td>
                  <td className="border px-4 py-2 text-right">
                    Rp. {totalSeguro}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <table className="mb-6 w-full table-auto">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4">
                <th className="px-4 py-2 text-left">{t("description")}</th>
                <th className="px-4 py-2 text-left">{t("percentage")}</th>
                <th className="px-4 py-2 text-right">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {/* Deducciones tipo DIN */}
              {rentas.map((d, i) => (
                <tr
                  key={`din-${i}`}
                  className={
                    d.valueDeducted > 0 ? "bg-yellow-100 font-medium" : ""
                  }
                >
                  <td className="border px-4 py-2">
                    - Tramo {i + 1} ({d.from} – {d.until})
                  </td>
                  <td className="text-red-500 border px-4 py-2 text-right">
                    Rp. {d.valueDeducted.toFixed(2)}
                  </td>
                </tr>
              ))}
              {rentas.length > 0 && (
                <tr className="bg-red-50 font-medium">
                  <td className="border px-4 py-2">{t("subtotalRenta")}</td>
                  <td className="border px-4 py-2 text-right">
                    Rp. {totalRenta}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Lista de deducciones STA */}
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">{t("insuranceDetails")}</h3>
            {seguros.length > 0 ? (
              <ul className="mb-2 list-inside list-disc">
                {seguros.map((d, i) => (
                  <li key={i}>
                    {d.nama_potongan}: Rp. {d.valueDeducted.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t("none")}</p>
            )}
            <p className="font-medium">
              {t("subtotalInsurance")}: Rp. {totalSeguro}
            </p>
          </div>

          {/* Lista de deducciones DIN (Renta) */}
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">{t("rentaDetails")}</h3>
            {rentas.length > 0 ? (
              <ul className="mb-2 list-inside list-disc">
                {rentas.map((d, i) => (
                  <li key={i}>
                    <strong>
                      Tramo {i + 1} ({d.from}–{d.until}):
                    </strong>{" "}
                    Rp. {d.valueDeducted.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t("none")}</p>
            )}
            <p className="font-medium">
              {t("subtotalRenta")}: Rp. {totalRenta}
            </p>
          </div>

          {/* Penalización por ausencias */}
          <div className="mb-6">
            <h3 className="mb-2 font-semibold">{t("absencePenalty")}</h3>
            <p>Rp. {data.castigo_ausencias}</p>
          </div>

          {/* Total neto */}
          <div className="text-right">
            <p className="text-lg font-bold">
              {t("netSalary")}: Rp. {data.total}
            </p>
          </div>

          <div className="mt-6 text-right">
            <ButtonOne onClick={onSubmitPrint}>
              {t("printSalarySlip")}{" "}
              <TfiPrinter className="ml-2 inline-block" />
            </ButtonOne>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DetailDataGaji;
