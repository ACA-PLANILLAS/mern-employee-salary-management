import DataKehadiran from "../models/DataKehadiranModel.js";
import DataPegawai from "../models/DataPegawaiModel.js";
import DataJabatan from "../models/DataJabatanModel.js";
import PotonganGaji from "../models/PotonganGajiModel.js";
import Parameter from "../models/ParameterModel.js";
import moment from "moment";
import "moment/locale/id.js";

import { createRequire } from "module";
import PositionHistory from "../models/PositionHistoryModel.js";
import { Op } from "sequelize";
const require = createRequire(import.meta.url);

const transaksiError = require("../errors/TransaksiError.json");
const pegawaiError = require("../errors/pegawaiError.json");
const params = require("../const/Params.json");

const { ATTENDANCE, DEDUCTION, SALARY } = transaksiError;
const { EMPLOYEE } = pegawaiError;
const { PARAMS } = params;

//TODO. modifier by month
// method untuk menampilkan semua Data Kehadiran
export const viewDataKehadiran = async (req, res) => {
  try {
    // Get data kehadiran
    const entries = await DataKehadiran.findAll({
      attributes: [
        "id",
        "bulan",
        "tahun",
        "nik",
        "nama_pegawai",
        "jenis_kelamin",
        "nama_jabatan",
        "hadir",
        "sakit",
        "alpha",
        "worked_hours",
        "additional_payments",
        "vacation_days",
        "vacation_payments",
        "comment_01",
        "comment_02",
        "day",
        "month",
      ],
      distinct: true,
    });

    const resultDataKehadiran = await Promise.all(
      entries.map(async (item) => {
        const peg = await DataPegawai.findOne({
          where: { id: item.nik },
        });

        const complete_name = peg
          ? `${peg.first_name} ${peg.middle_name} ${peg.last_name} ${peg.second_last_name} ${peg.maiden_name}`
          : "";

        return {
          id: item.id,
          bulan: item.bulan,
          tahun: item.tahun,
          nik: item.nik,
          nama_pegawai: item.nama_pegawai,
          jabatan_pegawai: item.nama_jabatan,
          jenis_kelamin: item.jenis_kelamin,
          hadir: item.hadir,
          sakit: item.sakit,
          alpha: item.alpha,
          worked_hours: item.worked_hours,
          additional_payments: item.additional_payments,
          vacation_days: item.vacation_days,
          vacation_payments: item.vacation_payments,
          comment_01: item.comment_01,
          comment_02: item.comment_02,
          day: item.day,
          month: item.month,
          complete_name,
        };
      })
    );

    return res.json(resultDataKehadiran);
  } catch (error) {
    console.log(error);
  }
};

// method untuk menampilkan Data Kehadiran by ID
export const viewDataKehadiranByID = async (req, res) => {
  try {
    const dataKehadiran = await DataKehadiran.findOne({
      attributes: [
        "id",
        "bulan",
        "tahun",
        "nik",
        "nama_pegawai",
        "jenis_kelamin",
        "nama_jabatan",
        "hadir",
        "sakit",
        "alpha",
        "createdAt",
        "worked_hours",
        "additional_payments",
        "vacation_days",
        "vacation_payments",
        "comment_01",
        "comment_02",
        "day",
        "month",
      ],
      where: {
        id: req.params.id,
      },
    });
    res.json(dataKehadiran);
  } catch (error) {
    res.status(500).json({ msg: ATTENDANCE.INTERNAL_ERROR.code });
  }
};

