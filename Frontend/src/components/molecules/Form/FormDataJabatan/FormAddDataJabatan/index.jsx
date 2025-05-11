import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { createDataJabatan, getMe } from '../../../../../config/redux/action';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../../../hooks/useErrorMessage';

const FormAddDataJabatan = () => {
    const [formData, setFormData] = useState({
        namaJabatan: '',
        gajiPokok: '',
        tjTransport: '',
        uangMakan: '',
    });

    const {
        namaJabatan,
        gajiPokok,
        tjTransport,
        uangMakan,
    } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);
    const { t } = useTranslation("dataJabatanAddForm");
    const getErrorMessage = useErrorMessage();

    const submitDataJabatan = (e) => {
        e.preventDefault();
        const newFormData = new FormData();
        newFormData.append('nama_jabatan', namaJabatan);
        newFormData.append('gaji_pokok', gajiPokok);
        newFormData.append('tj_transport', tjTransport);
        newFormData.append('uang_makan', uangMakan);
        dispatch(createDataJabatan(newFormData, navigate))
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
          const swalOptions = {
            icon: 'error',
            title: t('error'),
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'bg-[#3C50E0] text-white px-4 py-2 rounded-md shadow font-medium hover:bg-[#2f3fb6]'
            }
          };
      
          if (error.response?.data?.msg) {
            Swal.fire({
              ...swalOptions,
              text: getErrorMessage(error.response.data.msg),
            });
          } else if (error.message) {
            Swal.fire({
              ...swalOptions,
              text: getErrorMessage(error.message),
            });
          } else {
            Swal.fire({
              ...swalOptions,
              text: t('errorOccurred'),
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
            <Breadcrumb pageName={t('formAddJobTitle')} />
            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                {t('formAddJobTitle')}
                            </h3>
                        </div>
                        <form onSubmit={submitDataJabatan}>
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            required
                                            placeholder={t('enterMealAllowance')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <div>
                                        <ButtonOne>
                                            <span>{t('save')}</span>
                                        </ButtonOne>
                                    </div>
                                    <Link to="/data-jabatan" >
                                        <ButtonTwo>
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

export default FormAddDataJabatan;
