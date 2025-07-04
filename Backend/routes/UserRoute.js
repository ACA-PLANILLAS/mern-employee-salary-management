
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nik:
 *           type: string
 *         dui_or_nit:
 *           type: string
 *         document_type:
 *           type: string
 *         isss_affiliation_number:
 *           type: string
 *         pension_institution_code:
 *           type: string
 *         first_name:
 *           type: string
 *         middle_name:
 *           type: string
 *         last_name:
 *           type: string
 *         second_last_name:
 *           type: string
 *         maiden_name:
 *           type: string
 *         jenis_kelamin:
 *           type: string
 *         hire_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         monthly_salary:
 *           type: number
 *         username:
 *           type: string
 *         photo:
 *           type: string
 *         hak_akses:
 *           type: string
 *         pensionInstitution:
 *           $ref: '#/components/schemas/PensionInstitution'
 *         positionHistory:
 *           $ref: '#/components/schemas/PositionHistory'
 *     
 *     PositionHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         employee_id:
 *           type: integer
 *         position_id:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         position:
 *           $ref: '#/components/schemas/JobPosition'
 *     
 *     JobPosition:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nama_jabatan:
 *           type: string
 *         gaji_pokok:
 *           type: number
 *         tj_transport:
 *           type: number
 *         uang_makan:
 *           type: number
 *     
 *     PensionInstitution:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         institution_type:
 *           type: string
 *     
 *     Attendance:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         bulan:
 *           type: string
 *         tahun:
 *           type: integer
 *         nik:
 *           type: integer
 *         nama_pegawai:
 *           type: string
 *         jenis_kelamin:
 *           type: string
 *         nama_jabatan:
 *           type: string
 *         hadir:
 *           type: integer
 *         sakit:
 *           type: integer
 *         alpha:
 *           type: integer
 *         worked_hours:
 *           type: number
 *         additional_payments:
 *           type: number
 *         vacation_days:
 *           type: integer
 *         vacation_payments:
 *           type: number
 *     
 *     Deduction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         potongan:
 *           type: string
 *         jml_potongan:
 *           type: string
 *         from:
 *           type: string
 *         until:
 *           type: string
 *         value_d:
 *           type: number
 *         type:
 *           type: string
 *         payment_frequency:
 *           type: string
 *         deduction_group:
 *           type: string
 *     
 *     Salary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         bulan:
 *           type: string
 *         tahun:
 *           type: integer
 *         nama_pegawai:
 *           type: string
 *         jabatan_pegawai:
 *           type: string
 *         gaji_pokok:
 *           type: number
 *         tj_transport:
 *           type: number
 *         uang_makan:
 *           type: number
 *         potongan:
 *           type: number
 *         total:
 *           type: number
 *     
 *     CreateEmployeeRequest:
 *       type: object
 *       required:
 *         - nik
 *         - first_name
 *         - last_name
 *         - username
 *         - password
 *         - confPassword
 *         - position_id
 *       properties:
 *         nik:
 *           type: string
 *         dui_or_nit:
 *           type: string
 *         document_type:
 *           type: string
 *         isss_affiliation_number:
 *           type: string
 *         pension_institution_code:
 *           type: string
 *         first_name:
 *           type: string
 *         middle_name:
 *           type: string
 *         last_name:
 *           type: string
 *         second_last_name:
 *           type: string
 *         maiden_name:
 *           type: string
 *         jenis_kelamin:
 *           type: string
 *         hire_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         monthly_salary:
 *           type: number
 *         has_active_loan:
 *           type: boolean
 *         loan_original_amount:
 *           type: number
 *         loan_outstanding_balance:
 *           type: number
 *         loan_monthly_installment:
 *           type: number
 *         loan_start_date:
 *           type: string
 *           format: date
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         confPassword:
 *           type: string
 *         hak_akses:
 *           type: string
 *         position_id:
 *           type: integer
 *         photo:
 *           type: string
 *           format: binary
 *     
 *     CreateAttendanceRequest:
 *       type: object
 *       required:
 *         - nik
 *         - nama_pegawai
 *         - nama_jabatan
 *         - jenis_kelamin
 *         - hadir
 *         - sakit
 *         - alpha
 *       properties:
 *         nik:
 *           type: integer
 *         nama_pegawai:
 *           type: string
 *         nama_jabatan:
 *           type: string
 *         jenis_kelamin:
 *           type: string
 *         hadir:
 *           type: integer
 *         sakit:
 *           type: integer
 *         alpha:
 *           type: integer
 *         worked_hours:
 *           type: number
 *         additional_payments:
 *           type: number
 *         vacation_days:
 *           type: integer
 *         vacation_payments:
 *           type: number
 *         comment_01:
 *           type: string
 *         comment_02:
 *           type: string
 *     
 *     CreateDeductionRequest:
 *       type: object
 *       required:
 *         - potongan
 *         - jml_potongan
 *       properties:
 *         id:
 *           type: integer
 *         potongan:
 *           type: string
 *         jml_potongan:
 *           type: number
 *         from:
 *           type: string
 *         until:
 *           type: string
 *         value_d:
 *           type: number
 *         type:
 *           type: string
 *         payment_frequency:
 *           type: string
 *         deduction_group:
 *           type: string
 *     
 *     CreateJobPositionRequest:
 *       type: object
 *       required:
 *         - nama_jabatan
 *         - gaji_pokok
 *       properties:
 *         nama_jabatan:
 *           type: string
 *         gaji_pokok:
 *           type: number
 *         tj_transport:
 *           type: number
 *         uang_makan:
 *           type: number
 *     
 *     CreatePensionInstitutionRequest:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - institution_type
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         institution_type:
 *           type: string
 *     
 *     CreatePositionHistoryRequest:
 *       type: object
 *       required:
 *         - employee_id
 *         - position_id
 *         - start_date
 *       properties:
 *         employee_id:
 *           type: integer
 *         position_id:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *     
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - password
 *         - confPassword
 *       properties:
 *         password:
 *           type: string
 *         confPassword:
 *           type: string
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *         error:
 *           type: string
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         msg:
 *           type: string
 *     
 *     ChartData:
 *       type: object
 *       properties:
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *         datasets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               data:
 *                 type: array
 *                 items:
 *                   type: number
 *               backgroundColor:
 *                 type: array
 *                 items:
 *                   type: string
 */

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

