import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb, ButtonOne, ButtonTwo } from "../../../../../components";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Layout from "../../../../../layout";
import { createDataPegawai, getMe } from "../../../../../config/redux/action";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../../hooks/useErrorMessage";
import axios from "axios";
import { API_URL } from "@/config/env";

const FormAddDataPegawai = () => {
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [pensionOptions, setPensionOptions] = useState([]);

  const [formData, setFormData] = useState({
    //nik: '',
    dui_or_nit: "",
    document_type: "",
    isss_affiliation_number: "",
    pension_institution_code: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    maiden_name: "",
    jenis_kelamin: "",
    hire_date: "",
    status: "",
    jabatan: "",
    last_position_change_date: "",
    monthly_salary: "",
    has_active_loan: "",
    loan_original_amount: "",
    loan_outstanding_balance: "",
    loan_monthly_installment: "",
    loan_start_date: "",
    username: "",
    password: "",
    confPassword: "",
    title: "",
    file: null,
    preview: null,
    hak_akses: "",
  });

  const {
    //nik,
    dui_or_nit,
    document_type,
    isss_affiliation_number,
    pension_institution_code,
    first_name,
    middle_name,
    last_name,
    second_last_name,
    maiden_name,
    jenis_kelamin,
    hire_date,
    status,
    jabatan,
    last_position_change_date,
    monthly_salary,
    has_active_loan,
    loan_original_amount,
    loan_outstanding_balance,
    loan_monthly_installment,
    loan_start_date,
    username,
    password,
    confPassword,
    title,
    file,
    preview,
    hak_akses,
  } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataGajiAddForm");
  const getErrorMessage = useErrorMessage();

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [jabatanRes, pensionRes] = await Promise.all([
          axios.get(`${API_URL}/data_jabatan`),
          axios.get(`${API_URL}/pension_institutions`),
        ]);

        console.log("pensionRes Data:", pensionRes);
        setJabatanOptions(jabatanRes ? jabatanRes.data : []);
        setPensionOptions(pensionRes ? pensionRes.data?.data : []);
      } catch (err) {
        console.error("Error loading catalogs:", err);
      }
    };

    fetchCatalogs();
  }, []);

  const onLoadImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      setFormData({
        ...formData,
        title: image.name,
        file: image,
        preview: URL.createObjectURL(image),
      });
    }
  };

  const imageCancel = () => {
    setFormData({
      ...formData,
      title: "",
      file: null,
      preview: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const appendIfExists = (formData, key, value) => {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined &&
      value !== "Invalid date"
    ) {
      formData.append(key, value);
    }
  };

  const submitDataPegawai = (e) => {
    e.preventDefault();

    const requiredFields = [
      "dui_or_nit",
      "document_type",
      "isss_affiliation_number",
      "pension_institution_code",
      "first_name",
      "last_name",
      "jenis_kelamin",
      "hire_date",
      "status",
      "jabatan",
      "username",
      "password",
      "confPassword",
      "hak_akses",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || String(formData[field])?.trim() === "") {
        Swal.fire({
          icon: "error",
          title: t("gagal"),
          text: t(`fieldRequired`, { field: t(field) }),
        });
        return;
      }
    }

    if (!file) {
      Swal.fire({
        icon: "error",
        title: t("gagal"),
        text: t("fotoRequired"),
      });
      return;
    }

    if (password !== confPassword) {
      Swal.fire({
        icon: "error",
        title: t("gagal"),
        text: t("passwordMismatch"),
      });
      return;
    }

    const newFormData = new FormData();
    newFormData.append("photo", file);
    newFormData.append("title", title);
    newFormData.append("dui_or_nit", dui_or_nit);
    newFormData.append("document_type", document_type);
    newFormData.append("isss_affiliation_number", isss_affiliation_number);
    newFormData.append("pension_institution_code", pension_institution_code);
    newFormData.append("first_name", first_name);
    newFormData.append("middle_name", middle_name);
    newFormData.append("last_name", last_name);
    newFormData.append("second_last_name", second_last_name);
    newFormData.append("maiden_name", maiden_name);
    newFormData.append("jenis_kelamin", jenis_kelamin);
    newFormData.append("hire_date", hire_date);
    newFormData.append("status", status);
    newFormData.append("position_id", jabatan);
    newFormData.append("username", username);
    newFormData.append("password", password);
    newFormData.append("confPassword", confPassword);
    newFormData.append("hak_akses", hak_akses);

    dispatch(createDataPegawai(newFormData, navigate))
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: t("berhasil"),
          text: getErrorMessage(response.message),
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        const msg =
          error.response?.data?.msg || error.message || "terjadiKesalahan";
        Swal.fire({
          icon: "error",
          title: t("gagal"),
          text: getErrorMessage(msg),
          confirmButtonText: "Ok",
        });
      });
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    // if (isError) {
    //   navigate("/login");
    // }
    // if (user && user.hak_akses !== "admin") {
    //   navigate("/dashboard");
    // }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <Breadcrumb pageName={t("formAddDataPegawai")} />

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {t("formAddDataPegawai")}
              </h3>
            </div>
            <form onSubmit={submitDataPegawai}>
              <div className="p-6.5">
                {/* — Identificación — */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("documentType")} <span className="text-meta-1">*</span>
                    </label>
                    <select
                      name="document_type"
                      value={document_type}
                      onChange={handleChange}
                      className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option value="">{t("documentType")}</option>
                      <option key={1} value={"DUI"}>
                        DUI
                      </option>
                      <option key={2} value={"Pasaporte"}>
                        Pasaporte
                      </option>
                      <option key={3} value={"Minoridad"}>
                        Carné de Minoridad
                      </option>
                      <option key={3} value={"Residente"}>
                        Carné de Residente
                      </option>
                    </select>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("duiOrNit")} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="dui_or_nit"
                      value={dui_or_nit}
                      onChange={handleChange}
                      placeholder={t("masukkanDuiOrNit")}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("pensionInstitutionCode")}{" "}
                      <span className="text-meta-1">*</span>
                    </label>
                    <select
                      name="pension_institution_code"
                      value={pension_institution_code}
                      onChange={handleChange}
                      className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option value="">{t("pilihPensionInstitution")}</option>,
                      {pensionOptions?.map((inst) => (
                        <option key={inst.code} value={inst.code}>
                          {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("isssAffiliationNumber")}{" "}
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="isss_affiliation_number"
                      value={isss_affiliation_number}
                      onChange={handleChange}
                      placeholder={t("masukkanIsssAffiliationNumber")}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <br />
                <hr className="border-stroke dark:border-strokedark" />
                <br />

                {/* — Nombres — */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("firstName")} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={first_name}
                      onChange={handleChange}
                      required
                      placeholder={t("masukkanFirstName")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("middleName")}
                    </label>
                    <input
                      type="text"
                      name="middle_name"
                      value={middle_name}
                      onChange={handleChange}
                      placeholder={t("masukkanMiddleName")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("lastName")} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={last_name}
                      onChange={handleChange}
                      required
                      placeholder={t("masukkanLastName")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("secondLastName")}
                    </label>
                    <input
                      type="text"
                      name="second_last_name"
                      value={second_last_name}
                      onChange={handleChange}
                      placeholder={t("masukkanSecondLastName")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("maidenName")}
                    </label>
                    <input
                      type="text"
                      name="maiden_name"
                      value={maiden_name}
                      onChange={handleChange}
                      placeholder={t("masukkanMaidenName")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                  {/* campo vacío */}
                  <div className="w-full xl:w-1/2"></div>
                </div>

                <br />
                <hr className="border-stroke dark:border-strokedark" />
                <br />

                {/* — Credenciales & Rol — */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("username")} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={handleChange}
                      required
                      placeholder={t("masukkanUsername")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("password")} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      required
                      placeholder={t("masukkanPassword")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("confPassword")} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="password"
                      name="confPassword"
                      value={confPassword}
                      onChange={handleChange}
                      required
                      placeholder={t("konfirmasiPassword")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("jenisKelamin")} <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="jenis_kelamin"
                        value={jenis_kelamin}
                        onChange={handleChange}
                        required
                        className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="" disabled>
                          {t("pilihJenisKelamin")}
                        </option>
                        <option value="laki-laki">{t("male")}</option>
                        <option value="perempuan">{t("female")}</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                <br />
                <hr className="border-stroke dark:border-strokedark" />
                <br />

                {/* — Empleo — */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("jabatan")} <span className="text-meta-1">*</span>
                    </label>

                    <select
                      name="jabatan"
                      value={jabatan}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option value="">{t("pilihJabatan")}</option>
                      {jabatanOptions?.map((jab) => (
                        <option key={jab.id} value={jab.id}>
                          {jab.nama_jabatan}
                        </option>
                      ))}
                    </select>

                    {/* <input
                      type="text"
                      name="jabatan"
                      value={jabatan}
                      onChange={handleChange}
                      required
                      placeholder={t("masukkanJabatan")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    /> */}
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("tanggalMasuk")} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="date"
                      name="hire_date"
                      value={hire_date}
                      onChange={handleChange}
                      required
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("lastPositionChangeDate")}
                    </label>
                    <input
                      type="date"
                      name="last_position_change_date"
                      value={last_position_change_date}
                      onChange={handleChange}
                      placeholder={t("masukkanLastPositionChangeDate")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("monthlySalary")}
                    </label>
                    <input
                      type="number"
                      name="monthly_salary"
                      value={monthly_salary}
                      onChange={handleChange}
                      placeholder={t("masukkanMonthlySalary")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                </div> */}

                {/* — Préstamo — */}
                {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("hasActiveLoan")}
                    </label>
                    <div className="relative">
                      <select
                        name="has_active_loan"
                        value={has_active_loan}
                        onChange={handleChange}
                        className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="" disabled>
                          {t("pilihHasActiveLoan")}
                        </option>
                        <option value="true">{t("yes")}</option>
                        <option value="false">{t("no")}</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("loanOriginalAmount")}
                    </label>
                    <input
                      type="number"
                      name="loan_original_amount"
                      value={loan_original_amount}
                      onChange={handleChange}
                      placeholder={t("masukkanLoanOriginalAmount")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                </div> 

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("loanOutstandingBalance")}
                    </label>
                    <input
                      type="number"
                      name="loan_outstanding_balance"
                      value={loan_outstanding_balance}
                      onChange={handleChange}
                      placeholder={t("masukkanLoanOutstandingBalance")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("loanMonthlyInstallment")}
                    </label>
                    <input
                      type="number"
                      name="loan_monthly_installment"
                      value={loan_monthly_installment}
                      onChange={handleChange}
                      placeholder={t("masukkanLoanMonthlyInstallment")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("loanStartDate")}
                    </label>
                    <input
                      type="date"
                      name="loan_start_date"
                      value={loan_start_date}
                      onChange={handleChange}
                      placeholder={t("masukkanLoanStartDate")}
                      className="active… w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2"></div>
                </div>

                 */}

                <br />
                <hr className="border-stroke dark:border-strokedark" />
                <br />

                {/* — Estado & Acceso — */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("status")} <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={status}
                        onChange={handleChange}
                        required
                        className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="" disabled>
                          {t("pilihStatus")}
                        </option>
                        <option value="karyawan tetap">
                          {t("permanentEmployee")}
                        </option>
                        <option value="karyawan tidak tetap">
                          {t("nonPermanentEmployee")}
                        </option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("hakAkses")} <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="hak_akses"
                        value={hak_akses}
                        onChange={handleChange}
                        required
                        className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="" disabled>
                          {t("pilihHakAkses")}
                        </option>
                        <option value="admin">{t("admin")}</option>
                        <option value="pegawai">{t("pegawai")}</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                {/* — Foto — */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("uploadFoto")}
                    </label>
                    <input
                      type="file"
                      onChange={onLoadImageUpload}
                      required
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm file:font-medium focus:border-primary file:focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    {preview && (
                      <figure className="animate-fadeIn relative h-64 w-64">
                        <img
                          src={preview}
                          alt="Foto"
                          className="h-full w-full rounded-xl object-cover shadow-6"
                        />
                        <button
                          onClick={imageCancel}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 absolute right-2 top-2 rounded-full bg-white p-1.5 focus:outline-none dark:bg-black/30"
                        >
                          <AiOutlineClose className="h-5 w-5" />
                        </button>
                      </figure>
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 text-center md:flex-row">
                  <ButtonOne>
                    <span>{t("simpan")}</span>
                  </ButtonOne>
                  <Link to="/data-pegawai">
                    <ButtonTwo>
                      <span>{t("kembali")}</span>
                    </ButtonTwo>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormAddDataPegawai;
