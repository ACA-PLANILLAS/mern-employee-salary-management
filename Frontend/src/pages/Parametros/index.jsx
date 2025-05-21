import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout";
import { Breadcrumb, ButtonOne, ButtonTwo } from "../../components";
import Swal from "sweetalert2";
import { getMe } from "../../config/redux/action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalEditParametro from "../../components/molecules/Modals/Parametros/ModalEditParametro";
import { useTranslation } from "react-i18next";

import { API_URL } from "@/config/env";

const Parametros = () => {
  const { t } = useTranslation('common');
  const [parameters, setParameters] = useState([]);
  const [selectedParam, setSelectedParam] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  const fetchParameters = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/parameters`);
      setParameters(data);
    } catch (error) {
      console.error(error);
      Swal.fire(t("common.error"), t("common.loadParamsError"), "error");
    }
  };

  useEffect(() => {
    fetchParameters();
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/login");
    if (user && user.hak_akses !== "admin") navigate("/dashboard");
  }, [isError, user, navigate]);

  const handleOpenViewModal = (param) => {
    setSelectedParam(param);
    setOpenViewModal(true);
  };

  const handleOpenEditModal = (param) => {
    setSelectedParam(param);
    setOpenEditModal(true);
  };

  const handleCloseModals = () => {
    setOpenViewModal(false);
    setOpenEditModal(false);
    setSelectedParam(null);
  };

  const handleUpdateParam = async (updated) => {
    try {
      await axios.put(`${API_URL}/parameters/`, {
        id: updated.id,
        name: updated.name,
        value: updated.value,
      });
      setParameters((params) =>
        params.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      Swal.fire(t("common.success"), t("common.updateSuccess"), "success");
    } catch (error) {
      console.error(error);
      Swal.fire(t("common.error"), t("common.updateError"), "error");
    } finally {
      handleCloseModals();
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName={t("common.systemParameters")} />

      <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto py-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("common.colNumber")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("common.colName")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("common.colValue")}
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  {t("common.colAction")}
                </th>
              </tr>
            </thead>
            <tbody>
              {parameters.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-gray-400 dark:text-gray-500 py-4 text-center"
                  >
                    {t("common.noParamsRegistered")}
                  </td>
                </tr>
              ) : (
                parameters.map((param, idx) => (
                  <tr key={param.id}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {idx + 1}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {param.name}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {param.value}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex gap-2">
                        <ButtonOne onClick={() => handleOpenEditModal(param)}>
                          {t("common.edit")}
                        </ButtonOne>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openEditModal && selectedParam && (
        <ModalEditParametro
          open={openEditModal}
          onClose={handleCloseModals}
          data={selectedParam}
          onSave={handleUpdateParam}
        />
      )}
    </Layout>
  );
};

export default Parametros;
