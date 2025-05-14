import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import Layout from '../../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { BiSearch } from 'react-icons/bi';
import { getMe } from '../../../../../config/redux/action';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../../../hooks/useErrorMessage';

const ITEMS_PER_PAGE = 4;
const API_URL = import.meta.env.VITE_API_URL;

const OBSERVATION_CODES = [
  { code: '00', label: 'Sin observación' },
  { code: '01', label: 'Sin cambios con respecto al mes anterior' },
  { code: '02', label: 'Pagos adicionales' },
  { code: '03', label: 'Aprendices' },
  { code: '04', label: 'Pensionado' },
  { code: '05', label: 'Licencia' },
  { code: '06', label: 'Incapacidad' },
  { code: '07', label: 'Retiro del Trabajador de la empresa' },
  { code: '08', label: 'Ingreso o Reingreso del Trabajador' },
  { code: '09', label: 'Vacaciones' },
  { code: '10', label: 'Vacaciones más pagos adicionales' },
  { code: '11', label: 'Planillas catorcenales y semanales fraccionadas' },
  { code: '12', label: 'Cotizaciones patronales por subsidios del ISSS' },
  { code: '13', label: 'Cotizante al IPSFA' },
  { code: '14', label: 'Cotizante Bienestar Magisterial' },
  { code: '15', label: 'Régimen especial del Sector Doméstico' },
  { code: '16', label: 'Régimen especial de Marino mercante' },
  { code: '17', label: 'Régimen especial de regidores' },
  { code: '18', label: 'Complemento de salario' },
  { code: '19', label: 'Retiro por fallecimiento del trabajador' },
  { code: '20', label: 'Vacaciones Salario Mixto' },
  { code: '21', label: 'Pagos Adicionales y Vacaciones Salario Mixto' },
  { code: '22', label: 'Pago de complemento por subsidio' },
  { code: '23', label: 'Trabajador independiente régimen general' },
];