/**
 * @swagger
 * /data_pegawai:
 *   get:
 *     summary: Obtener todos los empleados
 *     tags: [Empleados]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_pegawai',          verifyUser, adminOnly, getAllEmployees);

/**
 * @swagger
 * /data_pegawai/{id}:
 *   get:
 *     summary: Obtener empleado por ID
 *     tags: [Empleados]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_pegawai/:id',      verifyUser, adminOnly, getEmployeeById);

/**
 * @swagger
 * /data_pegawai:
 *   post:
 *     summary: Crear nuevo empleado
 *     tags: [Empleados]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *     responses:
 *       201:
 *         description: Empleado creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Error en la imagen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/data_pegawai',         verifyUser, adminOnly, createEmployee);

/**
 * @swagger
 * /data_pegawai/{id}:
 *   patch:
 *     summary: Actualizar empleado
 *     tags: [Empleados]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/data_pegawai/:id',    verifyUser, adminOnly, updateEmployee);

/**
 * @swagger
 * /data_pegawai/{id}:
 *   delete:
 *     summary: Eliminar empleado
 *     tags: [Empleados]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/data_pegawai/:id',   verifyUser, adminOnly, deleteEmployee);

// PositionHistory Routes

/**
 * @swagger
 * /position_history:
 *   get:
 *     summary: Obtener todo el historial de posiciones
 *     tags: [Historial de Posiciones]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Historial de posiciones obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PositionHistory'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/position_history',      verifyUser, adminOnly, getAllPositionHistories);

/**
 * @swagger
 * /position_history/{id}:
 *   get:
 *     summary: Obtener historial de posición por ID
 *     tags: [Historial de Posiciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Historial encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PositionHistory'
 *       404:
 *         description: Historial no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/position_history/:id',  verifyUser, adminOnly, getPositionHistoryById);

/**
 * @swagger
 * /position_history:
 *   post:
 *     summary: Crear nuevo historial de posición
 *     tags: [Historial de Posiciones]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePositionHistoryRequest'
 *     responses:
 *       201:
 *         description: Historial creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PositionHistory'
 *       400:
 *         description: Datos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/position_history',     verifyUser, adminOnly, createPositionHistory);

/**
 * @swagger
 * /position_history/{id}:
 *   patch:
 *     summary: Actualizar historial de posición
 *     tags: [Historial de Posiciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del historial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePositionHistoryRequest'
 *     responses:
 *       200:
 *         description: Historial actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PositionHistory'
 *       404:
 *         description: Historial no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/position_history/:id',verifyUser, adminOnly, updatePositionHistory);

/**
 * @swagger
 * /position_history/{id}:
 *   delete:
 *     summary: Eliminar historial de posición
 *     tags: [Historial de Posiciones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Historial eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Historial no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/position_history/:id',verifyUser, adminOnly, deletePositionHistory);

// PensionInstitution Routes

/**
 * @swagger
 * /pension_institutions:
 *   get:
 *     summary: Obtener todas las instituciones de pensiones
 *     tags: [Instituciones de Pensiones]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de instituciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PensionInstitution'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/pension_institutions',          verifyUser, adminOnly, getAllPensionInstitutions);

/**
 * @swagger
 * /pension_institutions/{code}:
 *   get:
 *     summary: Obtener institución de pensiones por código
 *     tags: [Instituciones de Pensiones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la institución
 *     responses:
 *       200:
 *         description: Institución encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PensionInstitution'
 *       404:
 *         description: Institución no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/pension_institutions/:code',    verifyUser, adminOnly, getPensionInstitutionByCode);

/**
 * @swagger
 * /pension_institutions:
 *   post:
 *     summary: Crear nueva institución de pensiones
 *     tags: [Instituciones de Pensiones]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePensionInstitutionRequest'
 *     responses:
 *       201:
 *         description: Institución creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PensionInstitution'
 *       400:
 *         description: Datos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/pension_institutions',         verifyUser, adminOnly, createPensionInstitution);

/**
 * @swagger
 * /pension_institutions/{code}:
 *   patch:
 *     summary: Actualizar institución de pensiones
 *     tags: [Instituciones de Pensiones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la institución
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePensionInstitutionRequest'
 *     responses:
 *       200:
 *         description: Institución actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PensionInstitution'
 *       404:
 *         description: Institución no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/pension_institutions/:code',  verifyUser, adminOnly, updatePensionInstitution);

/**
 * @swagger
 * /pension_institutions/{code}:
 *   delete:
 *     summary: Eliminar institución de pensiones
 *     tags: [Instituciones de Pensiones]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la institución
 *     responses:
 *       200:
 *         description: Institución eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Institución no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/pension_institutions/:code', verifyUser, adminOnly, deletePensionInstitution);


// Change Password

/**
 * @swagger
 * /data_pegawai/{id}/change_password:
 *   patch:
 *     summary: Cambiar contraseña de empleado (Admin)
 *     tags: [Autenticación]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Contraseñas no coinciden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/data_pegawai/:id/change_password', verifyUser, adminOnly, changePassword);

// Data Jabatan

/**
 * @swagger
 * /data_jabatan:
 *   get:
 *     summary: Obtener todos los cargos/posiciones
 *     tags: [Cargos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de cargos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobPosition'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_jabatan', verifyUser, adminOnly, getDataJabatan);

/**
 * @swagger
 * /data_jabatan/{id}:
 *   get:
 *     summary: Obtener cargo por ID
 *     tags: [Cargos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cargo
 *     responses:
 *       200:
 *         description: Cargo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobPosition'
 *       404:
 *         description: Cargo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_jabatan/:id', verifyUser, adminOnly, getDataJabatanByID);

/**
 * @swagger
 * /data_jabatan:
 *   post:
 *     summary: Crear nuevo cargo
 *     tags: [Cargos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobPositionRequest'
 *     responses:
 *       201:
 *         description: Cargo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/data_jabatan', verifyUser, adminOnly, createDataJabatan);

/**
 * @swagger
 * /data_jabatan/{id}:
 *   patch:
 *     summary: Actualizar cargo
 *     tags: [Cargos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cargo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobPositionRequest'
 *     responses:
 *       200:
 *         description: Cargo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Cargo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/data_jabatan/:id', verifyUser, adminOnly, updateDataJabatan);

/**
 * @swagger
 * /data_jabatan/{id}:
 *   delete:
 *     summary: Eliminar cargo
 *     tags: [Cargos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cargo
 *     responses:
 *       200:
 *         description: Cargo eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Cargo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/data_jabatan/:id', verifyUser, adminOnly, deleteDataJabatan);

/* ==== Transaksi  ==== */
// Data Kehadiran

