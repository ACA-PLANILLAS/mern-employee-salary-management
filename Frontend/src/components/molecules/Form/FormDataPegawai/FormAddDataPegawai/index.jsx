import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import Layout from '../../../../../layout';
import { createDataPegawai, getMe } from '../../../../../config/redux/action';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../../../hooks/useErrorMessage';

const FormAddDataPegawai = () => {
    const [formData, setFormData] = useState({
        nik: '',
        namaPegawai: '',
        username: '',
        password: '',
        confPassword: '',
        jenisKelamin: '',
        jabatan: '',
        tanggalMasuk: '',
        title: '',
        file: '',
        preview: '',
        status: '',
        hak_akses: '',
    });

    const {
        nik,
        namaPegawai,
        username,
        password,
        confPassword,
        jenisKelamin,
        jabatan,
        tanggalMasuk,
        title,
        file,
        preview,
        status,
        hak_akses,
    } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    const { t } = useTranslation("dataGajiAddForm");
    const getErrorMessage = useErrorMessage();

    const onLoadImageUpload = (e) => {
        const image = e.target.files[0];
        if (image) {
            setFormData({
                ...formData,
                title: image.name,
                file: image,
                preview: URL.createObjectURL(image),
            });
        }
    };

    const imageCancel = () => {
        setFormData({
            ...formData,
            title: '',
            file: null,
            preview: null,
        });
    };

    const submitDataPegawai = (e) => {
        e.preventDefault();
        const newFormData = new FormData();
        newFormData.append('photo', file);
        newFormData.append('title', title);
        newFormData.append('nik', nik);
        newFormData.append('nama_pegawai', namaPegawai);
        newFormData.append('username', username);
        newFormData.append('password', password);
        newFormData.append('confPassword', confPassword);
        newFormData.append('jenis_kelamin', jenisKelamin);
        newFormData.append('jabatan', jabatan);
        newFormData.append('tanggal_masuk', tanggalMasuk);
        newFormData.append('status', status);
        newFormData.append('hak_akses', hak_akses);

        dispatch(createDataPegawai(newFormData, navigate))
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: t('berhasil'),
                    text: getErrorMessage(response.message),
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.msg) {
                    Swal.fire({
                        icon: 'error',
                        title: t('gagal'),
                        text: getErrorMessage(error.response.data.msg),
                        confirmButtonText: 'Ok',
                    });
                } else if (error.message) {
                    Swal.fire({
                        icon: 'error',
                        title: t('gagal'),
                        text: getErrorMessage(error.message),
                        confirmButtonText: 'Ok',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: t('gagal'),
                        text: t('terjadiKesalahan'),
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
            <Breadcrumb pageName={t('formAddDataPegawai')} />
            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                {t('formAddDataPegawai')}
                            </h3>
                        </div>
                        <form onSubmit={submitDataPegawai}>
                            <div className='p-6.5'>
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('nik')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='nik'
                                            name='nik'
                                            value={nik}
                                            onChange={handleChange}
                                            required
                                            placeholder={t('masukkanNik')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('namaLengkap')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='namaPegawai'
                                            name='namaPegawai'
                                            value={namaPegawai}
                                            onChange={handleChange}
                                            required={true}
                                            placeholder={t('masukkanNamaLengkap')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('username')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='username'
                                            id='username'
                                            name='username'
                                            value={username}
                                            onChange={handleChange}
                                            required={true}
                                            placeholder={t('masukkanUsername')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('password')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='password'
                                            id='password'
                                            name='password'
                                            value={password}
                                            onChange={handleChange}
                                            required={true}
                                            placeholder={t('masukkanPassword')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('confPassword')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='password'
                                            id='confPassword'
                                            name='confPassword'
                                            value={confPassword}
                                            onChange={handleChange}
                                            required={true}
                                            placeholder={t('konfirmasiPassword')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('jenisKelamin')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                                id='jenisKelamin'
                                                name='jenisKelamin'
                                                value={jenisKelamin}
                                                onChange={handleChange}
                                                required={true}
                                            >
                                                <option value='' disabled={true}>{t('pilihJenisKelamin')}</option>
                                                <option value='laki-laki'>{t('male')}</option>
                                                <option value='perempuan'>{t('female')}</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('jabatan')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='jabatan'
                                            name='jabatan'
                                            value={jabatan}
                                            onChange={handleChange}
                                            required={true}
                                            placeholder={t('masukkanJabatan')}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('tanggalMasuk')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='date'
                                            id='tanggalMasuk'
                                            name='tanggalMasuk'
                                            value={tanggalMasuk}
                                            onChange={handleChange}
                                            required={true}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('status')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                                id='status'
                                                name='status'
                                                value={status}
                                                onChange={handleChange}
                                                required={true}
                                            >
                                                <option value='' disabled={true}>{t('pilihStatus')}</option>
                                                <option value='karyawan tetap'>{t('permanentEmployee')}</option>
                                                <option value='karyawan tidak tetap'>{t('nonPermanentEmployee')}</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('hakAkses')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                                id='hak_akses'
                                                name='hak_akses'
                                                value={hak_akses}
                                                onChange={handleChange}
                                                required={true}
                                            >
                                                <option value='' disabled={true}>{t('pilihHakAkses')}</option>
                                                <option value='admin'>{t('admin')}</option>
                                                <option value='pegawai'>{t('pegawai')}</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-2.5 block text-black dark:text-white ">
                                            {t('uploadFoto')}
                                        </label>
                                        <input
                                            type="file"
                                            className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke dark:file:border-strokedark file:bg-[#EEEEEE] dark:file:bg-white/30 dark:file:text-white file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                                            onChange={onLoadImageUpload}
                                            required={true}
                                        />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {preview ? (
                                            <figure className="relative w-64 h-64 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 animate-fadeIn">
                                                <img
                                                    src={preview}
                                                    alt="People Image"
                                                    className="object-cover w-full h-full shadow-6 rounded-xl"
                                                />
                                                <button
                                                    onClick={imageCancel}
                                                    className="absolute top-2 right-2 bg-white dark:bg-black/30 rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                                >
                                                    <AiOutlineClose className="h-5 w-5" />
                                                </button>
                                            </figure>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <div>
                                        <ButtonOne  >
                                            <span>{t('simpan')}</span>
                                        </ButtonOne>
                                    </div>
                                    <Link to="/data-pegawai" >
                                        <ButtonTwo  >
                                            <span>{t('kembali')}</span>
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

export default FormAddDataPegawai;
