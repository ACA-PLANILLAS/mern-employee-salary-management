import { jest } from "@jest/globals";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/DataPegawai.js";

// Mock all dependencies
jest.mock("../models/DataPegawaiModel.js", () => ({
  default: {
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn(),
  },
}));

jest.mock("../models/PositionHistoryModel.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    belongsTo: jest.fn(),
  },
}));

jest.mock("../models/PensionInstitutionModel.js", () => ({
  default: {},
}));

jest.mock("../models/DataJabatanModel.js", () => ({
  default: {},
}));

jest.mock("../models/associations.js", () => ({
  setupAssociations: jest.fn(),
}));

jest.mock("../config/Database.js", () => ({
  transaction: jest.fn(),
}));

// Mock the error codes
jest.mock(
  "../errors/pegawaiError.json",
  () => ({
    EMPLOYEE: {
      NOT_FOUND: { code: "EMP-002" },
      DELETE_SUCCESS: { code: "EMP-013" },
      INTERNAL_ERROR: { code: "EMP-015" },
      PHOTO_REQUIRED: { code: "EMP-006" },
      INVALID_PHOTO_FORMAT: { code: "EMP-007" },
      PHOTO_TOO_LARGE: { code: "EMP-008" },
      UPDATE_SUCCESS: { code: "EMP-011" },
      UPDATE_FAILED: { code: "EMP-012" },
      CREATE_SUCCESS: { code: "EMP-010" },
    },
  }),
  { virtual: true }
);
jest.mock(
  "../errors/authError.json",
  () => ({
    PASSWORD: {
      PASSWORD_MISMATCH: { code: "AUTH-009" },
    },
  }),
  { virtual: true }
);

// Import mocked modules
// const DataPegawai = require("../models/DataPegawaiModel.js").default;
// const PositionHistory = require("../models/PositionHistoryModel.js").default;
// const db = require("../config/Database.js");
import DataPegawai from "../models/DataPegawaiModel.js";
import PositionHistory from "../models/PositionHistoryModel.js";
import db from "../config/Database.js";

