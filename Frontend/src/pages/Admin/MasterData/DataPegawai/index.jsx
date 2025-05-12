import { useState, useEffect } from "react";
import Layout from "../../../../layout";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { FaRegEdit, FaPlus } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  deleteDataPegawai,
  getDataPegawai,
  getMe,
} from "../../../../config/redux/action";
import { BiSearch } from "react-icons/bi";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useDisplayValue } from "../../../../hooks/useDisplayValue";
const API_URL = import.meta.env.VITE_API_URL;
import { FaUser } from 'react-icons/fa';

import defaultAvatar from '../../../../assets/images/defaultAvatar.png'

const ITEMS_PER_PAGE = 4;

const DataPegawai = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { dataPegawai } = useSelector((state) => state.dataPegawai);
  const { t } = useTranslation("dataPegawai");
  const getDisplayValue = useDisplayValue();

  const totalPages = Math.ceil(dataPegawai.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const filteredDataPegawai = dataPegawai.filter((pegawai) => {
    const keyword = searchKeyword.toLowerCase();
    const statusKeyword = filterStatus.toLowerCase();
    return (
      // si prefieres buscar también por username o nombres, agrégalos aquí
      // pegawai.nik.toLowerCase().includes(keyword) &&
      (filterStatus === "" || pegawai.status.toLowerCase() === statusKeyword)
    );
  });

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handleSearch = (e) => setSearchKeyword(e.target.value);
  const handleFilterStatus = (e) => setFilterStatus(e.target.value);

  const onDeletePegawai = (id) => {
    Swal.fire({
      title: t("modal.confirmDelete.title"),
      text: t("modal.confirmDelete.text"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("modal.confirmDelete.yes"),
      cancelButtonText: t("modal.confirmDelete.no"),
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDataPegawai(id)).then(() => {
          Swal.fire({
            title: t("toast.deleteSuccess.title"),
            text: t("toast.deleteSuccess.message"),
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          dispatch(getDataPegawai());
        });
      }
    });
  };

  useEffect(() => {
    dispatch(getDataPegawai(startIndex, endIndex));
  }, [dispatch, startIndex, endIndex]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/login");
    if (user && user.hak_akses !== "admin") navigate("/dashboard");
  }, [isError, user, navigate]);

  const paginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 2) {
      items.push(
        <p
          key="start-ellipsis"
          className="border border-gray-2 bg-gray px-4 py-2 font-medium text-black dark:border-strokedark dark:bg-transparent dark:text-white"
        >
          ...
        </p>
      );
    }
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
      <Breadcrumb pageName={t("title")} />
      <Link to="/data-pegawai/form-data-pegawai/add">
        <ButtonOne>
          <span>{t("button.addEmployee")}</span>
          <span>
            <FaPlus />
          </span>
        </ButtonOne>
      </Link>

      <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* filtros */}
        <div className="mt-4 flex flex-col items-center justify-between md:flex-row md:justify-between">
          <div className="relative mb-4 flex-1 md:mb-0 md:mr-2">
            <div className="relative">
              <span className="absolute left-48 top-1/2 z-30 -translate-y-1/2 text-xl">
                <MdOutlineKeyboardArrowDown />
              </span>
              <select
                value={filterStatus}
                onChange={handleFilterStatus}
                className="relative appearance-none rounded border border-stroke bg-transparent px-8 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                <option value="">{t("filter.status")}</option>
                <option value="karyawan tetap">
                  {t("filter.permanentEmployee")}
                </option>
                <option value="karyawan tidak tetap">
                  {t("filter.nonPermanentEmployee")}
                </option>
              </select>
            </div>
          </div>
          <div className="flex-2 relative mb-4 md:mb-0">
            <input
              type="text"
              placeholder={t("search.placeholder.employeeName")}
              value={searchKeyword}
              onChange={handleSearch}
              className="left-0 rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span className="absolute left-2 py-3 text-xl">
              <BiSearch />
            </span>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto py-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  {t("table.header.no")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.photo")}
                </th>
                {/* <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.url")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.id")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.nik")}
                </th> */}
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.duiOrNit")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.documentType")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white min-w-[180px]">
                  {t("table.header.isssAffiliationNumber")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white min-w-[180px]">
                  {t("table.header.pensionInstitutionCode")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.firstName")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.middleName")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.lastName")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.secondLastName")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white min-w-[180px]">
                  {t("table.header.maidenName")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.gender")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white min-w-[180px]">
                  {t("table.header.joinDate")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.status")}
                </th>
                {/* Empleos */}
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.position")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white min-w-[180px]">
                  {t("table.header.lastPositionChangeDate")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.monthlySalary")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.hasActiveLoan")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white min-w-[180px]">
                  {t("table.header.loanOriginalAmount")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.loanOutstandingBalance")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white min-w-[180px]">
                  {t("table.header.loanMonthlyInstallment")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white min-w-[180px]">
                  {t("table.header.loanStartDate")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.username")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.accessRights")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("table.header.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDataPegawai
                .slice(startIndex, endIndex)
                .map((data, index) => (
                  <tr key={data.id}>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {startIndex + index + 1}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="h-12.5 w-15">
                        <div className="overflow-hidden rounded-full">
                          <img
                            src={
                                data.url
                                  ? data.url
                                  : data.photo
                                    ? `${API_URL}/images/${data.photo}`
                                    : defaultAvatar
                              }
                            alt="Photo Profil"
                            onError={e => {
                                // primera vez: cambiamos al avatar por defecto
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = defaultAvatar;
                              }}
                          />
                        </div>
                      </div>
                    </td>
                    {/* <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.url ? (
                        <a
                          href={data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {data.url}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td> */}
                    {/* <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.id}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                      {data.nik}
                    </td> */}
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.dui_or_nit || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.document_type || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.isss_affiliation_number || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.pension_institution_code || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.first_name}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.middle_name || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.last_name}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.second_last_name || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.maiden_name || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {getDisplayValue(data.jenis_kelamin)}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.hire_date || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {getDisplayValue(data.status)}
                    </td>
                    {/* Empleos */}
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {/* positionHistory es un array y necesito obeteer  position.nama_jabatan */}
                      {data.positionHistory && data.positionHistory.length > 0
                        ? data.positionHistory[0]?.position?.nama_jabatan
                        : "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.positionHistory && data.positionHistory.length > 0
                        ? data.positionHistory[0]?.start_date
                        : "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.positionHistory && data.positionHistory.length > 0
                        ? data.positionHistory[0]?.position?.gaji_pokok
                        : "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.has_active_loan != null
                        ? getDisplayValue(data.has_active_loan)
                        : "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.loan_original_amount != null
                        ? data.loan_original_amount
                        : "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.loan_outstanding_balance != null
                        ? data.loan_outstanding_balance
                        : "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.loan_monthly_installment != null
                        ? data.loan_monthly_installment
                        : "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.loan_start_date || "-"}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {data.username}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {getDisplayValue(data.hak_akses)}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <Link
                          to={`/data-pegawai/form-data-pegawai/edit/${data.id}`}
                          className="hover:text-black"
                        >
                          <FaRegEdit className="text-xl text-primary hover:text-black dark:hover:text-white" />
                        </Link>
                        <button
                          onClick={() => onDeletePegawai(data.id)}
                          className="hover:text-black"
                        >
                          <BsTrash3 className="text-xl text-danger hover:text-black dark:hover:text-white" />
                        </button>
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
              {t("pagination.displaying")} {startIndex + 1}-
              {Math.min(endIndex, filteredDataPegawai.length)}{" "}
              {t("pagination.of")} {filteredDataPegawai.length}{" "}
              {t("pagination.totalEmployeeData")}
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

export default DataPegawai;
