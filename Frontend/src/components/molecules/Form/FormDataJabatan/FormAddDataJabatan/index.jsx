import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { createDataJabatan, getMe } from '../../../../../config/redux/action';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../../../hooks/useErrorMessage';
import useCurrencyByUser from '../../../../../config/currency/useCurrencyByUser';
import { getCurrentRate } from '../../../../../config/currency/currencyStore';

const FormAddDataJabatan = () => {
  const [formData, setFormData] = useState({
    namaJabatan: '',
    gajiPokok: '',
    tjTransport: '',
    uangMakan: '',
  });

  const [gajiPokokUSD, setGajiPokokUSD] = useState(null);
  const [tjTransportUSD, setTjTransportUSD] = useState(null);
  const [uangMakanUSD, setUangMakanUSD] = useState(null);

  const { namaJabatan, gajiPokok, tjTransport, uangMakan } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataJabatanAddForm");
  const getErrorMessage = useErrorMessage();
  const { currency, symbol, toUSD } = useCurrencyByUser();

  const validateMoney = (value) => /^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) >= 0;
  const isZeroOrEmpty = (value) => value === '' || parseFloat(value) === 0;

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate('/login');
    if (user && user.hak_akses !== 'admin') navigate('/dashboard');
  }, [isError, user, navigate]);

  // Al cambiar moneda, convertir todos los valores locales desde USD
  useEffect(() => {
    const rate = getCurrentRate(currency);
    if (gajiPokokUSD !== null) setFormData(prev => ({ ...prev, gajiPokok: (gajiPokokUSD * rate).toFixed(2) }));
    if (tjTransportUSD !== null) setFormData(prev => ({ ...prev, tjTransport: (tjTransportUSD * rate).toFixed(2) }));
    if (uangMakanUSD !== null) setFormData(prev => ({ ...prev, uangMakan: (uangMakanUSD * rate).toFixed(2) }));
  }, [currency]);

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['gajiPokok', 'tjTransport', 'uangMakan'].includes(name)) {
      if (value === '' || validateMoney(value)) {
        const floatVal = parseFloat(value);
        const usdVal = isNaN(floatVal) ? 0 : toUSD(floatVal);

        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'gajiPokok') setGajiPokokUSD(usdVal);
        if (name === 'tjTransport') setTjTransportUSD(usdVal);
        if (name === 'uangMakan') setUangMakanUSD(usdVal);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitDataJabatan = (e) => {
    e.preventDefault();

    if (!namaJabatan.trim()) {
      Swal.fire({ icon: 'error', title: t('error'), text: t('allFieldsRequired') });
      return;
    }

    if (isZeroOrEmpty(gajiPokok)) {
      Swal.fire({ icon: 'error', title: t('error'), text: `${t('basicSalary')}: ${t('requiredAndGreaterThanZero')}` });
      return;
    }

    if (!validateMoney(gajiPokok)) {
      Swal.fire({ icon: 'error', title: t('error'), text: `${t('basicSalary')}: ${t('invalidFormat')}` });
      return;
    }

    if ((tjTransport && !validateMoney(tjTransport)) || (uangMakan && !validateMoney(uangMakan))) {
      Swal.fire({ icon: 'error', title: t('error'), text: t('invalidMoneyFields') });
      return;
    }

    const newFormData = new FormData();
    newFormData.append('nama_jabatan', namaJabatan);
    newFormData.append('gaji_pokok', toUSD(Number(gajiPokok)));
    newFormData.append('tj_transport', toUSD(Number(tjTransport || 0)));
    newFormData.append('uang_makan', toUSD(Number(uangMakan || 0)));

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
        Swal.fire({
          icon: 'error',
          title: t('error'),
          text: error.response?.data?.msg
            ? getErrorMessage(error.response.data.msg)
            : error.message || t('errorOccurred'),
        });
      });
  };

  const renderMoneyInput = (name, label, value, required, placeholder) => (
    <div className='w-full xl:w-1/2'>
      <label className='mb-2.5 block text-black dark:text-white'>
        {label} {required && <span className='text-meta-1'>*</span>}
      </label>
      <div className="relative flex items-center gap-3">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 flex justify-center items-center text-black dark:text-white">
          {symbol}
        </span>
        <input
          type='text'
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          required={required}
          placeholder={placeholder}
          className='pl-10 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
        />
        {currency !== 'USD' && (
          <span className="h-full text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap px-3 py-2 border border-stroke dark:border-strokedark rounded bg-gray-50 dark:bg-boxdark">
            ≈ ${toUSD(Number(value)).toFixed(2)} USD
          </span>
        )}
      </div>
    </div>
  );

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
                      name='namaJabatan'
                      value={namaJabatan}
                      onChange={handleChange}
                      required
                      placeholder={t('enterJobTitle')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>

                  {renderMoneyInput('gajiPokok', t('basicSalary'), gajiPokok, true, t('enterBasicSalary'))}
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                  {renderMoneyInput('tjTransport', t('transportAllowance'), tjTransport, false, t('enterTransportAllowance'))}
                  {renderMoneyInput('uangMakan', t('mealAllowance'), uangMakan, false, t('enterMealAllowance'))}
                </div>

                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                  <ButtonOne>
                    <span>{t('save')}</span>
                  </ButtonOne>
                  <Link to="/data-jabatan">
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
  );
};

export default FormAddDataJabatan;