//TODO doing
// method untuk menambah data kehadiran
export const createDataKehadiran = async (req, res) => {
  const {
    nik, // id
    nama_pegawai, // id
    nama_jabatan, // id empleo
    jenis_kelamin,
    hadir,
    sakit,
    alpha,
    worked_hours,
    additional_payments,
    vacation_days,
    vacation_payments,
    comment_01,
    comment_02,
  } = req.body;

  try {
    const data_nik_pegawai = await DataPegawai.findOne({
      where: {
        id: nik,
      },
    });
    // const data_nama_jabatan = await DataJabatan.findOne({
    //   where: {
    //     nama_jabatan: nama_jabatan,
    //   },
    // });

    const paymentsOnMonth = (await Parameter.findOne({
      where: {
        type: PARAMS.PMON,
      },
    })) || { value: 1 };

    //current month and year
    const month = moment().locale("id").format("M");
    const year = moment().locale("id").format("YYYY");

    // if (!data_nama_pegawai) {
    //   return res.status(404).json({ msg: EMPLOYEE.NOT_FOUND_BY_NAME.code });
    // }

    // if (!data_nama_jabatan) {
    //   return res.status(404).json({ msg: EMPLOYEE.NOT_FOUND_BY_JABATAN.code });
    // }

    if (!data_nik_pegawai) {
      return res.status(404).json({ msg: EMPLOYEE.NOT_FOUND_BY_NIK.code });
    }

    const nama_sudah_ada = await DataKehadiran.findAll({
      where: {
        nik: data_nik_pegawai.id,
        bulan: month,
        tahun: year,
      },
    });

    if (
      nama_sudah_ada != null &&
      nama_sudah_ada.length < paymentsOnMonth.value
    ) {
      // Guardar el mes en formato de numero, enero = 1, febrero = 2, etc.
      const monthNumber = moment().format("M");
      const dayNumber = moment().format("D");

      await DataKehadiran.create({
        bulan: monthNumber,
        tahun: year,
        nik: data_nik_pegawai.id,
        nama_pegawai: data_nik_pegawai.id, //data_nama_pegawai.id,
        jenis_kelamin: jenis_kelamin,
        nama_jabatan: "", //data_nama_jabatan.id,
        hadir: hadir,
        sakit: sakit,
        alpha: alpha,
        worked_hours: worked_hours,
        additional_payments: additional_payments,
        vacation_days: vacation_days,
        vacation_payments: vacation_payments,
        comment_01: comment_01,
        comment_02: comment_02,
        month: monthNumber,
        day: dayNumber,
      });
      res.json({ msg: ATTENDANCE.CREATE_SUCCESS.code });
    } else {
      res.status(400).json({ msg: ATTENDANCE.ALREADY_EXISTS.code });
    }
  } catch (error) {
    console.log(error);
  }
};

// method untuk update data kehadiran
export const updateDataKehadiran = async (req, res) => {
  try {
    await DataKehadiran.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: ATTENDANCE.UPDATE_SUCCESS.code });
  } catch (error) {
    console.log(error.msg);
  }
};

// method untuk delete data kehadiran
export const deleteDataKehadiran = async (req, res) => {
  try {
    await DataKehadiran.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: ATTENDANCE.DELETE_SUCCESS.code });
  } catch (error) {
    console.log(error.msg);
  }
};

// method untuk create data potongan gaji
export const createDataPotonganGaji = async (req, res) => {
  const {
    id,
    potongan, //npmbre
    jml_potongan,
    from,
    until,
    value_d,
    type,
    payment_frequency,
    deduction_group,
  } = req.body;

  console.log("req.body", req.body);

  try {
    // Si tienen el mismo nombre y mismo alias
    let nama_potongan;

    if (deduction_group == undefined || deduction_group == null) {
      console.log("1");
      await PotonganGaji.findOne({
        where: {
          potongan: potongan,
        },
      });
    } else {
      console.log("2");
      await PotonganGaji.findOne({
        where: {
          potongan: potongan,
          deduction_group: deduction_group,
        },
      });
    }

    if (nama_potongan) {
      res.status(400).json({ msg: DEDUCTION.ALREADY_EXISTS.code });
    } else {
      await PotonganGaji.create({
        id: id,
        potongan: potongan,
        jml_potongan: jml_potongan.toLocaleString(),
        from: from,
        until: until,
        value_d: value_d,
        type: type,
        payment_frequency: payment_frequency,
        deduction_group: deduction_group,
      });
      res.json({ msg: DEDUCTION.CREATE_SUCCESS.code });
    }
  } catch (error) {
    console.log(error);
  }
};

