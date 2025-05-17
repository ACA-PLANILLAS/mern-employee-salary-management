import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../layout";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TfiPrinter } from "react-icons/tfi";
import Swal from "sweetalert2";
import { BiSearch } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import {
  getDataPegawai,
  fetchSlipGajiByName,
  getMe,
} from "../../../../config/redux/action";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL;

const MONTH_MAP = {
  Januari: 1,
  Februari: 2,
  Maret: 3,
  April: 4,
  Mei: 5,
  Juni: 6,
  Juli: 7,
  Agustus: 8,
  September: 9,
  Oktober: 10,
  November: 11,
  Desember: 12,
};

const SlipGaji = () => {
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchId, setSearchId] = useState("");
  const [results, setResults] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("slipGaji");

  const { isError, user } = useSelector((state) => state.auth);
  const { dataPegawai } = useSelector((state) => state.dataPegawai);
   const { dataSlipGaji } = useSelector((state) => state.slipGaji);

  const handleSearchMonth = (e) => setSearchMonth(e.target.value);
  const handleSearchYear = (e) => setSearchYear(e.target.value);
  const handleSearchId = (e) => setSearchId(e.target.value);

  const handleSearch = async (e) => {
    e.preventDefault();

    const monthInt = MONTH_MAP[searchMonth];

    if (!monthInt || !searchYear || !searchId) {
      Swal.fire({
        icon: "error",
        title: t("notFoundShort"),
        text: t("notFoundLong"),
        timer: 2000,
      });
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/data_gaji_pegawai?year=${searchYear}&month=${monthInt}`
      );
      const data = await res.json();

      const filtered = data.filter((item) => String(item.id) === searchId);

      if (filtered.length > 0) {
        setResults(filtered);
        setShowMessage(false);
      } else {
        setResults([]);
        setShowMessage(true);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: t("notFoundShort"),
        text: t("notFoundLong"),
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    dispatch(getMe());
    dispatch(getDataPegawai());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
    if (user && user.hak_akses !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

     const handleExportExcel = async (event) => {
          event.preventDefault();
          try {
              if(searchName !== ''){
              await    dispatch(fetchSlipGajiByName(searchName));
              console.log('Datos del laporan gaji:', dataSlipGaji);
  
              const worksheet = XLSX.utils.json_to_sheet(dataSlipGaji);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
          
              const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
              });
          
              const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
          
              saveAs(blob, "datos.xlsx");
          }else{
         
              Swal.fire({
                  icon: 'error',
                  title: t('swalTitle'),
                  text: t('swalText'),
                  timer: 2000,
              });
          }
  
          } catch (error) {
              console.log(error);
  
              Swal.fire({
                  icon: 'error',
                  title: t('swalTitle'),
                  text: t('swalText'),
                  timer: 2000,
              });
          }
      };

  return (
    <Layout>
      <Breadcrumb pageName={t("breadcrumb")} />
      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {t("filterTitle")}
              </h3>
            </div>
            <form onSubmit={handleSearch}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <div className="mb-4 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("bulan")} <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={searchMonth}
                        onChange={handleSearchMonth}
                        required
                      >
                        <option value="">{t("pilihBulan")}</option>
                        {Object.keys(MONTH_MAP).map((month) => (
                          <option key={month} value={month}>
                            {t(month.toLowerCase())}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("tahun")} <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <input
                        type="number"
                        placeholder={t("masukkanTahun")}
                        value={searchYear}
                        onChange={handleSearchYear}
                        required
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-2xl">
                        <BiSearch />
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("namaPegawai")} <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        required
                      >
                        <option value="">{t("pilihNamaPegawai")}</option>
                        {dataPegawai.map((pegawai) => (
                          <option key={pegawai.id} value={pegawai.id}>
                            {`${pegawai.first_name || ""} ${
                              pegawai.last_name || ""
                            }`}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 text-center md:flex-row">
                  <ButtonOne type="submit">
                    <span>{t("consultar")}</span>
                  </ButtonOne>
                </div>

                {showMessage && (
                  <div className="border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-700/20 mt-4 rounded-md border p-4">
                    <h5 className="text-red-700 dark:text-red-300 font-semibold">
                      {t("notFoundShort")}
                    </h5>
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {t("notFoundLong")}
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-black dark:text-white">
                      {t("resultadosEncontrados")}
                    </h4>
                    {results.map((r) => (
                      <div
                        key={r.attendanceId}
                        className="flex items-center justify-between rounded-lg border border-stroke bg-white p-4 shadow dark:border-strokedark dark:bg-boxdark"
                      >
                        <div>
                          <p className="font-medium text-black dark:text-white">
                            {t("verReciboDe")} {r.first_name} {r.last_name}
                          </p>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {t("attendanceId")}: {r.attendanceId}
                          </span>
                        </div>
                        <a
                          href={`/print-employee-receipt/${r.attendanceId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded bg-meta-3 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
                        >
                          <TfiPrinter className="text-lg" />
                          {t("imprimir")}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SlipGaji;
