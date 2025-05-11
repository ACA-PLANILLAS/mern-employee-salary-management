import { useEffect, useState } from 'react';
import Layout from '../../layout';
import { Breadcrumb } from '../../components';
import Swal from 'sweetalert2';
import { Button } from '@mui/material';
import {
  ModalEditParametro,
  ModalViewParametro
} from '../../components/molecules/Modals/Parametros';

const Parametros = () => {
  const [parameters, setParameters] = useState([]);
  const [selectedParam, setSelectedParam] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

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

  useEffect(() => {
    // Datos quemados por ahora
    setParameters([
      { id: 1, name: 'Días Laborales', value: 5, daily_hours: 8, payment_type: 'mensual' },
      { id: 2, name: 'Vacaciones', value: 15, daily_hours: 0, payment_type: 'mensual' },
      { id: 3, name: 'Medio Tiempo', value: 3, daily_hours: 4, payment_type: 'semanal' }
    ]);
  }, []);

  return (
    <Layout>
      <Breadcrumb pageName="Parámetros del Sistema" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
        <div className="max-w-full overflow-x-auto py-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">N.º</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Nombre</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Valor</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Horas por Día</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Tipo de Pago</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Acción</th>
              </tr>
            </thead>
            <tbody>
              {parameters.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400 dark:text-gray-500">
                    No hay parámetros registrados
                  </td>
                </tr>
              ) : (
                parameters.map((param, idx) => (
                  <tr key={param.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {idx + 1}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {param.name}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {param.value}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {param.daily_hours}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark capitalize">
                      {param.payment_type}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex gap-2">
                        <Button variant="outlined" size="small" onClick={() => handleOpenViewModal(param)}>
                          Ver
                        </Button>
                        <Button variant="contained" size="small" onClick={() => handleOpenEditModal(param)}>
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
        <ModalViewParametro open={openViewModal} onClose={handleCloseModals} data={selectedParam} />
      )}

      {openEditModal && selectedParam && (
        <ModalEditParametro open={openEditModal} onClose={handleCloseModals} data={selectedParam} />
      )}
    </Layout>
  );
};

export default Parametros;
