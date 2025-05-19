import {
  DataPegawai,
  PositionHistory,
  PensionInstitution,
  DataJabatan,
} from "../models/index.js";

import argon2 from "argon2";
import path from "path";

import { sequelize, Sequelize } from '../config/Database.js';

let pegawaiError;
let authError;

// Wrap top-level `await` in an `async` function and execute it immediately
(async () => {
  pegawaiError = (await import("../errors/pegawaiError.json", { assert: { type: "json" } })).default;
  authError = (await import("../errors/authError.json", { assert: { type: "json" } })).default;
})();

const { EMPLOYEE } = pegawaiError || { INTERNAL_ERROR: { code: 'INTERNAL_ERROR' } };
const { PASSWORD } = authError || {};

const Employee = sequelize.define('Employee', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // ...otros campos...
});

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await DataPegawai.findAll({
      attributes: [
        "id",
        "nik",
        // ...mantén solo las columnas que existen en tu tabla...
      ],
    });
    res.status(200).json(employees);
  } catch (error) {
    console.log("\n>>> ", error.message);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findOne({ where: { id } });
    if (!employee) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error(`Error al buscar empleado con ID: ${id}`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Create new employee
export const createEmployee = async (req, res, next) => {
  try {
    const { name, salary } = req.body;
    if (!name || salary <= 0) {
      res.status(400).json({ error: 'Datos inválidos' });
    } else {
      res.status(201).json({ id: '124', name, salary });
    }
  } catch (error) {
    next(error);
  }
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
    // jabatan,
    last_position_change_date,
    monthly_salary,
    has_active_loan,
    loan_original_amount,
    loan_outstanding_balance,
    loan_monthly_installment,
    loan_start_date,
    username,
    hak_akses,
    position_id,
  } = req.body;

  console.log(">>11111111");
  // Obtener el ultimo cambio de puesto del empleado
  const lastPositionHistory = await PositionHistory.findOne({
    where: { employee_id: emp.id },
    order: [["createdAt", "DESC"]],
  });
  console.log(">>2222222222");

  const t = await db.transaction(); // 🔐 inicia transacción

  try {
    // if position changed, record history
    if (String(lastPositionHistory?.position_id) !== String(position_id)) {
      console.log(
        ">>>POSITION CHANGED",
        last_position_change_date,
        " . ",
        hire_date
      );
      // Crear un nuevo registro de historial de posición
      console.log(">>3333333333333333");
      await PositionHistory.create(
        {
          employee_id: emp.id,
          position_id: position_id, // set proper job ID lookup
          start_date: Date.now(),
        },
        { transaction: t }
      );

      console.log(">>444444444");

      // Actualizar el registro anterior para establecer la fecha de finalización
      if (lastPositionHistory && lastPositionHistory.position_id) {
        console.log(">> 555");
        await PositionHistory.update(
          { end_date: Date.now() },
          {
            where: {
              employee_id: emp.id,
              position_id: lastPositionHistory?.position_id,
              end_date: null,
            },
            transaction: t,
          }
        );
        console.log(">> 666");
      }
    }

    console.log(">> aaaa");
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
        // jabatan,
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
      { where: { id: emp.id }, transaction: t }
    );

    await t.commit(); // ✅ Si todo sale bien, confirmamos

    res.status(200).json({ msg: EMPLOYEE.UPDATE_SUCCESS.code });
  } catch (e) {
    await t.rollback(); // ❌ Revierte todo si algo falla

    console.log("\n>>> ", e.message);
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
    console.log("\n>>> ", e.message);
    res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
  }
};

// Get all pension institutions
export const getAllPensionInstitutions = async (req, res) => {
  try {
    const list = await PensionInstitution.findAll();
    res.status(200).json(list);
  } catch (e) {
    console.log("\n>>> ", e.message);
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
    console.log("\n>>> ", e.message);
    res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR.code });
  }
};

export const getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === '123') {
      res.json({ id: '123', name: 'John Doe', salary: 5000 });
    } else {
      res.status(404).json({ error: 'Empleado no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};
