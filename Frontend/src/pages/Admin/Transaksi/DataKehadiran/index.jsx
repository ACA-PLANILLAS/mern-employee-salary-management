import React, { useState, useEffect } from "react";
import Layout from "../../../../layout";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { FaRegEdit, FaPlus } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BiSearch } from "react-icons/bi";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import {
  deleteDataKehadiran,
  getDataKehadiran,
  getMe,
} from "../../../../config/redux/action";
import { useTranslation } from "react-i18next";
import { useDisplayValue } from "../../../../hooks/useDisplayValue";
import useCurrencyByUser from "../../../../config/currency/useCurrencyByUser";
import { OBSERVATION_CODES } from "../../../../shared/Const";
import { useErrorMessage } from "../../../../hooks/useErrorMessage";

const ITEMS_PER_PAGE = 4;

const DataKehadiran = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTahun, setFilterTahun] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const { t } = useTranslation("dataKehadiran");
  const getDisplayValue = useDisplayValue();
  
    const getErrorMessage = useErrorMessage();

  const { toLocal, symbol, currency } = useCurrencyByUser();

  const { dataKehadiran } = useSelector((state) => state.dataKehadiran);
  const { isError, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPages = Math.ceil(dataKehadiran.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Filtrado combinado: por mes, año y nombre completo
  const filteredData = dataKehadiran.filter((d) => {
    const matchBulan =
      !filterBulan || d.bulan.toLowerCase().includes(filterBulan.toLowerCase());
    const matchTahun = !filterTahun || d.tahun.toString() === filterTahun;
    const matchNama =
      !filterNama ||
      d.complete_name.toLowerCase().includes(filterNama.toLowerCase());
    return matchBulan && matchTahun && matchNama;
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: t("confirmation"),
      text: t("deleteConfirmation"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("noText"),
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(deleteDataKehadiran(id))
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                title: t("success"),
                text: t("deleteSuccess"),
                icon: "success",
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              dispatch(getDataKehadiran());
            } else {
              Swal.fire({
                icon: "error",
                title: t("error"),
                text: getErrorMessage(response?.msg),
              }).then(() => {});
            }
          })
          .catch((error) => {
            const status = error.response?.data?.msg || "desconocido";
            Swal.fire({
              icon: "error",
              title: t("error"),
              text: getErrorMessage(status),
            }).then(() => {});
          });
      }
    });
  };

  useEffect(() => {
    dispatch(getDataKehadiran());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/login");
    if (user && user.hak_akses !== "admin") navigate("/dashboard");
  }, [isError, user, navigate]);

  const paginationItems = () => {
    const items = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (start > 1)
      items.push(
        <p key="s-ellips" className="px-3">
          …
        </p>
      );
    for (let p = start; p <= end; p++) {
      items.push(
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          className={`rounded-lg border px-4 py-2 ${
            currentPage === p ? "bg-primary text-white" : ""
          }`}
        >
          {p}
        </button>
      );
    }
    if (end < totalPages)
      items.push(
        <p key="e-ellips" className="px-3">
          …
        </p>
      );
    return items;
  };

  return (
    <Layout>
      <Breadcrumb pageName={t("title")} />

      {/* Filtro */}
      <div className="mt-6 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="border-b border-stroke pb-2 font-medium text-black dark:border-strokedark dark:text-white">
          {t("filterTitle")}
        </h3>
        <div className="mt-4 flex flex-wrap gap-4">
          {/* Mes */}
          <div className="relative flex-1">
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="form-input h-8 w-40 rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">{t("selectMonth")}</option>
              {[
                "january",
                "february",
                "march",
                "april",
                "may",
                "june",
                "july",
                "august",
                "september",
                "october",
                "november",
                "december",
              ].map((m, i) => (
                <option key={i} value={t(m)}>
                  {t(m)}
                </option>
              ))}
            </select>
            <MdOutlineKeyboardArrowDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform text-xl" />
          </div>
          {/* Año */}
          <div className="relative flex-1">
            <input
              type="number"
              placeholder={t("enterYear")}
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              min="0"
              className="form-input h-8 w-40 rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
            />
          </div>
          {/* Nombre */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="form-input h-8 w-full rounded-md border text-center disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
            />
            <BiSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-xl" />
          </div>
          <Link to="/data-kehadiran/form-data-kehadiran/add">
            <ButtonOne>
              <span>{t("inputAttendance")}</span>
              <FaPlus className="ml-2" />
            </ButtonOne>
          </Link>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="mt-6 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("no")}
                </th>
                {/* <th className="py-4 px-4 font-medium text-center text-black dark:text-white">{t('nik')}</th> */}
                <th className="min-w-[180px] px-4 py-4 font-medium text-black dark:text-white">
                  {t("employeeName")}
                </th>
                {/* <th className="py-4 px-4 font-medium text-black dark:text-white">{t('position')}</th> */}
                {/* <th className="py-4 px-4 font-medium text-black dark:text-white">{t('gender')}</th> */}
                <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                  {t("present")}
                </th>
                <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                  {t("sick")}
                </th>
                <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                  {t("absent")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("workedHours")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("additionalPayments")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("vacationDays")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("vacationPayments")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("observation1")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("observation2")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("askPermission")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(startIndex, endIndex).map((data, idx) => (
                <tr key={data.id} className="border-b dark:border-strokedark">
                  <td className="px-4 py-5">{startIndex + idx + 1}</td>
                  {/* <td className="py-5 px-4 text-center">{data.nik}</td> */}
                  <td className="px-4 py-5">{data.complete_name}</td>
                  {/* <td className="py-5 px-4">{data.jabatan_pegawai}</td> */}
                  {/* <td className="py-5 px-4">{getDisplayValue(data.jenis_kelamin)}</td> */}
                  <td className="px-4 py-5 text-center">{data.hadir}</td>
                  <td className="px-4 py-5 text-center">{data.sakit}</td>
                  <td className="px-4 py-5 text-center">{data.alpha}</td>
                  <td className="px-4 py-5 text-center">{data.worked_hours}</td>
                  <td className="px-4 py-5 text-center">
                    {symbol}
                    {toLocal(data.additional_payments)}
                  </td>
                  <td className="px-4 py-5 text-center">
                    {data.vacation_days}
                  </td>
                  <td className="px-4 py-5 text-center">
                    {symbol}
                    {toLocal(data.vacation_payments)}
                  </td>
                  <td className="px-4 py-5 text-center">
                    {getDisplayValue(
                      OBSERVATION_CODES.find((c) => c.code === data.comment_01)
                        ?.label
                    ) || data.comment_01}
                  </td>
                  <td className="px-4 py-5 text-center">
                    {getDisplayValue(
                      OBSERVATION_CODES.find((c) => c.code === data.comment_02)
                        ?.label
                    ) || data.comment_02}
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex space-x-3">
                      <Link
                        to={`/data-kehadiran/form-data-kehadiran/edit/${data.id}`}
                        className="hover:text-black"
                      >
                        <FaRegEdit className="text-xl text-primary" />
                      </Link>
                      <button
                        onClick={() => handleDelete(data.id)}
                        className="hover:text-black"
                      >
                        <BsTrash3 className="text-xl text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm">
            {t("paginationLabel", {
              from: startIndex + 1,
              to: Math.min(endIndex, filteredData.length),
              total: filteredData.length,
            })}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-primary px-6 py-2 text-primary disabled:opacity-50"
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            {paginationItems()}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-primary px-6 py-2 text-primary disabled:opacity-50"
            >
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataKehadiran;