/**
 * @swagger
 * /data_kehadiran:
 *   get:
 *     summary: Obtener todos los registros de asistencia
 *     tags: [Asistencia]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de asistencias obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_kehadiran', verifyUser, adminOnly, viewDataKehadiran);

/**
 * @swagger
 * /data_kehadiran/{id}:
 *   get:
 *     summary: Obtener registro de asistencia por ID
 *     tags: [Asistencia]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia
 *     responses:
 *       200:
 *         description: Registro de asistencia encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_kehadiran/:id', verifyUser, adminOnly, viewDataKehadiranByID);

/**
 * @swagger
 * /data_kehadiran:
 *   post:
 *     summary: Crear nuevo registro de asistencia
 *     tags: [Asistencia]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceRequest'
 *     responses:
 *       201:
 *         description: Registro de asistencia creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/data_kehadiran', verifyUser, adminOnly, createDataKehadiran);

/**
 * @swagger
 * /data_kehadiran/update/{id}:
 *   patch:
 *     summary: Actualizar registro de asistencia
 *     tags: [Asistencia]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceRequest'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/data_kehadiran/update/:id', verifyUser, adminOnly, updateDataKehadiran);

/**
 * @swagger
 * /data_kehadiran/{id}:
 *   delete:
 *     summary: Eliminar registro de asistencia
 *     tags: [Asistencia]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/data_kehadiran/:id', verifyUser, adminOnly, deleteDataKehadiran);

// Data Potongan

/**
 * @swagger
 * /data_potongan:
 *   get:
 *     summary: Obtener todos los registros de descuentos
 *     tags: [Descuentos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de descuentos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Deduction'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_potongan', adminOnly, verifyUser, viewDataPotongan);

/**
 * @swagger
 * /data_potongan/{id}:
 *   get:
 *     summary: Obtener descuento por ID
 *     tags: [Descuentos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     responses:
 *       200:
 *         description: Descuento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deduction'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_potongan/:id', adminOnly, verifyUser, viewDataPotonganByID);

/**
 * @swagger
 * /data_potongan:
 *   post:
 *     summary: Crear nuevo registro de descuento
 *     tags: [Descuentos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeductionRequest'
 *     responses:
 *       201:
 *         description: Descuento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/data_potongan', adminOnly, verifyUser, createDataPotonganGaji);

/**
 * @swagger
 * /data_potongan/update/{id}:
 *   patch:
 *     summary: Actualizar descuento
 *     tags: [Descuentos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeductionRequest'
 *     responses:
 *       200:
 *         description: Descuento actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/data_potongan/update/:id', adminOnly, verifyUser, updateDataPotongan);

/**
 * @swagger
 * /data_potongan/{id}:
 *   delete:
 *     summary: Eliminar descuento
 *     tags: [Descuentos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     responses:
 *       200:
 *         description: Descuento eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/data_potongan/:id', adminOnly, verifyUser, deleteDataPotongan);

// Data Gaji

/**
 * @swagger
 * /data_gaji_pegawai:
 *   get:
 *     summary: Obtener todos los registros de salarios
 *     tags: [Salarios]
 *     responses:
 *       200:
 *         description: Lista de salarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_gaji_pegawai', viewDataGajiPegawai);

/**
 * @swagger
 * /data_gaji_pegawai/{attendanceId}:
 *   get:
 *     summary: Obtener salario por ID de asistencia
 *     tags: [Salarios]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de asistencia
 *     responses:
 *       200:
 *         description: Salario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salary'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_gaji_pegawai/:attendanceId', verifyUser, viewDataGajiPegawaiById);

/* ====  Laporan  ==== */
// laporan Gaji Pegawai

