import express from 'express';

/* === import Middleware === */
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';

/* === import Controllers === */
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from '../controllers/DataPegawai.js'; 

import {
    getAllPositionHistories,
    getPositionHistoryById,
    createPositionHistory,
    updatePositionHistory,
    deletePositionHistory
  } from '../controllers/PositionHistoryController.js';
  
  import {
    getAllPensionInstitutions,
    getPensionInstitutionByCode,
    createPensionInstitution,
    updatePensionInstitution,
    deletePensionInstitution
  } from '../controllers/PensionInstitutionController.js';

import {
    getDataJabatan,
    createDataJabatan,
    updateDataJabatan,
    deleteDataJabatan,
    getDataJabatanByID
} from "../controllers/DataJabatan.js";

import {
    viewDataKehadiran,
    createDataKehadiran,
    updateDataKehadiran,
    deleteDataKehadiran,
    viewDataKehadiranByID,
    viewDataGajiByName,
    viewChartDataSalaryByGender,
    viewChartDataEmployeeStatus,
} from "../controllers/TransaksiController.js";

import {
    createDataPotonganGaji,
    deleteDataPotongan,
    viewDataPotonganByID,
    updateDataPotongan,
    viewDataPotongan
} from "../controllers/TransaksiController.js";

import {
    viewDataGajiPegawai,
    viewDataGajiPegawaiById,
    viewDataGajiPegawaiByMonth,
    viewDataGajiPegawaiByYear
} from "../controllers/TransaksiController.js";

import {
    viewLaporanAbsensiPegawaiByMonth,
    viewLaporanAbsensiPegawaiByYear,
    viewLaporanGajiPegawai,
    viewLaporanGajiPegawaiByMonth,
    viewLaporanGajiPegawaiByName,
    viewLaporanGajiPegawaiByYear,
    viewSlipGajiByMonth,
    viewSlipGajiByName,
    viewSlipGajiByYear,
} from "../controllers/LaporanController.js";

import { LogOut, changePassword } from '../controllers/Auth.js';
import {
    dashboardPegawai,
    viewDataGajiSinglePegawaiByMonth,
    viewDataGajiSinglePegawaiByYear
} from '../controllers/Pegawai.js';

const router = express.Router();

// Admin Route :

/* ==== Master Data ==== */
// Data Pegawai
/*router.get('/data_pegawai', verifyUser, adminOnly, getDataPegawai);
router.get('/data_pegawai/id/:id', verifyUser, adminOnly, getDataPegawaiByID);
router.get('/data_pegawai/nik/:nik', verifyUser, adminOnly, getDataPegawaiByNik);
router.get('/data_pegawai/name/:name', verifyUser, getDataPegawaiByName);
router.post('/data_pegawai', verifyUser, adminOnly, createDataPegawai);
router.patch('/data_pegawai/:id', verifyUser, adminOnly, updateDataPegawai);
router.delete('/data_pegawai/:id', verifyUser, adminOnly, deleteDataPegawai); */

// router.get('/data_pegawai', verifyUser, adminOnly, getDataPegawai);
// router.get('/data_pegawai/id/:id', verifyUser, adminOnly, getDataPegawaiByID);
// router.get('/data_pegawai/nik/:nik', verifyUser, adminOnly, getDataPegawaiByNik);
// router.get('/data_pegawai/name/:name', verifyUser, getDataPegawaiByName);
// router.post('/data_pegawai',verifyUser, adminOnly, createDataPegawai);
// router.patch('/data_pegawai/:id', verifyUser, adminOnly, updateDataPegawai);
// router.delete('/data_pegawai/:id', verifyUser, adminOnly, deleteDataPegawai);
router.get('/data_pegawai',          verifyUser, adminOnly, getAllEmployees);
router.get('/data_pegawai/:id',      verifyUser, adminOnly, getEmployeeById);
router.post('/data_pegawai',         verifyUser, adminOnly, createEmployee);
router.patch('/data_pegawai/:id',    verifyUser, adminOnly, updateEmployee);
router.delete('/data_pegawai/:id',   verifyUser, adminOnly, deleteEmployee);

// PositionHistory Routes
router.get('/position_history',      verifyUser, adminOnly, getAllPositionHistories);
router.get('/position_history/:id',  verifyUser, adminOnly, getPositionHistoryById);
router.post('/position_history',     verifyUser, adminOnly, createPositionHistory);
router.patch('/position_history/:id',verifyUser, adminOnly, updatePositionHistory);
router.delete('/position_history/:id',verifyUser, adminOnly, deletePositionHistory);

