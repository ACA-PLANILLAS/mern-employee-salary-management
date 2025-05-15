import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../../layout';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo} from '../../../../../components';
import { getMe } from '../../../../../config/redux/action';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../../../hooks/useErrorMessage';
import useCurrencyByUser from '../../../../../config/currency/useCurrencyByUser';
import { getCurrentRate } from '../../../../../config/currency/currencyStore';
const API_URL = import.meta.env.VITE_API_URL;

const FormEditDataJabatan = () => {
    const [namaJabatan, setNamaJabatan] = useState('');
    const [gajiPokok, setGajiPokok] = useState('');
    const [tjTransport, setTjTransport] = useState('');
    const [uangMakan, setUangMakan] = useState('');
    const [msg,setMsg] = useState('');
    const { id } = useParams();
    const { currency, symbol, toUSD } = useCurrencyByUser();
    const [prevCurrency, setPrevCurrency] = useState(currency);

    // Datos de la moneda anterior
    const [gajiPokokUSD, setGajiPokokUSD] = useState(null);

    useEffect(() => {
        if (!gajiPokokUSD) return;
      
        const currentRate = getCurrentRate(currency);
        console.log('primer', currentRate);
        const localAmount =(gajiPokokUSD * currentRate);
      
        // setGajiPokok(localAmount);
        setGajiPokok(Number(localAmount.toFixed(2)));
      }, [currency]);

      
     

   

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { isError, user } = useSelector((state) => state.auth);
    const { t } = useTranslation("dataJabatanEditForm");
    const getErrorMessage = useErrorMessage();

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`${API_URL}/data_jabatan/${id}`);
                setNamaJabatan(response.data.nama_jabatan);
                setGajiPokok(response.data.gaji_pokok);
                setTjTransport(response.data.tj_transport);
                setUangMakan(response.data.uang_makan);

                // Mostramos el valor en la moneda activa
                setGajiPokokUSD(Number(response.data.gaji_pokok));

                const currentRate = getCurrentRate(currency);
                setGajiPokok(Math.round(response.data.gaji_pokok * currentRate));
            } catch (error) {
                if (error.response) {
                    setMsg(getErrorMessage(error.response.data.msg));
                }
            }
        }
        getUserById();
    }, [id]);

    const updateDataJabatan = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nama_jabatan', namaJabatan);
            formData.append('gaji_pokok', toUSD(Number(gajiPokok)));
            formData.append('tj_transport', tjTransport);
            formData.append('uang_makan', uangMakan);

            const response = await axios.patch(`${API_URL}/data_jabatan/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg(getErrorMessage(response.data.msg));
            Swal.fire({
                icon: 'success',
                title: t('success'),
                timer: 1500,
                text: getErrorMessage(response.data.msg)
            });
            navigate('/data-jabatan');
        } catch (error) {
            setMsg(getErrorMessage(error.response.data.msg));
            Swal.fire({
                icon: 'error',
                title: t('error'),
                text: getErrorMessage(error.response.data.msg)
            });
        }
    };

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

    return (
        <Layout>
            <Breadcrumb pageName={t('formEditJobTitle')} />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                {t('formEditJobTitle')}
                            </h3>
                        </div>
                        <form onSubmit={updateDataJabatan}>
                            <div className='p-6.5'>
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('jobTitle')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='namaJabatan'
                                            name='namaJabatan'
                                            value={namaJabatan}
                                            onChange={(e) => setNamaJabatan(e.target.value)}
                                            required={true}
                                            placeholder={t('enterJobTitle')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('basicSalary')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className="relative flex items-center gap-3">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 flex justify-center items-center text-black dark:text-white">
                                            {symbol}
                                            </span>
                                            <input
                                                type='number'
                                                id='gajiPokok'
                                                name='gajiPokok'
                                                value={gajiPokok}
                                                // onChange={(e) => setGajiPokok(e.target.value)}
                                                onChange={(e) => {
                                                    const newLocalValue = Number(e.target.value);
                                                    setGajiPokok(newLocalValue);
                                                    setGajiPokokUSD(toUSD(newLocalValue)); // actualiza el valor original en USD
                                                  }}
                                                required
                                                placeholder={t('enterBasicSalary')}
                                                className='pl-10 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                            />

                                            {/* USD conversion */}
                                            {currency !== 'USD' && gajiPokok && (
                                                <span className="h-full text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap px-3 py-2 border border-stroke dark:border-strokedark rounded bg-gray-50 dark:bg-boxdark">
                                                    ≈ ${toUSD(Number(gajiPokok))} USD
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('transportAllowance')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='tjTransport'
                                            name='tjTransport'
                                            value={tjTransport}
                                            onChange={(e) => setTjTransport(e.target.value)}
                                            required
                                            placeholder={t('enterTransportAllowance')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('mealAllowance')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='uangMakan'
                                            name='uangMakan'
                                            value={uangMakan}
                                            onChange={(e) => setUangMakan(e.target.value)}
                                            required
                                            placeholder={t('enterMealAllowance')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <div>
                                        <ButtonOne  >
                                            <span>{t('update')}</span>
                                        </ButtonOne>
                                    </div>
                                    <Link to="/data-jabatan" >
                                        <ButtonTwo  >
                                            <span>{t('back')}</span>
                                        </ButtonTwo>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default FormEditDataJabatan;
