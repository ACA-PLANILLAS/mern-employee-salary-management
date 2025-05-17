import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Breadcrumb, ButtonOne, ButtonTwo } from "../../../../../components";
import Layout from "../../../../../layout";
import axios from "axios";
import { getMe } from "../../../../../config/redux/action";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../../hooks/useErrorMessage";
const API_URL = import.meta.env.VITE_API_URL;

const FormEditDataPegawai = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataGajiAddForm");
  const getErrorMessage = useErrorMessage();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const onLoadImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      setFormData((f) => ({
        ...f,
        title: image.name,
        file: image,
        preview: URL.createObjectURL(image),
      }));
    }
  };

  const imageCancel = () => {
    setFormData((f) => ({
      ...f,
      title: "",
      file: null,
      preview: null,
    }));
  };

  useEffect(() => {
    // cargar catálogos
    const fetchCatalogs = async () => {
      try {
        const [jabRes, penRes] = await Promise.all([
          axios.get(`${API_URL}/data_jabatan`),
          axios.get(`${API_URL}/pension_institutions`),
        ]);
        setJabatanOptions(jabRes.data || []);
        setPensionOptions(penRes.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    // cargar datos existentes
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/data_pegawai/${id}`);
        const d = res.data;

        console.log("aaa", d);
        console.log("bbb", d.positionHistory[0]?.position?.id);
        setFormData({
          ...formData,
          dui_or_nit: d.dui_or_nit || "",
          document_type: d.document_type || "",
          isss_affiliation_number: d.isss_affiliation_number || "",
          pension_institution_code: d.pension_institution_code || "",
          first_name: d.first_name || "",
          middle_name: d.middle_name || "",
          last_name: d.last_name || "",
          second_last_name: d.second_last_name || "",
          maiden_name: d.maiden_name || "",
          jenis_kelamin: d.jenis_kelamin || "",
          hire_date: d.hire_date?.split("T")[0] || "",
          status: d.status || "",
          jabatan: d.positionHistory[0]?.position?.id || "",
          last_position_change_date:
            d.last_position_change_date?.split("T")[0] || "",
          monthly_salary: d.monthly_salary || "",
          has_active_loan: d.has_active_loan?.toString() || "",
          loan_original_amount: d.loan_original_amount || "",
          loan_outstanding_balance: d.loan_outstanding_balance || "",
          loan_monthly_installment: d.loan_monthly_installment || "",
          loan_start_date: d.loan_start_date?.split("T")[0] || "",
          username: d.username || "",
          hak_akses: d.hak_akses || "",
          preview: d.url || null,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchCatalogs();
    fetchData();
    // eslint-disable-next-line
  }, [id]);

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

  const appendIfExists = (fd, key, val) => {
    if (val !== "" && val != null && val !== "Invalid date")
      fd.append(key, val);
  };
  

  const validateForm = () => {
    const requiredFields = [
      'dui_or_nit', 'document_type', 'isss_affiliation_number',
      'pension_institution_code', 'first_name', 'last_name',
      'jenis_kelamin', 'hire_date', 'status', 'jabatan',
      'username', 'password', 'confPassword', 'hak_akses'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || String(formData[field])?.trim() === "") {
        Swal.fire({ icon: "error", title: t("gagal"), text: t("fieldRequired", { field: t(field) }) });
        return false;
      }
    }

    return true;
  };

  const submitDataPegawai = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newFormData = new FormData();
    if (file) newFormData.append("photo", file);
    newFormData.append("title", title);
    // newFormData.append("nik", nik); // comentado, como en el add
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
    appendIfExists(
      newFormData,
      "last_position_change_date",
      last_position_change_date
    );
    // newFormData.append("has_active_loan", has_active_loan);
    // appendIfExists(newFormData, "loan_original_amount", loan_original_amount);
    // appendIfExists(
    //   newFormData,
    //   "loan_outstanding_balance",
    //   loan_outstanding_balance
    // );
    // appendIfExists(
    //   newFormData,
    //   "loan_monthly_installment",
    //   loan_monthly_installment
    // );
    // appendIfExists(newFormData, "loan_start_date", loan_start_date);
    newFormData.append("username", username);
    newFormData.append("password", password);
    newFormData.append("confPassword", confPassword);
    newFormData.append("hak_akses", hak_akses);

    try {
      const response = await axios.patch(
        `${API_URL}/data_pegawai/${id}`,
        newFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Swal.fire({
        icon: "success",
        title: t("berhasil"),
        text: getErrorMessage(response.data.msg),
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/data-pegawai");
    } catch (error) {
      const msg =
        error.response?.data?.msg || error.message || "terjadiKesalahan";
      Swal.fire({
        icon: "error",
        title: t("gagal"),
        text: getErrorMessage(msg),
        confirmButtonText: "Ok",
      });
    }
  };

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
                  {/* <div className='w-full xl:w-1/2'>…nik{/*/}
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
                      <option value="DUI">DUI</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Minoridad">Carné de Minoridad</option>
                      <option value="Residente">Carné de Residente</option>
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
                      {t("pensionInstitutionCode")} <span className="text-meta-1">*</span>
                    </label>
                    <select
                      name="pension_institution_code"
                      value={pension_institution_code}
                      onChange={handleChange}
                      className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option value="">{t("pilihPensionInstitution")}</option>
                      {pensionOptions.map((inst) => (
                        <option key={inst.code} value={inst.code}>
                          {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("isssAffiliationNumber")} <span className="text-meta-1">*</span>
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div>
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                        className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                      {jabatanOptions.map((jab) => (
                        <option key={jab.id} value={jab.id}>
                          {jab.nama_jabatan}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("tanggalMasuk")} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="date"
                      name="hire_date"
                      value={hire_date}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
                    />
                  </div> */}
                </div>

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
                        className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary dark:focus:border-primary"
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
                        className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
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
                        className="w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
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
                {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      {t("uploadFoto")}
                    </label>
                    <input
                      type="file"
                      onChange={onLoadImageUpload}
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm file:font-medium focus:border-primary dark:border-form-strokedark dark:bg-form-input"
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
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 absolute right-2 top-2 rounded-full bg-white p-1.5 focus:outline-none dark:bg-black/30"
                        >
                          <AiOutlineClose className="h-5 w-5" />
                        </button>
                      </figure>
                    )}
                  </div>
                </div> */}

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

export default FormEditDataPegawai;
