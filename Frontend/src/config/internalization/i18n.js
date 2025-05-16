import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// COMMON
import commonEN from '../../assets/locales/en/common.json'
import commonES from '../../assets/locales/es/common.json'
import commonId from '../../assets/locales/id/common.json'

// HOME
import homeId from '../../assets/locales/id/home.json';
import homeEn from '../../assets/locales/en/home.json';
import homeEs from '../../assets/locales/es/home.json';

// LOGIN
import loginId from '../../assets/locales/id/login.json';
import loginEn from '../../assets/locales/en/login.json';
import loginEs from '../../assets/locales/es/login.json';

// DASHBOARD
import dashboardId from '../../assets/locales/id/dashboard.json';
import dashboardEn from '../../assets/locales/en/dashboard.json';
import dashboardEs from '../../assets/locales/es/dashboard.json';

// DATA FILES
import dataGajiId from '../../assets/locales/id/dataGaji.json';
import dataGajiEn from '../../assets/locales/en/dataGaji.json';
import dataGajiEs from '../../assets/locales/es/dataGaji.json';

import dataGajiAddFormId from '../../assets/locales/id/dataGajiAddForm.json';
import dataGajiAddFormEn from '../../assets/locales/en/dataGajiAddForm.json';
import dataGajiAddFormEs from '../../assets/locales/es/dataGajiAddForm.json';

import dataGajiDetailId from '../../assets/locales/id/dataGajiDetail.json';
import dataGajiDetailEn from '../../assets/locales/en/dataGajiDetail.json';
import dataGajiDetailEs from '../../assets/locales/es/dataGajiDetail.json';

import dataGajiEditFormId from '../../assets/locales/id/dataGajiEditForm.json';
import dataGajiEditFormEn from '../../assets/locales/en/dataGajiEditForm.json';
import dataGajiEditFormEs from '../../assets/locales/es/dataGajiEditForm.json';

import dataGajiPegawaiId from '../../assets/locales/id/dataGajiPegawai.json';
import dataGajiPegawaiEn from '../../assets/locales/en/dataGajiPegawai.json';
import dataGajiPegawaiEs from '../../assets/locales/es/dataGajiPegawai.json';

import dataJabatanId from '../../assets/locales/id/dataJabatan.json';
import dataJabatanEn from '../../assets/locales/en/dataJabatan.json';
import dataJabatanEs from '../../assets/locales/es/dataJabatan.json';

import dataJabatanAddFormId from '../../assets/locales/id/dataJabatanAddForm.json';
import dataJabatanAddFormEn from '../../assets/locales/en/dataJabatanAddForm.json';
import dataJabatanAddFormEs from '../../assets/locales/es/dataJabatanAddForm.json';

import dataJabatanEditFormId from '../../assets/locales/id/dataJabatanEditForm.json';
import dataJabatanEditFormEn from '../../assets/locales/en/dataJabatanEditForm.json';
import dataJabatanEditFormEs from '../../assets/locales/es/dataJabatanEditForm.json';

import dataKehadiranId from '../../assets/locales/id/dataKehadiran.json';
import dataKehadiranEn from '../../assets/locales/en/dataKehadiran.json';
import dataKehadiranEs from '../../assets/locales/es/dataKehadiran.json';

import dataKehadiranAddFormId from '../../assets/locales/id/dataKehadiranAddForm.json';
import dataKehadiranAddFormEn from '../../assets/locales/en/dataKehadiranAddForm.json';
import dataKehadiranAddFormEs from '../../assets/locales/es/dataKehadiranAddForm.json';

import dataKehadiranEditFormId from '../../assets/locales/id/dataKehadiranEditForm.json';
import dataKehadiranEditFormEn from '../../assets/locales/en/dataKehadiranEditForm.json';
import dataKehadiranEditFormEs from '../../assets/locales/es/dataKehadiranEditForm.json';

import dataPegawaiId from '../../assets/locales/id/dataPegawai.json';
import dataPegawaiEn from '../../assets/locales/en/dataPegawai.json';
import dataPegawaiEs from '../../assets/locales/es/dataPegawai.json';

import dataPotonganId from '../../assets/locales/id/dataPotongan.json';
import dataPotonganEn from '../../assets/locales/en/dataPotongan.json';
import dataPotonganEs from '../../assets/locales/es/dataPotongan.json';

