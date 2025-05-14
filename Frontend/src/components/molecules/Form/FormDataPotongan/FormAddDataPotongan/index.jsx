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
    type: 'STA',
    from: '',
    until: '',
    valueD: '',
    paymentFrequency: '1',
    deductionGroup: '',
  });

  const {
    potongan,
    jmlPotongan,
    type,
    from,
    until,
    valueD,
    paymentFrequency,
    deductionGroup,
  } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const { t } = useTranslation('dataPotonganAddForm');
  const getErrorMessage = useErrorMessage();

  const submitDataPotongan = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('potongan', potongan);
    payload.append('type', type);

    if (type === 'STA') {
      payload.append('jml_potongan', parseFloat(jmlPotongan) / 100);
    } else {
      payload.append('from', from);
      payload.append('until', until);
      payload.append('jml_potongan', parseFloat(jmlPotongan) / 100);
      payload.append('value_d', valueD);
      payload.append('payment_frequency', paymentFrequency);
      payload.append('deduction_group', deductionGroup);
    }

    dispatch(createDataPotongan(payload, navigate))
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
        const msg = error.response?.data?.msg || error.message || t('errorOccurred');
        Swal.fire({
          icon: 'error',
          title: t('error'),
          text: getErrorMessage(msg),
          confirmButtonText: 'Ok',
        });
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate('/login');
    if (user && user.hak_akses !== 'admin') navigate('/dashboard');
  }, [isError, user, navigate]);

  return (
    <Layout>
      <Breadcrumb pageName={t('formAddDeduction')} />

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {t('formAddDeduction')}
              </h3>
            </div>

            <form onSubmit={submitDataPotongan}>
              <div className="p-6.5">
                {/* Nombre de la deducción */}
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
                    required
                    placeholder={t('enterDeduction')}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                {/* Tipo de deducción */}
                <div className="w-full mb-4">
                  <label className="mb-4 block text-black dark:text-white">
                    {t('selectType')} <span className="text-meta-1">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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

                {/* Dinámico */}
                {type === 'DIN' && (
                  <>
                    {/* From & Until en misma fila en desktop */}
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
                          value={from}
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
                          value={until}
                          onChange={handleChange}
                          required
                          placeholder={t('enterUntil')}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
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

                    {/* Cuota fija */}
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
                        value={valueD}
                        onChange={handleChange}
                        required
                        placeholder={t('enterFixedFee')}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    {/* Frecuencia de pago */}
                    <div className="w-full mb-4">
                      <label className="mb-4 block text-black dark:text-white">
                        {t('paymentFrequency')} <span className="text-meta-1">*</span>
                      </label>
                      <select
                        id="paymentFrequency"
                        name="paymentFrequency"
                        value={paymentFrequency}
                        onChange={handleChange}
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="1">{t('monthly')}</option>
                        <option value="2">{t('biweekly')}</option>
                        <option value="4">{t('weekly')}</option>
                      </select>
                    </div>

                    {/* Grupo de deducción */}
                    <div className="w-full mb-4">
                      <label className="mb-4 block text-black dark:text-white">
                        {t('deductionGroup')} <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        id="deductionGroup"
                        name="deductionGroup"
                        value={deductionGroup}
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

export default FormAddDataPotongan;
