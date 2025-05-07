import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { createDataPotongan, getMe } from '../../../../../config/redux/action';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../../../hooks/useErrorMessage';

const FormAddDataPotongan = () => {
    const [formData, setFormData] = useState({
        potongan: '',
        jmlPotongan: '',
    });

    const {
        potongan,
        jmlPotongan,
    } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    const { t } = useTranslation('dataPotonganAddForm');
    const getErrorMessage = useErrorMessage();

    const submitDataPotongan = (e) => {
        e.preventDefault();
        const newFormData = new FormData();
        newFormData.append('potongan', potongan);
        newFormData.append('jml_potongan', jmlPotongan);

        dispatch(createDataPotongan(newFormData, navigate))
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: t('success'),
                    text: getErrorMessage(response.message),
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.msg) {
                    Swal.fire({
                        icon: 'error',
                        title: t('error'),
                        text: getErrorMessage(error.response.data.msg),
                        confirmButtonText: 'Ok',
                    });
                } else if (error.message) {
                    Swal.fire({
                        icon: 'error',
                        title: t('error'),
                        text: getErrorMessage(error.message),
                        confirmButtonText: 'Ok',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: t('error'),
                        text: t('errorOccurred'),
                        confirmButtonText: 'Ok',
                    });
                }
            });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
            <Breadcrumb pageName={t('formAddDeduction')} />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                {t('formAddDeduction')}
                            </h3>
                        </div>
                        <form onSubmit={submitDataPotongan}>
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            required
                                            placeholder={t('enterAmountDeduction')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <div>
                                        <ButtonOne  >
                                            <span>{t('save')}</span>
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

export default FormAddDataPotongan;
