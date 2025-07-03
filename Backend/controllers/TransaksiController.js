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

function toFloatOrZero(value) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

const roundUp2 = (value) => Math.ceil(value * 100) / 100;

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

  try {
    // Si tienen el mismo nombre y mismo alias
    let nama_potongan;

    if (deduction_group == undefined || deduction_group == null) {
      await PotonganGaji.findOne({
        where: {
          potongan: potongan,
        },
      });
    } else {
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
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
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
    const workDaysPerPeriod = await Parameter.findOne({
      where: { type: PARAMS.DWEK },
    });
    const totalPaymentsInMonth = await Parameter.findOne({
      where: { type: PARAMS.PMON },
    });

    // Parámetros de la empresa (DUI, ISSS, CCTS, Nombre)
    const paramDUIN = await Parameter.findOne({ where: { type: "DUIN" } });
    const paramNPIS = await Parameter.findOne({ where: { type: "NPIS" } });
    const paramCCTS = await Parameter.findOne({ where: { type: "CCTS" } });
    const paramCOMP = await Parameter.findOne({ where: { type: "COMP" } });
    const paramADCO = await Parameter.findOne({ where: { type: "ADCO" } });

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

        // Sacar el último puesto que tuvo el empleado en o antes de endOfMonth
        const history = await PositionHistory.findOne({
          where: {
            employee_id: pegawai.id,
            start_date: { [Op.lte]: attDate },
            [Op.or]: [{ end_date: { [Op.gte]: attDate } }, { end_date: null }],
          },
          order: [
            ["start_date", "DESC"],
            ["createdAt", "DESC"],
          ],
        });

        const idPuesto = history ? history.position_id : 0;

        // Recuperar las cifras salariales de ese puesto
        const datosPuesto = await DataJabatan.findOne({
          where: { id: idPuesto },
        });

        // SALARIO BASE entre el tipo de pago
        const rawSalary = toFloatOrZero(datosPuesto?.gaji_pokok);
        const payCount = totalPaymentsInMonth?.value || 1;
        const grossSalary = rawSalary / payCount;

        // Ausencias y penalización (Sí sujetos a ISSS e ISR)
        const unjustifiedAbsence = parseFloat(attendanceEmployee.alpha) || 0;
        const justifiedAbsence = parseFloat(attendanceEmployee.sakit) || 0; // Por el momento ignorar
        const totalAbsences = unjustifiedAbsence; // + enfermedad;
        const workDaysInPeriod = { 1: 30, 2: 15, 4: 7 }[payCount] || 0; // 1 para 30, 2 para 15 y 4 para 7
        const dailyRate = grossSalary / workDaysInPeriod;
        const absencePenalty = dailyRate * totalAbsences;

        // Viáticos (transporte + alimentación) (NO sujetos a ISSS ni ISR)
        const viaticos =
          toFloatOrZero(datosPuesto?.tj_transport) +
            toFloatOrZero(datosPuesto?.uang_makan) || 0;

        // Pagos extra (Sí sujetos a ISSS e ISR)
        const additional =
          toFloatOrZero(attendanceEmployee.additional_payments) || 0;
        const vacation =
          toFloatOrZero(attendanceEmployee.vacation_payments) || 0;

        const baseSalary = grossSalary + additional + vacation - absencePenalty;

        const totalDeductions = [];
        let totalValueDeducted = 0;
        let subtotalStandarDeductions = 0;
        let subtotalDynamicDeductions = 0;

        // deducciones tipo "STA"
        resultDataPotongan
          .filter((deduction) => deduction.type === "STA")
          .forEach((deduction) => {
            const valueDeducted =
              baseSalary * toFloatOrZero(deduction.jml_potongan);

            subtotalStandarDeductions += valueDeducted;
            totalValueDeducted += valueDeducted;

            totalDeductions.push({
              ...deduction,
              valueDeducted,
            });
          });

        const salarioStandarRestante = baseSalary - subtotalStandarDeductions;

        resultDataPotongan
          .filter((deduction) => deduction.type === "DIN")
          .forEach((deduction) => {
            let valueDeducted = 0;

            const from = toFloatOrZero(deduction.from);
            const until = toFloatOrZero(deduction.until);
            const porcentaje = toFloatOrZero(deduction.jml_potongan);
            const cuotaInicial = toFloatOrZero(deduction.value_d);

            const totalPayments = totalPaymentsInMonth?.value || -1;
            const payment_frequency = deduction?.payment_frequency || 0;

            const upperBound = until === -1 ? Infinity : until;

            if (
              salarioStandarRestante > from && // mayor que el mínimo
              salarioStandarRestante <= upperBound && // dentro del tope (o sin tope)
              (payment_frequency == totalPayments || payment_frequency == -1) // coincide freq.
            ) {
              const baseGravable = salarioStandarRestante - from;

              valueDeducted = baseGravable * porcentaje + cuotaInicial;

              subtotalDynamicDeductions += valueDeducted;
              totalValueDeducted += valueDeducted;
            }

            totalDeductions.push({
              ...deduction,
              valueDeducted,
            });
          });

        const valueDeducted =
          salarioStandarRestante - subtotalDynamicDeductions;

        const totalQuitado = totalValueDeducted + absencePenalty;

        const total = roundUp2(valueDeducted < 0 ? 0 : valueDeducted);

        return {
          ...pegawai,
          ...datosPuesto?.dataValues,
          idPuesto,

          id: pegawai.id,
          attendanceId: attendanceEmployee.id,
          hadir: attendanceEmployee.hadir,
          sakit: attendanceEmployee.sakit,
          alpha: attendanceEmployee.alpha,
          worked_hours: attendanceEmployee.worked_hours,
          additional_payments: attendanceEmployee.additional_payments,
          vacation_payments: attendanceEmployee.vacation_payments,
          vacation_days: attendanceEmployee.vacation_days,
          comment_01: attendanceEmployee.comment_01,
          comment_02: attendanceEmployee.comment_02,

          // Datos salarios
          salarioEmpleo: datosPuesto?.gaji_pokok, // El salario sin nada
          salarioInicial: roundUp2(baseSalary), // El salario mas pagos adicionales - sanciones
          salarioBruto: roundUp2(grossSalary), // El salario quinsenal, o semanal
          salarioDeduccionesStandar: roundUp2(salarioStandarRestante),
          salarioDeduccionesDinamicas: roundUp2(valueDeducted),
          salarioTotal: roundUp2(valueDeducted),
          total: roundUp2(total),
          totalWithViatics: roundUp2(total + viaticos),

          // Datos adicionales
          viaticos: roundUp2(viaticos),
          castigo_ausencias: roundUp2(absencePenalty),
          extras: roundUp2(additional + vacation),

          subtotalStandarDeductions: roundUp2(subtotalStandarDeductions),
          subtotalDynamicDeductions: roundUp2(subtotalDynamicDeductions),
          totalDeductions: roundUp2(totalValueDeducted),
          totalQuitado: roundUp2(totalQuitado),

          // parámetros empresa
          duiEmpleador: paramDUIN?.value,
          numeroPatronalISSS: paramNPIS?.value,
          correlativoCentroTrabajoISSS: paramCCTS?.value,
          nombreEmpresa: paramCOMP?.value,
          ubicacionEmpresa: paramADCO?.value,

          // Fechas
          year: attendanceEmployee.tahun,
          month: attendanceEmployee.month,
          day: attendanceEmployee.day,

          cantidadPagos: payCount,
          diasTrabajo: workDaysInPeriod,
          dailyRate: dailyRate,
        };
      })
    );

    const salariosClean = salariosConDeducciones.filter((item) => item != null);
    return salariosClean;
  } catch (error) {
    console.error(error.message);
  }
};