// method untuk menampilkan semua Data Potongan
export const viewDataPotongan = async (req, res) => {
  try {
    const dataPotongan = await PotonganGaji.findAll({
      attributes: [
        "id",
        "potongan",
        "jml_potongan",
        "from",
        "until",
        "value_d",
        "type",
        "payment_frequency",
        "deduction_group",
      ],
    });
    res.json(dataPotongan);
  } catch (error) {
    console.log(error);
  }
};

// method untuk menampilkan Data Potongan By ID
export const viewDataPotonganByID = async (req, res) => {
  try {
    const dataPotongan = await PotonganGaji.findOne({
      attributes: [
        "id",
        "potongan",
        "jml_potongan",
        "from",
        "until",
        "value_d",
        "type",
        "payment_frequency",
        "deduction_group",
      ],
      where: {
        id: req.params.id,
      },
    });
    res.json(dataPotongan);
  } catch (error) {
    console.log(error);
  }
};

// method untuk update Data Potongan
export const updateDataPotongan = async (req, res) => {
  try {
    await PotonganGaji.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: DEDUCTION.UPDATE_SUCCESS.code });
  } catch (error) {
    console.log(error.message);
  }
};

// method untuk delete data potongan
export const deleteDataPotongan = async (req, res) => {
  try {
    await PotonganGaji.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: DEDUCTION.DELETE_SUCCESS.code });
  } catch (error) {
    console.log(error.message);
  }
};

// method untuk mengambil data gaji pegawai (data pegawai + data jabatan + data kehadiran + data potongan)

// method untuk mengambil data pegawai :
export const getDataPegawai = async () => {
  let resultDataPegawai = [];

  try {
    // Get data pegawai:
    const data_pegawai = await DataPegawai.findAll({
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
      distinct: true,
    });

    resultDataPegawai = data_pegawai.map((pegawai) => {
      const id = pegawai.id;
      const nik = pegawai.nik;
      const dui_or_nit = pegawai.dui_or_nit;
      const document_type = pegawai.document_type;
      const isss_affiliation_number = pegawai.isss_affiliation_number;
      const pension_institution_code = pegawai.pension_institution_code;
      const first_name = pegawai.first_name;
      const middle_name = pegawai.middle_name;
      const last_name = pegawai.last_name;
      const second_last_name = pegawai.second_last_name;
      const maiden_name = pegawai.maiden_name;
      const jenis_kelamin = pegawai.jenis_kelamin;
      const hire_date = pegawai.hire_date;
      const status = pegawai.status;
      const last_position_change_date = pegawai.last_position_change_date;
      const monthly_salary = pegawai.monthly_salary;
      const has_active_loan = pegawai.has_active_loan;
      const loan_original_amount = pegawai.loan_original_amount;
      const loan_outstanding_balance = pegawai.loan_outstanding_balance || 0; // Default to 0 if null
      const loan_monthly_installment = pegawai.loan_monthly_installment || 0; // Default to 0 if null
      const loan_start_date = pegawai.loan_start_date || null; // Default to null if not provided
      const username = pegawai.username || "";
      const photo = pegawai.photo || "";
      const url = pegawai.url || "";
      const hak_akses = pegawai.hak_akses;

      return {
        id,
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
        last_position_change_date,
        monthly_salary,
        has_active_loan,
        loan_original_amount,
        loan_outstanding_balance,
        loan_monthly_installment,
        loan_start_date,
        username,
        photo,
        url,
        hak_akses,
      };
    });
  } catch (error) {
    console.error(error);
  }

  return resultDataPegawai;
};

