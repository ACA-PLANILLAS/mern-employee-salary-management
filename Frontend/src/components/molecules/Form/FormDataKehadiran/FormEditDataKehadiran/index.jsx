import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../../layout";
import axios from "axios";
import Swal from "sweetalert2";
import { Breadcrumb, ButtonOne, ButtonTwo } from "../../../../../components";
import { getMe } from "../../../../../config/redux/action";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../../hooks/useErrorMessage";
import { OBSERVATION_CODES } from "../../../../../shared/Const";
import { useDisplayValue } from "../../../../../hooks/useDisplayValue";
import useCurrencyByUser from "../../../../../config/currency/useCurrencyByUser";

import { API_URL } from "@/config/env";

const FormEditDataKehadiran = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataKehadiranEditForm");
  const { currency, symbol, toUSD, rate } = useCurrencyByUser();

  const getErrorMessage = useErrorMessage();
  const getDisplayValue = useDisplayValue();

  const [form, setForm] = useState({
    nik: "",
    nama_pegawai: "",
    nama_jabatan: "",
    jenis_kelamin: "",
    hadir: "",
    sakit: "",
    alpha: "",
    worked_hours: "",
    additional_payments: "",
    vacation_payments: "",
    vacation_days: "",
    comment_01: "",
    comment_02: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/data_kehadiran/${id}`);
        const data = res.data;
        setForm({
          ...data,
          additional_payments: (data.additional_payments * rate).toFixed(2),
          vacation_payments: (data.vacation_payments * rate).toFixed(2),
        });
      } catch (error) {
        console.log("error", error);
        Swal.fire({
          icon: "error",
          title: t("error"),
          text: getErrorMessage(error.response?.data?.msg),
        });
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/login");
    if (user && user.hak_akses !== "admin") navigate("/dashboard");
  }, [isError, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateDataKehadiran = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        additional_payments: toUSD(parseFloat(form.additional_payments || 0)),
        vacation_payments: toUSD(parseFloat(form.vacation_payments || 0)),
      };
      await axios.patch(`${API_URL}/data_kehadiran/update/${id}`, payload);
      Swal.fire({
        icon: "success",
        title: t("success"),
        timer: 1500,
      });
      navigate("/data-kehadiran");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: getErrorMessage(error.response?.data?.msg),
      });
    }
  };

  const renderMoneyInput = (name, value, onChange) => (
    <div className="relative flex items-center">
      <span className="absolute left-3 top-1/2 flex w-4 -translate-y-1/2 transform items-center justify-center text-black dark:text-white">
        {symbol}
      </span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
        className="bg-gray-100 h-8 w-[7rem] rounded-md border border-stroke pl-10  dark:border-form-strokedark dark:bg-boxdark"
      />
      {currency !== "USD" && (
        <span className="text-gray-700 dark:text-gray-300 bg-gray-50 ml-2 whitespace-nowrap rounded border border-stroke px-2 py-1 text-sm dark:border-strokedark dark:bg-boxdark">
          ≈ ${toUSD(Number(value)).toFixed(2)} USD
        </span>
      )}
    </div>
  );

  return (
    <Layout>
      <Breadcrumb pageName={t("formEditAttendance")} />
      <form onSubmit={updateDataKehadiran}>
        <div className="grid grid-cols-1 gap-6 rounded border bg-white p-6 dark:border-strokedark dark:bg-boxdark sm:grid-cols-2">
          {[
            { label: t("employeeName"), name: "nama_pegawai" },
            { label: t("nik"), name: "nik" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="mb-2 block text-black dark:text-white">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={form[name] ?? ""}
                disabled
                className="bg-gray-100 text-gray-500 w-full rounded border border-stroke px-4 py-2 dark:border-form-strokedark dark:bg-boxdark"
              />
            </div>
          ))}

          {["hadir", "sakit", "alpha", "worked_hours", "vacation_days"].map(
            (name) => (
              <div key={name}>
                <label className="mb-2 block text-black dark:text-white">
                  {t(name)}
                </label>
                <input
                  type="number"
                  min="0"
                  name={name}
                  value={form[name] ?? 0}
                  onChange={handleChange}
                  onFocus={(e) => e.target.select()}
                  className="w-full rounded border border-stroke px-4 py-2  dark:border-form-strokedark dark:bg-form-input"
                />
              </div>
            )
          )}

          {["additional_payments", "vacation_payments"].map((name) => (
            <div key={name}>
              <label className="mb-2 block text-black dark:text-white">
                {t(name)}
              </label>
              {renderMoneyInput(name, form[name], handleChange)}
            </div>
          ))}

          {[1, 2].map((n) => (
            <div key={n}>
              <label className="mb-2 block text-black dark:text-white">
                {t(`comment${n.toString().padStart(2, "0")}`)}
              </label>
              <select
                name={`comment_0${n}`}
                value={form[`comment_0${n}`] ?? "00"}
                onChange={handleChange}
                className="w-full rounded border border-stroke px-4 py-2 dark:border-form-strokedark dark:bg-form-input"
              >
                {OBSERVATION_CODES.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {code} - {getDisplayValue(label)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3  md:flex-row">
          <ButtonOne type="submit">
            <span>{t("update")}</span>
          </ButtonOne>
          <Link to="/data-kehadiran">
            <ButtonTwo>
              <span>{t("back")}</span>
            </ButtonTwo>
          </Link>
        </div>
      </form>
    </Layout>
  );
};

export default FormEditDataKehadiran;
