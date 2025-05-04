import DataJabatan from "../models/DataJabatanModel.js";
import DataPegawai from "../models/DataPegawaiModel.js";
import { Op } from "sequelize";

import { JOB_POSITION } from "../errors/jabatanError.json";

// menampilkan semua data jabatan
export const getDataJabatan = async (req, res) => {
    try {
        let response;
        if (req.hak_akses === "admin") {
            response = await DataJabatan.findAll({
                attributes: ['id', 'nama_jabatan', 'gaji_pokok', 'tj_transport', 'uang_makan'],
                include: [{
                    model: DataPegawai,
                    attributes: ['nama_pegawai', 'username', 'hak_akses'],
                }]
            });
        } else {
            if (req.userId !== DataJabatan.userId) return res.status(403).json({ msg: JOB_POSITION.FORBIDDEN_ACCESS });
            await DataJabatan.update({
                nama_jabatan, gaji_pokok, tj_transport, uang_makan
            }, {
                where: {
                    [Op.and]: [{ id_jabatan: jabatan.id_jabatan }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
    }
}

// method untuk menampilkan data jabatan by ID
export const getDataJabatanByID = async (req, res) => {
    try {
        const response = await DataJabatan.findOne({
            attributes: [
                'id', 'nama_jabatan', 'gaji_pokok', 'tj_transport', 'uang_makan'
            ],
            where: {
                id: req.params.id
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: JOB_POSITION.NOT_FOUND.code });
        }
    } catch (error) {
        res.status(500).json({ msg: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
    }
}

// method untuk tambah data jabatan
export const createDataJabatan = async (req, res) => {
    const {
        id_jabatan, nama_jabatan, gaji_pokok, tj_transport, uang_makan
    } = req.body;
    try {
        if (req.hak_akses === "admin") {
            await DataJabatan.create({
                id_jabatan: id_jabatan,
                nama_jabatan: nama_jabatan,
                gaji_pokok: gaji_pokok,
                tj_transport: tj_transport,
                uang_makan: uang_makan,
                userId: req.userId
            });
        } else {
            if (req.userId !== DataJabatan.userId) return res.status(403).json({ msg: JOB_POSITION.FORBIDDEN_ACCESS.code });
            await DataJabatan.update({
                nama_jabatan, gaji_pokok, tj_transport, uang_makan
            }, {
                where: {
                    [Op.and]: [{ id_jabatan: jabatan.id_jabatan }, { userId: req.userId }]
                },
            });
        }
        res.status(201).json({ success: true, message: JOB_POSITION.CREATE_SUCCESS.code });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
    }

}

// method untuk update data jabatan
export const updateDataJabatan = async (req, res) => {
    try {
        const jabatan = await DataJabatan.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!jabatan) return res.status(404).json({ msg: JOB_POSITION.DATA_NOT_FOUND.code });
        const { nama_jabatan, gaji_pokok, tj_transport, uang_makan } = req.body;
        if (req.hak_akses === "admin") {
            await DataJabatan.update({
                nama_jabatan, gaji_pokok, tj_transport, uang_makan
            }, {
                where: {
                    id: jabatan.id
                }
            });
        } else {
            if (req.userId !== DataJabatan.userId) return res.status(403).json({ msg: JOB_POSITION.FORBIDDEN_ACCESS });
            await DataJabatan.update({
                nama_jabatan, gaji_pokok, tj_transport, uang_makan
            }, {
                where: {
                    [Op.and]: [{ id_jabatan: jabatan.id_jabatan }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: JOB_POSITION.UPDATE_SUCCESS.code });
    } catch (error) {
        res.status(500).json({ msg: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
    }
}

// method untuk delete data jabatan
export const deleteDataJabatan = async (req, res) => {
    try {
        const jabatan = await DataJabatan.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!jabatan) return res.status(404).json({ msg: JOB_POSITION.DATA_NOT_FOUND.code });
        if (req.hak_akses === "admin") {
            await jabatan.destroy({
                where: {
                    id: jabatan.id
                }
            });
        } else {
            if (req.userId !== jabatan.userId) return res.status(403).json({ msg: JOB_POSITION.FORBIDDEN_ACCESS.code });
            await jabatan.destroy({
                where: {
                    [Op.and]: [{ id_jabatan: jabatan.id_jabatan }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: JOB_POSITION.DELETE_SUCCESS.code });
    } catch (error) {
        res.status(500).json({ msg: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
    }

}