// method untuk mengambil data jabatan :
export const getDataJabatan = async () => {
  let resultDataJabatan = [];
  try {
    // get data jabatan :
    const data_jabatan = await DataJabatan.findAll({
      attributes: ["nama_jabatan", "gaji_pokok", "tj_transport", "uang_makan"],
      distinct: true,
    });

    resultDataJabatan = data_jabatan.map((jabatan) => {
      const nama_jabatan = jabatan.nama_jabatan;
      const gaji_pokok = jabatan.gaji_pokok;
      const tj_transport = jabatan.tj_transport;
      const uang_makan = jabatan.uang_makan;

      return { nama_jabatan, gaji_pokok, tj_transport, uang_makan };
    });
  } catch (error) {
    console.error(error);
  }
  return resultDataJabatan;
};

// method untuk mengambil data kehadiran :
export const getDataKehadiran = async () => {
  try {
    // Get data kehadiran
    const data_Kehadiran = await DataKehadiran.findAll({
      attributes: [
        "id",
        "bulan",
        "tahun",
        "month",
        "day",
        "nik",
        "nama_pegawai",
        "jenis_kelamin",
        "nama_jabatan",
        "hadir",
        "sakit",
        "alpha",
        "worked_hours",
        "additional_payments",
        "vacation_payments",
        "vacation_days",
        "comment_01",
        "comment_02",
        "day",
        "month",
        "createdAt",
        "updatedAt",
      ],
      distinct: true,
    });

    const resultDataKehadiran = data_Kehadiran.map((k) => ({
      id: k.id,
      bulan: k.bulan,
      tahun: k.tahun,
      month: k.month,
      day: k.day,
      nik: k.nik,
      nama_pegawai: k.nama_pegawai,
      jenis_kelamin: k.jenis_kelamin,
      jabatan_pegawai: k.nama_jabatan,
      hadir: k.hadir,
      sakit: k.sakit,
      alpha: k.alpha,
      worked_hours: k.worked_hours,
      additional_payments: k.additional_payments,
      vacation_payments: k.vacation_payments,
      vacation_days: k.vacation_days,
      comment_01: k.comment_01,
      comment_02: k.comment_02,
      day: k.day,
      month: k.month,
      createdAt: k.createdAt,
      updatedAt: k.updatedAt,
    }));

    return resultDataKehadiran;
  } catch (error) {
    console.error(error);
  }
};

