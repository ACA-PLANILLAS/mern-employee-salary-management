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
import useCurrencyByUser from '../../../../../config/currency/useCurrencyByUser';
import { getCurrentRate } from '../../../../../config/currency/currencyStore';

const API_URL = import.meta.env.VITE_API_URL;

const FormEditDataPotongan = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation('dataPotonganAddForm');
  const getErrorMessage = useErrorMessage();
  const { currency, symbol, toUSD } = useCurrencyByUser();

  const [formData, setFormData] = useState({
    potongan: '',
    type: 'STA',
    jmlPotongan: '',
    from: '',
    until: '',
    valueD: '',
    paymentFrequency: '1',
    deductionGroup: '',
  });

  const [fromUSD, setFromUSD] = useState(null);
  const [untilUSD, setUntilUSD] = useState(null);
  const [valueDUSD, setValueDUSD] = useState(null);

  const {
    potongan, jmlPotongan, type, from, until, valueD,
    paymentFrequency, deductionGroup
  } = formData;

  const validateMoney = value => /^\d+(\.\d{0,2})?$/.test(value) && parseFloat(value) >= 0;

  const validatePercentage = (value) => {
    return /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100;
  };

  const handleChange = e => {
    const { name, value } = e.target;

    if (['from', 'until', 'valueD'].includes(name)) {
      if (value === '' || validateMoney(value)) {
        const numberValue = parseFloat(value);
        const usdValue = isNaN(numberValue) ? 0 : toUSD(numberValue);
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'from') setFromUSD(usdValue);
        if (name === 'until') setUntilUSD(usdValue);
        if (name === 'valueD') setValueDUSD(usdValue);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const rate = getCurrentRate(currency);
    if (fromUSD != null) setFormData(prev => ({ ...prev, from: (fromUSD * rate).toFixed(2) }));
    if (untilUSD != null) setFormData(prev => ({ ...prev, until: (untilUSD * rate).toFixed(2) }));
    if (valueDUSD != null) setFormData(prev => ({ ...prev, valueD: (valueDUSD * rate).toFixed(2) }));
  }, [currency]);

  const handleFocus = e => e.target.select();

  const renderMoneyInput = (name, label, value, usdValue, placeholder) => (
    <div className="w-full mb-4">
      <label className="mb-4 block text-black dark:text-white">
        {label} <span className="text-meta-1">*</span>
      </label>
      <div className="relative flex items-center gap-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{symbol}</span>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          required
          className="pl-10 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
        {currency !== 'USD' && value && (
          <span className="h-full text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap px-3 py-2 border border-stroke dark:border-strokedark rounded bg-gray-50 dark:bg-boxdark">
            ≈ ${toUSD(Number(value)).toFixed(2)} USD
          </span>
        )}
      </div>
    </div>
  );

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/data_potongan/${id}`);
      const data = res.data;
      setFormData({
        potongan: data.potongan,
        type: data.type,
        jmlPotongan: String((data.jml_potongan ?? 0) * 100),
        from: data.from != null ? String(data.from) : '',
        until: data.until != null ? String(data.until) : '',
        valueD: data.value_d != null ? String(data.value_d) : '',
        paymentFrequency: data.payment_frequency != null ? String(data.payment_frequency) : '1',
        deductionGroup: data.deduction_group ?? '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: getErrorMessage(error.response?.data?.msg || error.message),
      });
    }
  };

  useEffect(() => {
    fetchData();
    dispatch(getMe());
  }, [dispatch, id]);

  useEffect(() => {
    // TODO ACTIVAR LUEGO
    // if (isError) navigate('/login');
    // if (user && user.hak_akses !== 'admin') navigate('/dashboard');
  }, [isError, user, navigate]);

  const updateDataPotongan = async (e) => {
    e.preventDefault();

    if (!potongan.trim()) {
      Swal.fire({ icon: 'error', title: t('error'), text: t('deductionRequired') });
      return;
    }

    if (!validatePercentage(jmlPotongan)) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: t('percentageOutOfRange'),
      });
      return;
    }

    if (!validateMoney(jmlPotongan)) {
      Swal.fire({ icon: 'error', title: t('error'), text: t('percentageRequired') });
      return;
    }

    if (type === 'DIN') {
      if (![from, until, valueD].every(validateMoney)) {
        Swal.fire({ icon: 'error', title: t('error'), text: t('monetaryFieldsInvalid') });
        return;
      }
    }

    try {
      const payload = new FormData();
      payload.append('potongan', potongan);
      payload.append('type', type);

      if (type === 'STA') {
        payload.append('jml_potongan', String(parseFloat(jmlPotongan) / 100));
      } else {
        payload.append('from', toUSD(Number(from)));
        payload.append('until', toUSD(Number(until)));
        payload.append('jml_potongan', String(parseFloat(jmlPotongan) / 100));
        payload.append('value_d', toUSD(Number(valueD)));
        payload.append('payment_frequency', paymentFrequency);
        payload.append('deduction_group', deductionGroup);
      }

      const response = await axios.patch(
        `${API_URL}/data_potongan/update/${id}`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      Swal.fire({
        icon: 'success',
        title: t('success'),
        text: getErrorMessage(response.data.msg),
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/data-potongan');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: getErrorMessage(error.response?.data?.msg || error.message),
      });
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName={t('formEditDeduction')} />

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {t('formEditDeduction')}
              </h3>
            </div>

            <form onSubmit={updateDataPotongan}>
              <div className="p-6.5">
                {/* Nombre de la Deducción */}
                <div className="w-full mb-4">
                  <label className="mb-4 block text-black dark:text-white">
                    {t('deduction')} <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="potongan"
                    name="potongan"
                    value={potongan}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    required
                    placeholder={t('enterDeduction')}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                
                <div className="w-full mb-4">
                  <label className="mb-4 block text-black dark:text-white">
                    {t('selectType')} <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="type"
                    value={type}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="STA">{t('standard')}</option>
                    <option value="DIN">{t('dynamic')}</option>
                  </select>
                </div>

                {/* Estándar */}
                {type === 'STA' && (
                  <div className="w-full mb-4">
                    <label className="mb-4 block text-black dark:text-white">
                      {t('percentage')} <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="jmlPotongan"
                        name="jmlPotongan"
                        min="0"
                        value={jmlPotongan}
                        onChange={handleChange}
                        required
                        placeholder={t('enterPercentage')}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">%</span>
                    </div>
                  </div>
                )}

                {type === 'DIN' && (
                  <>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      {renderMoneyInput('from', t('from'), from, fromUSD, t('enterFrom'))}
                      {renderMoneyInput('until', t('until'), until, untilUSD, t('enterUntil'))}
                    </div>

                    {/* Porcentaje sobre el exceso */}
                    <div className="w-full mb-4">
                      <label className="mb-4 block text-black dark:text-white">
                        {t('percentageExcess')} <span className="text-meta-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="jmlPotongan"
                          name="jmlPotongan"
                          min="0"
                          value={jmlPotongan}
                          onChange={handleChange}
                          required
                          placeholder={t('enterPercentageExcess')}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">%</span>
                      </div>
                    </div>

                    {renderMoneyInput('valueD', t('fixedFee'), valueD, valueDUSD, t('enterFixedFee'))}

                    <div className="w-full mb-4">
                      <label className="mb-4 block text-black dark:text-white">
                        {t('paymentFrequency')} <span className="text-meta-1">*</span>
                      </label>
                      <select
                        name="paymentFrequency"
                        value={paymentFrequency}
                        onChange={handleChange}
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="1">{t('monthly')}</option>
                        <option value="2">{t('biweekly')}</option>
                        <option value="4">{t('weekly')}</option>
                      </select>
                    </div>

                    <div className="w-full mb-4">
                      <label className="mb-4 block text-black dark:text-white">
                        {t('deductionGroup')} <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="deductionGroup"
                        value={deductionGroup}
                        onChange={handleChange}
                        required
                        placeholder={t('enterDeductionGroup')}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col md:flex-row w-full gap-3 text-center">
                  <ButtonOne type="submit">
                    <span>{t('save')}</span>
                  </ButtonOne>
                  <Link to="/data-potongan">
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

export default FormEditDataPotongan;

 
