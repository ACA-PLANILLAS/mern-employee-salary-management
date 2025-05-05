import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEN from '../../assets/locales/en/common.json'
import commonES from '../../assets/locales/es/common.json'
import commonId from '../../assets/locales/id/common.json'

import homeId from '../../assets/locales/id/home.json';
import homeEn from '../../assets/locales/en/home.json';
import homeEs from '../../assets/locales/es/home.json';

import loginId from '../../assets/locales/id/login.json';
import loginEn from '../../assets/locales/en/login.json';
import loginEs from '../../assets/locales/es/login.json';

import dashboardId from '../../assets/locales/id/dashboard.json';
import dashboardEn from '../../assets/locales/en/dashboard.json';
import dashboardEs from '../../assets/locales/es/dashboard.json';


// DATA FILES
import dataGajiId from '../../assets/locales/id/dataGaji.json';
import dataGajiEn from '../../assets/locales/en/dataGaji.json';
import dataGajiEs from '../../assets/locales/es/dataGaji.json';

import dataGajiPegawaiId from '../../assets/locales/id/dataGajiPegawai.json';
import dataGajiPegawaiEn from '../../assets/locales/en/dataGajiPegawai.json';
import dataGajiPegawaiEs from '../../assets/locales/es/dataGajiPegawai.json';

import dataJabatanId from '../../assets/locales/id/dataJabatan.json';
import dataJabatanEn from '../../assets/locales/en/dataJabatan.json';
import dataJabatanEs from '../../assets/locales/es/dataJabatan.json';

import dataKehadiranId from '../../assets/locales/id/dataKehadiran.json';
import dataKehadiranEn from '../../assets/locales/en/dataKehadiran.json';
import dataKehadiranEs from '../../assets/locales/es/dataKehadiran.json';

import dataPegawaiId from '../../assets/locales/id/dataPegawai.json';
import dataPegawaiEn from '../../assets/locales/en/dataPegawai.json';
import dataPegawaiEs from '../../assets/locales/es/dataPegawai.json';

import dataPotonganId from '../../assets/locales/id/dataPotongan.json';
import dataPotonganEn from '../../assets/locales/en/dataPotongan.json';
import dataPotonganEs from '../../assets/locales/es/dataPotongan.json';

// REPORTS
import laporanAbsensiId from '../../assets/locales/id/laporanAbsensi.json';
import laporanAbsensiEn from '../../assets/locales/en/laporanAbsensi.json';
import laporanAbsensiEs from '../../assets/locales/es/laporanAbsensi.json';

import laporanGajiId from '../../assets/locales/id/laporanGaji.json';
import laporanGajiEn from '../../assets/locales/en/laporanGaji.json';
import laporanGajiEs from '../../assets/locales/es/laporanGaji.json';

// SLIP
import slipGajiId from '../../assets/locales/id/slipGaji.json';
import slipGajiEn from '../../assets/locales/en/slipGaji.json';
import slipGajiEs from '../../assets/locales/es/slipGaji.json';

// PASSWORD
import ubahPasswordAdminId from '../../assets/locales/id/ubahPasswordAdmin.json';
import ubahPasswordAdminEn from '../../assets/locales/en/ubahPasswordAdmin.json';
import ubahPasswordAdminEs from '../../assets/locales/es/ubahPasswordAdmin.json';

import ubahPasswordPegawaiId from '../../assets/locales/id/ubahPasswordPegawai.json';
import ubahPasswordPegawaiEn from '../../assets/locales/en/ubahPasswordPegawai.json';
import ubahPasswordPegawaiEs from '../../assets/locales/es/ubahPasswordPegawai.json';


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        common: commonId,
        home: homeId,
        login: loginId,
        dashboard: dashboardId,
        dataGaji: dataGajiId,
        dataGajiPegawai: dataGajiPegawaiId,
        dataJabatan: dataJabatanId,
        dataKehadiran: dataKehadiranId,
        dataPegawai: dataPegawaiId,
        dataPotongan: dataPotonganId,
        laporanAbsensi: laporanAbsensiId,
        laporanGaji: laporanGajiId,
        slipGaji: slipGajiId,
        ubahPasswordAdmin: ubahPasswordAdminId,
        ubahPasswordPegawai: ubahPasswordPegawaiId,
      },
      en: {
        common: commonEN,
        home: homeEn,
        login: loginEn,
        dashboard: dashboardEn,
        dataGaji: dataGajiEn,
        dataGajiPegawai: dataGajiPegawaiEn,
        dataJabatan: dataJabatanEn,
        dataKehadiran: dataKehadiranEn,
        dataPegawai: dataPegawaiEn,
        dataPotongan: dataPotonganEn,
        laporanAbsensi: laporanAbsensiEn,
        laporanGaji: laporanGajiEn,
        slipGaji: slipGajiEn,
        ubahPasswordAdmin: ubahPasswordAdminEn,
        ubahPasswordPegawai: ubahPasswordPegawaiEn,
      },
      es: {
        common: commonES,
        home: homeEs,
        login: loginEs,
        dashboard: dashboardEs,
        dataGaji: dataGajiEs,
        dataGajiPegawai: dataGajiPegawaiEs,
        dataJabatan: dataJabatanEs,
        dataKehadiran: dataKehadiranEs,
        dataPegawai: dataPegawaiEs,
        dataPotongan: dataPotonganEs,
        laporanAbsensi: laporanAbsensiEs,
        laporanGaji: laporanGajiEs,
        slipGaji: slipGajiEs,
        ubahPasswordAdmin: ubahPasswordAdminEs,
        ubahPasswordPegawai: ubahPasswordPegawaiEs,
      }
    },
    ns: [ // namespace disponibles
      'common', 'home', 'login', 'dashboard', 'dataGaji', 'dataGajiPegawai',
      'dataJabatan', 'dataKehadiran', 'dataPegawai', 'dataPotongan',
      'laporanAbsensi', 'laporanGaji', 'slipGaji', 'ubahPasswordAdmin', 'ubahPasswordPegawai'
    ],
    defaultNS: 'common',
    fallbackLng: 'en',
    debug: true,

    detection: {
      order: ['localStorage','navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'appLang',
    },

    interpolation: { escapeValue: false },
  })

export default i18n
