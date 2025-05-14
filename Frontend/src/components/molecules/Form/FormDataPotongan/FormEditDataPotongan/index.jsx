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
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation('dataPotonganAddForm');
  const getErrorMessage = useErrorMessage();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    if (isError) navigate('/login');
    if (user && user.hak_akses !== 'admin') navigate('/dashboard');
  }, [isError, user, navigate]);

  const updateDataPotongan = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('potongan', formData.potongan);
      payload.append('type', formData.type);

      if (formData.type === 'STA') {
        payload.append('jml_potongan', String(parseFloat(formData.jmlPotongan) / 100));
      } else {
        payload.append('from', formData.from);
        payload.append('until', formData.until);
        payload.append('jml_potongan', String(parseFloat(formData.jmlPotongan) / 100));
        payload.append('value_d', formData.valueD);
        payload.append('payment_frequency', formData.paymentFrequency);
        payload.append('deduction_group', formData.deductionGroup);
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
                {/* Deduction Name */}
                <div className="w-full mb-4">
                  <label className="mb-4 block text-black dark:text-white">
                    {t('deduction')} <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="potongan"
                    name="potongan"
                    value={formData.potongan}
                    onChange={handleChange}
                    required
                    placeholder={t('enterDeduction')}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                {/* Type */}
                <div className="w-full mb-4">
                  <label className="mb-4 block text-black dark:text-white">
                    {t('selectType')} <span className="text-meta-1">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="STA">{t('standard')}</option>
                    <option value="DIN">{t('dynamic')}</option>
                  </select>
                </div>

                {/* STA */}
                {formData.type === 'STA' && (
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
                        value={formData.jmlPotongan}
                        onChange={handleChange}
                        required
                        placeholder={t('enterPercentage')}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">%</span>
                    </div>
                  </div>
                )}

                {/* DIN */}
                {formData.type === 'DIN' && (
                  <>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-full md:w-1/2">
                        <label className="mb-4 block text-black dark:text-white">
                          {t('from')} <span className="text-meta-1">*</span>
                        </label>
                        <input
                          type="number"
                          id="from"
                          name="from"
                          min="0"
                          step="0.01"
                          value={formData.from}
                          onChange={handleChange}
                          required
                          placeholder={t('enterFrom')}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <label className="mb-4 block text-black dark:text-white">
                          {t('until')} <span className="text-meta-1">*</span>
                        </label>
                        <input
                          type="number"
                          id="until"
                          name="until"
                          min="0"
                          step="0.01"
                          value={formData.until}
                          onChange={handleChange}
                          required
                          placeholder={t('enterUntil')}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>

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
                          value={formData.jmlPotongan}
                          onChange={handleChange}
                          required
                          placeholder={t('enterPercentageExcess')}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">%</span>
                      </div>
                    </div>

                    <div className="w-full mb-4">
                      <label className="mb-4 block text-black dark:text-white">
                        {t('fixedFee')} <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="number"
                        id="valueD"
                        name="valueD"
                        min="0"
                        step="0.01"
                        value={formData.valueD}
                        onChange={handleChange}
                        required
                        placeholder={t('enterFixedFee')}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full mb-4">
                      <label className="mb-4 block text-black dark:text-white">
                        {t('paymentFrequency')} <span className="text-meta-1">*</span>
                      </label>
                      <select
                        id="paymentFrequency"
                        name="paymentFrequency"
                        value={formData.paymentFrequency}
                        onChange={handleChange}
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                        id="deductionGroup"
                        name="deductionGroup"
                        value={formData.deductionGroup}
                        onChange={handleChange}
                        required
                        placeholder={t('enterDeductionGroup')}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col md:flex-row w-full gap-3 text-center">
                  <ButtonOne type="submit">
                    <span>{t('update')}</span>
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
