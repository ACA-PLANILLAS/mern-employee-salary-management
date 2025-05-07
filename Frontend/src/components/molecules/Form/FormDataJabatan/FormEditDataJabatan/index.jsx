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

const FormEditDataJabatan = () => {
    const [namaJabatan, setNamaJabatan] = useState('');
    const [gajiPokok, setGajiPokok] = useState('');
    const [tjTransport, setTjTransport] = useState('');
    const [uangMakan, setUangMakan] = useState('');
    const [msg,setMsg] = useState('');
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { isError, user } = useSelector((state) => state.auth);
    const { t } = useTranslation("dataJabatanEditForm");
    const getErrorMessage = useErrorMessage();

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/data_jabatan/${id}`);
                setNamaJabatan(response.data.nama_jabatan);
                setGajiPokok(response.data.gaji_pokok);
                setTjTransport(response.data.tj_transport);
                setUangMakan(response.data.uang_makan);
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
            formData.append('gaji_pokok', gajiPokok);
            formData.append('tj_transport', tjTransport);
            formData.append('uang_makan', uangMakan);

            const response = await axios.patch(`http://localhost:5000/data_jabatan/${id}`, formData, {
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
                                        <input
                                            type='number'
                                            id='gajiPokok'
                                            name='gajiPokok'
                                            value={gajiPokok}
                                            onChange={(e) => setGajiPokok(e.target.value)}
                                            required
                                            placeholder={t('enterBasicSalary')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
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