export const getDataPotongan = async () => {
  let resultDataPotongan = [];
  try {
    // get data potongan :
    const data_potongan = await PotonganGaji.findAll({
      attributes: [
        "id",
        "potongan",
        "jml_potongan",
        "from",
        "until",
        "value_d",
        "type",
        "payment_frequency",
        "deduction_group",
        "createdAt",
        "updatedAt",
      ],
      distinct: true,
    });

    resultDataPotongan = data_potongan.map((p) => ({
      id: p.id,
      nama_potongan: p.potongan,
      jml_potongan: p.jml_potongan,
      from: p.from,
      until: p.until,
      value_d: p.value_d,
      type: p.type,
      payment_frequency: p.payment_frequency,
      deduction_group: p.deduction_group,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (error) {
    console.error(error);
  }
  return resultDataPotongan;
};

// Logika matematika
export const getDataGajiPegawai = async (year, month) => {
  try {
    // 1) recuperar y filtrar asistencia

    const allKehadiran = await getDataKehadiran();
    const attendance = allKehadiran.filter((a) => {
      return (
        a.tahun === parseInt(year) &&
        a.bulan.toLowerCase() === month.toLowerCase()
      );
    });
    console.log("attendance", attendance.length)

    // 2) traer sólo esos empleados
    const allPegawai = await getDataPegawai();
    const empleados = allPegawai.filter((p) =>
      attendance.some((a) => {
        return a.nik === String(p.id);
      })
    );

    const resultDataPotongan = await getDataPotongan();

    // 3) Recuperar parámetros de deducciones
    // getting job total work days and hours
    const workHoursInWeeks = await Parameter.findOne({
      where: { type: PARAMS.HWEK },
    });
    const totalPaymentsInMonth = await Parameter.findOne({
      where: { type: PARAMS.PMON },
    });
    const totalDaysWorkedOnMonth = workHoursInWeeks.value * 4;

    // 4) Calcular salario mes a mes + deducciones
    // const endOfMonth = new Date(parseInt(year), parseInt(month) - 1 + 1, 0);
    const endOfMonth = new Date(parseInt(year), parseInt(month), 0);
    const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);

    const salariosConDeducciones = await Promise.all(
      attendance.map(async (attendanceEmployee) => {
        // 4a) datos del empleado
        const pegawai = allPegawai.find(
          (p) => String(p.id) === attendanceEmployee.nik
        );
        if (!pegawai) return null;

        // fecha concreta de la asistencia
        const attDate = new Date(
          attendanceEmployee.tahun,
          parseInt(attendanceEmployee.bulan, 10) - 1,
          attendanceEmployee.day
        );

        console.log("date, ", attDate)

        // 4a) Sacar el último puesto que tuvo el empleado en o antes de endOfMonth
        const history = await PositionHistory.findOne({
          where: {
            employee_id: pegawai.id,
            start_date: { [Op.lte]: attDate },
            [Op.or]: [
              { end_date: { [Op.gte]: attDate } },
              { end_date: null },
            ],
          },
          order: [["start_date", "DESC"]],
        });

        const idPuesto = history ? history.position_id : 0;

        // 4b) Recuperar las cifras salariales de ese puesto
        const datosPuesto = await DataJabatan.findOne({
          where: { id: idPuesto },
        });

        //  gaji_pokok: 10000,
        // tj_transport: 200,
        // uang_makan: 122,

        // 4c) Cálculo del salario bruto prorrateado
        const salarioBruto =
          (datosPuesto.gaji_pokok +
            datosPuesto.tj_transport +
            datosPuesto.uang_makan) /
          parseFloat(totalPaymentsInMonth.value);

        // 4d) Deducciones fijas
        const totalDeductions = [];
        let totalValueDeducted = 0;
        let subtotalStandarDeductions = 0;
        let subtotalDynamicDeductions = 0;

        resultDataPotongan.forEach((deduction) => {
          let valueDeducted = 0;

          if (deduction.type === "STA") {
            valueDeducted = datosPuesto.gaji_pokok * deduction.jml_potongan;
            subtotalStandarDeductions += valueDeducted;
          } else if (
            deduction.type === "DIN" &&
            datosPuesto.gaji_pokok > deduction.from &&
            (deduction.until < 0 || datosPuesto.gaji_pokok <= deduction.until)
          ) {
            valueDeducted =
              deduction.value_d +
              (datosPuesto.gaji_pokok - deduction.from) *
              deduction.jml_potongan;

            subtotalDynamicDeductions += valueDeducted;
          }
          totalDeductions.push({
            ...deduction,
            valueDeducted: valueDeducted,
          });
          totalValueDeducted += valueDeducted;
        });

        // const kehadiran = attendance.find((a) => a.nik === String(pegawai.id));

        const totalUnassitence =
          parseFloat((datosPuesto.gaji_pokok * 8) / totalDaysWorkedOnMonth) *
          (parseFloat(attendanceEmployee.sakit) + parseFloat(attendanceEmployee.alpha));

        const total_gaji =
          salarioBruto - (totalValueDeducted + totalUnassitence);

        return {
          ...pegawai,
          ...datosPuesto?.dataValues,
          idPuesto,
          salarioEmpleo: datosPuesto?.gaji_pokok, // El salario sin nada
          salarioBruto: salarioBruto.toFixed(2),
          // potaciones: totalValueDeducted.toFixed(2),
          // deduccionAusencias: deduccionAusencias.toFixed(2),
          // total: neto.toFixed(2),
          id: pegawai.id,
          // gaji_pokok: pegawai.gaji_pokok.toLocaleString(),
          // tj_transport: pegawai.tj_transport.toLocaleString(),
          // uang_makan: pegawai.uang_makan.toLocaleString(),
          hadir: attendanceEmployee.hadir,
          sakit: attendanceEmployee.sakit,
          alpha: attendanceEmployee.alpha,
          deducciones: totalValueDeducted.toLocaleString(),
          castigo_ausencias: totalUnassitence.toLocaleString(),
          subtotalStandarDeductions: subtotalStandarDeductions.toLocaleString(),
          subtotalDynamicDeductions: subtotalDynamicDeductions.toLocaleString(),
          total: (total_gaji < 0 ? 0 : total_gaji).toFixed(2).toLocaleString(),
          year: attendanceEmployee.tahun,
          month: attendanceEmployee.month,
          day: attendanceEmployee.day,
        };
      })
    );

    return salariosConDeducciones;
  } catch (error) {
    console.error(error);
  }
};

// method untuk melihat data gaji pegawai
export const viewDataGajiPegawai = async (req, res) => {
  try {
    // Obtener año y fecha de los parametros de la solicitud
    const { year, month } = req.query;

    const dataGajiPegawai = await getDataGajiPegawai(year, month);
    res.status(200).json(dataGajiPegawai);
  } catch (error) {
    res.status(500).json({ error: SALARY.INTERNAL_ERROR.code });
  }
};

export const viewDataGajiPegawaiByName = async (req, res) => {
  try {
    const dataGajiPegawai = await getDataGajiPegawai();
    const { name } = req.params;

    const dataGajiByName = dataGajiPegawai
      .filter((data_gaji) => {
        return data_gaji.nama_pegawai
          .toLowerCase()
          .includes(name.toLowerCase().replace(/ /g, ""));
      })
      .map((data_gaji) => {
        return {
          tahun: data_gaji.tahun,
          bulan: data_gaji.bulan,
          id: data_gaji.id,
          nik: data_gaji.nik,
          nama_pegawai: data_gaji.nama_pegawai,
          jabatan: data_gaji.jabatan,
          jenis_kelamin: data_gaji.jenis_kelamin,
          jabatan_pegawai: data_gaji.jabatan_pegawai,
          gaji_pokok: data_gaji.gaji_pokok,
          tj_transport: data_gaji.tj_transport,
          uang_makan: data_gaji.uang_makan,
          potongan: data_gaji.potongan,
          total_gaji: data_gaji.total,
        };
      });

    if (dataGajiByName.length === 0) {
      return res.status(404).json({ msg: SALARY.NOT_FOUND_BY_NAME.code });
    }
    return res.json(dataGajiByName);
  } catch (error) {
    res.status(500).json({ error: SALARY.INTERNAL_ERROR.code });
  }
};

// method untuk melihat data gaji pegawai berdasarkan ID
export const viewDataGajiById = async (req, res) => {
  try {
    const dataGajiPegawai = await getDataGajiPegawai(req, res);
    const id = parseInt(req.params.id);

    const foundData = dataGajiPegawai.find((data) => data.id === id);

    if (!foundData) {
      res.status(404).json({ msg: SALARY.NOT_FOUND_BY_ID.code });
    } else {
      res.json(foundData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: SALARY.INTERNAL_ERROR.code });
  }
};

// method untuk melihat data gaji pegawai berdasarkan Name
export const viewDataGajiByName = async (req, res) => {
  try {
    const dataGajiPegawai = await getDataGajiPegawai(req, res);
    const name = req.params.name.toLowerCase();

    const foundData = dataGajiPegawai.filter((data) => {
      const formattedName = data.nama_pegawai.toLowerCase();
      const searchKeywords = name.split(" ");

      return searchKeywords.every((keyword) => formattedName.includes(keyword));
    });

    if (foundData.length === 0) {
      res.status(404).json({ msg: SALARY.NOT_FOUND_BY_NAME.code });
    } else {
      res.json(foundData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: SALARY.INTERNAL_ERROR.code });
  }
};

// method untuk mencari data gaji pegawai berdasarkan bulan
export const viewDataGajiPegawaiByMonth = async (req, res) => {
  try {
    const dataGajiPegawai = await getDataGajiPegawai();
    const response = await DataKehadiran.findOne({
      attributes: ["bulan"],
      where: {
        bulan: req.params.month,
      },
    });

    if (response) {
      const dataGajiByMonth = dataGajiPegawai
        .filter((data_gaji) => {
          return data_gaji.bulan === response.bulan;
        })
        .map((data_gaji) => {
          return {
            bulan: response.bulan,
            id: data_gaji.id,
            nik: data_gaji.nik,
            nama_pegawai: data_gaji.nama_pegawai,
            jenis_kelamin: data_gaji.jenis_kelamin,
            jabatan_pegawai: data_gaji.jabatan_pegawai,
            gaji_pokok: data_gaji.gaji_pokok,
            tj_transport: data_gaji.tj_transport,
            uang_makan: data_gaji.uang_makan,
            potongan: data_gaji.potongan,
            total_gaji: data_gaji.total,
          };
        });
      return res.json(dataGajiByMonth);
    }

    res.status(404).json({ msg: SALARY.NOT_FOUND_BY_MONTH.code });
  } catch (error) {
    res.status(500).json({ error: SALARY.INTERNAL_ERROR.code });
  }
};

// method untuk mencari data gaji pegawai berdasarkan tahun
export const viewDataGajiPegawaiByYear = async (req, res) => {
  try {
    const dataGajiPegawai = await getDataGajiPegawai();
    const { year } = req.params;

    const dataGajiByYear = dataGajiPegawai
      .filter((data_gaji) => {
        const gajiYear = data_gaji.tahun;
        return gajiYear === parseInt(year);
      })
      .map((data_gaji) => {
        return {
          tahun: data_gaji.tahun,
          id: data_gaji.id,
          nik: data_gaji.nik,
          nama_pegawai: data_gaji.nama_pegawai,
          jenis_kelamin: data_gaji.jenis_kelamin,
          jabatan_pegawai: data_gaji.jabatan,
          hadir: data_gaji.hadir,
          sakit: data_gaji.sakit,
          alpha: data_gaji.alpha,
          gaji_pokok: data_gaji.gaji_pokok,
          tj_transport: data_gaji.tj_transport,
          uang_makan: data_gaji.uang_makan,
          potongan: data_gaji.potongan,
          total_gaji: data_gaji.total,
        };
      });

    if (dataGajiByYear.length === 0) {
      return res.status(404).json({ msg: SALARY.NOT_FOUND_BY_YEAR.code });
    }
    res.json(dataGajiByYear);
  } catch (error) {
    res.status(500).json({ error: SALARY.INTERNAL_ERROR.code });
  }
};

// method untuk mencari data gaji pegawai berdasarkan tahun
export const dataLaporanGajiByYear = async (req, res) => {
  try {
    const dataGajiPegawai = await getDataGajiPegawai();
    const { year } = req.params;

    const dataGajiByYear = dataGajiPegawai
      .filter((data_gaji) => {
        const gajiYear = data_gaji.tahun;
        return gajiYear === parseInt(year);
      })
      .map((data_gaji) => {
        return {
          tahun: data_gaji.tahun,
          id: data_gaji.id,
          nik: data_gaji.nik,
          nama_pegawai: data_gaji.nama_pegawai,
          jenis_kelamin: data_gaji.jenis_kelamin,
          jabatan_pegawai: data_gaji.jabatan_pegawai,
          gaji_pokok: data_gaji.gaji_pokok,
          tj_transport: data_gaji.tj_transport,
          uang_makan: data_gaji.uang_makan,
          potongan: data_gaji.potongan,
          total_gaji: data_gaji.total,
        };
      });

    if (dataGajiByYear.length === 0) {
      return res.status(404).json({ msg: SALARY.NOT_FOUND_BY_YEAR.code });
    } else {
      const laporanByYear = dataGajiByYear.map((data) => data.tahun);
    }
  } catch (error) {
    res.status(500).json({ error: SALARY.INTERNAL_ERROR.code });
  }
};
