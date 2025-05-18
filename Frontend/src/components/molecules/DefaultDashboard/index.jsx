import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../../../layout";
import {
  CardOne,
  CardTwo,
  CardThree,
  CardFour,
  ChartOne,
  ChartTwo,
  Breadcrumb,
} from "../../../components";
import axios from "axios";
import { API_URL } from "@/config/env";
import { useTranslation } from "react-i18next";

const DefaultDashboard = () => {
  const { t } = useTranslation("common");
  const { user } = useSelector((state) => state.auth);
  const [dataPegawai, setDataPegawai] = useState(null);

  useEffect(() => {
    const getDataPegawai = async () => {
      try {
        // Descomenta para usar la API real:
        // const response = await axios.get(
        //   `${API_URL}/data_pegawai/${user.id}`
        // );
        // setDataPegawai(response.data);

        // Mock con user
        setDataPegawai(user);
      } catch (error) {
        console.error(t("dashboard.error.loadingEmployeeData"), error);
      }
    };

    if (user && user.hak_akses === "pegawai") {
      getDataPegawai();
    }
  }, [user, t]);

  const documento = dataPegawai
    ? dataPegawai.nik || dataPegawai.dui_or_nit
    : "";

  const nombreCompleto = dataPegawai
    ? [
        dataPegawai.first_name,
        dataPegawai.middle_name,
        dataPegawai.last_name,
        dataPegawai.second_last_name,
      ]
        .filter((n) => n && n.trim())
        .join(" ")
    : "";

  return (
    <Layout>
      <Breadcrumb pageName={t("dashboard.breadcrumb.dashboard")} />

      {user?.hak_akses === "admin" && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CardOne />
            <CardTwo />
            <CardThree />
            <CardFour />
          </div>
          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 sm:col-span-7">
              <ChartOne />
            </div>
            <div className="col-span-12 sm:col-span-5">
              <ChartTwo />
            </div>
          </div>
        </>
      )}

      {user?.hak_akses === "pegawai" && dataPegawai && (
        <>
          <div className="mt-6 px-4 py-2 text-center md:text-left">
            <h2 className="font-medium text-meta-3">
              {t("dashboard.welcome", {
                pegawai: t("dashboard.pegawai"),
              })}
            </h2>
          </div>

          <div className="mt-4 rounded-sm border bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:flex">
            <div className="w-full md:w-1/3 flex justify-center p-4">
              <img
                className="h-80 w-full max-w-[320px] rounded-xl object-cover"
                src={dataPegawai.url}
                alt={nombreCompleto || t("dashboard.alt.employeePhoto")}
              />
            </div>

            <div className="w-full md:w-2/3 p-6">
              <h3 className="mb-4 text-lg font-medium text-black dark:text-white">
                {t("dashboard.title.employeeData")}
              </h3>

              <div className="space-y-3 md:text-base">
                <div className="flex">
                  <span className="w-32 font-medium">
                    {t("dashboard.label.document")}
                  </span>
                  <span className="px-2">:</span>
                  <span>{documento || "-"}</span>
                </div>

                <div className="flex">
                  <span className="w-32 font-medium">
                    {t("dashboard.label.document_type")}
                  </span>
                  <span className="px-2">:</span>
                  <span>{dataPegawai.document_type || "-"}</span>
                </div>

                <div className="flex">
                  <span className="w-32 font-medium">{t("dashboard.label.isss")}</span>
                  <span className="px-2">:</span>
                  <span>
                    {dataPegawai.isss_affiliation_number || "-"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-32 font-medium">
                    {t("dashboard.label.pension")}
                  </span>
                  <span className="px-2">:</span>
                  <span>
                    {dataPegawai.pension_institution_code || "-"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-32 font-medium">
                    {t("dashboard.label.full_name")}
                  </span>
                  <span className="px-2">:</span>
                  <span>{nombreCompleto || "-"}</span>
                </div>

                <div className="flex">
                  <span className="w-32 font-medium">
                    {t("dashboard.label.username")}
                  </span>
                  <span className="px-2">:</span>
                  <span>{dataPegawai.username}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default DefaultDashboard;
