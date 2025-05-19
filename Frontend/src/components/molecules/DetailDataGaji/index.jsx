import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getMe } from '../../../config/redux/action';
import Layout from '../../../layout';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../components';
import { TfiPrinter } from 'react-icons/tfi';
import { useTranslation } from 'react-i18next';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const API_URL = import.meta.env.VITE_API_URL;
import Swal from 'sweetalert2';

const DetailDataGaji = () => {
    const [data, setData] = useState({
        tahun: '',
        bulan: '',
        nik: '',
        nama_pegawai: '',
        jabatan: '',
        gaji_pokok: '',
        tj_transport: '',
        uang_makan: '',
        potongan: '',
        total: '',
    });
    const { name } = useParams();
    const [index] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    const { t } = useTranslation("dataGajiDetail");

    const onSubmitPrint = () => {
        navigate(`/laporan/slip-gaji/print-page?month=${data.bulan}&year=${data.tahun}&name=${name}`);
    };

    useEffect(() => {
        const getDataPegawai = async () => {
            try {
                const response = await axios.get(`${API_URL}/data_gaji/name/${name}`);
                const data = response.data[0];

                setData(data);
            } catch (error) {
                console.log(error);
            }
        };

        getDataPegawai();
    }, [name]);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
        if (user && user.hak_akses !== 'admin') {
            navigate('/dashboard');
        }
    }, [isError, user, navigate]);

    const handleExportExcel = async (event) => {
        event.preventDefault();
        console.log(data);
        try {
            if(data){

                const worksheet = XLSX.utils.json_to_sheet([data]);
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
        
        
    }

    return (
        <Layout>
            <Breadcrumb pageName={t('detailSalaryData')} />
            <Link to='/data-gaji'>
                <ButtonTwo>
                    <span>{t('back')}</span>
                </ButtonTwo>
            </Link>
            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
                </div>

                <div className='max-w-full overflow-x-auto'>
                    <div className='md:w-2/3'>
                        <div className='w-full md:text-lg'>
                            <h2 className='font-medium mb-4 block text-black dark:text-white'>
                                <span className='inline-block w-32 md:w-40'>{t('name')}</span>
                                <span className='inline-block w-7'>:</span>
                                {data.nama_pegawai}
                            </h2>
                            <h2 className='font-medium mb-4 block text-black dark:text-white'>
                                <span className='inline-block w-32 md:w-40'>{t('nik')}</span>
                                <span className='inline-block w-6'>:</span>{' '}
                                <span className='pl-[-10] md:pl-0'></span>
                                {data.nik}
                            </h2>
                            <h2 className='font-medium mb-4 block text-black dark:text-white'>
                                <span className='inline-block w-32 md:w-40'>{t('jabatan')}</span>
                                <span className='inline-block w-7'>:</span>
                                {data.jabatan}
                            </h2>
                            <h2 className='font-medium mb-4 block text-black dark:text-white'>
                                <span className='inline-block w-32 md:w-40'>{t('month')}</span>
                                <span className='pl-[-8] md:pl-0'></span>
                                <span className='inline-block w-7'>:</span>
                                {data.bulan}
                            </h2>
                            <h2 className='font-medium mb-4 block text-black dark:text-white'>
                                <span className='inline-block w-32 md:w-40'>{t('year')}</span>
                                <span className='inline-block w-7'>:</span>
                                {data.tahun}
                                <span className='pl-[-8] md:pl-0'></span>
                            </h2>
                        </div>
                    </div>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    No
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    {t('description')}
                                </th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>
                                    {t('amount')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='bg-gray-50 dark:border-strokedark'>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    {index + 1}
                                </td>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    {t('salary')}
                                </td>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    Rp. {data.gaji_pokok}
                                </td>
                            </tr>
                            <tr className='bg-gray-50 dark:border-strokedark'>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    {index + 2}
                                </td>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    {t('transportAllowance')}
                                </td>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    Rp. {data.tj_transport}
                                </td>
                            </tr>
                            <tr className='bg-gray-50 dark:border-strokedark'>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    {index + 3}
                                </td>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    {t('mealAllowance')}
                                </td>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    Rp. {data.uang_makan}
                                </td>
                            </tr>
                            <tr className='bg-gray-50 dark:border-strokedark'>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    {index + 4}
                                </td>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    {t('deduction')}
                                </td>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    Rp. {data.potongan}
                                </td>
                            </tr>
                            <tr className='bg-gray-50 dark:border-strokedark'>
                                <td className='border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                </td>
                                <td className='font-medium border-b  border-[#eee] dark:border-strokedark py-5 text-right text-black dark:text-white'>
                                    {t('totalSalary')} :
                                </td>
                                <td className='font-medium border-b border-[#eee] dark:border-strokedark py-5 px-4 text-black dark:text-white'>
                                    Rp. {data.total}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='w-full md:w-1/2 md:justify-end py-6'>
                        <div className='w-full md:w-auto'>
                            <ButtonOne
                                onClick={onSubmitPrint}
                            >
                                <span>{t('printSalarySlip')}</span>
                                <span>
                                    <TfiPrinter />
                                </span>
                            </ButtonOne>
                            <ButtonOne type="button" onClick={handleExportExcel} className='ml-2'>
                                        <span>{t('printButtonExcel')}</span>
                                        <span>
                                            <TfiPrinter />
                                        </span>
                            </ButtonOne>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DetailDataGaji;
