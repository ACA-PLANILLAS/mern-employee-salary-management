import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne } from '../../../../components';
import { TfiLock } from 'react-icons/tfi'
import { changePassword, getMe } from '../../../../config/redux/action';
import { useTranslation } from 'react-i18next';

const UbahPasswordAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation('ubahPasswordAdmin');

    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const { isError, user } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === confPassword) {
            try {
                dispatch(changePassword(password, confPassword));
                Swal.fire({
                    icon: 'success',
                    title: t('alert.success.title'),
                    text: t('alert.success.text'),
                    showConfirmButton: false,
                    timer: 1500,
                });

                setPassword('');
                setConfPassword('');
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: t('alert.error.title'),
                    text: error.response?.data?.msg || t('alert.error.text.general'),
                    confirmButtonText: t('alert.button.ok'),
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: t('alert.error.title'),
                text: t('alert.error.text.mismatch'),
                confirmButtonText: t('alert.button.ok'),
                timer: 1500,
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
            <Breadcrumb pageName={t('breadcrumb.pageName')} />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>{t('form.title')}</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className='p-6.5'>
                                <div className='mb-4.5 '>
                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            {t('form.label.newPassword')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder={t('form.placeholder.newPassword')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full mb-4'>
                                        <label className='mb-4 block text-black dark:text-white'>
                                            {t('form.label.repeatPassword')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='password'
                                            placeholder={t('form.placeholder.repeatPassword')}
                                            value={confPassword}
                                            required
                                            onChange={(e) => setConfPassword(e.target.value)}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                        <TfiLock className='absolute right-4 top-4 text-xl' />
                                    </div>
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <ButtonOne type='submit'>
                                        <span>{t('form.button.updatePassword')}</span>
                                    </ButtonOne>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UbahPasswordAdmin;