export const getDataGajiPegawaiById = async (attendanceId) => {
  try {
    // Obtener y filtrar asistencia específica
    const allKehadiran = await getDataKehadiran();
    const att = allKehadiran.find((a) => a.id === attendanceId);
    if (!att) return null;

    // Obtener datos del empleado correspondiente
    const allPegawai = await getDataPegawai();
    const pegawai = allPegawai.find((p) => String(p.id) === att.nik);
    if (!pegawai) return null;

    const resultDataPotongan = await getDataPotongan();

    // Obtener parámetros necesarios
    const workHoursInWeeks = await Parameter.findOne({
      where: { type: PARAMS.HWEK },
    });
    const workDaysPerPeriod = await Parameter.findOne({
      where: { type: PARAMS.DWEK },
    });
    const totalPaymentsInMonth = await Parameter.findOne({
      where: { type: PARAMS.PMON },
    });

    // Parámetros de la empresa (DUI, ISSS, CCTS, Nombre)
    const paramDUIN = await Parameter.findOne({ where: { type: "DUIN" } });
    const paramNPIS = await Parameter.findOne({ where: { type: "NPIS" } });
    const paramCCTS = await Parameter.findOne({ where: { type: "CCTS" } });
    const paramCOMP = await Parameter.findOne({ where: { type: "COMP" } });
    const paramADCO = await Parameter.findOne({ where: { type: "ADCO" } });

    // Procesar asistencia individual
    const attDate = new Date(att.tahun, parseInt(att.bulan, 10) - 1, att.day);

    const history = await PositionHistory.findOne({
      where: {
        employee_id: pegawai.id,
        start_date: { [Op.lte]: attDate },
        [Op.or]: [{ end_date: { [Op.gte]: attDate } }, { end_date: null }],
      },
      order: [
        ["start_date", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    const idPuesto = history ? history.position_id : 0;

    const datosPuesto = await DataJabatan.findOne({
      where: { id: idPuesto },
    });

    // SALARIO BASE entre el tipo de pago
    const rawSalary = toFloatOrZero(datosPuesto?.gaji_pokok);
    const payCount = totalPaymentsInMonth?.value || 1;
    const grossSalary = rawSalary / payCount;

    // Ausencias y penalización (Sí sujetos a ISSS e ISR)
    const unjustifiedAbsence = parseFloat(att.alpha) || 0;
    const justifiedAbsence = parseFloat(att.sakit) || 0; // Por el momento ignorar
    const totalAbsences = unjustifiedAbsence; // + enfermedad;
    const workDaysInPeriod = { 1: 30, 2: 15, 4: 7 }[payCount] || 0; // 1 para 30, 2 para 15 y 4 para 7
    const dailyRate = grossSalary / workDaysInPeriod;
    const absencePenalty = dailyRate * totalAbsences;

    // Viáticos (transporte + alimentación) (NO sujetos a ISSS ni ISR)
    const viaticos =
      toFloatOrZero(datosPuesto?.tj_transport) +
      toFloatOrZero(datosPuesto?.uang_makan);

    // Pagos extra (Sí sujetos a ISSS e ISR)
    const additional = toFloatOrZero(att.additional_payments) || 0;
    const vacation = toFloatOrZero(att.vacation_payments) || 0;

    const baseSalary = grossSalary + additional + vacation - absencePenalty;

    const totalDeductions = [];
    let totalValueDeducted = 0;
    let subtotalStandarDeductions = 0;
    let subtotalDynamicDeductions = 0;

    resultDataPotongan
      .filter((deduction) => deduction.type === "STA")
      .forEach((deduction) => {
        const valueDeducted =
          baseSalary * toFloatOrZero(deduction.jml_potongan);

        subtotalStandarDeductions += valueDeducted;
        totalValueDeducted += valueDeducted;

        totalDeductions.push({
          ...deduction,
          valueDeducted,
        });
      });

    const salarioStandarRestante = baseSalary - subtotalStandarDeductions;

    resultDataPotongan
      .filter((deduction) => deduction.type === "DIN")
      .forEach((deduction) => {
        let valueDeducted = 0;

        const from = toFloatOrZero(deduction.from);
        const until = toFloatOrZero(deduction.until);
        const porcentaje = toFloatOrZero(deduction.jml_potongan);
        const cuotaInicial = toFloatOrZero(deduction.value_d);

        const totalPayments = totalPaymentsInMonth?.value || -1;
        const payment_frequency = deduction?.payment_frequency || 0;

        const upperBound = until == -1 ? Infinity : until;
        
        if (
          salarioStandarRestante > from && // mayor que el mínimo
          salarioStandarRestante <= upperBound && // dentro del tope (o sin tope)
          (payment_frequency == totalPayments || payment_frequency == "-1") // coincide freq.
        ) {
          const baseGravable = salarioStandarRestante - from;

          valueDeducted = baseGravable * porcentaje + cuotaInicial;

          subtotalDynamicDeductions += valueDeducted;
          totalValueDeducted += valueDeducted;
        }

        totalDeductions.push({
          ...deduction,
          valueDeducted,
        });
      });

    const valueDeducted = salarioStandarRestante - subtotalDynamicDeductions;

    const totalQuitado = totalValueDeducted + absencePenalty;

    const total = roundUp2(valueDeducted < 0 ? 0 : valueDeducted);

    return {
      ...pegawai,
      ...datosPuesto?.dataValues,
      idPuesto,

      id: pegawai.id,
      attendanceId: att.id,
      hadir: att.hadir,
      sakit: att.sakit,
      alpha: att.alpha,
      worked_hours: att.worked_hours,
      additional_payments: att.additional_payments,
      vacation_payments: att.vacation_payments,
      vacation_days: att.vacation_days,
      comment_01: att.comment_01,
      comment_02: att.comment_02,

      salarioEmpleo: datosPuesto?.gaji_pokok,
      salarioInicial: roundUp2(baseSalary), // El salario mas pagos adicionales - sanciones
      salarioBruto: roundUp2(grossSalary), // El salario quinsenal, o semanal
      salarioDeduccionesStandar: roundUp2(salarioStandarRestante),
      salarioDeduccionesDinamicas: roundUp2(valueDeducted),
      salarioTotal: roundUp2(valueDeducted),
      total: roundUp2(total),
      totalWithViatics: roundUp2(total + viaticos),

      // Datos adicionales
      viaticos: roundUp2(viaticos),
      castigo_ausencias: roundUp2(absencePenalty),
      extras: roundUp2(additional + vacation),

      subtotalStandarDeductions: roundUp2(subtotalStandarDeductions),
      subtotalDynamicDeductions: roundUp2(subtotalDynamicDeductions),
      totalDeductions: roundUp2(totalValueDeducted),
      totalQuitado: roundUp2(totalQuitado),

      // parámetros empresa
      duiEmpleador: paramDUIN?.value,
      numeroPatronalISSS: paramNPIS?.value,
      correlativoCentroTrabajoISSS: paramCCTS?.value,
      nombreEmpresa: paramCOMP?.value,
      ubicacionEmpresa: paramADCO?.value,

      // Fechas
      year: att.tahun,
      month: att.bulan,
      day: att.day,

      cantidadPagos: payCount,
      diasTrabajo: workDaysInPeriod,
      dailyRate: dailyRate,

      detallesDeducciones: totalDeductions,
    };
  } catch (error) {
    console.error(error.message);
    return null;
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

// viewDataGajiById
export const viewDataGajiPegawaiById = async (req, res) => {
  try {
    const attendanceId = parseInt(req.params.attendanceId, 10);
    const resultado = await getDataGajiPegawaiById(attendanceId);

    if (!resultado) {
      // TODO revisar
      return res.status(404).json({ error: "Asistencia no encontrada" });
    }
    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: SALARY.INTERNAL_ERROR.code });
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

export const viewChartDataSalaryByGender = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const allKehadiran = await DataKehadiran.findAll({
      attributes: ["bulan", "tahun", "nik"],
      where: { tahun: parseInt(year) },
      raw: true,
    });

    const allPegawai = await DataPegawai.findAll({
      attributes: ["id", "monthly_salary", "jenis_kelamin"],
      raw: true,
    });

    // Mapear empleados por ID para acceso rápido
    const pegawaiMap = {};
    allPegawai.forEach((p) => {
      pegawaiMap[String(p.id)] = {
        salary: parseFloat(p.monthly_salary || 0),
        gender: (p.jenis_kelamin || "").toLowerCase().replace(/\s+/g, ""),
      };
    });

    const salarioPorGeneroYMes = {
      laki: Array(12).fill(0),
      perempuan: Array(12).fill(0),
    };

    allKehadiran.forEach((entry) => {
      const nik = String(entry.nik);
      const pegawai = pegawaiMap[nik];
      if (!pegawai) return;

      const { salary, gender } = pegawai;
      const monthIndex = parseInt(entry.bulan, 10) - 1;

      if (gender.includes("laki-laki")) {
        salarioPorGeneroYMes.laki[monthIndex] += 1;
      } else if (gender.includes("perempuan")) {
        salarioPorGeneroYMes.perempuan[monthIndex] += 1;
      }
    });

    res.json({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      series: [
        {
          name: "Laki-Laki",
          data: salarioPorGeneroYMes.laki.map((v) => Number(v.toFixed(2))),
        },
        {
          name: "Perempuan",
          data: salarioPorGeneroYMes.perempuan.map((v) => Number(v.toFixed(2))),
        },
      ],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      msg: "Error al obtener datos del gráfico de salario por género",
    });
  }
};

export const viewChartDataEmployeeStatus = async (req, res) => {
  try {
    const allEmployees = await DataPegawai.findAll({
      attributes: ["status"],
      raw: true,
    });

    let permanent = 0;
    let temporary = 0;

    allEmployees.forEach((emp) => {
      const status = (emp.status || "").toLowerCase().replace(/\s+/g, "");
      if (status.includes("karyawantetap")) permanent++;
      else if (status.includes("karyawantidaktetap")) temporary++;
    });

    res.json({
      series: [permanent, temporary],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error al contar empleados por tipo" });
  }
};