describe("DataPegawai Controller", () => {
  beforeEach(() => {
    DataPegawai.create = jest.fn();
    DataPegawai.findByPk = jest.fn();
    DataPegawai.update = jest.fn();
    DataPegawai.destroy = jest.fn();
    PositionHistory.create = jest.fn();
    PositionHistory.findOne = jest.fn();
    PositionHistory.update = jest.fn();
    // ... lo que necesites
  });

  describe("createEmployee", () => {
    let req;
    let res;
    let mockTransaction;

    beforeEach(() => {
      req = {
        body: {},
        files: null, // Initialize files to null
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
      db.transaction = jest.fn().mockResolvedValue(mockTransaction);
      // Reset mocks for each test
      DataPegawai.create.mockReset();
      PositionHistory.create.mockReset();
      mockTransaction.commit.mockReset();
      mockTransaction.rollback.mockReset();
      // Reset specific model mocks for createEmployee if they are also used in updateEmployee
      DataPegawai.create.mockReset();
      // PositionHistory.create.mockReset(); // Already reset if using describe block for updateEmployee
    });

    it("should return 400 if passwords do not match", async () => {
      req.body = {
        password: "password123",
        confPassword: "password456",
      };
      // No need to mock files or database calls as it should fail before that

      await createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "AUTH-009", // Password dan Konfirmasi Password Tidak Cocok
      });
      expect(db.transaction).not.toHaveBeenCalled(); // Should not start a transaction
    });

    it("should return 400 if photo is not provided", async () => {
      req.body = {
        // Valid body
        nik: "12345",
        nama_pegawai: "Test User",
        username: "testuser",
        password: "password123",
        confPassword: "password123",
        jenis_kelamin: "Laki-laki",
        jabatan: "Developer",
        tanggal_masuk: "2023-01-01",
        status: "Aktif",
        hak_akses: "user",
      };
      req.files = null; // No photo

      await createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "EMP-006", // Upload Foto Gagal Silahkan Upload Foto Ulang
      });
      expect(db.transaction).not.toHaveBeenCalled();
    });

    it("should return 422 if photo format is invalid", async () => {
      req.body = {
        /* valid body */
      };
      const mockInvalidFormatPhoto = {
        name: "document.txt", // Invalid extension
        data: Buffer.from("fakeimagedata"),
        size: 100000,
        mimetype: "text/plain",
        md5: "mockmd5txt",
        mv: jest.fn().mockImplementation((path, cb) => cb()),
      };
      req.files = { photo: mockInvalidFormatPhoto };

      await createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        msg: "EMP-007", // File Foto Tidak Sesuai Dengan Format
      });
      expect(db.transaction).not.toHaveBeenCalled();
    });
  });

  describe("updateEmployee", () => {
    let req;
    let res;
    let mockTransaction;

    beforeEach(() => {
      req = {
        params: { id: "1" },
        body: {},
        // files: null, // updateEmployee does not handle file uploads in the provided code
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockTransaction = {
        commit: jest.fn().mockResolvedValue(true), // Mock successful commit
        rollback: jest.fn().mockResolvedValue(true), // Mock successful rollback
      };
      db.transaction = jest.fn().mockResolvedValue(mockTransaction);

      // Reset mocks for each test
      DataPegawai.findByPk.mockReset();
      DataPegawai.update.mockReset();
      PositionHistory.findOne.mockReset();
      PositionHistory.create.mockReset();
      PositionHistory.update.mockReset();
      mockTransaction.commit.mockReset();
      mockTransaction.rollback.mockReset();
    });

    it("should update an employee successfully (no position change)", async () => {
      req.body = {
        nik: "12345-updated",
        first_name: "Test User Updated",
        position_id: "pos1", // Current position_id
      };
      const mockEmployee = { id: 1, nik: "12345", first_name: "Test User" };
      const mockPositionHistory = {
        employee_id: 1,
        position_id: "pos1",
        end_date: null,
      };

      DataPegawai.findByPk.mockResolvedValue(mockEmployee);
      PositionHistory.findOne.mockResolvedValue(mockPositionHistory);
      DataPegawai.update.mockResolvedValue([1]); // Sequelize update returns [number of affected rows]

      await updateEmployee(req, res);

      expect(DataPegawai.findByPk).toHaveBeenCalledWith("1");
      // expect(PositionHistory.findOne).toHaveBeenCalledWith({
      //   where: { employee_id: mockEmployee.id },
      //   order: [['createdAt', 'DESC']],
      // });
      expect(DataPegawai.update).toHaveBeenCalled();
      expect(PositionHistory.create).not.toHaveBeenCalled(); // No new position history
      expect(PositionHistory.update).not.toHaveBeenCalled(); // No update to old position history end_date
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "EMP-011" }); // Data Pegawai Berhasil di Perbarui
    });

    it("should return 404 if employee not found", async () => {
      req.params.id = "nonexistent";
      DataPegawai.findByPk.mockResolvedValue(null);

      await updateEmployee(req, res);

      expect(DataPegawai.findByPk).toHaveBeenCalledWith("nonexistent");

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "AUTH-001" });
      expect(db.transaction).not.toHaveBeenCalled();
    });

    it("should return 400 and rollback if database update fails", async () => {
      req.body = {
        nik: "12345-fail",
        first_name: "Test User Fail",
        position_id: "pos1",
      };
      const mockEmployee = { id: 1, nik: "12345", first_name: "Test User" };
      const mockPositionHistory = {
        employee_id: 1,
        position_id: "pos1",
        end_date: null,
      };
      const dbError = new Error("Database update error");

      DataPegawai.findByPk.mockResolvedValue(mockEmployee);
      PositionHistory.findOne.mockResolvedValue(mockPositionHistory);
      DataPegawai.update.mockRejectedValue(dbError); // Simulate error during DataPegawai.update

      await updateEmployee(req, res);

      expect(DataPegawai.findByPk).toHaveBeenCalledWith("1");
      expect(PositionHistory.findOne).toHaveBeenCalled();
      expect(DataPegawai.update).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "EMP-012" }); // Gagal memperbarui data pegawai
    });

    it("should return 400 and rollback if PositionHistory.create fails (during position change)", async () => {
      req.body = { position_id: "pos-new" }; // Trigger position change
      const mockEmployee = { id: 1, nik: "123", first_name: "Test" };
      const mockOldPositionHistory = { employee_id: 1, position_id: "pos-old" };
      const dbError = new Error("PositionHistory.create error");

      DataPegawai.findByPk.mockResolvedValue(mockEmployee);
      PositionHistory.findOne.mockResolvedValue(mockOldPositionHistory);
      PositionHistory.create.mockRejectedValue(dbError); // Simulate error

      await updateEmployee(req, res);

      expect(db.transaction).toHaveBeenCalled();
      expect(PositionHistory.create).toHaveBeenCalled();
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "EMP-012" });
    });

    it("should return 400 and rollback if PositionHistory.update fails (during position change)", async () => {
      req.body = { position_id: "pos-new" }; // Trigger position change
      const mockEmployee = { id: 1, nik: "123", first_name: "Test" };
      const mockOldPositionHistory = {
        employee_id: 1,
        position_id: "pos-old",
        end_date: null,
      }; // end_date is null to trigger update
      const dbError = new Error("PositionHistory.update error");

      DataPegawai.findByPk.mockResolvedValue(mockEmployee);
      PositionHistory.findOne.mockResolvedValue(mockOldPositionHistory);
      PositionHistory.create.mockResolvedValue({}); // This one succeeds
      PositionHistory.update.mockRejectedValue(dbError); // This one fails

      await updateEmployee(req, res);

      expect(db.transaction).toHaveBeenCalled();
      expect(PositionHistory.create).toHaveBeenCalled();
      expect(PositionHistory.update).toHaveBeenCalled();
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "EMP-012" });
    });
  });

  describe("deleteEmployee", () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        params: { id: "1" }, // Default mock id
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      // Reset mocks for each test
      DataPegawai.findByPk.mockReset();
      DataPegawai.destroy.mockReset();
    });

    it("should delete an employee successfully", async () => {
      const mockEmployee = {
        id: 1,
        nik: "12345",
        nama_pegawai: "Test User to Delete",
      };
      DataPegawai.findByPk.mockResolvedValue(mockEmployee);
      DataPegawai.destroy.mockResolvedValue(1); // Simulate successful deletion (returns number of affected rows)

      await deleteEmployee(req, res);

      expect(DataPegawai.findByPk).toHaveBeenCalledWith("1");
      expect(DataPegawai.destroy).toHaveBeenCalledWith({
        where: { id: mockEmployee.id },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "EMP-013" }); // EMPLOYEE.DELETE_SUCCESS.code
    });

    it("should return 404 if employee to delete is not found", async () => {
      req.params.id = "nonexistent-id";
      DataPegawai.findByPk.mockResolvedValue(null);

      await deleteEmployee(req, res);

      expect(DataPegawai.findByPk).toHaveBeenCalledWith("nonexistent-id");
      expect(DataPegawai.destroy).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "AUTH-001" });
    });

    it("should return 500 if database error occurs during deletion", async () => {
      const mockEmployee = { id: 1, nik: "12345", nama_pegawai: "Test User" };
      const dbError = new Error("Database deletion error");

      DataPegawai.findByPk.mockResolvedValue(mockEmployee);
      DataPegawai.destroy.mockRejectedValue(dbError);

      await deleteEmployee(req, res);

      expect(DataPegawai.findByPk).toHaveBeenCalledWith("1");
      expect(DataPegawai.destroy).toHaveBeenCalledWith({
        where: { id: mockEmployee.id },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "EMP-015" }); // EMPLOYEE.INTERNAL_ERROR.code
    });
  });
});
