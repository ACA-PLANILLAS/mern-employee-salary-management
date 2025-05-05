import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from '../../../../layout';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb, ButtonOne } from '../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TfiPrinter } from 'react-icons/tfi';
import Swal from 'sweetalert2';
import { BiSearch } from 'react-icons/bi';
import { fetchLaporanAbsensiByMonth, fetchLaporanAbsensiByYear, getMe } from '../../../../config/redux/action';
import { useTranslation } from 'react-i18next';

const LaporanAbsensi = () => {
    const { t } = useTranslation('laporanAbsensi');
    const [searchMonth, setSearchMonth] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isError, user } = useSelector((state) => state.auth);

    const handleSearchMonth = (event) => {
        setSearchMonth(event.target.value);
    };

    const handleSearchYear = (event) => {
        setSearchYear(event.target.value);
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        const selectedMonth = searchMonth;
        const selectedYear = searchYear;

        let yearDataFound = false;
        let monthDataFound = false;

        await Promise.all([
            dispatch(fetchLaporanAbsensiByYear(selectedYear, () => (yearDataFound = true))),
            dispatch(fetchLaporanAbsensiByMonth(selectedMonth, () => (monthDataFound = true))),
        ]);
        setShowMessage(true);

        if (yearDataFound && monthDataFound) {
            setShowMessage(false);
            navigate(`/laporan/absensi/print-page?month=${selectedMonth}&year=${selectedYear}`);
        } else {
            setShowMessage(false);
            Swal.fire({
                icon: 'error',
                title: t('laporanAbsensi.swalTitle'),
                text: t('laporanAbsensi.swalText'),
                timer: 2000,
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
            <Breadcrumb pageName={t('laporanAbsensi.pageTitle')} />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                {t('laporanAbsensi.filterTitle')}
                            </h3>
                        </div>
                        <form onSubmit={handleSearch}>
                            {showMessage && (
                                <p className="text-meta-1">{t('laporanAbsensi.notFoundMessage')}</p>
                            )}
                            <div className='p-6.5'>
                                <div className='mb-4.5 '>
                                    <div className='w-full mb-4'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('laporanAbsensi.labelMonth')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select
                                                className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                                value={searchMonth}
                                                onChange={handleSearchMonth}
                                                required
                                            >
                                                <option value=''>{t('laporanAbsensi.selectMonth')}</option>
                                                <option value='Januari'>{t('laporanAbsensi.january')}</option>
                                                <option value='Februari'>{t('laporanAbsensi.february')}</option>
                                                <option value='Maret'>{t('laporanAbsensi.march')}</option>
                                                <option value='April'>{t('laporanAbsensi.april')}</option>
                                                <option value='Mei'>{t('laporanAbsensi.may')}</option>
                                                <option value='Juni'>{t('laporanAbsensi.june')}</option>
                                                <option value='Juli'>{t('laporanAbsensi.july')}</option>
                                                <option value='Agustus'>{t('laporanAbsensi.august')}</option>
                                                <option value='September'>{t('laporanAbsensi.september')}</option>
                                                <option value='Oktober'>{t('laporanAbsensi.october')}</option>
                                                <option value='November'>{t('laporanAbsensi.november')}</option>
                                                <option value='Desember'>{t('laporanAbsensi.december')}</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>

                                    <div className='w-full mb-4'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('laporanAbsensi.labelYear')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <input
                                                type="number"
                                                placeholder={t('laporanAbsensi.placeholderYear')}
                                                value={searchYear}
                                                onChange={handleSearchYear}
                                                required
                                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            />
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <BiSearch />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <ButtonOne type='submit'>
                                        <span>{t('laporanAbsensi.printButton')}</span>
                                        <span>
                                            <TfiPrinter />
                                        </span>
                                    </ButtonOne>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default LaporanAbsensi;