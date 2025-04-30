import DataPegawai from "../models/DataPegawaiModel.js";
import argon2 from "argon2";
import path from "path";

import { EMPLOYEE } from "../errors/pegawaiError.json";
import { PASSWORD } from "../errors/authError.json";

// menampilkan semua data Pegawai
export const getDataPegawai = async (req, res) => {
    try {
        const response = await DataPegawai.findAll({
            attributes: [
                'id', 'nik', 'nama_pegawai',
                'jenis_kelamin', 'jabatan', 'tanggal_masuk',
                'status', 'photo', 'hak_akses'
            ]
        });
        res.status(200).json({ response: response, msg: EMPLOYEE.FETCH_SUCCESS });
    } catch (error) {
        res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR });
    }
}

// method untuk mencari data Pegawai berdasarkan ID
export const getDataPegawaiByID = async (req, res) => {
    try {
        const response = await DataPegawai.findOne({
            attributes: [
                'id', 'nik', 'nama_pegawai',
                'jenis_kelamin', 'jabatan', 'username', 'tanggal_masuk',
                'status', 'photo', 'hak_akses'
            ],
            where: {
                id: req.params.id
            }
        });
        if (response) {
            res.status(200).json({ response: response, msg: EMPLOYEE.FETCH_SUCCESS });
        } else {
            res.status(404).json({ msg: EMPLOYEE.NOT_FOUND_BY_ID })
        }
    } catch (error) {
        res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR });
    }
}

// method untuk mencari data pegawai berdasarkan NIK
export const getDataPegawaiByNik = async (req, res) => {
    try {
        const response = await DataPegawai.findOne({
            attributes: [
                'id', 'nik', 'nama_pegawai',
                'jenis_kelamin', 'jabatan', 'tanggal_masuk',
                'status', 'photo', 'hak_akses'
            ],
            where: {
                nik: req.params.nik
            }
        });
        if (response) {
            res.status(200).json({ response: response, msg: EMPLOYEE.FETCH_SUCCESS });
        } else {
            res.status(404).json({ msg: EMPLOYEE.NOT_FOUND_BY_NIK })
        }
    } catch (error) {
        res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR });
    }
}


// method untuk mencari data pegawai berdasarkan Nama
export const getDataPegawaiByName = async (req, res) => {
    try {
        const response = await DataPegawai.findOne({
            attributes: [
                'id', 'nik', 'nama_pegawai',
                'jenis_kelamin', 'jabatan', 'tanggal_masuk',
                'status', 'photo', 'hak_akses'
            ],
            where: {
                nama_pegawai: req.params.name
            }
        });
        if (response) {
            res.status(200).json({ response: response, msg: EMPLOYEE.FETCH_SUCCESS });
        } else {
            res.status(404).json({ msg: EMPLOYEE.NOT_FOUND_BY_NAME })
        }
    } catch (error) {
        res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR });
    }
}

//  method untuk tambah data Pegawai
export const createDataPegawai = async (req, res) => {
    const {
        nik, nama_pegawai,
        username, password, confPassword, jenis_kelamin,
        jabatan, tanggal_masuk,
        status, hak_akses
    } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: PASSWORD.PASSWORD_MISMATCH });
    }

    if (!req.files || !req.files.photo) {
        return res.status(400).json({ msg: EMPLOYEE.PHOTO_REQUIRED });
    }

    const file = req.files.photo;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: EMPLOYEE.INVALID_PHOTO_FORMAT });
    }

    if (fileSize > 2000000) {
        return res.status(422).json({ msg: EMPLOYEE.PHOTO_TOO_LARGE });
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
            return res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR });
        }

        const hashPassword = await argon2.hash(password);

        try {
            await DataPegawai.create({
                nik: nik,
                nama_pegawai: nama_pegawai,
                username: username,
                password: hashPassword,
                jenis_kelamin: jenis_kelamin,
                jabatan: jabatan,
                tanggal_masuk: tanggal_masuk,
                status: status,
                photo: fileName,
                url: url,
                hak_akses: hak_akses
            });

            res.status(201).json({ success: true, message: EMPLOYEE.CREATE_SUCCESS });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: EMPLOYEE.INTERNAL_ERROR });
        }
    });
};


// method untuk update data Pegawai
export const updateDataPegawai = async (req, res) => {
    const pegawai = await DataPegawai.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!pegawai) return res.staus(404).json({ msg: EMPLOYEE.USER_NOT_FOUND });
    const {
        nik, nama_pegawai,
        username, jenis_kelamin,
        jabatan, tanggal_masuk,
        status, hak_akses
    } = req.body;

    try {
        await DataPegawai.update({
            nik: nik,
            nama_pegawai: nama_pegawai,
            username: username,
            jenis_kelamin: jenis_kelamin,
            jabatan: jabatan,
            tanggal_masuk: tanggal_masuk,
            status: status,
            hak_akses: hak_akses
        }, {
            where: {
                id: pegawai.id
            }
        });
        res.status(200).json({ msg: EMPLOYEE.UPDATE_SUCCESS });
    } catch (error) {
        res.status(400).json({ msg: EMPLOYEE.INTERNAL_ERROR });
    }
}

// Method untuk update password Pegawai
export const changePasswordAdmin = async (req, res) => {
    const pegawai = await DataPegawai.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!pegawai) return res.status(404).json({ msg: EMPLOYEE.USER_NOT_FOUND });


    const { password, confPassword } = req.body;

    if (password !== confPassword) return res.status(400).json({ msg: PASSWORD.PASSWORD_MISMATCH });

    try {
        if (pegawai.hak_akses === "pegawai") {
            const hashPassword = await argon2.hash(password);

            await DataPegawai.update(
                {
                    password: hashPassword
                },
                {
                    where: {
                        id: pegawai.id
                    }
                }
            );

            res.status(200).json({ msg: EMPLOYEE.UPDATE_SUCCESS });
        } else {
            res.status(403).json({ msg: EMPLOYEE.UNAUTHORIZED });
        }
    } catch (error) {
        res.status(500).json({ msg: EMPLOYEE.INTERNAL_ERROR });
    }
};


// method untuk delete data Pegawai
export const deleteDataPegawai = async (req, res) => {
    const pegawai = await DataPegawai.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!pegawai) return res.status(404).json({ msg: EMPLOYEE.USER_NOT_FOUND });
    try {
        await DataPegawai.destroy({
            where: {
                id: pegawai.id
            }
        });
        res.status(200).json({ msg: EMPLOYEE.DELETE_SUCCESS });
    } catch (error) {
        res.status(400).json({ msg: EMPLOYEE.INTERNAL_ERROR });
    }
}