// PensionInstitution Routes
router.get('/pension_institutions',          verifyUser, adminOnly, getAllPensionInstitutions);
router.get('/pension_institutions/:code',    verifyUser, adminOnly, getPensionInstitutionByCode);
router.post('/pension_institutions',         verifyUser, adminOnly, createPensionInstitution);
router.patch('/pension_institutions/:code',  verifyUser, adminOnly, updatePensionInstitution);
router.delete('/pension_institutions/:code', verifyUser, adminOnly, deletePensionInstitution);


// Change Password
router.patch('/data_pegawai/:id/change_password', verifyUser, adminOnly, changePassword);
// Data Jabatan
router.get('/data_jabatan', verifyUser, adminOnly, getDataJabatan);
router.get('/data_jabatan/:id', verifyUser, adminOnly, getDataJabatanByID);
router.post('/data_jabatan', verifyUser, adminOnly, createDataJabatan);
router.patch('/data_jabatan/:id', verifyUser, adminOnly, updateDataJabatan);
router.delete('/data_jabatan/:id', verifyUser, adminOnly, deleteDataJabatan);

/* ==== Transaksi  ==== */
// Data Kehadiran
router.get('/data_kehadiran', verifyUser, adminOnly, viewDataKehadiran);
router.get('/data_kehadiran/:id', verifyUser, adminOnly, viewDataKehadiranByID);
router.post('/data_kehadiran', verifyUser, adminOnly, createDataKehadiran); //TODO doing
router.patch('/data_kehadiran/update/:id', verifyUser, adminOnly, updateDataKehadiran);
router.delete('/data_kehadiran/:id', verifyUser, adminOnly, deleteDataKehadiran);
// Data Potongan
router.get('/data_potongan', adminOnly, verifyUser, viewDataPotongan);
router.get('/data_potongan/:id', adminOnly, verifyUser, viewDataPotonganByID);
router.post('/data_potongan', adminOnly, verifyUser, createDataPotonganGaji);
router.patch('/data_potongan/update/:id', adminOnly, verifyUser, updateDataPotongan);
router.delete('/data_potongan/:id', adminOnly, verifyUser, deleteDataPotongan);
// Data Gaji
router.get('/data_gaji_pegawai', viewDataGajiPegawai);
router.get('/data_gaji_pegawai/:attendanceId', verifyUser, viewDataGajiPegawaiById);
//router.get('/data_gaji/name/:name', verifyUser, viewDataGajiByName);
// router.get('/data_gaji_pegawai/month/:month', viewDataGajiPegawaiByMonth);
// router.get('/data_gaji_pegawai/year/:year', viewDataGajiPegawaiByYear);

/* ====  Laporan  ==== */
// laporan Gaji Pegawai
router.get('/laporan/gaji', verifyUser, adminOnly, viewLaporanGajiPegawai);
router.get('/laporan/gaji/name/:name', verifyUser, adminOnly, viewLaporanGajiPegawaiByName);
router.get('/laporan/gaji/month/:month', verifyUser, adminOnly, viewLaporanGajiPegawaiByMonth);
router.get('/laporan/gaji/year/:year', verifyUser, adminOnly, viewLaporanGajiPegawaiByYear);
// Laporan Absensi Pegawai
router.get('/laporan/absensi/month/:month', verifyUser, adminOnly, viewLaporanAbsensiPegawaiByMonth);
router.get('/laporan/absensi/year/:year', verifyUser, adminOnly, viewLaporanAbsensiPegawaiByYear);
// Slip Gaji Pegawai
router.get('/laporan/slip_gaji/name/:name', verifyUser, adminOnly, viewSlipGajiByName);
router.get('/laporan/slip_gaji/month/:month', verifyUser, adminOnly, viewSlipGajiByMonth);
router.get('/laporan/slip_gaji/year/:year', verifyUser, adminOnly, viewSlipGajiByYear);

/* ==== Ubah Password ==== */
router.patch('/change_password', verifyUser, changePassword);

/* ==== Logout ==== */
router.delete('/logout', LogOut);

// Pegawai Route :
/* ==== Dashboard ==== */
router.get('/dashboard', verifyUser, dashboardPegawai);
/* ==== Data Gaji ==== */
router.get('/data_gaji/month/:month', verifyUser, viewDataGajiSinglePegawaiByMonth);
router.get('/data_gaji/year/:year', verifyUser, viewDataGajiSinglePegawaiByYear);
/* ==== Ubah Password ==== */
router.patch('/change_password', verifyUser, changePassword);
/* ==== Logout ==== */
router.delete('/logout', LogOut);

router.get("/chart-data/salary-by-gender", viewChartDataSalaryByGender);
router.get('/chart-data/employee-status', viewChartDataEmployeeStatus);

export default router;