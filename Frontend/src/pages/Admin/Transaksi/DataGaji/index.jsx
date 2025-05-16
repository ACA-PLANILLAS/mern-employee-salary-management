import { useState, useEffect, useMemo } from "react";
import Layout from "../../../../layout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { FaRegEye } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import Swal from "sweetalert2";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { TfiPrinter } from "react-icons/tfi";
import {
  fetchLaporanGajiByMonth,
  fetchLaporanGajiByYear,
  getDataGaji,
  getMe,
} from "../../../../config/redux/action";
import { useTranslation } from "react-i18next";
import { useDisplayValue } from "../../../../hooks/useDisplayValue";
import useCurrencyByUser from "../../../../config/currency/useCurrencyByUser";

const ITEMS_PER_PAGE = 4;

// Obtener valores por defecto para mes y año
const today = new Date();
const DEFAULT_MONTH = (today.getMonth() + 1).toString(); // 1–12
const DEFAULT_YEAR = today.getFullYear().toString();

const DataGaji = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTahun, setFilterTahun] = useState(DEFAULT_YEAR);
  const [filterBulan, setFilterBulan] = useState(DEFAULT_MONTH);
  const [filterNama, setFilterNama] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const { dataGaji } = useSelector((state) => state.dataGaji);
  const { isError, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("dataGaji");
  const getDisplayValue = useDisplayValue();

  const { toLocal, symbol, currency } = useCurrencyByUser();

  const totalPages = Math.ceil(dataGaji.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

    const dateOptions = useMemo(() => {
    //  filtramos por año/mes
    const relevant = dataGaji.filter(
      (d) =>
        d.year.toString() === filterTahun && d.month.toString() === filterBulan
    );
    // extraemos strings únicos "YYYY-M-D"
    const combos = Array.from(
      new Set(relevant.map((d) => `${d.year}-${d.month}-${d.day}`))
    ).sort();
    // devolvemos objetos con valor y etiqueta formateada
    return combos.map((str) => {
      const [yyyy, m, d] = str.split("-");
      const mm = m.padStart(2, "0"),
        dd = d.padStart(2, "0");
      return { value: str, label: `${dd}/${mm}/${yyyy}` };
    });
  }, [dataGaji, filterTahun, filterBulan]);
  
    const filteredDataGaji = dataGaji
    .filter((d) => {
      // primero por año/mes (como ya hacías en el useEffect)
      const byMonthYear =
        d.year.toString() === filterTahun &&
        d.month.toString() === filterBulan;
      if (!byMonthYear) return false;
      // si hay fecha seleccionada, comparar full string
      if (filterDate) {
        return `${d.year}-${d.month}-${d.day}` === filterDate;
      }
      return true;
    });

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleBulanChange = (event) => {
    setFilterBulan(event.target.value);
    setFilterDate("");
  };

  const handleTahunChange = (event) => {
    setFilterTahun(event.target.value);
    setFilterDate("");
  };

  const handleNamaChange = (event) => {
    setFilterNama(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    let dataFound = Array.isArray(dataGaji);
    setShowMessage(true);

    if (dataFound) {
      setShowMessage(false);
      navigate(
        `/laporan/gaji/print-page?month=${filterBulan}&year=${filterTahun}`
      );
    } else {
      setShowMessage(false);
      Swal.fire({
        icon: "error",
        title: t("dataNotFound"),
        text: t("sorryDataNotFound"),
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    dispatch(getDataGaji(filterTahun, filterBulan));
  }, [dispatch, filterTahun, filterBulan]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
    if (user && user.hak_akses !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  const paginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`border border-gray-2 px-4 py-2 font-semibold text-black dark:border-strokedark dark:text-white ${
            currentPage === page
              ? "bg-primary text-white hover:bg-primary dark:bg-primary dark:hover:bg-primary"
              : "hover:bg-gray-2 dark:hover:bg-stroke"
          } rounded-lg`}
        >
          {page}
        </button>
      );
    }

    if (startPage > 2) {
      items.unshift(
        <p
          key="start-ellipsis"
          className="border border-gray-2 bg-gray px-4 py-2 font-medium text-black dark:border-strokedark dark:bg-transparent dark:text-white"
        >
          ...
        </p>
      );
    }

    if (endPage < totalPages - 1) {
      items.push(
        <p
          key="end-ellipsis"
          className="border border-gray-2 bg-gray px-4 py-2 font-medium text-black dark:border-strokedark dark:bg-transparent dark:text-white"
        >
          ...
        </p>
      );
    }

    return items;
  };
  return (
    <Layout>
      <Breadcrumb pageName={t("employeeSalaryData")} />

      <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10">
        <div className="border-b border-stroke py-2 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            {t("filterEmployeeSalaryData")}
          </h3>
        </div>
        <form onSubmit={handleSearch}>
          {showMessage && <p className="text-meta-1">{t("dataNotFound")}</p>}
          <div className="mt-4 flex flex-col items-center md:flex-row md:justify-between">
            <div className="relative mb-4 w-full md:mb-0 md:mr-2 md:w-1/2">
              <div className="relative">
                <span className="px-6">{t("month")}</span>
                <span className="absolute left-70 top-1/2 z-30 -translate-y-1/2 text-xl">
                  <MdOutlineKeyboardArrowDown />
                </span>
                <select
                  value={filterBulan}
                  onChange={handleBulanChange}
                  required
                  className="relative appearance-none rounded border border-stroke bg-transparent px-18 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="">{t("selectMonth")}</option>
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
                </select>
              </div>
            </div>
            <div className="relative mb-4 w-full md:mb-0 md:mr-2 md:w-1/2">
              <div className="relative">
                <span className="px-6">{t("year")}</span>
                <input
                  type="number"
                  placeholder={t("enterYear")}
                  value={filterTahun}
                  onChange={handleTahunChange}
                  required
                  className="left-0 rounded border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <span className="absolute left-25 py-3 text-xl ">
                  <BiSearch />
                </span>
              </div>
            </div>

            <div className="relative mb-4 w-full md:mb-0 md:mr-2 md:w-1/2">
              <div className="relative">
                <span className="px-6">Fecha</span>
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="relative appearance-none rounded border border-stroke bg-transparent px-18 py-2 outline-none transition focus:border-primary"
                >
                  <option value="">{t("allDates")}</option>
                  {dateOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex w-full justify-center md:w-1/2 md:justify-end">
              <div className="w-full md:w-auto">
                <ButtonOne type="submit">
                  <span>{t("printSalaryList")}</span>
                  <span>
                    <TfiPrinter />
                  </span>
                </ButtonOne>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-6 bg-gray-2 text-left dark:bg-meta-4">
          {filteredDataGaji
            .reduce((uniqueEntries, data) => {
              const isEntryExist = uniqueEntries.find(
                (entry) =>
                  entry.bulan === data.bulan && entry.tahun === data.tahun
              );
              if (!isEntryExist) {
                uniqueEntries.push(data);
              }
              return uniqueEntries;
            }, [])
            .map(
              (data) =>
                data.tahun !== 0 &&
                data.bulan !== 0 && (
                  <h2
                    className="px-4 py-2 text-black dark:text-white"
                    key={`${data.bulan}-${data.tahun}`}
                  >
                    {t("displayingSalaryDataMonth")} :
                    <span className="font-medium"> {filterBulan} </span>
                    {t("year")} :{" "}
                    <span className="font-medium">{filterTahun}</span>
                  </h2>
                )
            )}
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mt-4 flex flex-col items-center justify-between md:flex-row md:justify-between">
          <div className="flex-2 relative mb-4 md:mb-0">
            <input
              type="text"
              placeholder={t("searchEmployeeName")}
              value={filterNama}
              onChange={handleNamaChange}
              className="left-0 rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span className="absolute left-2 py-3 text-xl">
              <BiSearch />
            </span>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto py-4">
          <table className="table-auto-full w-full">
            <thead>
              <tr className="bg-gray-2  dark:bg-meta-4">
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("no")}
                </th>
                {/* <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("id")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("nik")}
                </th> */}
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("duiOrNit")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("documentType")}
                </th>
                {/* <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("isssAffiliationNumber")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("pensionInstitutionCode")}
                </th> */}
                <th className="min-w-[380px] px-2 py-2 font-medium text-black dark:text-white">
                  {t("name")}
                </th>
                {/* <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("middleName")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("lastName")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("secondLastName")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("maidenName")}
                </th> */}
                {/* <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("gender")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("hireDate")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("status")}
                </th> */}
                {/* <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("lastPositionChangeDate")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("monthlySalary")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("hasActiveLoan")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("loanOriginalAmount")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("loanOutstandingBalance")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("loanMonthlyInstallment")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("loanStartDate")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("username")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("photo")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("url")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("accessRights")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("positionId")}
                </th> */}
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("positionName")}
                </th>
                {/* <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("userId")}
                </th> */}
                {/* <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("createdAt")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("updatedAt")}
                </th> */}
                {/* <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("dataPegawaiId")}
                </th> */}
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("grossSalary")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("presentDays")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("sickDays")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("alpha")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("deductions")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("absencePenalty")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("total")}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDataGaji
                .slice(startIndex, endIndex)
                .map((data, index) => (
                  <tr key={data.attendanceId}>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {startIndex + index + 1}
                    </td> 
                    {/* <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.id}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.nik}
                    </td> */}
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.dui_or_nit}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.document_type}
                    </td>
                    {/* <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.isss_affiliation_number}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.pension_institution_code}
                    </td> */}
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.first_name} {data.middle_name} {data.last_name}{" "}
                      {data.second_last_name} {data.maiden_name}
                    </td>
                    {/* <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.middle_name}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.last_name}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.second_last_name}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.maiden_name}
                    </td> */}
                    {/* <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.jenis_kelamin}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.hire_date}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.status}
                    </td> */}
                    {/* <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.last_position_change_date}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.monthly_salary}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.has_active_loan.toString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.loan_original_amount}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.loan_outstanding_balance}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.loan_monthly_installment}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.loan_start_date}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.username}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.photo}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      <a
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.url}
                      </a>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.hak_akses}
                    </td>
                    
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.id_jabatan}
                    </td> */}
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.nama_jabatan}
                    </td>{" "}
                    {/*
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.userId}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.createdAt}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.updatedAt}
                    </td> */}
                    {/* <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.dataPegawaiId}
                    </td> */}
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {symbol}{toLocal(data.salarioBruto)}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.hadir}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.sakit}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.alpha}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {symbol}{toLocal(data.totalDeductions)}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.castigo_ausencias}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {symbol}{toLocal(data.total)}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <Link
                          className="hover:text-black"
                          to={`/data-gaji/detail-data-gaji/id/${data.attendanceId}`}
                        >
                          <FaRegEye className="text-xl text-primary hover:text-black dark:hover:text-white" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between md:flex-row md:justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-5 dark:text-gray-4 py-4 text-sm">
              {t("displaying")} {startIndex + 1}-
              {Math.min(endIndex, filteredDataGaji.length)} {t("of")}{" "}
              {filteredDataGaji.length} {t("employeeSalaryData")}
            </span>
          </div>
          <div className="flex space-x-2 py-4">
            <button
              disabled={currentPage === 1}
              onClick={goToPrevPage}
              className="rounded-lg border border-primary px-6 py-2 font-semibold text-primary hover:bg-primary hover:text-white disabled:opacity-50 dark:border-primary dark:text-white dark:hover:bg-primary dark:hover:text-white"
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            {paginationItems()}
            <button
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
              className="rounded-lg border border-primary px-6 py-2 font-semibold text-primary hover:bg-primary hover:text-white disabled:opacity-50 dark:border-primary dark:text-white dark:hover:bg-primary dark:hover:text-white"
            >
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataGaji;