const FormAddDataKehadiran = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [dataKehadiran, setDataKehadiran] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataKehadiranAddForm");
  const getErrorMessage = useErrorMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Campos de asistencia
  const [hadir, setHadir] = useState([]);
  const [sakit, setSakit] = useState([]);
  const [alpha, setAlpha] = useState([]);

  // Nuevos campos
  const [workedHours, setWorkedHours] = useState([]);
  const [additionalPayments, setAdditionalPayments] = useState([]);
  const [vacationPayments, setVacationPayments] = useState([]);
  const [vacationDays, setVacationDays] = useState([]);
  const [comment01, setComment01] = useState([]);
  const [comment02, setComment02] = useState([]);

  // Paginación
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const filteredDataPegawai = dataPegawai.filter((pegawai) =>
    pegawai.first_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    pegawai.middle_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    pegawai.last_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    pegawai.second_last_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    pegawai.maiden_name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const totalPages = Math.ceil(filteredDataPegawai.length / ITEMS_PER_PAGE);

  // Fecha actual para campos automáticos
  const now = new Date();
  const bulanName = now.toLocaleString('es-ES', { month: 'long' });
  const monthNum = now.getMonth() + 1;
  const dayNum = now.getDate();
  const yearNum = now.getFullYear();

  // Handlers básicos
  const handleSearch = (e) => setSearchKeyword(e.target.value);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Handlers asistencia
  const handleHadir = (i, v) => { const a = [...hadir]; a[i] = v; setHadir(a); };
  const handleSakit = (i, v) => { const a = [...sakit]; a[i] = v; setSakit(a); };
  const handleAlpha = (i, v) => { const a = [...alpha]; a[i] = v; setAlpha(a); };

  // Handlers nuevos campos
  const handleWorkedHours = (i, v) => { const a = [...workedHours]; a[i] = v; setWorkedHours(a); };
  const handleAdditionalPayments = (i, v) => { const a = [...additionalPayments]; a[i] = v; setAdditionalPayments(a); };
  const handleVacationPayments = (i, v) => { const a = [...vacationPayments]; a[i] = v; setVacationPayments(a); };
  const handleVacationDays = (i, v) => { const a = [...vacationDays]; a[i] = v; setVacationDays(a); };
  const handleComment01 = (i, v) => { const a = [...comment01]; a[i] = v; setComment01(a); };
  const handleComment02 = (i, v) => { const a = [...comment02]; a[i] = v; setComment02(a); };

  // Fetch datos
  const getDataPegawai = async () => {
    const res = await axios.get(`${API_URL}/data_pegawai`);
    setDataPegawai(res.data);
  };
  const getDataKehadiran = async () => {
    try {
      const res = await axios.get(`${API_URL}/data_kehadiran`);
      setDataKehadiran(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDataPegawai();
    getDataKehadiran();
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate('/login');
    if (user && user.hak_akses !== 'admin') navigate('/dashboard');
  }, [isError, user, navigate]);

  // Guardar
  const saveDataKehadiran = async (e) => {
    e.preventDefault();
    try {
      for (let i = 0; i < dataPegawai.length; i++) {
        const emp = dataPegawai[i];
        const exists = dataKehadiran.some(d => d.nama_pegawai === emp.nama_pegawai);
        if (exists) continue;

        await axios.post(`${API_URL}/data_kehadiran`, {
          nik: emp.id,
          nama_pegawai: emp.id,
          nama_jabatan: emp.id,
          jenis_kelamin: emp.jenis_kelamin,
          hadir: parseInt(hadir[i] ?? 0, 10),
          sakit: parseInt(sakit[i] ?? 0, 10),
          alpha: parseInt(alpha[i] ?? 0, 10),
          worked_hours: parseInt(workedHours[i] ?? 0, 10),
          additional_payments: parseFloat(additionalPayments[i] ?? 0),
          vacation_payments: parseFloat(vacationPayments[i] ?? 0),
          vacation_days: parseInt(vacationDays[i] ?? 0, 10),
          comment_01: comment01[i] || '00',
          comment_02: comment02[i] || '00',
          bulan: bulanName,
          month: monthNum,
          day: dayNum,
          tahun: yearNum,
        });
      }
      Swal.fire({ icon: 'success', title: t('successMessage'), showConfirmButton: false, timer: 1500 });
      navigate("/data-kehadiran");
    } catch (err) {
      Swal.fire({ title: t('error'), text: getErrorMessage(err.response?.data?.msg), icon: "error" });
    }
  };

  // Paginación dinámica
  const paginationItems = () => {
    const items = []; const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible/2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (start > 1) items.push(<p key="start-ellipsis" className="px-3">…</p>);
    for (let p = start; p <= end; p++) {
      items.push(
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          className={`px-3 py-1 border ${p===currentPage ? 'bg-primary text-white' : ''}`}
        >{p}</button>
      );
    }
    if (end < totalPages) items.push(<p key="end-ellipsis" className="px-3">…</p>);
    return items;
  };

  return (
    <Layout>
      <Breadcrumb pageName={t('formAddAttendance')} />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
        <form onSubmit={saveDataKehadiran}>
          <div className="flex justify-between items-center mt-4 flex-col md:flex-row">
            <div className="relative mb-4 md:mb-0">
              <input
                type="text"
                placeholder={t('searchEmployee')}
                value={searchKeyword}
                onChange={handleSearch}
                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none focus:border-primary"
              />
              <span className="absolute left-2 py-3 text-xl"><BiSearch/></span>
            </div>
          </div>
          <div className="overflow-x-auto py-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4">No</th>
                  <th className="py-4 px-4">{t('nik')}</th>
                  <th className="py-4 px-4">{t('employeeName')}</th>
                  <th className="py-4 px-4">{t('jobTitle')}</th>
                  <th className="py-4 px-4">{t('gender')}</th>
                  <th className="py-4 px-4">{t('present')}</th>
                  <th className="py-4 px-4">{t('sick')}</th>
                  <th className="py-4 px-4">{t('alpha')}</th>
                  <th className="py-4 px-4">Horas Trabajadas</th>
                  <th className="py-4 px-4">Pago Adicional</th>
                  <th className="py-4 px-4">Monto Vacaciones</th>
                  <th className="py-4 px-4">Días Vacaciones</th>
                  <th className="py-4 px-4">Obs. 1</th>
                  <th className="py-4 px-4">Obs. 2</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataPegawai.slice(startIndex, endIndex).map((emp, idx) => {
                  const globalIndex = startIndex + idx;
                  const exists = dataKehadiran.some(d => d.nama_pegawai === emp.nama_pegawai);
                  if (exists) {
                    return (
                      <tr key={emp.id} className="border-b">
                        <td className="py-5 px-4 text-center">{globalIndex+1}</td>
                        <td colSpan="13" className="py-5 px-4 text-center">{t('attendanceDataAlreadySaved')}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={emp.id} className="border-b">
                      <td className="py-5 px-4 text-center">{globalIndex+1}</td>
                      <td className="py-5 px-4">{emp.nik}</td>
                      <td className="py-5 px-4">{emp.nama_pegawai}</td>
                      <td className="py-5 px-4">{emp.jabatan}</td>
                      <td className="py-5 px-4">{emp.jenis_kelamin}</td>
                      <td className="py-5 px-4">
                        <input
                          type="number" min="0" required
                          value={hadir[idx] ?? 0}
                          onChange={e=>handleHadir(idx, e.target.value)}
                          className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                        />
                      </td>
                      <td className="py-5 px-4">
                        <input
                          type="number" min="0" required
                          value={sakit[idx] ?? 0}
                          onChange={e=>handleSakit(idx, e.target.value)}
                          className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                        />
                      </td>
                      <td className="py-5 px-4">
                        <input
                          type="number" min="0" required
                          value={alpha[idx] ?? 0}
                          onChange={e=>handleAlpha(idx, e.target.value)}
                          className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                        />
                      </td>
                      <td className="py-5 px-4">
                        <input
                          type="number" min="0" required
                          value={workedHours[idx] ?? 0}
                          onChange={e=>handleWorkedHours(idx, e.target.value)}
                          className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                        />
                      </td>
                      <td className="py-5 px-4">
                        <input
                          type="number" step="0.01" min="0"
                          value={additionalPayments[idx] ?? 0}
                          onChange={e=>handleAdditionalPayments(idx, e.target.value)}
                          className="form-input h-8 w-[7rem] text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                        />
                      </td>
                      <td className="py-5 px-4">
                        <input
                          type="number" step="0.01" min="0"
                          value={vacationPayments[idx] ?? 0}
                          onChange={e=>handleVacationPayments(idx, e.target.value)}
                          className="form-input h-8 w-[7rem] text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                        />
                      </td>
                      <td className="py-5 px-4">
                        <input
                          type="number" min="0"
                          value={vacationDays[idx] ?? 0}
                          onChange={e=>handleVacationDays(idx, e.target.value)}
                          className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                        />
                      </td>
                      <td className="py-5 px-4">
                        <select
                          value={comment01[idx] || '00'}
                          onChange={e=>handleComment01(idx, e.target.value)}
                          className="form-input h-8 w-[11rem] text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                          required
                        >
                          {OBSERVATION_CODES.map(c=> (
                            <option key={c.code} value={c.code}>{c.code} – {c.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-5 px-4">
                        <select
                          value={comment02[idx] || '00'}
                          onChange={e=>handleComment02(idx, e.target.value)}
                          className="form-input h-8 w-[11rem] text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                        >
                          {OBSERVATION_CODES.map(c=> (
                            <option key={c.code} value={c.code}>{c.code} – {c.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 flex-col md:flex-row">
            <span className="text-sm">
              {t('showingData')} {startIndex+1}-{Math.min(endIndex, filteredDataPegawai.length)} {t('from')} {filteredDataPegawai.length}
            </span>
            <div className="flex items-center space-x-2 py-4">
              <button
                disabled={currentPage===1}
                onClick={goToPrevPage}
                className="py-2 px-6 rounded-lg border border-primary text-primary disabled:opacity-50"
              >
                <MdKeyboardDoubleArrowLeft/>
              </button>
              {paginationItems()}
              <button
                disabled={currentPage===totalPages}
                onClick={goToNextPage}
                className="py-2 px-6 rounded-lg border border-primary text-primary disabled:opacity-50"
              >
                <MdKeyboardDoubleArrowRight/>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 text-center py-4">
            <ButtonOne type="submit"><span>{t('save')}</span></ButtonOne>
            <Link to="/data-kehadiran">
              <ButtonTwo><span>{t('back')}</span></ButtonTwo>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default FormAddDataKehadiran;