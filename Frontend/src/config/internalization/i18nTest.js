// src/i18nForTests.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['home', 'dataGajiDetail'],  // agregamos el namespace nuevo
  defaultNS: 'home',
  resources: {
    en: {
      home: {
        banner: {
          titleLine1: "Sistem Penggajian Karyawan Online",
          titleLine2: "PT. Humpuss Karbometil Selulosa",
          description: "Sebuah platform perusahaan untuk mengelola proses penggajian karyawan secara efisien dan terintegrasi melalui platform digital.",
          login: "Login"
        }
      },
      dataGajiDetail: {
        detailSalaryData: "Salary Detail Data",
        back: "Back",
        name: "Name",
        nik: "NIK",
        jabatan: "Position",
        month: "Month",
        year: "Year",
        description: "Description",
        amount: "Amount",
        salary: "Salary",
        transportAllowance: "Transport Allowance",
        mealAllowance: "Meal Allowance",
        deduction: "Deduction",
        totalSalary: "Total Salary",
        printSalarySlip: "Print Salary Slip"
      }
    }
  },
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;