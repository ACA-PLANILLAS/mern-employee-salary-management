import PositionHistory from "../models/PositionHistoryModel.js";
import PensionInstitution from "../models/PensionInstitutionModel.js"; 
 import DataPegawai from "../models/DataPegawaiModel.js";
import argon2 from "argon2";
import path from "path";

import { createRequire } from "module";

const require = createRequire(import.meta.url);

const pegawaiError = require("../errors/pegawaiError.json");
const authError = require("../errors/authError.json");
const { EMPLOYEE } = pegawaiError;
const { PASSWORD } = authError;

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await DataPegawai.findAll({
      attributes: [
        "id",
        "nik",
        "dui_or_nit",
        "document_type",
        "isss_affiliation_number",
        "pension_institution_code",
        "first_name",
        "middle_name",
        "last_name",
        "second_last_name",
        "maiden_name",
        "jenis_kelamin",
        "hire_date",
        "status",
        "jabatan",
        "last_position_change_date",
        "monthly_salary",
        "has_active_loan",
        "loan_original_amount",
        "loan_outstanding_balance",
        "loan_monthly_installment",
        "loan_start_date",
        "username",
        "photo",
        "url",
        "hak_akses",
      ],
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const emp = await DataPegawai.findByPk(req.params.id, {
      attributes: [
        "id",
        "nik",
        "dui_or_nit",
        "document_type",
        "isss_affiliation_number",
        "pension_institution_code",
        "first_name",
        "middle_name",
        "last_name",
        "second_last_name",
        "maiden_name",
        "jenis_kelamin",
        "hire_date",
        "status",
        "jabatan",
        "last_position_change_date",
        "monthly_salary",
        "has_active_loan",
        "loan_original_amount",
        "loan_outstanding_balance",
        "loan_monthly_installment",
        "loan_start_date",
        "username",
        "photo",
        "url",
        "hak_akses",
      ],
      include: [{ model: PensionInstitution, as: "pensionInstitution" }],
    });
    if (!emp) return res.status(404).json({ msg: EMPLOYEE.NOT_FOUND.code });
    res.status(200).json(emp);
  } catch (error) {
    res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
  }
};

// Create new employee
export const createEmployee = async (req, res) => {
  const {
    nik,
    dui_or_nit,
    document_type,
    isss_affiliation_number,
    pension_institution_code,
    first_name,
    middle_name,
    last_name,
    second_last_name,
    maiden_name,
    jenis_kelamin,
    hire_date,
    status,
    jabatan,
    last_position_change_date,
    monthly_salary,
    has_active_loan,
    loan_original_amount,
    loan_outstanding_balance,
    loan_monthly_installment,
    loan_start_date,
    username,
    password,
    confPassword,
    hak_akses,
  } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({ msg: PASSWORD.PASSWORD_MISMATCH.code });
  }
  // photo upload logic
  if (!req.files?.photo) {
    return res.status(400).json({ msg: EMPLOYEE.PHOTO_REQUIRED.code });
  }

  const file = req.files.photo;
  const fileSize = file.data.length;
  const ext = path.extname(file.name).toLowerCase();
  const allowed = [".png", ".jpg", ".jpeg"];

  if (fileSize > 2000000) {
    return res.status(422).json({ msg: EMPLOYEE.PHOTO_TOO_LARGE.code });
  }

  if (!allowed.includes(ext) || file.data.length > 2e6) {
    return res.status(422).json({ msg: EMPLOYEE.INVALID_PHOTO_FORMAT.code });
  }
  const filename = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${filename}`;

  file.mv(`./public/images/${filename}`, async (err) => {
    if (err) return res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
    const hashed = await argon2.hash(password);
    try {
      const newEmp = await DataPegawai.create({
        nik,
        dui_or_nit,
        document_type,
        isss_affiliation_number,
        pension_institution_code,
        first_name,
        middle_name,
        last_name,
        second_last_name,
        maiden_name,
        jenis_kelamin,
        hire_date,
        status,
        jabatan,
        last_position_change_date,
        monthly_salary,
        has_active_loan,
        loan_original_amount,
        loan_outstanding_balance,
        loan_monthly_installment,
        loan_start_date,
        username,
        password: hashed,
        photo: filename,
        url,
        hak_akses,
      });
      // record initial position history
      await PositionHistory.create({
        employee_id: newEmp.id,
        position_id: null, // set proper job ID lookup
        start_date: last_position_change_date || hire_date,
      });
      res
        .status(201)
        .json({ success: true, message: EMPLOYEE.CREATE_SUCCESS.code });
    } catch (e) {
      res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
    }
  });
};

// Update employee
export const updateEmployee = async (req, res) => {
  const emp = await DataPegawai.findByPk(req.params.id);
  if (!emp) return res.status(404).json({ msg: EMPLOYEE.NOT_FOUND.code });
  const {
    nik,
    dui_or_nit,
    document_type,
    isss_affiliation_number,
    pension_institution_code,
    first_name,
    middle_name,
    last_name,
    second_last_name,
    maiden_name,
    jenis_kelamin,
    hire_date,
    status,
    jabatan,
    last_position_change_date,
    monthly_salary,
    has_active_loan,
    loan_original_amount,
    loan_outstanding_balance,
    loan_monthly_installment,
    loan_start_date,
    username,
    hak_akses,
  } = req.body;
  try {
    // if position changed, record history
    if (emp.jabatan !== jabatan) {
      await PositionHistory.create({
        employee_id: emp.id,
        position_id: null, // lookup new job ID
        start_date: last_position_change_date,
      });
    }
    await DataPegawai.update(
      {
        nik,
        dui_or_nit,
        document_type,
        isss_affiliation_number,
        pension_institution_code,
        first_name,
        middle_name,
        last_name,
        second_last_name,
        maiden_name,
        jenis_kelamin,
        hire_date,
        status,
        jabatan,
        last_position_change_date,
        monthly_salary,
        has_active_loan,
        loan_original_amount,
        loan_outstanding_balance,
        loan_monthly_installment,
        loan_start_date,
        username,
        hak_akses,
      },
      { where: { id: emp.id } }
    );
    res.status(200).json({ msg: EMPLOYEE.UPDATE_SUCCESS.code });
  } catch (e) {
    res.status(400).json({ msg: EMPLOYEE.UPDATE_FAILED.code });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  const emp = await DataPegawai.findByPk(req.params.id);
  if (!emp) return res.status(404).json({ msg: EMPLOYEE.NOT_FOUND.code });
  try {
    await DataPegawai.destroy({ where: { id: emp.id } });
    res.status(200).json({ msg: EMPLOYEE.DELETE_SUCCESS.code });
  } catch (e) {
    res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
  }
};

// Get all pension institutions
export const getAllPensionInstitutions = async (req, res) => {
  try {
    const list = await PensionInstitution.findAll();
    res.status(200).json(list);
  } catch (e) {
    res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
  }
};

// Get position history for an employee
export const getPositionHistory = async (req, res) => {
  try {
    const history = await PositionHistory.findAll({
      where: { employee_id: req.params.id },
    });
    res.status(200).json(history);
  } catch (e) {
    res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
  }
};
