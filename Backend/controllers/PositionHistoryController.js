import PositionHistory from "../models/PositionHistoryModel.js";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const histError = require("../errors/positionHistoryError.json");
const { POSITION_HISTORY } = histError;

export const getAllPositionHistories = async (req, res) => {
  try {
    const histories = await PositionHistory.findAll();
    res
      .status(POSITION_HISTORY.SUCCESS.status)
      .json({ code: POSITION_HISTORY.SUCCESS.code, data: histories });
  } catch (error) {
    res
      .status(POSITION_HISTORY.SERVER_ERROR.status)
      .json({
        code: POSITION_HISTORY.SERVER_ERROR.code,
        message: POSITION_HISTORY.SERVER_ERROR.message,
      });
  }
};

export const getPositionHistoryById = async (req, res) => {
  try {
    const hist = await PositionHistory.findByPk(req.params.id);
    if (!hist) {
      return res
        .status(POSITION_HISTORY.NOT_FOUND.status)
        .json({
          code: POSITION_HISTORY.NOT_FOUND.code,
          message: POSITION_HISTORY.NOT_FOUND.message,
        });
    }
    res
      .status(POSITION_HISTORY.SUCCESS.status)
      .json({ code: POSITION_HISTORY.SUCCESS.code, data: hist });
  } catch (error) {
    res
      .status(POSITION_HISTORY.SERVER_ERROR.status)
      .json({
        code: POSITION_HISTORY.SERVER_ERROR.code,
        message: POSITION_HISTORY.SERVER_ERROR.message,
      });
  }
};

export const createPositionHistory = async (req, res) => {
  const { employee_id, position_id, start_date, end_date } = req.body;
  if (!employee_id || !position_id || !start_date) {
    return res
      .status(POSITION_HISTORY.MISSING_DATA.status)
      .json({
        code: POSITION_HISTORY.MISSING_DATA.code,
        message: POSITION_HISTORY.MISSING_DATA.message,
      });
  }
  try {
    const newHist = await PositionHistory.create({
      employee_id,
      position_id,
      start_date,
      end_date,
    });
    res
      .status(POSITION_HISTORY.SUCCESS.status)
      .json({ code: POSITION_HISTORY.SUCCESS.code, data: newHist });
  } catch (error) {
    res
      .status(POSITION_HISTORY.CREATE_FAILED.status)
      .json({
        code: POSITION_HISTORY.CREATE_FAILED.code,
        message: POSITION_HISTORY.CREATE_FAILED.message,
      });
  }
};

export const updatePositionHistory = async (req, res) => {
  try {
    const hist = await PositionHistory.findByPk(req.params.id);
    if (!hist) {
      return res
        .status(POSITION_HISTORY.NOT_FOUND.status)
        .json({
          code: POSITION_HISTORY.NOT_FOUND.code,
          message: POSITION_HISTORY.NOT_FOUND.message,
        });
    }
    await hist.update(req.body);
    res
      .status(POSITION_HISTORY.SUCCESS.status)
      .json({ code: POSITION_HISTORY.SUCCESS.code, data: hist });
  } catch (error) {
    res
      .status(POSITION_HISTORY.UPDATE_FAILED.status)
      .json({
        code: POSITION_HISTORY.UPDATE_FAILED.code,
        message: POSITION_HISTORY.UPDATE_FAILED.message,
      });
  }
};

export const deletePositionHistory = async (req, res) => {
  try {
    const hist = await PositionHistory.findByPk(req.params.id);
    if (!hist) {
      return res
        .status(POSITION_HISTORY.NOT_FOUND.status)
        .json({
          code: POSITION_HISTORY.NOT_FOUND.code,
          message: POSITION_HISTORY.NOT_FOUND.message,
        });
    }
    await hist.destroy();
    res
      .status(POSITION_HISTORY.SUCCESS.status)
      .json({
        code: POSITION_HISTORY.SUCCESS.code,
        message: POSITION_HISTORY.SUCCESS.message,
      });
  } catch (error) {
    res
      .status(POSITION_HISTORY.DELETE_FAILED.status)
      .json({
        code: POSITION_HISTORY.DELETE_FAILED.code,
        message: POSITION_HISTORY.DELETE_FAILED.message,
      });
  }
};