/**
 * @swagger
 * /laporan/gaji:
 *   get:
 *     summary: Obtener reporte general de salarios
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/gaji', verifyUser, adminOnly, viewLaporanGajiPegawai);

/**
 * @swagger
 * /laporan/gaji/name/{name}:
 *   get:
 *     summary: Obtener reporte de salarios por nombre
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del empleado
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/gaji/name/:name', verifyUser, adminOnly, viewLaporanGajiPegawaiByName);

/**
 * @swagger
 * /laporan/gaji/month/{month}:
 *   get:
 *     summary: Obtener reporte de salarios por mes
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Mes
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/gaji/month/:month', verifyUser, adminOnly, viewLaporanGajiPegawaiByMonth);

/**
 * @swagger
 * /laporan/gaji/year/{year}:
 *   get:
 *     summary: Obtener reporte de salarios por año
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Año
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/gaji/year/:year', verifyUser, adminOnly, viewLaporanGajiPegawaiByYear);

// Laporan Absensi Pegawai

/**
 * @swagger
 * /laporan/absensi/month/{month}:
 *   get:
 *     summary: Obtener reporte de asistencia por mes
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Mes
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/absensi/month/:month', verifyUser, adminOnly, viewLaporanAbsensiPegawaiByMonth);

/**
 * @swagger
 * /laporan/absensi/year/{year}:
 *   get:
 *     summary: Obtener reporte de asistencia por año
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Año
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/absensi/year/:year', verifyUser, adminOnly, viewLaporanAbsensiPegawaiByYear);

// Slip Gaji Pegawai

/**
 * @swagger
 * /laporan/slip_gaji/name/{name}:
 *   get:
 *     summary: Obtener slip de salario por nombre
 *     tags: [Slips de Salario]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del empleado
 *     responses:
 *       200:
 *         description: Slip encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/slip_gaji/name/:name', verifyUser, adminOnly, viewSlipGajiByName);

/**
 * @swagger
 * /laporan/slip_gaji/month/{month}:
 *   get:
 *     summary: Obtener slip de salario por mes
 *     tags: [Slips de Salario]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Mes
 *     responses:
 *       200:
 *         description: Slip encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/slip_gaji/month/:month', verifyUser, adminOnly, viewSlipGajiByMonth);

/**
 * @swagger
 * /laporan/slip_gaji/year/{year}:
 *   get:
 *     summary: Obtener slip de salario por año
 *     tags: [Slips de Salario]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Año
 *     responses:
 *       200:
 *         description: Slip encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/laporan/slip_gaji/year/:year', verifyUser, adminOnly, viewSlipGajiByYear);

/* ==== Ubah Password ==== */

