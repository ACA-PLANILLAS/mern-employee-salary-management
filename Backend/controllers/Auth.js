import DataPegawai from "../models/DataPegawaiModel.js";
import argon2 from "argon2";
import { verifyUser } from "../middleware/AuthUser.js";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const authError = require('../errors/authError.json');
const pegawaiError = require('../errors/pegawaiError.json');

const { LOGIN, LOGOUT, ME, PASSWORD } = authError;
const { EMPLOYEE } = pegawaiError;

export const Login = async (req, res) => {
  let user = {};
  const pegawai = await DataPegawai.findOne({
    where: {
      username: req.body.username
    }
  });

  if (!pegawai) {
    return res.status(404).json({ msg: EMPLOYEE.USER_NOT_FOUND.code });
  }

  const match = await argon2.verify(pegawai.password, req.body.password);

  if (!match) {
    return res.status(400).json({ msg: LOGIN.INVALID_PASSWORD.code });
  }

  req.session.userId = pegawai.id_pegawai;

  // Build display name
  const names = [pegawai.first_name, pegawai.middle_name, pegawai.last_name, pegawai.second_last_name, pegawai.maiden_name]
    .filter(Boolean)
    .join(" ");

  user = {
    id_pegawai: pegawai.id,
    nama_pegawai: pegawai.nama_pegawai,
    username: pegawai.username,
    hak_akses: pegawai.hak_akses
  }

  res.status(200).json({
    id: pegawai.id,
    id_pegawai: pegawai.id_pegawai,
    fullName: names,
    username: pegawai.username,
    accessRights: pegawai.hak_akses,
    code: LOGIN.LOGIN_SUCCESS.code,
    message: LOGIN.LOGIN_SUCCESS.message
  });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: ME.NOT_LOGGED_IN.code });
  }
  const pegawai = await DataPegawai.findOne({
    attributes: [
      'id_pegawai','nik','dui_or_nit','document_type','isss_affiliation_number','pension_institution_code',
      'first_name','middle_name','last_name','second_last_name','maiden_name',
      'username','hak_akses','id','photo','url'
    ],
    where: {
      id_pegawai: req.session.userId
    }
  });
  if (!pegawai) return res.status(404).json({ msg: ME.USER_NOT_FOUND.code });
  res.status(200).json(pegawai);
}

export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: LOGOUT.LOGOUT_FAILED.code });
    res.status(200).json({ msg: LOGOUT.LOGOUT_SUCCESS.code });
  });
}

export const changePassword = async (req, res) => {
  await verifyUser(req, res, () => { });

  const userId = req.userId;

  const user = await DataPegawai.findOne({
    where: {
      id: userId
    }
  });

  const { password, confPassword } = req.body;

  if (password !== confPassword) return res.status(400).json({ msg: PASSWORD.PASSWORD_MISMATCH.code });

  try {
    const hashPassword = await argon2.hash(password);

    await DataPegawai.update(
      {
        password: hashPassword
      },
      {
        where: {
          id: user.id
        }
      }
    )
    res.status(200).json({ msg: PASSWORD.UPDATE_SUCCESS.code });
  } catch (error) {
    res.status(400).json({ msg: PASSWORD.UPDATE_FAILED.code });
  }
};