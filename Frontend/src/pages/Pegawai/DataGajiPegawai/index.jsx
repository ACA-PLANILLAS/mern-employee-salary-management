import { useState, useEffect } from "react";
import Layout from "../../../layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, ButtonOne } from "../../../components";
import Swal from "sweetalert2";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { TfiPrinter } from "react-icons/tfi";
import { useTranslation } from "react-i18next";
import { API_URL } from "@/config/env";
import { getMe } from "../../../config/redux/action";
import useCurrencyByUser from "../../../config/currency/useCurrencyByUser";

const MONTH_OPTIONS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DEFAULT_MONTH = (new Date().getMonth() + 1).toString();
const DEFAULT_YEAR = new Date().getFullYear().toString();

const DataGajiPegawai = () => {
  const [filterMonth, setFilterMonth] = useState(DEFAULT_MONTH);
  const [filterYear, setFilterYear] = useState(DEFAULT_YEAR);
  const [dataGaji, setDataGaji] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("dataGaji");
  const { isError, user } = useSelector((state) => state.auth);
  const { toLocal, symbol } = useCurrencyByUser();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!filterMonth || !filterYear) {
      Swal.fire({
        icon: "error",
        title: t("incompleteDataTitle", "Datos incompletos"),
        text: t("incompleteDataText", "Por favor selecciona mes y año."),
        timer: 2000,
      });
      return;
    }

    try {
      if (!user) return;
      dispatch(getMe());

      const res = await fetch(
        `${API_URL}/data_gaji_pegawai?year=${filterYear}&month=${filterMonth}`
      );
      const all = await res.json();

      // Filtramos solo las filas de este usuario
      const results = all.filter((item) => item.id === user.id);

      if (results.length > 0) {
        setDataGaji(results);
        setShowMessage(false);
      } else {
        setDataGaji([]);
        setShowMessage(true);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: t("fetchErrorTitle", "Error al obtener datos"),
        text: error.message,
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    // Al montar, hacemos la búsqueda por defecto en cuanto tengamos user
    if (user) handleSearch({ preventDefault: () => {} });
  }, [user]);

  useEffect(() => {
    if (isError) navigate("/login");
  }, [isError, navigate]);

  return (
    <Layout>
      <Breadcrumb pageName={t("mySalarySlips", "Mis planillas de salario")} />

      {/* === Formulario de filtro === */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-4">
        <div className="relative w-1/4">
          <label className="mb-1 block text-sm font-medium">
            {t("month", "Mes")}
          </label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full appearance-none rounded border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          >
            <option value="">{t("selectMonth", "Seleccione mes")}</option>
            <option value="1">{t("january")}</option>
            <option value="2">{t("february")}</option>
            <option value="3">{t("march")}</option>
            <option value="4">{t("april")}</option>
            <option value="5">{t("may")}</option>
            <option value="6">{t("june")}</option>
            <option value="7">{t("july")}</option>
            <option value="8">{t("august")}</option>
            <option value="9">{t("september")}</option>
            <option value="10">{t("october")}</option>
            <option value="11">{t("november")}</option>
            <option value="12">{t("december")}</option>
            {/* {MONTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.label.toLowerCase(), opt.label)}
              </option>
            ))} */}
          </select>
          <MdOutlineKeyboardArrowDown className="pointer-events-none absolute right-3 top-10 text-xl" />
        </div>

        <div className="relative w-1/4">
          <label className="mb-1 block text-sm font-medium">
            {t("year", "Año")}
          </label>
          <input
            type="number"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            placeholder={t("yearPlaceholder", "YYYY")}
            className="w-full appearance-none rounded border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          />
          <BiSearch className="pointer-events-none absolute left-3 top-10 text-xl" />
        </div>

        <div className="flex items-end">
          <ButtonOne type="submit">{t("search", "Buscar")}</ButtonOne>
        </div>
      </form>

      {showMessage && (
        <div className="text-red-600 mb-4">
          {t("noRecords", {
            filterMonth,
            filterYear,
            defaultValue: `No se encontraron registros para ${filterMonth}/${filterYear}.`
          })}
        </div>
      )}

      {/* === Tabla de resultados === */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              <th className="px-2 py-4 font-medium text-black dark:text-white">
                {t("no", "#")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("monthYear", "Mes/Año")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("grossSalary", "Salario Bruto")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("presentDays", "Días Presentes")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("sickDays", "Días Enfermo")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("alpha", "Ausencias")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("deductions", "Deducciones")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("absencePenalty", "Penalización")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("total", "Total")}
              </th>
              <th className="px-2 py-2 font-medium text-black dark:text-white">
                {t("print", "Imprimir")}
              </th>
            </tr>
          </thead>
          <tbody>
            {dataGaji.map((row, idx) => (
              <tr key={row.attendanceId}>
                <td className="px-4 py-2 text-center">{idx + 1}</td>
                <td className="px-4 py-2 text-center">
                  {row.month}/{row.year}
                </td>
                <td className="px-4 py-2 text-right">
                  {symbol}
                  {toLocal(row.salarioBruto)}
                </td>
                <td className="px-4 py-2 text-center">{row.hadir}</td>
                <td className="px-4 py-2 text-center">{row.sakit}</td>
                <td className="px-4 py-2 text-center">{row.alpha}</td>
                <td className="px-4 py-2 text-right">
                  {symbol}
                  {toLocal(row.totalDeductions)}
                </td>
                <td className="px-4 py-2 text-right">
                  {symbol}
                  {toLocal(parseFloat(row.castigo_ausencias))}
                </td>
                <td className="px-4 py-2 text-right">
                  {symbol}
                  {toLocal(parseFloat(row.total))}
                </td>
                <td className="px-4 py-2 text-center">
                  <a
                    href={`/print-employee-receipt/${row.attendanceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-gray-200 inline-block rounded p-2"
                  >
                    <TfiPrinter className="text-xl" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default DataGajiPegawai;