import dataPotonganAddFormId from '../../assets/locales/id/dataPotonganAddForm.json';
import dataPotonganAddFormEn from '../../assets/locales/en/dataPotonganAddForm.json';
import dataPotonganAddFormEs from '../../assets/locales/es/dataPotonganAddForm.json';

import dataPotonganEditFormId from '../../assets/locales/id/dataPotonganEditForm.json';
import dataPotonganEditFormEn from '../../assets/locales/en/dataPotonganEditForm.json';
import dataPotonganEditFormEs from '../../assets/locales/es/dataPotonganEditForm.json';

// REPORTS
import laporanAbsensiId from '../../assets/locales/id/laporanAbsensi.json';
import laporanAbsensiEn from '../../assets/locales/en/laporanAbsensi.json';
import laporanAbsensiEs from '../../assets/locales/es/laporanAbsensi.json';

import laporanGajiId from '../../assets/locales/id/laporanGaji.json';
import laporanGajiEn from '../../assets/locales/en/laporanGaji.json';
import laporanGajiEs from '../../assets/locales/es/laporanGaji.json';

// PRINT PDF
import printPdfDataGajiPegawaiId from '../../assets/locales/id/printPdfDataGajiPegawai.json';
import printPdfDataGajiPegawaiEn from '../../assets/locales/en/printPdfDataGajiPegawai.json';
import printPdfDataGajiPegawaiEs from '../../assets/locales/es/printPdfDataGajiPegawai.json';

import printPdfLaporanAbsensiId from '../../assets/locales/id/printPdfLaporanAbsensi.json';
import printPdfLaporanAbsensiEn from '../../assets/locales/en/printPdfLaporanAbsensi.json';
import printPdfLaporanAbsensiEs from '../../assets/locales/es/printPdfLaporanAbsensi.json';

import printPdfLaporanGajiId from '../../assets/locales/id/printPdfLaporanGaji.json';
import printPdfLaporanGajiEn from '../../assets/locales/en/printPdfLaporanGaji.json';
import printPdfLaporanGajiEs from '../../assets/locales/es/printPdfLaporanGaji.json';

import printPdfSlipGajiId from '../../assets/locales/id/printPdfSlipGaji.json';
import printPdfSlipGajiEn from '../../assets/locales/en/printPdfSlipGaji.json';
import printPdfSlipGajiEs from '../../assets/locales/es/printPdfSlipGaji.json';

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

// NOT FOUND
import notFoundId from '../../assets/locales/id/notFound.json';
import notFoundEn from '../../assets/locales/en/notFound.json';
import notFoundEs from '../../assets/locales/es/notFound.json';

// DATABASE MESSAGES
import databaseMessagesId from '../../assets/locales/id/databaseMessages.json';
import databaseMessagesEn from '../../assets/locales/en/databaseMessages.json';
import databaseMessagesEs from '../../assets/locales/es/databaseMessages.json';

// CATALOGS
import catalogsId from '../../assets/locales/id/catalogs.json';
import catalogsEn from '../../assets/locales/en/catalogs.json';
import catalogsEs from '../../assets/locales/es/catalogs.json';

