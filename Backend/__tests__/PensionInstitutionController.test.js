import { jest } from '@jest/globals';
import {
    getAllPensionInstitutions,
    getPensionInstitutionByCode,
    createPensionInstitution,
    updatePensionInstitution,
    deletePensionInstitution
} from '../controllers/PensionInstitutionController.js';
import PensionInstitution from '../models/PensionInstitutionModel.js';
import pensError from '../errors/pensionInstitutionError.json';

const { PENSION_INSTITUTION } = pensError;

// Mock the PensionInstitutionModel
jest.mock('../models/PensionInstitutionModel.js');

describe('PensionInstitutionController', () => {
    let req;
    let res;

      beforeEach(() => {      
        PensionInstitution.findAll= jest.fn();
        PensionInstitution.findByPk= jest.fn();
        PensionInstitution.create= jest.fn();
    // ... lo que necesites
  });

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Reset mocks before each test
        PensionInstitution.findAll.mockReset();
        PensionInstitution.findByPk.mockReset();
        PensionInstitution.create.mockReset();
        // Instance methods like update and destroy will be mocked on the instances themselves
    });

    describe('getAllPensionInstitutions', () => {
        it('should return an array of pension institutions and success code', async () => {
            const mockInstitutions = [{ code: 'AFP01', name: 'AFP Crecer', institution_type: 'AFP' }];
            PensionInstitution.findAll.mockResolvedValue(mockInstitutions);

            await getAllPensionInstitutions(req, res);

            expect(PensionInstitution.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.SUCCESS.status);
            expect(res.json).toHaveBeenCalledWith({ code: PENSION_INSTITUTION.SUCCESS.code, data: mockInstitutions });
        });

        it('should return server error if database query fails', async () => {
            PensionInstitution.findAll.mockRejectedValue(new Error('DB Error'));

            await getAllPensionInstitutions(req, res);

            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.SERVER_ERROR.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.SERVER_ERROR.code,
                message: PENSION_INSTITUTION.SERVER_ERROR.message,
            });
        });
    });

    describe('getPensionInstitutionByCode', () => {
        it('should return a single pension institution and success code if found', async () => {
            req.params.code = 'AFP01';
            const mockInstitution = { code: 'AFP01', name: 'AFP Crecer', institution_type: 'AFP' };
            PensionInstitution.findByPk.mockResolvedValue(mockInstitution);

            await getPensionInstitutionByCode(req, res);

            expect(PensionInstitution.findByPk).toHaveBeenCalledWith('AFP01');
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.SUCCESS.status);
            expect(res.json).toHaveBeenCalledWith({ code: PENSION_INSTITUTION.SUCCESS.code, data: mockInstitution });
        });

        it('should return not found error if pension institution is not found', async () => {
            req.params.code = 'XXX99';
            PensionInstitution.findByPk.mockResolvedValue(null);

            await getPensionInstitutionByCode(req, res);

            expect(PensionInstitution.findByPk).toHaveBeenCalledWith('XXX99');
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.NOT_FOUND.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.NOT_FOUND.code,
                message: PENSION_INSTITUTION.NOT_FOUND.message,
            });
        });

        it('should return server error if database query fails', async () => {
            req.params.code = 'AFP01';
            PensionInstitution.findByPk.mockRejectedValue(new Error('DB Error'));

            await getPensionInstitutionByCode(req, res);

            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.SERVER_ERROR.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.SERVER_ERROR.code,
                message: PENSION_INSTITUTION.SERVER_ERROR.message,
            });
        });
    });

    describe('createPensionInstitution', () => {
        const validInstitutionData = { code: 'AFP02', name: 'AFP Confia', institution_type: 'AFP' };

        it('should create and return a new pension institution with success code', async () => {
            req.body = validInstitutionData;
            // The create method directly returns the created instance
            PensionInstitution.create.mockResolvedValue(validInstitutionData);

            await createPensionInstitution(req, res);

            expect(PensionInstitution.create).toHaveBeenCalledWith(validInstitutionData);
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.SUCCESS.status);
            expect(res.json).toHaveBeenCalledWith({ code: PENSION_INSTITUTION.SUCCESS.code, data: validInstitutionData });
        });

        it('should return missing data error if code is missing', async () => {
            req.body = { name: 'AFP Confia', institution_type: 'AFP' };
            await createPensionInstitution(req, res);
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.MISSING_DATA.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.MISSING_DATA.code,
                message: PENSION_INSTITUTION.MISSING_DATA.message,
            });
        });

        it('should return missing data error if name is missing', async () => {
            req.body = { code: 'AFP02', institution_type: 'AFP' };
            await createPensionInstitution(req, res);
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.MISSING_DATA.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.MISSING_DATA.code,
                message: PENSION_INSTITUTION.MISSING_DATA.message,
            });
        });

        it('should return missing data error if institution_type is missing', async () => {
            req.body = { code: 'AFP02', name: 'AFP Confia' };
            await createPensionInstitution(req, res);
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.MISSING_DATA.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.MISSING_DATA.code,
                message: PENSION_INSTITUTION.MISSING_DATA.message,
            });
        });

        it('should return creation failed error if database query fails (e.g. duplicate code)', async () => {
            req.body = validInstitutionData;
            PensionInstitution.create.mockRejectedValue(new Error('DB Error or Duplicate Entry'));

            await createPensionInstitution(req, res);

            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.CREATE_FAILED.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.CREATE_FAILED.code,
                message: PENSION_INSTITUTION.CREATE_FAILED.message,
            });
        });
    });

    describe('updatePensionInstitution', () => {
        const updateData = { name: 'AFP Crecer Updated', institution_type: 'AFP' };
        let mockInstitutionInstance;

        beforeEach(() => {
            mockInstitutionInstance = {
                code: 'AFP01',
                name: 'AFP Crecer',
                institution_type: 'AFP',
                update: jest.fn().mockImplementation(async (newData) => {
                    Object.assign(mockInstitutionInstance, newData);
                    return mockInstitutionInstance;
                }),
            };
        });

        it('should update and return the pension institution with success code', async () => {
            req.params.code = 'AFP01';
            req.body = updateData;
            PensionInstitution.findByPk.mockResolvedValue(mockInstitutionInstance);

            await updatePensionInstitution(req, res);

            expect(PensionInstitution.findByPk).toHaveBeenCalledWith('AFP01');
            expect(mockInstitutionInstance.update).toHaveBeenCalledWith(updateData);
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.SUCCESS.status);
            expect(res.json).toHaveBeenCalledWith({ code: PENSION_INSTITUTION.SUCCESS.code, data: expect.objectContaining(updateData) });
        });

        it('should return not found error if pension institution to update is not found', async () => {
            req.params.code = 'XXX99';
            req.body = updateData;
            PensionInstitution.findByPk.mockResolvedValue(null);

            await updatePensionInstitution(req, res);

            expect(PensionInstitution.findByPk).toHaveBeenCalledWith('XXX99');
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.NOT_FOUND.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.NOT_FOUND.code,
                message: PENSION_INSTITUTION.NOT_FOUND.message,
            });
        });

        it('should return update failed error if database query fails', async () => {
            req.params.code = 'AFP01';
            req.body = updateData;
            PensionInstitution.findByPk.mockResolvedValue(mockInstitutionInstance);
            mockInstitutionInstance.update.mockRejectedValue(new Error('DB Error'));

            await updatePensionInstitution(req, res);

            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.UPDATE_FAILED.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.UPDATE_FAILED.code,
                message: PENSION_INSTITUTION.UPDATE_FAILED.message,
            });
        });
    });

    describe('deletePensionInstitution', () => {
        let mockInstitutionInstance;

        beforeEach(() => {
            mockInstitutionInstance = {
                code: 'AFP01',
                destroy: jest.fn().mockResolvedValue(1) // Indicates successful deletion
            };
        });

        it('should delete the pension institution and return success message', async () => {
            req.params.code = 'AFP01';
            PensionInstitution.findByPk.mockResolvedValue(mockInstitutionInstance);

            await deletePensionInstitution(req, res);

            expect(PensionInstitution.findByPk).toHaveBeenCalledWith('AFP01');
            expect(mockInstitutionInstance.destroy).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.SUCCESS.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.SUCCESS.code,
                message: PENSION_INSTITUTION.SUCCESS.message,
            });
        });

        it('should return not found error if pension institution to delete is not found', async () => {
            req.params.code = 'XXX99';
            PensionInstitution.findByPk.mockResolvedValue(null);

            await deletePensionInstitution(req, res);

            expect(PensionInstitution.findByPk).toHaveBeenCalledWith('XXX99');
            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.NOT_FOUND.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.NOT_FOUND.code,
                message: PENSION_INSTITUTION.NOT_FOUND.message,
            });
        });

        it('should return delete failed error if database query fails', async () => {
            req.params.code = 'AFP01';
            PensionInstitution.findByPk.mockResolvedValue(mockInstitutionInstance);
            mockInstitutionInstance.destroy.mockRejectedValue(new Error('DB Error'));

            await deletePensionInstitution(req, res);

            expect(res.status).toHaveBeenCalledWith(PENSION_INSTITUTION.DELETE_FAILED.status);
            expect(res.json).toHaveBeenCalledWith({
                code: PENSION_INSTITUTION.DELETE_FAILED.code,
                message: PENSION_INSTITUTION.DELETE_FAILED.message,
            });
        });
    });
});