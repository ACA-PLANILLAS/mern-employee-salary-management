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
  fetchSlipGajiByMonth,
  fetchSlipGajiByName,
  fetchSlipGajiByYear,
  getDataPegawai,
  getMe,
} from "../../../../config/redux/action";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React from "react";

const SlipGaji = () => {
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchName, setSearchName] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("slipGaji");

  const { isError, user } = useSelector((state) => state.auth);
  const { dataPegawai } = useSelector((state) => state.dataPegawai);
   const { dataSlipGaji } = useSelector((state) => state.slipGaji);

  const handleSearchMonth = (event) => setSearchMonth(event.target.value);
  const handleSearchYear = (event) => setSearchYear(event.target.value);
  const handleSearchName = (event) => setSearchName(event.target.value);

  const handleSearch = async (event) => {
    event.preventDefault();

    const selectedMonth = searchMonth;
    const selectedYear = searchYear;
    const selectedName = searchName;

    let yearDataFound = false;
    let monthDataFound = false;
    let nameDataFound = false;

    await Promise.all([
      dispatch(fetchSlipGajiByYear(selectedYear, () => (yearDataFound = true))),
      dispatch(
        fetchSlipGajiByMonth(selectedMonth, () => (monthDataFound = true))
      ),
      dispatch(fetchSlipGajiByName(selectedName, () => (nameDataFound = true))),
    ]);
    setShowMessage(true);

    if (yearDataFound && monthDataFound && nameDataFound) {
      setShowMessage(false);
      navigate(
        `/laporan/slip-gaji/print-page?month=${selectedMonth}&year=${selectedYear}&name=${selectedName}`
      );
    } else {
      setShowMessage(false);
      Swal.fire({
        icon: "error",
        title: t("notFoundShort"),
        text: t("notFoundLong"),
        timer: 2000,
      });
    }
  };

  const nameOptions = dataPegawai.map((pegawai) => (
    <option key={pegawai.id} value={pegawai.nama_pegawai}>
      {pegawai.nama_pegawai}
    </option>
  ));

  useEffect(() => {
    dispatch(getDataPegawai());
  }, [dispatch]);

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
              {showMessage && (
                <p className="text-meta-1">{t("notFoundShort")}</p>
              )}
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
                        <option value="Januari">{t("januari")}</option>
                        <option value="Februari">{t("februari")}</option>
                        <option value="Maret">{t("maret")}</option>
                        <option value="April">{t("april")}</option>
                        <option value="Mei">{t("mei")}</option>
                        <option value="Juni">{t("juni")}</option>
                        <option value="Juli">{t("juli")}</option>
                        <option value="Agustus">{t("agustus")}</option>
                        <option value="September">{t("september")}</option>
                        <option value="Oktober">{t("oktober")}</option>
                        <option value="November">{t("november")}</option>
                        <option value="Desember">{t("desember")}</option>
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
                        value={searchName}
                        onChange={handleSearchName}
                        required
                      >
                        <option value="">{t("pilihNamaPegawai")}</option>
                        {nameOptions}
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 text-center md:flex-row">
                  <ButtonOne type="submit">
                    <span>{t("cetakSlipGaji")}</span>
                    <span>
                      <TfiPrinter />
                    </span>
                  </ButtonOne>
                  <ButtonOne type="button" onClick={handleExportExcel}>
                    <span>{t("printButtonExcel")}</span>
                    <span>
                      <TfiPrinter />
                    </span>
                  </ButtonOne>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SlipGaji;
