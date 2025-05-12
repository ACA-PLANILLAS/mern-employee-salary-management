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
    //nik: '',
    dui_or_nit: '',
    document_type: '',
    isss_affiliation_number: '',
    pension_institution_code: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    second_last_name: '',
    maiden_name: '',
    jenis_kelamin: '',
    hire_date: '',
    status: '',
    jabatan: '',
    last_position_change_date: '',
    monthly_salary: '',
    has_active_loan: '',
    loan_original_amount: '',
    loan_outstanding_balance: '',
    loan_monthly_installment: '',
    loan_start_date: '',
    username: '',
    password: '',
    confPassword: '',
    title: '',
    file: null,
    preview: null,
    hak_akses: '',
  });

  const {
    //nik,
    dui_or_nit, document_type, isss_affiliation_number, pension_institution_code,
    first_name, middle_name, last_name, second_last_name, maiden_name,
    jenis_kelamin, hire_date, status, jabatan,
    last_position_change_date, monthly_salary, has_active_loan,
    loan_original_amount, loan_outstanding_balance, loan_monthly_installment, loan_start_date,
    username, password, confPassword, title, file, preview, hak_akses,
  } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation('dataGajiAddForm');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitDataPegawai = (e) => {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append('photo', file);
    newFormData.append('title', title);
    // newFormData.append('nik', nik);
    newFormData.append('dui_or_nit', dui_or_nit);
    newFormData.append('document_type', document_type);
    newFormData.append('isss_affiliation_number', isss_affiliation_number);
    newFormData.append('pension_institution_code', pension_institution_code);
    newFormData.append('first_name', first_name);
    newFormData.append('middle_name', middle_name);
    newFormData.append('last_name', last_name);
    newFormData.append('second_last_name', second_last_name);
    newFormData.append('maiden_name', maiden_name);
    newFormData.append('jenis_kelamin', jenis_kelamin);
    newFormData.append('hire_date', hire_date);
    newFormData.append('status', status);
    newFormData.append('jabatan', jabatan);
    newFormData.append('last_position_change_date', last_position_change_date);
    newFormData.append('monthly_salary', monthly_salary);
    newFormData.append('has_active_loan', has_active_loan);
    newFormData.append('loan_original_amount', loan_original_amount);
    newFormData.append('loan_outstanding_balance', loan_outstanding_balance);
    newFormData.append('loan_monthly_installment', loan_monthly_installment);
    newFormData.append('loan_start_date', loan_start_date);
    newFormData.append('username', username);
    newFormData.append('password', password);
    newFormData.append('confPassword', confPassword);
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
        const msg = error.response?.data?.msg || error.message || 'terjadiKesalahan';
        Swal.fire({
          icon: 'error',
          title: t('gagal'),
          text: getErrorMessage(msg),
          confirmButtonText: 'Ok',
        });
      });
  };

  useEffect(() => { dispatch(getMe()); }, [dispatch]);
  
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
                {/* — Identificación — */}
                {/* <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('nik')} <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='text'
                      name='nik'
                      value={nik}
                      onChange={handleChange}
                      required
                      placeholder={t('masukkanNik')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('duiOrNit')}
                    </label>
                    <input
                      type='text'
                      name='dui_or_nit'
                      value={dui_or_nit}
                      onChange={handleChange}
                      placeholder={t('masukkanDuiOrNit')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>
                </div> */}

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('documentType')}
                    </label>
                    <input
                      type='text'
                      name='document_type'
                      value={document_type}
                      onChange={handleChange}
                      placeholder={t('masukkanDocumentType')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('isssAffiliationNumber')}
                    </label>
                    <input
                      type='text'
                      name='isss_affiliation_number'
                      value={isss_affiliation_number}
                      onChange={handleChange}
                      placeholder={t('masukkanIsssAffiliationNumber')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('pensionInstitutionCode')}
                    </label>
                    <input
                      type='text'
                      name='pension_institution_code'
                      value={pension_institution_code}
                      onChange={handleChange}
                      placeholder={t('masukkanPensionInstitutionCode')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  {/* campo vacío para mantener grid */}
                  <div className='w-full xl:w-1/2'></div>
                </div>

                {/* — Nombres — */}
                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('firstName')} <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='text'
                      name='first_name'
                      value={first_name}
                      onChange={handleChange}
                      required
                      placeholder={t('masukkanFirstName')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('middleName')}
                    </label>
                    <input
                      type='text'
                      name='middle_name'
                      value={middle_name}
                      onChange={handleChange}
                      placeholder={t('masukkanMiddleName')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('lastName')} <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='text'
                      name='last_name'
                      value={last_name}
                      onChange={handleChange}
                      required
                      placeholder={t('masukkanLastName')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('secondLastName')}
                    </label>
                    <input
                      type='text'
                      name='second_last_name'
                      value={second_last_name}
                      onChange={handleChange}
                      placeholder={t('masukkanSecondLastName')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('maidenName')}
                    </label>
                    <input
                      type='text'
                      name='maiden_name'
                      value={maiden_name}
                      onChange={handleChange}
                      placeholder={t('masukkanMaidenName')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  {/* campo vacío */}
                  <div className='w-full xl:w-1/2'></div>
                </div>

                {/* — Credenciales & Rol — */}
                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('username')} <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='text'
                      name='username'
                      value={username}
                      onChange={handleChange}
                      required
                      placeholder={t('masukkanUsername')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('password')} <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='password'
                      name='password'
                      value={password}
                      onChange={handleChange}
                      required
                      placeholder={t('masukkanPassword')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('confPassword')} <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='password'
                      name='confPassword'
                      value={confPassword}
                      onChange={handleChange}
                      required
                      placeholder={t('konfirmasiPassword')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('jenisKelamin')} <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative'>
                      <select
                        name='jenis_kelamin'
                        value={jenis_kelamin}
                        onChange={handleChange}
                        required
                        className='w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value='' disabled>{t('pilihJenisKelamin')}</option>
                        <option value='laki-laki'>{t('male')}</option>
                        <option value='perempuan'>{t('female')}</option>
                      </select>
                      <span className='absolute top-1/2 right-4 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                {/* — Empleo — */}
                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('jabatan')} <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='text'
                      name='jabatan'
                      value={jabatan}
                      onChange={handleChange}
                      required
                      placeholder={t('masukkanJabatan')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('tanggalMasuk')} <span className='text-meta-1'>*</span>
                    </label>
                    <input
                      type='date'
                      name='hire_date'
                      value={hire_date}
                      onChange={handleChange}
                      required
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('lastPositionChangeDate')}
                    </label>
                    <input
                      type='date'
                      name='last_position_change_date'
                      value={last_position_change_date}
                      onChange={handleChange}
                      placeholder={t('masukkanLastPositionChangeDate')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('monthlySalary')}
                    </label>
                    <input
                      type='number'
                      name='monthly_salary'
                      value={monthly_salary}
                      onChange={handleChange}
                      placeholder={t('masukkanMonthlySalary')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                </div>

                {/* — Préstamo — */}
                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('hasActiveLoan')}
                    </label>
                    <div className='relative'>
                      <select
                        name='has_active_loan'
                        value={has_active_loan}
                        onChange={handleChange}
                        className='w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value='' disabled>{t('pilihHasActiveLoan')}</option>
                        <option value='true'>{t('yes')}</option>
                        <option value='false'>{t('no')}</option>
                      </select>
                      <span className='absolute top-1/2 right-4 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('loanOriginalAmount')}
                    </label>
                    <input
                      type='number'
                      name='loan_original_amount'
                      value={loan_original_amount}
                      onChange={handleChange}
                      placeholder={t('masukkanLoanOriginalAmount')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('loanOutstandingBalance')}
                    </label>
                    <input
                      type='number'
                      name='loan_outstanding_balance'
                      value={loan_outstanding_balance}
                      onChange={handleChange}
                      placeholder={t('masukkanLoanOutstandingBalance')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('loanMonthlyInstallment')}
                    </label>
                    <input
                      type='number'
                      name='loan_monthly_installment'
                      value={loan_monthly_installment}
                      onChange={handleChange}
                      placeholder={t('masukkanLoanMonthlyInstallment')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                </div>

                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('loanStartDate')}
                    </label>
                    <input
                      type='date'
                      name='loan_start_date'
                      value={loan_start_date}
                      onChange={handleChange}
                      placeholder={t('masukkanLoanStartDate')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active… dark:focus:border-primary'
                    />
                  </div>
                  <div className='w-full xl:w-1/2'></div>
                </div>

                {/* — Estado & Acceso — */}
                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('status')} <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative'>
                      <select
                        name='status'
                        value={status}
                        onChange={handleChange}
                        required
                        className='w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value='' disabled>{t('pilihStatus')}</option>
                        <option value='karyawan tetap'>{t('permanentEmployee')}</option>
                        <option value='karyawan tidak tetap'>{t('nonPermanentEmployee')}</option>
                      </select>
                      <span className='absolute top-1/2 right-4 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('hakAkses')} <span className='text-meta-1'>*</span>
                    </label>
                    <div className='relative'>
                      <select
                        name='hak_akses'
                        value={hak_akses}
                        onChange={handleChange}
                        required
                        className='w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      >
                        <option value='' disabled>{t('pilihHakAkses')}</option>
                        <option value='admin'>{t('admin')}</option>
                        <option value='pegawai'>{t('pegawai')}</option>
                      </select>
                      <span className='absolute top-1/2 right-4 -translate-y-1/2 text-2xl'>
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                {/* — Foto — */}
                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                  <div className='w-full xl:w-1/2'>
                    <label className='mb-2.5 block text-black dark:text-white'>
                      {t('uploadFoto')}
                    </label>
                    <input
                      type='file'
                      onChange={onLoadImageUpload}
                      required
                      className='w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke dark:file:border-strokedark file:bg-[#EEEEEE] dark:file:bg-white/30 dark:file:text-white file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary dark:border-form-strokedark dark:bg-form-input'
                    />
                  </div>
                  <div className='flex justify-center items-center'>
                    {preview && (
                      <figure className='relative w-64 h-64 animate-fadeIn'>
                        <img src={preview} alt='Foto' className='object-cover w-full h-full shadow-6 rounded-xl' />
                        <button onClick={imageCancel} className='absolute top-2 right-2 bg-white dark:bg-black/30 rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 focus:outline-none'>
                          <AiOutlineClose className='h-5 w-5' />
                        </button>
                      </figure>
                    )}
                  </div>
                </div>

                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                  <ButtonOne><span>{t('simpan')}</span></ButtonOne>
                  <Link to='/data-pegawai'>
                    <ButtonTwo><span>{t('kembali')}</span></ButtonTwo>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormAddDataPegawai;
