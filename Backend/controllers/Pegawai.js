import DataPegawai from "../models/DataPegawaiModel.js";
import DataKehadiran from "../models/DataKehadiranModel.js";
import { getDataGajiPegawai } from "./TransaksiController.js";
import { verifyUser } from "../middleware/AuthUser.js";

import { ME } from "../errors/authError.json";
import { DASHBOARD, EMPLOYEE } from "../errors/pegawaiError.json";
import { SALARY_REPORT } from "../errors/salaryError.json";

// method untuk dashboard pegawai
export const dashboardPegawai = async (req, res) => {
  await verifyUser(req, res, () => { });

  const userId = req.userId;

  const response = await DataPegawai.findOne({
    where: {
      id: userId
    },
    attributes: [
      'id', 'nik', 'nama_pegawai',
      'jenis_kelamin', 'jabatan', 'tanggal_masuk',
      'status', 'photo', 'hak_akses'
    ]
  });

  res.status(200).json({ response: response, msg: DASHBOARD.FETCH_SUCCESS });
};

// method untuk view gaji single pegawai by month
export const viewDataGajiSinglePegawaiByMonth = async (req, res) => {
  await verifyUser(req, res, () => { });

  const userId = req.userId;
  const user = await DataPegawai.findOne({
    where: {
      id: userId
    }
  });

  try {
    const dataGajiPegawai = await getDataGajiPegawai();

    const response = await DataKehadiran.findOne({
      attributes: [
        'bulan'
      ],
      where: {
        bulan: req.params.month
      }
    });

    if (response) {
      const dataGajiByMonth = dataGajiPegawai.filter((data_gaji) => {
        return data_gaji.id === user.id && data_gaji.bulan === response.bulan;
      }).map((data_gaji) => {
        return {
          bulan: response.bulan,
          tahun: data_gaji.tahun,
          nik: user.nik,
          nama_pegawai: user.nama_pegawai,
          jenis_kelamin: user.jenis_kelamin,
          jabatan: user.jabatan,
          gaji_pokok: data_gaji.gaji_pokok,
          tj_transport: data_gaji.tj_transport,
          uang_makan: data_gaji.uang_makan,
          potongan: data_gaji.potongan,
          total_gaji: data_gaji.total,
        };
      });
      return res.json({ response: dataGajiByMonth, msg: EMPLOYEE.FETCH_SUCCESS });
    }

    res.status(404).json({ msg: `${EMPLOYEE.SALARY_NOT_FOUND} ${user.nama_pegawai}` });
  } catch (error) {
    res.status(500).json({ error: EMPLOYEE.INTERNAL_SERVER_ERROR });
  }
};

// method untuk view gaji single pegawai by year
export const viewDataGajiSinglePegawaiByYear = async (req, res) => {
  await verifyUser(req, res, () => { });

  const userId = req.userId;
  const user = await DataPegawai.findOne({
    where: {
      id: userId
    }
  });

  try {
    const dataGajiPegawai = await getDataGajiPegawai();
    const { year } = req.params;

    const dataGajiByYear = dataGajiPegawai.filter((data_gaji) => {
      return data_gaji.id === user.id && data_gaji.tahun === parseInt(year);
    }).map((data_gaji) => {
      return {
        tahun: data_gaji.tahun,
        bulan: data_gaji.bulan,
        nik: user.nik,
        nama_pegawai: user.nama_pegawai,
        jenis_kelamin: user.jenis_kelamin,
        jabatan: user.jabatan,
        gaji_pokok: data_gaji.gaji_pokok,
        tj_transport: data_gaji.tj_transport,
        uang_makan: data_gaji.uang_makan,
        potongan: data_gaji.potongan,
        total_gaji: data_gaji.total,
      };
    });

    if (dataGajiByYear.length === 0) {
      return res.status(404).json({ msg: ` ${EMPLOYEE.SALARY_BY_YEAR_NOT_FOUND} ${year}` });
    }
    res.json({ response: dataGajiByYear, msg: EMPLOYEE.SALARY_NOT_FOUND });
  } catch (error) {
    res.status(500).json({ error: EMPLOYEE.INTERNAL_SERVER_ERROR });
  }
}

// data yang ditampilkan ( Bulan / Tahun, Gaji Pokok, tj_transport, Uang Makan, Potongan, Total Gaji  )