// Print
import printId from '../../assets/locales/id/print.json';
import printEn from '../../assets/locales/en/print.json';
import printEs from '../../assets/locales/es/print.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        common: commonId, home: homeId, login: loginId, dashboard: dashboardId,
        dataGaji: dataGajiId, dataGajiAddForm: dataGajiAddFormId, dataGajiDetail: dataGajiDetailId, dataGajiEditForm: dataGajiEditFormId, dataGajiPegawai: dataGajiPegawaiId,
        dataJabatan: dataJabatanId, dataJabatanAddForm: dataJabatanAddFormId, dataJabatanEditForm: dataJabatanEditFormId,
        dataKehadiran: dataKehadiranId, dataKehadiranAddForm: dataKehadiranAddFormId, dataKehadiranEditForm: dataKehadiranEditFormId,
        dataPegawai: dataPegawaiId, dataPotongan: dataPotonganId, dataPotonganAddForm: dataPotonganAddFormId, dataPotonganEditForm: dataPotonganEditFormId,
        laporanAbsensi: laporanAbsensiId, laporanGaji: laporanGajiId,
        printPdfDataGajiPegawai: printPdfDataGajiPegawaiId, printPdfLaporanAbsensi: printPdfLaporanAbsensiId, printPdfLaporanGaji: printPdfLaporanGajiId, printPdfSlipGaji: printPdfSlipGajiId,
        slipGaji: slipGajiId, ubahPasswordAdmin: ubahPasswordAdminId, ubahPasswordPegawai: ubahPasswordPegawaiId,
        notFound: notFoundId, databaseMessages: databaseMessagesId, catalogs: catalogsId,
        print: printId,
      },
      en: {
        common: commonEN, home: homeEn, login: loginEn, dashboard: dashboardEn,
        dataGaji: dataGajiEn, dataGajiAddForm: dataGajiAddFormEn, dataGajiDetail: dataGajiDetailEn, dataGajiEditForm: dataGajiEditFormEn, dataGajiPegawai: dataGajiPegawaiEn,
        dataJabatan: dataJabatanEn, dataJabatanAddForm: dataJabatanAddFormEn, dataJabatanEditForm: dataJabatanEditFormEn,
        dataKehadiran: dataKehadiranEn, dataKehadiranAddForm: dataKehadiranAddFormEn, dataKehadiranEditForm: dataKehadiranEditFormEn,
        dataPegawai: dataPegawaiEn, dataPotongan: dataPotonganEn, dataPotonganAddForm: dataPotonganAddFormEn, dataPotonganEditForm: dataPotonganEditFormEn,
        laporanAbsensi: laporanAbsensiEn, laporanGaji: laporanGajiEn,
        printPdfDataGajiPegawai: printPdfDataGajiPegawaiEn, printPdfLaporanAbsensi: printPdfLaporanAbsensiEn, printPdfLaporanGaji: printPdfLaporanGajiEn, printPdfSlipGaji: printPdfSlipGajiEn,
        slipGaji: slipGajiEn, ubahPasswordAdmin: ubahPasswordAdminEn, ubahPasswordPegawai: ubahPasswordPegawaiEn,
        notFound: notFoundEn, databaseMessages: databaseMessagesEn, catalogs: catalogsEn,
        print: printEn,
      },
      es: {
        common: commonES, home: homeEs, login: loginEs, dashboard: dashboardEs,
        dataGaji: dataGajiEs, dataGajiAddForm: dataGajiAddFormEs, dataGajiDetail: dataGajiDetailEs, dataGajiEditForm: dataGajiEditFormEs, dataGajiPegawai: dataGajiPegawaiEs,
        dataJabatan: dataJabatanEs, dataJabatanAddForm: dataJabatanAddFormEs, dataJabatanEditForm: dataJabatanEditFormEs,
        dataKehadiran: dataKehadiranEs, dataKehadiranAddForm: dataKehadiranAddFormEs, dataKehadiranEditForm: dataKehadiranEditFormEs,
        dataPegawai: dataPegawaiEs, dataPotongan: dataPotonganEs, dataPotonganAddForm: dataPotonganAddFormEs, dataPotonganEditForm: dataPotonganEditFormEs,
        laporanAbsensi: laporanAbsensiEs, laporanGaji: laporanGajiEs,
        printPdfDataGajiPegawai: printPdfDataGajiPegawaiEs, printPdfLaporanAbsensi: printPdfLaporanAbsensiEs, printPdfLaporanGaji: printPdfLaporanGajiEs, printPdfSlipGaji: printPdfSlipGajiEs,
        slipGaji: slipGajiEs, ubahPasswordAdmin: ubahPasswordAdminEs, ubahPasswordPegawai: ubahPasswordPegawaiEs,
        notFound: notFoundEs, databaseMessages: databaseMessagesEs, catalogs: catalogsEs,
        print: printEs,
      }
    },
    ns: [
      'common', 'home', 'login', 'dashboard', 'dataGaji', 'dataGajiAddForm', 'dataGajiDetail', 'dataGajiEditForm', 'dataGajiPegawai',
      'dataJabatan', 'dataJabatanAddForm', 'dataJabatanEditForm', 'dataKehadiran', 'dataKehadiranAddForm', 'dataKehadiranEditForm',
      'dataPegawai', 'dataPotongan', 'dataPotonganAddForm', 'dataPotonganEditForm', 'laporanAbsensi', 'laporanGaji',
      'printPdfDataGajiPegawai', 'printPdfLaporanAbsensi', 'printPdfLaporanGaji', 'printPdfSlipGaji',
      'slipGaji', 'ubahPasswordAdmin', 'ubahPasswordPegawai', 'notFound', 'databaseMessages', 'catalogs', 'print'
    ],
    defaultNS: 'common',
    fallbackLng: 'en',
    debug: true,

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'appLang',
    },

    interpolation: { escapeValue: false },
  })

export default i18n
