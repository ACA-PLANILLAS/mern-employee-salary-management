import React, { useRef, useEffect, useState } from "react";
import LogoPt from "../../../../assets/images/logo/logo-dark.svg";
import LogoSipeka from "../../../../assets/images/logo/logo-sipeka.png";
import { useReactToPrint } from "react-to-print";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../../../config/redux/action";
import { ButtonOne, ButtonTwo } from "../../../atoms";
import { useTranslation } from "react-i18next";
import { useDisplayValue } from "../../../../hooks/useDisplayValue";
import useCurrencyByUser from "../../../../config/currency/useCurrencyByUser";

const API_URL = import.meta.env.VITE_API_URL;

const PrintPdfLaporanGaji = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("dataGaji");
  const { isError, user } = useSelector((s) => s.auth);

  const getDisplayValue = useDisplayValue();
  const { toLocal, symbol, currency } = useCurrencyByUser();

  const [data, setData] = useState([]);

  const params = new URLSearchParams(location.search);
  const monthParam = params.get("month");
  const yearParam = params.get("year");

  const [day, setDay] = useState("");
  const [monthName, setMonthName] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const today = new Date();
    const m = monthParam ? Number(monthParam) : today.getMonth() + 1;
    const y = yearParam ? Number(yearParam) : today.getFullYear();

    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    setDay(today.getDate());
    setMonthName(monthNames[m - 1]);
    setYear(y);

    // Fetch directo a la API unificada
    fetch(`${API_URL}/data_gaji_pegawai?year=${y}&month=${m}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, [monthParam, yearParam]);

  // Control de acceso y print automático
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) return navigate("/login");
    if (user && user.hak_akses !== "admin") return navigate("/dashboard");
    handlePrint();
  }, [isError, user, navigate, handlePrint]);

  return (
    <>
      {/* Botones de acción */}
      <div className="flex gap-3 bg-white p-6 text-center dark:bg-meta-4">
        <ButtonOne onClick={handlePrint}>{t("printSalaryList")}</ButtonOne>
        <ButtonTwo onClick={() => navigate(-1)}>{t("back")}</ButtonTwo>
      </div>

      {/* Contenido a imprimir */}
      <div ref={componentRef} className="bg-white p-10 dark:bg-meta-4">
        {/* Encabezado con logos */}
        <div className="flex items-center justify-between border-b-4 border-black pb-4 dark:border-white">
          <img src={LogoSipeka} alt="SiPeKa" className="w-32" />
        </div>

        {/* Título y fecha */}
        <h2 className="my-4 text-center text-xl font-medium dark:text-white">
          {t("employeeSalaryData")}
        </h2>
        <div className="mb-6 dark:text-white">
          <strong>{t("date")}:</strong> {`${day} ${monthName} ${year}`}
        </div>

        {/* Tabla con mismas columnas y traducciones que DataGaji */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("no")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("duiOrNit")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("documentType")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("name")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("positionName")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("grossSalary")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("presentDays")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("sickDays")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("alpha")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("deductions")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("absencePenalty")}
                </th>
                <th className="border px-2 py-1 dark:border-white dark:text-white">
                  {t("total")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.attendanceId}>
                  <td className="border px-2 py-1 text-center dark:border-white">
                    {i + 1}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {row.dui_or_nit}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {row.document_type}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {[
                      row.first_name,
                      row.middle_name,
                      row.last_name,
                      row.second_last_name,
                      row.maiden_name,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {row.nama_jabatan}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {" "}
                    {symbol}
                    {toLocal(row.salarioBruto)}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {row.hadir}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {row.sakit}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {row.alpha}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {symbol}
                    {toLocal(row.totalDeductions)}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {symbol}
                    {toLocal(row.castigo_ausencias)}
                  </td>
                  <td className="border px-2 py-1 dark:border-white">
                    {symbol}
                    {toLocal(row.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Firma */}
        <div className="mt-6 text-right dark:text-white">
          <p>{`${day} ${getDisplayValue(monthName)} ${year}`}</p>
          <p className="italic">{t("signature")}</p>
        </div>

        {/* Pie de impresión */}
        <div className="mt-10 italic dark:text-white">
          {t("printedOn")}: {`${day} ${getDisplayValue(monthName)} ${year}`}
        </div>
      </div>
    </>
  );
};

export default PrintPdfLaporanGaji;
