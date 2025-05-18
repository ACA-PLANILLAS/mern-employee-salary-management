import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Layout from "../../../../../layout";
import Swal from "sweetalert2";
import { Breadcrumb, ButtonOne, ButtonTwo } from "../../../../../components";
import { BiSearch } from "react-icons/bi";
import { getMe } from "../../../../../config/redux/action";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../../hooks/useErrorMessage";
import { useDisplayValue } from "../../../../../hooks/useDisplayValue";
import { OBSERVATION_CODES } from "../../../../../shared/Const";
import useCurrencyByUser from "../../../../../config/currency/useCurrencyByUser";

const ITEMS_PER_PAGE = 4;

//import { API_URL } from '@/config/env';
import { API_URL } from "@/config/env";

const FormAddDataKehadiran = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [dataKehadiran, setDataKehadiran] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataKehadiranAddForm");
  const getErrorMessage = useErrorMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getDisplayValue = useDisplayValue();
  const { currency, symbol, toUSD } = useCurrencyByUser();

  const validateMoneyInput = (value) => /^\d+(\.\d{0,2})?$/.test(value);

  const renderMoneyInput = (name, value, onChange) => (
    <div className="relative flex items-center">
      <span className="absolute left-3 top-1/2 flex w-4 -translate-y-1/2 transform items-center justify-center text-black dark:text-white">
        {symbol}
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
        className="h-8 w-[7rem] rounded-md border pl-10 text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
      />
      {currency !== "USD" && (
        <span className="text-gray-700 dark:text-gray-300 bg-gray-50 ml-2 whitespace-nowrap rounded border border-stroke px-2 py-1 text-sm dark:border-strokedark dark:bg-boxdark">
          ≈ ${toUSD(Number(value)).toFixed(2)} USD
        </span>
      )}
    </div>
  );

  // Campos de asistencia
  const [hadir, setHadir] = useState([]);
  const [sakit, setSakit] = useState([]);
  const [alpha, setAlpha] = useState([]);

  // Nuevos campos
  const [workedHours, setWorkedHours] = useState([]);
  const [additionalPayments, setAdditionalPayments] = useState([]);
  const [vacationPayments, setVacationPayments] = useState([]);
  const [vacationDays, setVacationDays] = useState([]);
  const [comment01, setComment01] = useState([]);
  const [comment02, setComment02] = useState([]);

  // Paginación
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const filteredDataPegawai = dataPegawai.filter(
    (pegawai) =>
      pegawai.first_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      pegawai.middle_name
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      pegawai.last_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      pegawai.second_last_name
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      pegawai.maiden_name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const totalPages = Math.ceil(filteredDataPegawai.length / ITEMS_PER_PAGE);

  // Fecha actual para campos automáticos
  const now = new Date();
  const bulanName = now.toLocaleString("es-ES", { month: "long" });
  const monthNum = now.getMonth() + 1;
  const dayNum = now.getDate();
  const yearNum = now.getFullYear();

  // Handlers básicos
  const handleSearch = (e) => setSearchKeyword(e.target.value);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Handlers asistencia
  const handleHadir = (i, v) => {
    const a = [...hadir];
    a[i] = v;
    setHadir(a);
  };
  const handleSakit = (i, v) => {
    const a = [...sakit];
    a[i] = v;
    setSakit(a);
  };
  const handleAlpha = (i, v) => {
    const a = [...alpha];
    a[i] = v;
    setAlpha(a);
  };

  // Handlers nuevos campos
  const handleWorkedHours = (i, v) => {
    const a = [...workedHours];
    a[i] = v;
    setWorkedHours(a);
  };
  const handleAdditionalPayments = (i, v) => {
    const a = [...additionalPayments];
    a[i] = v;
    setAdditionalPayments(a);
  };
  const handleVacationPayments = (i, v) => {
    const a = [...vacationPayments];
    a[i] = v;
    setVacationPayments(a);
  };
  const handleVacationDays = (i, v) => {
    const a = [...vacationDays];
    a[i] = v;
    setVacationDays(a);
  };
  const handleComment01 = (i, v) => {
    const a = [...comment01];
    a[i] = v;
    setComment01(a);
  };
  const handleComment02 = (i, v) => {
    const a = [...comment02];
    a[i] = v;
    setComment02(a);
  };

  // Fetch datos
  const getDataPegawai = async () => {
    const res = await axios.get(`${API_URL}/data_pegawai`);
    setDataPegawai(res.data);
  };
  const getDataKehadiran = async () => {
    try {
      const res = await axios.get(`${API_URL}/data_kehadiran`);
      setDataKehadiran(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDataPegawai();
    getDataKehadiran();
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/login");
    if (user && user.hak_akses !== "admin") navigate("/dashboard");
  }, [isError, user, navigate]);

  const handleFocus = (e) => e.target.select();

  const isValidNumber = (value) => {
    console.log("value", value);
    return /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) >= 0;
  };

  // Guardar
  const saveDataKehadiran = async (e) => {
    e.preventDefault();
    try {
      for (let i = 0; i < dataPegawai.length; i++) {
        const emp = dataPegawai[i];
        const exists = dataKehadiran.some(
          (d) => d.nama_pegawai === emp.nama_pegawai
        );
        if (exists) continue;

        // Validar campos numéricos
        const numericFields = [
          { value: hadir[i] ?? 0, label: t("present") },
          { value: sakit[i] ?? 0, label: t("sick") },
          { value: alpha[i] ?? 0, label: t("alpha") },
          { value: workedHours[i] ?? 0, label: t("workedHours") },
          { value: vacationDays[i] ?? 0, label: t("vacationDays") },
        ];

        for (const field of numericFields) {
          if (!isValidNumber(field.value)) {
            Swal.fire({
              icon: "error",
              title: t("error"),
              text: `${field.label}: ${t("invalidNumber")}`,
            });
            return;
          }
        }

        // Validar campos monetarios
        const monetaryFields = [
          { value: additionalPayments[i] ?? 0, label: t("additionalPayments") },
          { value: vacationPayments[i] ?? 0, label: t("vacationPayments") },
        ];

        for (const field of monetaryFields) {
          if (!isValidNumber(field.value)) {
            Swal.fire({
              icon: "error",
              title: t("error"),
              text: `${field.label}: ${t("invalidAmount")}`,
            });
            return;
          }
        }

        await axios.post(`${API_URL}/data_kehadiran`, {
          nik: emp.id,
          nama_pegawai: emp.id,
          nama_jabatan: emp.id,
          jenis_kelamin: emp.jenis_kelamin,
          hadir: parseInt(hadir[i] ?? 0, 10),
          sakit: parseInt(sakit[i] ?? 0, 10),
          alpha: parseInt(alpha[i] ?? 0, 10),
          worked_hours: parseInt(workedHours[i] ?? 0, 10),
          additional_payments: toUSD(parseFloat(additionalPayments[i] ?? 0)),
          vacation_payments: toUSD(parseFloat(vacationPayments[i] ?? 0)),
          vacation_days: parseInt(vacationDays[i] ?? 0, 10),
          comment_01: comment01[i] || "00",
          comment_02: comment02[i] || "00",
          bulan: bulanName,
          month: monthNum,
          day: dayNum,
          tahun: yearNum,
        });
      }
      Swal.fire({
        icon: "success",
        title: t("successMessage"),
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/data-kehadiran");
    } catch (err) {
      Swal.fire({
        title: t("error"),
        text: getErrorMessage(err.response?.data?.msg),
        icon: "error",
      });
    }
  };

  // Paginación dinámica
  const paginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (start > 1)
      items.push(
        <p key="start-ellipsis" className="px-3">
          …
        </p>
      );
    for (let p = start; p <= end; p++) {
      items.push(
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          className={`border px-3 py-1 ${
            p === currentPage ? "bg-primary text-white" : ""
          }`}
        >
          {p}
        </button>
      );
    }
    if (end < totalPages)
      items.push(
        <p key="end-ellipsis" className="px-3">
          …
        </p>
      );
    return items;
  };

  return (
    <Layout>
      <Breadcrumb pageName={t("formAddAttendance")} />
      <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <form onSubmit={saveDataKehadiran}>
          <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
            <div className="relative mb-4 md:mb-0">
              <input
                type="text"
                placeholder={t("searchEmployee")}
                value={searchKeyword}
                onChange={handleSearch}
                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none focus:border-primary"
              />
              <span className="absolute left-2 py-3 text-xl">
                <BiSearch />
              </span>
            </div>
          </div>
          <div className="overflow-x-auto py-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4">{t("no")}</th>
                  <th className="px-4 py-4">{t("nik")}</th>
                  <th className="px-4 py-4">{t("employeeName")}</th>
                  <th className="px-4 py-4">{t("jobTitle")}</th>
                  <th className="px-4 py-4">{t("gender")}</th>
                  <th className="px-4 py-4">{t("present")}</th>
                  <th className="px-4 py-4">{t("sick")}</th>
                  <th className="px-4 py-4">{t("alpha")}</th>
                  <th className="px-4 py-4">{t("workedHours")}</th>
                  <th className="px-4 py-4">{t("additionalPayments")}</th>
                  <th className="px-4 py-4">{t("vacationPayments")}</th>
                  <th className="px-4 py-4">{t("vacationDays")}</th>
                  <th className="px-4 py-4">{t("comment01")}</th>
                  <th className="px-4 py-4">{t("comment02")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataPegawai
                  .slice(startIndex, endIndex)
                  .map((emp, idx) => {
                    const globalIndex = startIndex + idx;
                    const exists = dataKehadiran.some(
                      (d) => d.nama_pegawai === emp.nama_pegawai
                    );
                    if (exists) {
                      return (
                        <tr key={emp.id} className="border-b">
                          <td className="px-4 py-5 text-center">
                            {globalIndex + 1}
                          </td>
                          <td colSpan="13" className="px-4 py-5 text-center">
                            {t("attendanceDataAlreadySaved")}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={emp.id} className="border-b">
                        <td className="px-4 py-5 text-center">
                          {globalIndex + 1}
                        </td>
                        <td className="px-4 py-5">{emp.nik}</td>
                        <td className="px-4 py-5">{emp.nama_pegawai}</td>
                        <td className="px-4 py-5">{emp.jabatan}</td>
                        <td className="px-4 py-5">{emp.jenis_kelamin}</td>
                        <td className="px-4 py-5">
                          <input
                            type="number"
                            min="0"
                            required
                            value={hadir[idx] ?? 0}
                            onChange={(e) => handleHadir(idx, e.target.value)}
                            onFocus={handleFocus}
                            className="form-input h-8 w-10 rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                          />
                        </td>
                        <td className="px-4 py-5">
                          <input
                            type="number"
                            min="0"
                            required
                            value={sakit[idx] ?? 0}
                            onChange={(e) => handleSakit(idx, e.target.value)}
                            onFocus={handleFocus}
                            className="form-input h-8 w-10 rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                          />
                        </td>
                        <td className="px-4 py-5">
                          <input
                            type="number"
                            min="0"
                            required
                            value={alpha[idx] ?? 0}
                            onChange={(e) => handleAlpha(idx, e.target.value)}
                            onFocus={handleFocus}
                            className="form-input h-8 w-10 rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                          />
                        </td>
                        <td className="px-4 py-5">
                          <input
                            type="number"
                            min="0"
                            required
                            value={workedHours[idx] ?? 0}
                            onChange={(e) =>
                              handleWorkedHours(idx, e.target.value)
                            }
                            onFocus={handleFocus}
                            className="form-input h-8 w-10 rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                          />
                        </td>
                        <td className="px-4 py-5">
                          {renderMoneyInput(
                            "additional_payments",
                            additionalPayments[idx] ?? 0,
                            (e) => handleAdditionalPayments(idx, e.target.value)
                          )}
                        </td>
                        <td className="px-4 py-5">
                          {renderMoneyInput(
                            "vacation_payments",
                            vacationPayments[idx] ?? 0,
                            (e) => handleVacationPayments(idx, e.target.value)
                          )}
                        </td>
                        <td className="px-4 py-5">
                          <input
                            type="number"
                            min="0"
                            value={vacationDays[idx] ?? 0}
                            onChange={(e) =>
                              handleVacationDays(idx, e.target.value)
                            }
                            onFocus={handleFocus}
                            className="form-input h-8 w-10 rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                          />
                        </td>
                        <td className="px-4 py-5">
                          <select
                            value={comment01[idx] || "00"}
                            onChange={(e) =>
                              handleComment01(idx, e.target.value)
                            }
                            className="form-input h-8 w-[11rem] rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                            required
                          >
                            {OBSERVATION_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code} – {getDisplayValue(c.label)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-5">
                          <select
                            value={comment02[idx] || "00"}
                            onChange={(e) =>
                              handleComment02(idx, e.target.value)
                            }
                            className="form-input h-8 w-[11rem] rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                          >
                            {OBSERVATION_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code} – {getDisplayValue(c.label)}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
            <span className="text-sm">
              {t("showingData")} {startIndex + 1}-
              {Math.min(endIndex, filteredDataPegawai.length)} {t("from")}{" "}
              {filteredDataPegawai.length}
            </span>
            <div className="flex items-center space-x-2 py-4">
              <button
                disabled={currentPage === 1}
                onClick={goToPrevPage}
                className="rounded-lg border border-primary px-6 py-2 text-primary disabled:opacity-50"
              >
                <MdKeyboardDoubleArrowLeft />
              </button>
              {paginationItems()}
              <button
                disabled={currentPage === totalPages}
                onClick={goToNextPage}
                className="rounded-lg border border-primary px-6 py-2 text-primary disabled:opacity-50"
              >
                <MdKeyboardDoubleArrowRight />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-4 text-center md:flex-row">
            <ButtonOne type="submit">
              <span>{t("save")}</span>
            </ButtonOne>
            <Link to="/data-kehadiran">
              <ButtonTwo>
                <span>{t("back")}</span>
              </ButtonTwo>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default FormAddDataKehadiran;
