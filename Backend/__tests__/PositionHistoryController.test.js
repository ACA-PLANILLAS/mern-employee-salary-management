import { jest } from "@jest/globals";
import {
  getAllPositionHistories,
  getPositionHistoryById,
  createPositionHistory,
  updatePositionHistory,
  deletePositionHistory,
} from "../controllers/PositionHistoryController.js";
import PositionHistory from "../models/PositionHistoryModel.js";
import histError from "../errors/positionHistoryError.json";

const { POSITION_HISTORY } = histError;

// Mock the PositionHistoryModel
jest.mock("../models/PositionHistoryModel.js");

describe("PositionHistoryController", () => {
  let req;
  let res;

  beforeEach(() => {
    PositionHistory.findAll = jest.fn();
    PositionHistory.findByPk = jest.fn();
    PositionHistory.create = jest.fn();
    // ... lo que necesites
  });

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Reset mocks before each test
    PositionHistory.findAll.mockReset();
    PositionHistory.findByPk.mockReset();
    PositionHistory.create.mockReset();
    // PositionHistory.update.mockReset(); // .update is a method of an instance, not the model itself
    // PositionHistory.destroy.mockReset(); // .destroy is a method of an instance
  });

  describe("getAllPositionHistories", () => {
    it("should return an array of position histories and success code", async () => {
      const mockHistories = [
        { id: 1, employee_id: 1, position_id: 1, start_date: "2023-01-01" },
      ];
      PositionHistory.findAll.mockResolvedValue(mockHistories);

      await getAllPositionHistories(req, res);

      expect(PositionHistory.findAll).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(POSITION_HISTORY.SUCCESS.status);
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.SUCCESS.code,
        data: mockHistories,
      });
    });

    it("should return server error if database query fails", async () => {
      PositionHistory.findAll.mockRejectedValue(new Error("DB Error"));

      await getAllPositionHistories(req, res);

      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.SERVER_ERROR.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.SERVER_ERROR.code,
        message: POSITION_HISTORY.SERVER_ERROR.message,
      });
    });
  });

  describe("getPositionHistoryById", () => {
    it("should return a single position history and success code if found", async () => {
      req.params.id = "1";
      const mockHistory = {
        id: 1,
        employee_id: 1,
        position_id: 1,
        start_date: "2023-01-01",
      };
      PositionHistory.findByPk.mockResolvedValue(mockHistory);

      await getPositionHistoryById(req, res);

      expect(PositionHistory.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(POSITION_HISTORY.SUCCESS.status);
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.SUCCESS.code,
        data: mockHistory,
      });
    });

    it("should return not found error if position history is not found", async () => {
      req.params.id = "999";
      PositionHistory.findByPk.mockResolvedValue(null);

      await getPositionHistoryById(req, res);

      expect(PositionHistory.findByPk).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.NOT_FOUND.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.NOT_FOUND.code,
        message: POSITION_HISTORY.NOT_FOUND.message,
      });
    });

    it("should return server error if database query fails", async () => {
      req.params.id = "1";
      PositionHistory.findByPk.mockRejectedValue(new Error("DB Error"));

      await getPositionHistoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.SERVER_ERROR.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.SERVER_ERROR.code,
        message: POSITION_HISTORY.SERVER_ERROR.message,
      });
    });
  });

  describe("createPositionHistory", () => {
    const validHistoryData = {
      employee_id: 1,
      position_id: 1,
      start_date: "2023-01-01",
    };
    const validHistoryDataWithEndDate = {
      ...validHistoryData,
      end_date: "2023-12-31",
    };

    it("should create and return a new position history with success code (no end_date)", async () => {
      req.body = validHistoryData;
      const createdHistory = { id: 1, ...validHistoryData };
      PositionHistory.create.mockResolvedValue(createdHistory);

      await createPositionHistory(req, res);

      expect(PositionHistory.create).toHaveBeenCalledWith(validHistoryData);
      expect(res.status).toHaveBeenCalledWith(POSITION_HISTORY.SUCCESS.status);
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.SUCCESS.code,
        data: createdHistory,
      });
    });

    it("should create and return a new position history with success code (with end_date)", async () => {
      req.body = validHistoryDataWithEndDate;
      const createdHistory = { id: 1, ...validHistoryDataWithEndDate };
      PositionHistory.create.mockResolvedValue(createdHistory);

      await createPositionHistory(req, res);

      expect(PositionHistory.create).toHaveBeenCalledWith(
        validHistoryDataWithEndDate
      );
      expect(res.status).toHaveBeenCalledWith(POSITION_HISTORY.SUCCESS.status);
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.SUCCESS.code,
        data: createdHistory,
      });
    });

    it("should return missing data error if employee_id is missing", async () => {
      req.body = { position_id: 1, start_date: "2023-01-01" };
      await createPositionHistory(req, res);
      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.MISSING_DATA.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.MISSING_DATA.code,
        message: POSITION_HISTORY.MISSING_DATA.message,
      });
    });

    it("should return missing data error if position_id is missing", async () => {
      req.body = { employee_id: 1, start_date: "2023-01-01" };
      await createPositionHistory(req, res);
      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.MISSING_DATA.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.MISSING_DATA.code,
        message: POSITION_HISTORY.MISSING_DATA.message,
      });
    });

    it("should return missing data error if start_date is missing", async () => {
      req.body = { employee_id: 1, position_id: 1 };
      await createPositionHistory(req, res);
      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.MISSING_DATA.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.MISSING_DATA.code,
        message: POSITION_HISTORY.MISSING_DATA.message,
      });
    });

    it("should return creation failed error if database query fails", async () => {
      req.body = validHistoryData;
      PositionHistory.create.mockRejectedValue(new Error("DB Error"));

      await createPositionHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.CREATE_FAILED.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.CREATE_FAILED.code,
        message: POSITION_HISTORY.CREATE_FAILED.message,
      });
    });
  });

  describe("updatePositionHistory", () => {
    const updateData = { start_date: "2023-02-01", end_date: "2024-01-01" };
    let mockHistoryInstance;

    beforeEach(() => {
      mockHistoryInstance = {
        id: 1,
        employee_id: 1,
        position_id: 1,
        start_date: "2023-01-01",
        update: jest.fn().mockResolvedValue(this), // 'this' refers to the instance itself after update
        // Simulating the behavior where the instance is updated and returned.
      };
    });

    it("should update and return the position history with success code", async () => {
      req.params.id = "1";
      req.body = updateData;
      PositionHistory.findByPk.mockResolvedValue(mockHistoryInstance);
      // The mock for `update` is on the instance, so after findByPk resolves,
      // hist.update(req.body) will use mockHistoryInstance.update.
      // We also need to ensure the data returned in res.json is the updated instance.
      // One way is to have the mock `update` modify the instance or return the updated data.
      // For simplicity, we assume `mockHistoryInstance.update` updates the instance in place
      // and the controller sends back `mockHistoryInstance`.
      // Let's refine the mock to reflect the update:
      mockHistoryInstance.update = jest.fn(async (newData) => {
        Object.assign(mockHistoryInstance, newData);
        return mockHistoryInstance;
      });

      await updatePositionHistory(req, res);

      expect(PositionHistory.findByPk).toHaveBeenCalledWith("1");
      expect(mockHistoryInstance.update).toHaveBeenCalledWith(updateData);
      expect(res.status).toHaveBeenCalledWith(POSITION_HISTORY.SUCCESS.status);
      // The data sent back should be the instance after update
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.SUCCESS.code,
        data: expect.objectContaining(updateData),
      });
    });

    it("should return not found error if position history to update is not found", async () => {
      req.params.id = "999";
      req.body = updateData;
      PositionHistory.findByPk.mockResolvedValue(null);

      await updatePositionHistory(req, res);

      expect(PositionHistory.findByPk).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.NOT_FOUND.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.NOT_FOUND.code,
        message: POSITION_HISTORY.NOT_FOUND.message,
      });
    });

    it("should return update failed error if database query fails", async () => {
      req.params.id = "1";
      req.body = updateData;
      PositionHistory.findByPk.mockResolvedValue(mockHistoryInstance);
      mockHistoryInstance.update.mockRejectedValue(new Error("DB Error")); // Mock the instance's update method

      await updatePositionHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.UPDATE_FAILED.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.UPDATE_FAILED.code,
        message: POSITION_HISTORY.UPDATE_FAILED.message,
      });
    });
  });

  describe("deletePositionHistory", () => {
    let mockHistoryInstance;

    beforeEach(() => {
      mockHistoryInstance = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(1), // Indicates successful deletion
      };
    });

    it("should delete the position history and return success message", async () => {
      req.params.id = "1";
      PositionHistory.findByPk.mockResolvedValue(mockHistoryInstance);

      await deletePositionHistory(req, res);

      expect(PositionHistory.findByPk).toHaveBeenCalledWith("1");
      expect(mockHistoryInstance.destroy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(POSITION_HISTORY.SUCCESS.status);
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.SUCCESS.code,
        message: POSITION_HISTORY.SUCCESS.message,
      });
    });

    it("should return not found error if position history to delete is not found", async () => {
      req.params.id = "999";
      PositionHistory.findByPk.mockResolvedValue(null);

      await deletePositionHistory(req, res);

      expect(PositionHistory.findByPk).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.NOT_FOUND.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.NOT_FOUND.code,
        message: POSITION_HISTORY.NOT_FOUND.message,
      });
    });

    it("should return delete failed error if database query fails", async () => {
      req.params.id = "1";
      PositionHistory.findByPk.mockResolvedValue(mockHistoryInstance);
      mockHistoryInstance.destroy.mockRejectedValue(new Error("DB Error"));

      await deletePositionHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(
        POSITION_HISTORY.DELETE_FAILED.status
      );
      expect(res.json).toHaveBeenCalledWith({
        code: POSITION_HISTORY.DELETE_FAILED.code,
        message: POSITION_HISTORY.DELETE_FAILED.message,
      });
    });
  });
});