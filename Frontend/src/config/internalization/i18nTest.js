import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['home', 'dataGajiDetail', 'chartsOne'],
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
          loading: "Loading data...",
          detailSalaryData: "Salary Detail",
          back: "Back",
          employeeInfo: "Employee Information",
          fullName: "Full Name",
          nik: "NIK",
          documentType: "Document Type",
          hireDate: "Hire Date",
          position: "Position",
          accessLevel: "Access Level",
          month: "Month",
          year: "Year",
          salaryBreakdownStepByStep: "Salary Breakdown Step by Step",
          step1_income: "Step 1: Income",
          description: "Description",
          amount: "Amount",
          baseSalary: "Base Salary",
          transportAllowance: "Transport Allowance",
          mealAllowance: "Meal Allowance",
          grossSalary: "Gross Salary",
          step2_standardDeductions: "Step 3: Standard Deductions (ISS/AFF)",
          deduction: "Deduction",
          subtotalInsurance: "Subtotal Insurance Deductions",
          step3_dynamicDeductions: "Step 4: Rent Deductions",
          range: "Range",
          subtotalRenta: "Subtotal Rent Deductions",
          step4_absencePenalty: "Step 2: Absence Penalty",
          step5_totalDeductions: "Step 5: Total Deductions",
          netSalary: "Net Salary",
          printSalarySlip: "Print Salary Slip"        
      },
      chartsOne: {
        dataMale: "Male Data",
        dataFemale: "Female Data",
        dateRange: "14.04.2023 - 14.05.2023",
        months: {
          jan: "Jan",
          feb: "Feb",
          mar: "Mar",
          apr: "Apr",
          may: "May",
          jun: "Jun",
          jul: "Jul",
          aug: "Aug",
          sep: "Sep",
          oct: "Oct",
          nov: "Nov",
          dec: "Dec"
        }
      },
      dataJabatanAddForm: {
        formAddJobTitle: "Job Title Data Form",
        jobTitle: "Job Title",
        basicSalary: "Basic Salary",
        transportAllowance: "Transport Allowance",
        mealAllowance: "Meal Allowance",
        enterJobTitle: "Enter job title",
        enterBasicSalary: "Enter basic salary",
        enterTransportAllowance: "Enter transport allowance",
        enterMealAllowance: "Enter meal allowance",
        save: "Save",
        back: "Back",
        success: "Successful",
        error: "Failed",
        requiredAndGreaterThanZero: "This field is required and must be greater than zero",
        invalidFormat: "Invalid format. Use only numbers with up to 2 decimal places",
        invalidMoneyFields: "Check monetary fields, only positive numeric values are allowed",
        allFieldsRequired: "All fields are required",
        errorOccurred: "An error occurred"
      },
      dataJabatanEditForm: {
          formEditJobTitle: "Edit Job Title Data Form",
          jobTitle: "Job Title",
          basicSalary: "Basic Salary",
          transportAllowance: "Transport Allowance",
          mealAllowance: "Meal Allowance",
          enterJobTitle: "Enter job title",
          enterBasicSalary: "Enter basic salary",
          enterTransportAllowance: "Enter transport allowance",
          enterMealAllowance: "Enter meal allowance",
          update: "Update",
          back: "Back",
          success: "Successful",
          error: "Failed",
          errorOccurred: "An error occurred",
          allFieldsRequired: "All fields are required",
          requiredAndGreaterThanZero: "This field is required and must be greater than zero",
          invalidFormat: "Invalid format. Use only numbers with up to 2 decimal places",
          invalidMoneyFields: "Check monetary fields. Only positive numeric values are allowed"
      }
    },
      es: {
        chartsOne: {
          dataMale: "Datos Masculinos",
          dataFemale: "Datos Femeninos",
          dateRange: "14.04.2023 - 14.05.2023",
          months: {
            jan: "Ene",
            feb: "Feb",
            mar: "Mar",
            apr: "Abr",
            may: "May",
            jun: "Jun",
            jul: "Jul",
            aug: "Ago",
            sep: "Sep",
            oct: "Oct",
            nov: "Nov",
            dec: "Dic"
          }
        }
    }
  },
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;