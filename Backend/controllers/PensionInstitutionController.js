import PensionInstitution from "../models/PensionInstitutionModel.js";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pensError = require("../errors/pensionInstitutionError.json");
const { PENSION_INSTITUTION } = pensError;

export const getAllPensionInstitutions = async (req, res) => {
  try {
    const list = await PensionInstitution.findAll();
    res
      .status(PENSION_INSTITUTION.SUCCESS.status)
      .json({ code: PENSION_INSTITUTION.SUCCESS.code, data: list });
  } catch (error) {
    res
      .status(PENSION_INSTITUTION.SERVER_ERROR.status)
      .json({
        code: PENSION_INSTITUTION.SERVER_ERROR.code,
        message: PENSION_INSTITUTION.SERVER_ERROR.message,
      });
  }
};

export const getPensionInstitutionByCode = async (req, res) => {
  try {
    const inst = await PensionInstitution.findByPk(req.params.code);
    if (!inst) {
      return res
        .status(PENSION_INSTITUTION.NOT_FOUND.status)
        .json({
          code: PENSION_INSTITUTION.NOT_FOUND.code,
          message: PENSION_INSTITUTION.NOT_FOUND.message,
        });
    }
    res
      .status(PENSION_INSTITUTION.SUCCESS.status)
      .json({ code: PENSION_INSTITUTION.SUCCESS.code, data: inst });
  } catch (error) {
    res
      .status(PENSION_INSTITUTION.SERVER_ERROR.status)
      .json({
        code: PENSION_INSTITUTION.SERVER_ERROR.code,
        message: PENSION_INSTITUTION.SERVER_ERROR.message,
      });
  }
};

export const createPensionInstitution = async (req, res) => {
  const { code, name, institution_type } = req.body;
  if (!code || !name || !institution_type) {
    return res
      .status(PENSION_INSTITUTION.MISSING_DATA.status)
      .json({
        code: PENSION_INSTITUTION.MISSING_DATA.code,
        message: PENSION_INSTITUTION.MISSING_DATA.message,
      });
  }
  try {
    const newInst = await PensionInstitution.create({
      code,
      name,
      institution_type,
    });
    res
      .status(PENSION_INSTITUTION.SUCCESS.status)
      .json({ code: PENSION_INSTITUTION.SUCCESS.code, data: newInst });
  } catch (error) {
    res
      .status(PENSION_INSTITUTION.CREATE_FAILED.status)
      .json({
        code: PENSION_INSTITUTION.CREATE_FAILED.code,
        message: PENSION_INSTITUTION.CREATE_FAILED.message,
      });
  }
};

export const updatePensionInstitution = async (req, res) => {
  try {
    const inst = await PensionInstitution.findByPk(req.params.code);
    if (!inst) {
      return res
        .status(PENSION_INSTITUTION.NOT_FOUND.status)
        .json({
          code: PENSION_INSTITUTION.NOT_FOUND.code,
          message: PENSION_INSTITUTION.NOT_FOUND.message,
        });
    }
    await inst.update(req.body);
    res
      .status(PENSION_INSTITUTION.SUCCESS.status)
      .json({ code: PENSION_INSTITUTION.SUCCESS.code, data: inst });
  } catch (error) {
    res
      .status(PENSION_INSTITUTION.UPDATE_FAILED.status)
      .json({
        code: PENSION_INSTITUTION.UPDATE_FAILED.code,
        message: PENSION_INSTITUTION.UPDATE_FAILED.message,
      });
  }
};

export const deletePensionInstitution = async (req, res) => {
  try {
    const inst = await PensionInstitution.findByPk(req.params.code);
    if (!inst) {
      return res
        .status(PENSION_INSTITUTION.NOT_FOUND.status)
        .json({
          code: PENSION_INSTITUTION.NOT_FOUND.code,
          message: PENSION_INSTITUTION.NOT_FOUND.message,
        });
    }
    await inst.destroy();
    res
      .status(PENSION_INSTITUTION.SUCCESS.status)
      .json({
        code: PENSION_INSTITUTION.SUCCESS.code,
        message: PENSION_INSTITUTION.SUCCESS.message,
      });
  } catch (error) {
    res
      .status(PENSION_INSTITUTION.DELETE_FAILED.status)
      .json({
        code: PENSION_INSTITUTION.DELETE_FAILED.code,
        message: PENSION_INSTITUTION.DELETE_FAILED.message,
      });
  }
};
