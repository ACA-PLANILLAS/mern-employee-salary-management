import { useState, useEffect } from "react";
import Layout from "../../../../layout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { FaRegEdit, FaPlus } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import {
  deleteDataJabatan,
  getDataJabatan,
  getMe,
} from "../../../../config/redux/action";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import useCurrencyByUser from "../../../../config/currency/useCurrencyByUser";
import { CurrencySwitcher } from "../../../../components/atoms";
import { useErrorMessage } from "../../../../hooks/useErrorMessage";

const ITEMS_PER_PAGE = 4;

const DataJabatan = () => {
  const { toLocal, symbol, currency } = useCurrencyByUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const getErrorMessage = useErrorMessage();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isError, user } = useSelector((state) => state.auth);
  const { dataJabatan } = useSelector((state) => state.dataJabatan);
  const { t } = useTranslation("dataJabatan");

  const totalPages = Math.ceil(dataJabatan.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const filteredDataJabatan = dataJabatan.filter((jabatan) => {
    const { nama_jabatan } = jabatan;
    const keyword = searchKeyword.toLowerCase();
    return nama_jabatan.toLowerCase().includes(keyword);
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

  const handleSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

  const onDeleteJabatan = (id) => {
    Swal.fire({
      title: t("confirmation_title"),
      text: t("confirmation_text"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDataJabatan(id))
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                title: t("success_title"),
                text: t("success_text"),
                icon: "success",
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              dispatch(getDataJabatan());
            } else {
              Swal.fire({
                icon: "error",
                title: t("error_title"),
                text: getErrorMessage(response?.msg),
              }).then(() => {});
            }
          })
          .catch((error) => {
            const status = error.response?.data?.msg || "desconocido";
            Swal.fire({
              icon: "error",
              title: t("error_title"),
              text: getErrorMessage(status),
            }).then(() => {});
          });
      }
    });
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDataJabatan(startIndex, endIndex));
  }, [dispatch, startIndex, endIndex]);

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
      <Breadcrumb pageName={t("breadcrumb_title")} />
      <Link to="/data-jabatan/form-data-jabatan/add">
        <ButtonOne>
          <span>{t("add_position")}</span>
          <span>
            <FaPlus />
          </span>
        </ButtonOne>
      </Link>

      <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mt-4 flex flex-col items-center justify-between md:flex-row md:justify-between">
          <div className="flex-2 relative mb-4 md:mb-0">
            <input
              type="text"
              placeholder={t("search_placeholder")}
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
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("column_number")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("column_position")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("column_base_salary")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("column_transport_allowance")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("column_meal_allowance")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("column_action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDataJabatan
                .slice(startIndex, endIndex)
                .map((data, index) => (
                  <tr key={data.id}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {startIndex + index + 1}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {data.nama_jabatan}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {/* Salario Base */}
                      <p className="text-black dark:text-white">
                        {symbol} {toLocal(data.gaji_pokok)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {/* Subsidio de Transporte */}
                      <p className="text-black dark:text-white">
                        {symbol} {toLocal(data.tj_transport)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {/* Subsidio de Alimentación */}
                      <p className="text-black dark:text-white">
                        {symbol} {toLocal(data.uang_makan)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <Link
                          className="hover:text-black"
                          to={`/data-jabatan/form-data-jabatan/edit/${data.id}`}
                        >
                          <FaRegEdit className="text-xl text-primary hover:text-black dark:hover:text-white" />
                        </Link>
                        <button
                          onClick={() => onDeleteJabatan(data.id)}
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
              {t("pagination_text", {
                from: startIndex + 1,
                to: Math.min(endIndex, filteredDataJabatan.length),
                total: filteredDataJabatan.length,
              })}
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

export default DataJabatan;