/**
 * @swagger
 * /change_password:
 *   patch:
 *     summary: Cambiar contraseña del usuario actual
 *     tags: [Autenticación]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Contraseñas no coinciden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/change_password', verifyUser, changePassword);

/* ==== Logout ==== */

/**
 * @swagger
 * /logout:
 *   delete:
 *     summary: Cerrar sesión
 *     tags: [Autenticación]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error al cerrar sesión
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/logout', LogOut);

// Pegawai Route :
/* ==== Dashboard ==== */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Obtener datos del dashboard del empleado
 *     tags: [Dashboard]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Datos del dashboard obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nik:
 *                   type: string
 *                 nama_pegawai:
 *                   type: string
 *                 jenis_kelamin:
 *                   type: string
 *                 jabatan:
 *                   type: string
 *                 tanggal_masuk:
 *                   type: string
 *                 status:
 *                   type: string
 *                 photo:
 *                   type: string
 *                 hak_akses:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/dashboard', verifyUser, dashboardPegawai);

/* ==== Data Gaji ==== */

/**
 * @swagger
 * /data_gaji/month/{month}:
 *   get:
 *     summary: Obtener salario del empleado por mes
 *     tags: [Salarios Empleado]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Mes
 *     responses:
 *       200:
 *         description: Salario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_gaji/month/:month', verifyUser, viewDataGajiSinglePegawaiByMonth);

/**
 * @swagger
 * /data_gaji/year/{year}:
 *   get:
 *     summary: Obtener salario del empleado por año
 *     tags: [Salarios Empleado]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Año
 *     responses:
 *       200:
 *         description: Salario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salary'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/data_gaji/year/:year', verifyUser, viewDataGajiSinglePegawaiByYear);

/**
 * @swagger
 * /chart-data/salary-by-gender:
 *   get:
 *     summary: Obtener datos para gráfico de salarios por género
 *     tags: [Gráficos]
 *     responses:
 *       200:
 *         description: Datos del gráfico obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChartData'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/chart-data/salary-by-gender", viewChartDataSalaryByGender);

/**
 * @swagger
 * /chart-data/employee-status:
 *   get:
 *     summary: Obtener datos para gráfico de estado de empleados
 *     tags: [Gráficos]
 *     responses:
 *       200:
 *         description: Datos del gráfico obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChartData'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/chart-data/employee-status', viewChartDataEmployeeStatus);

export default router;