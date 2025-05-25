import { jest } from '@jest/globals';
import { Login } from '../controllers/Auth.js';
import DataPegawai from '../models/DataPegawaiModel.js';
import argon2 from 'argon2';

// Mock external dependencies
jest.mock('../models/DataPegawaiModel.js');
jest.mock('argon2');

describe('Auth Controller', () => {
  beforeEach(() => {
    DataPegawai.findOne = jest.fn();
    argon2.verify = jest.fn();
  });

  describe('Login', () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        body: {},
        session: {}, // Mock session object
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      // Reset mocks before each test
      DataPegawai.findOne.mockReset();
      argon2.verify.mockReset();
    });

    // Remove or comment out the placeholder test
    // it('should be a placeholder test', () => {
    //   expect(true).toBe(true);
    // });

    it('should login successfully with correct credentials', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      const mockPegawai = {
        id: 'emp-id-123', // Changed from id_pegawai to id to match controller
        id_pegawai: 'legacy-emp-id-123', // Kept for session.userId if still used like that
        first_name: 'Test',
        middle_name: '',
        last_name: 'User',
        second_last_name: '',
        maiden_name: '',
        username: 'testuser',
        password: 'hashedPassword123', // Hashed password
        hak_akses: 'user',
      };
      DataPegawai.findOne.mockResolvedValue(mockPegawai);
      argon2.verify.mockResolvedValue(true);

      await Login(req, res);

      expect(DataPegawai.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(argon2.verify).toHaveBeenCalledWith('hashedPassword123', 'password123');
      expect(req.session.userId).toBe(mockPegawai.id_pegawai); // Controller uses pegawai.id_pegawai for session
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: mockPegawai.id,
        id_pegawai: mockPegawai.id_pegawai,
        fullName: 'Test User', // Assembled name
        username: mockPegawai.username,
        accessRights: mockPegawai.hak_akses,
        code: 'AUTH-003', // LOGIN.LOGIN_SUCCESS.code
        message: 'Login Berhasil', // LOGIN.LOGIN_SUCCESS.message
      });
    });

    it('should return 404 if user not found', async () => {
      req.body = { username: 'nonexistentuser', password: 'password123' };
      DataPegawai.findOne.mockResolvedValue(null);

      await Login(req, res);

      expect(DataPegawai.findOne).toHaveBeenCalledWith({ where: { username: 'nonexistentuser' } });
      expect(argon2.verify).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: 'AUTH-001' }); // EMPLOYEE.USER_NOT_FOUND.code
    });

    it('should return 400 if password is invalid', async () => {
      req.body = { username: 'testuser', password: 'wrongpassword' };
      const mockPegawai = {
        id_pegawai: 'emp-id-123',
        password: 'hashedPassword123',
        // other necessary fields for the function to not break before argon2.verify
        first_name: 'Test',
        username: 'testuser',
        hak_akses: 'user',
      };
      DataPegawai.findOne.mockResolvedValue(mockPegawai);
      argon2.verify.mockResolvedValue(false);

      await Login(req, res);

      expect(DataPegawai.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(argon2.verify).toHaveBeenCalledWith('hashedPassword123', 'wrongpassword');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'AUTH-002' }); // LOGIN.INVALID_PASSWORD.code
    });
  });

  describe('Me', () => {
    it('should be a placeholder test for Me', () => {
      expect(true).toBe(true);
    });
  });
});
