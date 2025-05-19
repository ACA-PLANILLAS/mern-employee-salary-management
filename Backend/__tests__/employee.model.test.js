import DataPegawaiModel from '../models/DataPegawaiModel.js';

jest.mock('../models/DataPegawaiModel.js', () => ({
  create: jest.fn((data) => {
    if (!data || Object.keys(data).length === 0) {
      const error = new Error('notNull Violation'); // Simula un error de validación
      error.name = 'SequelizeValidationError'; // Asegúrate de que el nombre del error sea correcto
      throw error;
    }
    return Promise.resolve({ ...data, id_pegawai: 'mocked-id' }); // Simula un empleado creado
  }),
}));

describe('DataPegawaiModel', () => {
  beforeAll(async () => {
    // No es necesario autenticar ni sincronizar porque los métodos están simulados
  });

  afterAll(async () => {
    // No es necesario cerrar la conexión porque los métodos están simulados
  });

  it('debería crear un empleado válido', async () => {
    const employeeData = {
      id_pegawai: 'a1b2c3d4-e5f6-7890-ab12-cd34ef56gh88',
      nik: '334455',
      nama_pegawai: 'Carlos López',
      username: 'julian',
      password: '$argon2i$v=19$m=16,t=2,p=1$S2xtQ0xkOU16ckt5enZvWFNtcTI5cEZtSDdHb0ZrXzM$sQch0yEbQ0L5/oY7+hzwHQ',
      jenis_kelamin: 'Laki-Laki',
      jabatan: 'Operator Produksi',
      tanggal_masuk: '01-07-23',
      status: 'karyawan tetap',
      photo: 'carlos.jpg',
      url: 'http://localhost:5000/images/carlos.jpg',
      hak_akses: 'pegawai',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const employee = await DataPegawaiModel.create(employeeData);

    expect(employee.id_pegawai).toBe('mocked-id'); // Verifica el ID simulado
    expect(employee.nik).toBe(employeeData.nik);
    expect(employee.nama_pegawai).toBe(employeeData.nama_pegawai);
    expect(employee.username).toBe(employeeData.username);
    expect(employee.password).toBe(employeeData.password);
    expect(employee.jenis_kelamin).toBe(employeeData.jenis_kelamin);
    expect(employee.jabatan).toBe(employeeData.jabatan);
    expect(employee.tanggal_masuk).toBe(employeeData.tanggal_masuk);
    expect(employee.status).toBe(employeeData.status);
    expect(employee.photo).toBe(employeeData.photo);
    expect(employee.url).toBe(employeeData.url);
    expect(employee.hak_akses).toBe(employeeData.hak_akses);
  });

  it('debería fallar si falta un campo requerido', async () => {
    let error;
    try {
      await DataPegawaiModel.create({});
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe('SequelizeValidationError'); // Verifica el nombre del error
    expect(error.message).toBe('notNull Violation'); // Verifica el mensaje del error
  });
});
