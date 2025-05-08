import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import Layout from '../../../../../layout';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { getMe } from '../../../../../config/redux/action';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../../../hooks/useErrorMessage';
const API_URL = import.meta.env.VITE_API_URL;

const FormEditDataPotongan = () => {
    const [potongan, setPotongan] = useState('');
    const [jmlPotongan, setJmlPotongan] = useState('');
    const [msg, setMsg] = useState('');
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isError, user } = useSelector((state) => state.auth);

    const { t } = useTranslation();
    const getErrorMessage = useErrorMessage();

    const updateDataPotongan = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('potongan', potongan);
            formData.append('jml_potongan', jmlPotongan);

            const response = await axios.patch(`${API_URL}/data_potongan/update/${id}`, formData, {
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
            navigate('/data-potongan');
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
        const getDataById = async () => {
            try {
                const response = await axios.get(`${API_URL}/data_potongan/${id}`);
                setPotongan(response.data.potongan);
                setJmlPotongan(response.data.jml_potongan);
            } catch (error) {
                if (error.response) {
                    setMsg(getErrorMessage(error.response.data.msg));
                }
            }
        }
        getDataById();
    }, [id]);

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
            <Breadcrumb pageName={t('formEditDeduction')} />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                {t('formEditDeduction')}
                            </h3>
                        </div>
                        <form onSubmit={updateDataPotongan}>
                            <div className='p-6.5'>
                                <div className='mb-4.5 '>
                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            {t('deduction')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='potongan'
                                            name='potongan'
                                            value={potongan}
                                            onChange={(e) => setPotongan(e.target.value)}
                                            required={true}
                                            placeholder={t('enterDeduction')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            {t('amountDeduction')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='jmlPotongan'
                                            name='jmlPotongan'
                                            value={jmlPotongan}
                                            onChange={(e) => setJmlPotongan(e.target.value)}
                                            required
                                            placeholder={t('enterAmountDeduction')}
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
                                    <Link to="/data-potongan" >
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

export default FormEditDataPotongan;
