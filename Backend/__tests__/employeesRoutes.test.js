import request from 'supertest';
import app from '../app.js'; // Asegúrate de que `app` sea tu instancia de Express
import DataPegawaiModel from '../models/DataPegawaiModel.js';

jest.mock('../models/DataPegawaiModel.js', () => ({
  bulkCreate: jest.fn(() => Promise.resolve()),
  findAll: jest.fn(() => Promise.resolve([
    { id: 1, name: 'John Doe', nik: '123456' },
    { id: 2, name: 'Jane Smith', nik: '654321' },
  ])),
  findOne: jest.fn((query) => {
    const id = query.where.id;
    if (id === 1) {
      return Promise.resolve({ id: 1, name: 'John Doe', nik: '123456' });
    }
    return Promise.resolve(null);
  }),
  // No uses hasMany en el mock
}));

describe('Employees Routes - GET Methods', () => {
  beforeAll(async () => {
    // No es necesario sincronizar la base de datos porque los métodos están simulados
  });

  afterAll(async () => {
    // No es necesario cerrar la conexión porque los métodos están simulados
  });

  it('debería devolver una lista de empleados', async () => {
    const response = await request(app).get('/employees');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('id', 1);
    expect(response.body[0]).toHaveProperty('name', 'John Doe');
  });

  it('debería devolver un empleado existente por ID', async () => {
    const response = await request(app).get('/employees/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('name', 'John Doe');
  });

  it('debería devolver un error 404 si el empleado no existe', async () => {
    const response = await request(app).get('/employees/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Empleado no encontrado');
  });
});
