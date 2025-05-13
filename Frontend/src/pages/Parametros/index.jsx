// src/pages/Parametros.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layout";
import { Breadcrumb } from "../../components";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import {
  ModalEditParametro,
  ModalViewParametro,
} from "../../components/molecules/Modals/Parametros";
import { getMe } from "../../config/redux/action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Parametros = () => {
  const [parameters, setParameters] = useState([]);
  const [selectedParam, setSelectedParam] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

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

  const fetchParameters = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/parameters`);
      setParameters(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los parámetros", "error");
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/login");
    if (user && user.hak_akses !== "admin") navigate("/dashboard");
  }, [isError, user, navigate]);

  const handleUpdateParam = async (updated) => {
    try {
      // Asumo ruta PUT /parameters/
      await axios.put(`${API_URL}/parameters/`, {
        id: updated.id,
        name: updated.name,
        value: updated.value,
      });
      // Refrescar estado local
      setParameters((params) =>
        params.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      Swal.fire("¡Listo!", "Parámetro actualizado correctamente.", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar el parámetro", "error");
    } finally {
      handleCloseModals();
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName="Parámetros del Sistema" />

      <div className="mt-6 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto py-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  N.º
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Nombre
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Valor
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Acción
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
                    No hay parámetros registrados
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
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenViewModal(param)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenEditModal(param)}
                        >
                          Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openViewModal && selectedParam && (
        <ModalViewParametro
          open={openViewModal}
          onClose={handleCloseModals}
          data={selectedParam}
        />
      )}

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
