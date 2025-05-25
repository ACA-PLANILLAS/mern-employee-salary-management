import { jest } from '@jest/globals';
import {
    getAllParameter,
    getParameterById,
    getParameterByType,
    updateParameter
} from '../controllers/ParametersController.js';
import Parameter from '../models/ParameterModel.js';
import parameterError from '../errors/ParameterError.json';

const { PARAMETER } = parameterError;

// Mock the ParameterModel
jest.mock('../models/ParameterModel.js');

describe('ParametersController', () => {
    let req;
    let res;
    let consoleSpy;

     beforeEach(() => {
     Parameter.findAll = jest.fn();
        Parameter.findOne= jest.fn();
        Parameter.update= jest.fn();
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
        // Spy on console.log and keep original implementation
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        // Reset mocks before each test
        Parameter.findAll.mockReset();
        Parameter.findOne.mockReset();
        Parameter.update.mockReset();
    });

    afterEach(() => {
        // Restore console.log
        consoleSpy.mockRestore();
    });

    describe('getAllParameter', () => {
        it('should return an array of parameters and status 200', async () => {
            const mockParameters = [{ id: 1, name: 'Param1', value: 'Value1' }];
            Parameter.findAll.mockResolvedValue(mockParameters);

            await getAllParameter(req, res);

            expect(Parameter.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockParameters);
        });

        it('should return status 500 and error message if database query fails', async () => {
            Parameter.findAll.mockRejectedValue(new Error('DB Error'));

            await getAllParameter(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: PARAMETER.SERVER_ERROR.code });
            expect(consoleSpy).toHaveBeenCalledWith("\n>>> ", "DB Error");
        });
    });

    describe('getParameterById', () => {
        it('should return a single parameter and status 200 if found', async () => {
            req.params.id = '1';
            const mockParameter = { id: 1, name: 'Param1', value: 'Value1' };
            Parameter.findOne.mockResolvedValue(mockParameter);

            await getParameterById(req, res);

            expect(Parameter.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockParameter);
        });

        it('should return status 404 and error message if parameter not found', async () => {
            req.params.id = '999';
            Parameter.findOne.mockResolvedValue(null);

            await getParameterById(req, res);

            expect(Parameter.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return status 500 and error message if database query fails', async () => {
            req.params.id = '1';
            Parameter.findOne.mockRejectedValue(new Error('DB Error'));

            await getParameterById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: PARAMETER.SERVER_ERROR.code });
            expect(consoleSpy).toHaveBeenCalledWith("\n>>> ", "DB Error");
        });
    });

    describe('getParameterByType', () => {
        it('should return an array of parameters and status 200 if found by type', async () => {
            req.params.type = 'TYPEA';
            const mockParameters = [{ id: 1, name: 'Param1', value: 'Value1', type: 'TYPEA' }];
            Parameter.findAll.mockResolvedValue(mockParameters);

            await getParameterByType(req, res);

            expect(Parameter.findAll).toHaveBeenCalledWith({ where: { type: 'TYPEA' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockParameters);
        });

        it('should return status 404 and error message if no parameters match the type (controller returns what findAll returns, which might be an empty array)', async () => {
            req.params.type = 'UNKNOWN_TYPE';
            // The controller sends 200 with empty array if findAll resolves to empty.
            // To test the 404 path, we'd need findAll to return null/undefined which isn't standard for findAll.
            // The controller has `if (response)` which for an empty array is true.
            // Let's assume the intention was `if (response && response.length > 0)` for the 404.
            // Given the current code, an empty array will be returned with 200.
            // To hit the 404, `Parameter.findAll` must return a falsy value (e.g. null).
            Parameter.findAll.mockResolvedValue(null);


            await getParameterByType(req, res);

            expect(Parameter.findAll).toHaveBeenCalledWith({ where: { type: 'UNKNOWN_TYPE' } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: PARAMETER.PARAMETER_NOT_FOUND.code });
        });
        
        it('should return status 200 and empty array if parameters of type found but list is empty', async () => {
            req.params.type = 'TYPE_EMPTY';
            Parameter.findAll.mockResolvedValue([]); // Simulate type exists but no parameters for it

            await getParameterByType(req, res);
            expect(Parameter.findAll).toHaveBeenCalledWith({ where: { type: 'TYPE_EMPTY' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });


        it('should return status 500 and error message if database query fails', async () => {
            req.params.type = 'TYPEA';
            Parameter.findAll.mockRejectedValue(new Error('DB Error'));

            await getParameterByType(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: PARAMETER.SERVER_ERROR.code });
            expect(consoleSpy).toHaveBeenCalledWith("\n>>> ", "DB Error");
        });
    });

    describe('updateParameter', () => {
        beforeEach(() => {
            req.body = {
                id: '1',
                name: 'Updated Param',
                value: 'Updated Value'
            };
        });

        it('should return status 200 and success message if update is successful', async () => {
            Parameter.update.mockResolvedValue([1]); // Indicates 1 row updated

            await updateParameter(req, res);

            expect(Parameter.update).toHaveBeenCalledWith(
                { name: 'Updated Param', value: 'Updated Value' },
                { where: { id: '1' } }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: PARAMETER.SUCCESS.code });
        });

        it('should return status 404 and error message if the parameter to update is not found', async () => {
            Parameter.update.mockResolvedValue([0]); // Indicates 0 rows updated

            await updateParameter(req, res);

            expect(Parameter.update).toHaveBeenCalledWith(
                { name: 'Updated Param', value: 'Updated Value' },
                { where: { id: '1' } }
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: PARAMETER.PARAMETER_NOT_FOUND.code });
        });

        it('should return status 500 and error message if database query fails', async () => {
            Parameter.update.mockRejectedValue(new Error('DB Error'));

            await updateParameter(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: PARAMETER.SERVER_ERROR.code });
            expect(consoleSpy).toHaveBeenCalledWith("\n>>> ", "DB Error");
        });
    });
});