import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../../layout';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { getMe } from '../../../../../config/redux/action';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../../../hooks/useErrorMessage';
import useCurrencyByUser from '../../../../../config/currency/useCurrencyByUser';
import { getCurrentRate } from '../../../../../config/currency/currencyStore';

// import { API_URL } from '@/config/env';
import { API_URL } from '@/config/env';

const FormEditDataJabatan = () => {
  const [namaJabatan, setNamaJabatan] = useState('');
  const [gajiPokok, setGajiPokok] = useState('');
  const [tjTransport, setTjTransport] = useState('');
  const [uangMakan, setUangMakan] = useState('');

  const [gajiPokokUSD, setGajiPokokUSD] = useState(null);
  const [tjTransportUSD, setTjTransportUSD] = useState(null);
  const [uangMakanUSD, setUangMakanUSD] = useState(null);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currency, symbol, toUSD } = useCurrencyByUser();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation("dataJabatanEditForm");
  const getErrorMessage = useErrorMessage();

  const validateMoney = (value) => /^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) >= 0;
  const isZeroOrEmpty = (value) => value === '' || parseFloat(value) === 0;

  // Al cambiar moneda, recalcular todos los montos locales desde los USD
  useEffect(() => {
    const rate = getCurrentRate(currency);
    if (gajiPokokUSD != null) setGajiPokok((gajiPokokUSD * rate).toFixed(2));
    if (tjTransportUSD != null) setTjTransport((tjTransportUSD * rate).toFixed(2));
    if (uangMakanUSD != null) setUangMakan((uangMakanUSD * rate).toFixed(2));
  }, [currency]);

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(`${API_URL}/data_jabatan/${id}`);
        const data = response.data;

        setNamaJabatan(data.nama_jabatan);

        setGajiPokokUSD(Number(data.gaji_pokok));
        setTjTransportUSD(Number(data.tj_transport));
        setUangMakanUSD(Number(data.uang_makan));

        const rate = getCurrentRate(currency);
        setGajiPokok((data.gaji_pokok * rate).toFixed(2));
        setTjTransport((data.tj_transport * rate).toFixed(2));
        setUangMakan((data.uang_makan * rate).toFixed(2));
      } catch (error) {
        if (error.response) {
          Swal.fire({
            icon: 'error',
            title: t('error'),
            text: getErrorMessage(error.response.data.msg),
          });
        }
      }
    };
    getUserById();
  }, [id]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate('/login');
    if (user && user.hak_akses !== 'admin') navigate('/dashboard');
  }, [isError, user, navigate]);

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleMoneyChange = (setter, usdSetter) => (e) => {
    const value = e.target.value;
    if (value === '' || validateMoney(value)) {
      setter(value);
      usdSetter && usdSetter(toUSD(Number(value)));
    }
  };

  const updateDataJabatan = async (e) => {
    e.preventDefault();

    if (!namaJabatan.trim()) {
      Swal.fire({ icon: 'error', title: t('error'), text: t('allFieldsRequired') });
      return;
    }

    if (isZeroOrEmpty(gajiPokok)) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: `${t('basicSalary')}: ${t('requiredAndGreaterThanZero')}`
      });
      return;
    }

    if (!validateMoney(gajiPokok)) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: `${t('basicSalary')}: ${t('invalidFormat')}`
      });
      return;
    }

    if ((tjTransport && !validateMoney(tjTransport)) || (uangMakan && !validateMoney(uangMakan))) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: t('invalidMoneyFields')
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nama_jabatan', namaJabatan);
      formData.append('gaji_pokok', toUSD(Number(gajiPokok)));
      formData.append('tj_transport', toUSD(Number(tjTransport || 0)));
      formData.append('uang_makan', toUSD(Number(uangMakan || 0)));

      const response = await axios.patch(`${API_URL}/data_jabatan/${id}`, formData);
      Swal.fire({
        icon: 'success',
        title: t('success'),
        timer: 1500,
        text: getErrorMessage(response.data.msg)
      });
      navigate('/data-jabatan');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: getErrorMessage(error.response?.data?.msg)
      });
    }
  };

  const renderMoneyInput = (label, value, setter, usdSetter, name, placeholder) => (
    <div className='w-full xl:w-1/2'>
      <label className='mb-2.5 block text-black dark:text-white'>
        {label} <span className='text-meta-1'>*</span>
      </label>
      <div className="relative flex items-center gap-3">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 flex justify-center items-center text-black dark:text-white">
          {symbol}
        </span>
        <input
          type='text'
          name={name}
          value={value}
          onFocus={handleFocus}
          onChange={handleMoneyChange(setter, usdSetter)}
          required
          placeholder={placeholder}
          className='pl-10 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
        />
        {currency !== 'USD' && value && (
          <span className="h-full text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap px-3 py-2 border border-stroke dark:border-strokedark rounded bg-gray-50 dark:bg-boxdark">
            ≈ ${toUSD(Number(value))} USD
          </span>
        )}
      </div>
    </div>
  );

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
                      value={namaJabatan}
                      onChange={(e) => setNamaJabatan(e.target.value)}
                      required
                      placeholder={t('enterJobTitle')}
                      className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                  </div>
                  {renderMoneyInput(
                    t('basicSalary'),
                    gajiPokok,
                    setGajiPokok,
                    setGajiPokokUSD,
                    'gajiPokok',
                    t('enterBasicSalary')
                  )}
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                  {renderMoneyInput(
                    t('transportAllowance'),
                    tjTransport,
                    setTjTransport,
                    setTjTransportUSD,
                    'tjTransport',
                    t('enterTransportAllowance')
                  )}
                  {renderMoneyInput(
                    t('mealAllowance'),
                    uangMakan,
                    setUangMakan,
                    setUangMakanUSD,
                    'uangMakan',
                    t('enterMealAllowance')
                  )}
                </div>

                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                  <ButtonOne>
                    <span>{t('update')}</span>
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

export default FormEditDataJabatan;
