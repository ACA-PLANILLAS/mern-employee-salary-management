import { jest } from '@jest/globals';
import { getEmployee, createEmployee } from '../controllers/DataPegawai.js';

describe('EmployeeController', () => {
  describe('getEmployee', () => {
    it('debería devolver un empleado existente', async () => {
      const req = { params: { id: '123' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const next = jest.fn();

      await getEmployee(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: '123' }));
    });

    it('debería manejar errores correctamente', async () => {
      const req = { params: { id: 'invalid' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const next = jest.fn();

      await getEmployee(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Empleado no encontrado' });
    });
  });

  describe('createEmployee', () => {
    it('debería crear un nuevo empleado correctamente', async () => {
      const req = { body: { name: 'John Doe', salary: 5000 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const next = jest.fn();

      await createEmployee(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe', salary: 5000 }));
    });

    it('debería manejar errores de validación', async () => {
      const req = { body: { name: '', salary: -100 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const next = jest.fn();

      await createEmployee(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Datos inválidos' });
    });
  });
});
