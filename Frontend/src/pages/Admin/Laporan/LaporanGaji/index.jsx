import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from '../../../../layout';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb, ButtonOne } from '../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { TfiPrinter } from 'react-icons/tfi'
import Swal from 'sweetalert2';
import { getMe, fetchLaporanGajiByMonth, fetchLaporanGajiByYear } from '../../../../config/redux/action';
import { BiSearch } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LaporanGaji = () => {
    const { t } = useTranslation('laporanGaji');
    const [searchMonth, setSearchMonth] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const componentRef = useRef();

    const { isError, user } = useSelector((state) => state.auth);
    const { dataLaporanGaji } = useSelector((state) => state.laporanGaji);

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
            dispatch(fetchLaporanGajiByYear(selectedYear, () => (yearDataFound = true))),
            dispatch(fetchLaporanGajiByMonth(selectedMonth, () => (monthDataFound = true))),
        ]);
        setShowMessage(true);

        if (yearDataFound && monthDataFound) {
            setShowMessage(false);
            navigate(`/laporan/gaji/print-page?month=${selectedMonth}&year=${selectedYear}`);
        } else {
            setShowMessage(false);
            Swal.fire({
                icon: 'error',
                title: t('swalTitle'),
                text: t('swalText'),
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

    const handleExportExcel = async (event) => {
        event.preventDefault();

        try {
            if(searchMonth != ''){
            await dispatch(fetchLaporanGajiByMonth(searchMonth)),
            console.log('Datos del laporan gaji:', dataLaporanGaji);

            const worksheet = XLSX.utils.json_to_sheet(dataLaporanGaji);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        
            const excelBuffer = XLSX.write(workbook, {
              bookType: "xlsx",
              type: "array",
            });
        
            const blob = new Blob([excelBuffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
        
            saveAs(blob, "datos.xlsx");
        }else{
            Swal.fire({
                icon: 'error',
                title: t('swalTitle'),
                text: t('swalText'),
                timer: 2000,
            });
        }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: t('swalTitle'),
                text: t('swalText'),
                timer: 2000,
            });
        }
    };


    return (
        <Layout>
            <Breadcrumb pageName={t('pageTitle')} />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                {t('sectionTitle')}
                            </h3>
                        </div>
                        <form onSubmit={handleSearch}>
                            {showMessage && (
                                <p className="text-meta-1">{t('notFoundMessage')}</p>
                            )}
                            <div className='p-6.5'>
                                <div className='mb-4.5 '>
                                    <div className='w-full mb-4'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('labelMonth')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <select
                                                className='relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                                value={searchMonth}
                                                onChange={handleSearchMonth}
                                                required
                                            >
                                                <option value=''>{t('selectMonth')}</option>
                                                <option value='Januari'>{t('months.january')}</option>
                                                <option value='Februari'>{t('months.february')}</option>
                                                <option value='Maret'>{t('months.march')}</option>
                                                <option value='April'>{t('months.april')}</option>
                                                <option value='Mei'>{t('months.may')}</option>
                                                <option value='Juni'>{t('months.june')}</option>
                                                <option value='Juli'>{t('months.july')}</option>
                                                <option value='Agustus'>{t('months.august')}</option>
                                                <option value='September'>{t('months.september')}</option>
                                                <option value='Oktober'>{t('months.october')}</option>
                                                <option value='November'>{t('months.november')}</option>
                                                <option value='Desember'>{t('months.december')}</option>
                                            </select>
                                            <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl'>
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>

                                    <div className='w-full mb-4'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            {t('labelYear')} <span className='text-meta-1'>*</span>
                                        </label>
                                        <div className='relative z-20 bg-transparent dark:bg-form-input'>
                                            <input
                                                type="number"
                                                placeholder={t('placeholderYear')}
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
                                        <span>{t('printButton')}</span>
                                        <span>
                                            <TfiPrinter />
                                        </span>
                                    </ButtonOne>
                                    <ButtonOne type="button" onClick={handleExportExcel}>
                                        <span>{t('printButtonExcel')}</span>
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
};

export default LaporanGaji;