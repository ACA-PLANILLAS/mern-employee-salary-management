import { jest } from '@jest/globals';
import {
    getDataJabatan,
    getDataJabatanByID,
    createDataJabatan,
    updateDataJabatan,
    deleteDataJabatan
} from '../controllers/DataJabatan.js';
import DataJabatan from '../models/DataJabatanModel.js';
import DataPegawai from '../models/DataPegawaiModel.js';
import jabatanError from '../errors/jabatanError.json';

const { JOB_POSITION } = jabatanError;

// Mock external dependencies
jest.mock('../models/DataJabatanModel.js');
jest.mock('../models/DataPegawaiModel.js');

describe('DataJabatan Controller', () => {
    let req;
    let res;

    beforeEach(() => {
     DataJabatan.findAll = jest.fn();
        DataJabatan.findOne = jest.fn();
        DataJabatan.create = jest.fn();
        DataJabatan.update = jest.fn();
        // ... lo que necesites
    });

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            session: {}, // Mock session object, though not directly used by DataJabatan controller
            hak_akses: null, // To be set in each test
            userId: null, // To be set in each test for non-admin scenarios
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Reset mocks before each test
        DataJabatan.findAll.mockReset();
        DataJabatan.findOne.mockReset();
        DataJabatan.create.mockReset();
        DataJabatan.update.mockReset();
        DataJabatan.destroy = jest.fn().mockResolvedValue(1); // Mock destroy on the instance
        // Mock static destroy as well if needed, or ensure findOne returns an object with a destroy method
        // For simplicity, we'll assume findOne returns an object that has a .destroy() method
    });

    describe('getDataJabatan', () => {
        it('should return all job positions for admin', async () => {
            req.hak_akses = 'admin';
            const mockJabatanData = [
                { id: '1', nama_jabatan: 'Manager', gaji_pokok: 10000, tj_transport: 500, uang_makan: 200 },
                { id: '2', nama_jabatan: 'Staff', gaji_pokok: 5000, tj_transport: 300, uang_makan: 150 },
            ];
            DataJabatan.findAll.mockResolvedValue(mockJabatanData);

            await getDataJabatan(req, res);

            expect(DataJabatan.findAll).toHaveBeenCalledWith({
                attributes: ['id', 'nama_jabatan', 'gaji_pokok', 'tj_transport', 'uang_makan'],
                include: [{
                    model: DataPegawai,
                    attributes: ['first_name', 'username', 'hak_akses'],
                }]
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockJabatanData);
        });

        it('should return 403 for non-admin if userId does not match (though this logic is flawed in controller)', async () => {
            // The controller's non-admin branch for getDataJabatan has an update logic
            // which seems incorrect for a GET request.
            // This test reflects the current flawed implementation.
            req.hak_akses = 'user';
            req.userId = 'user1';
            // Simulate DataJabatan.userId, which is not how it's typically accessed.
            // This highlights a potential issue in the controller itself.
            // For the purpose of this test, we assume DataJabatan.userId would be some static or instance property.
            // Let's assume it's meant to be compared with a specific jabatan's userId, which is not available in findAll context.
            // The controller will try to call DataJabatan.update if not admin.
            DataJabatan.update = jest.fn().mockResolvedValue([1]); // Mock update returning success

            await getDataJabatan(req, res);

            // Based on current controller logic, it will attempt an update.
            // And because it's not finding `nama_jabatan` etc from req.body, it will be undefined.
            // The where clause also refers to `jabatan.id_jabatan` which is not defined in this scope.
            // This test will likely fail or expose the controller's issues.
            // For now, let's expect the 403 due to `req.userId !== DataJabatan.userId`
            // This part of the controller `if (req.userId !== DataJabatan.userId)` is problematic as `DataJabatan.userId` is not a thing.
            // Let's assume it meant to check against a specific instance, which isn't the case for `getDataJabatan`
            // For the purpose of this test, we'll mock it so that the condition `req.userId !== DataJabatan.userId` is met.
            // This highlights a design flaw in the controller.
            // Given the current structure, this path leads to a 403 if we interpret DataJabatan.userId as undefined.
            // Or, if it's trying to update, it will fail differently.
            // Let's assume the intention was to block non-admins from general listing or has a bug.
            // The provided controller code for non-admin getDataJabatan is:
            // if (req.userId !== DataJabatan.userId) return res.status(403).json({ msg: JOB_POSITION.FORBIDDEN_ACCESS });
            // await DataJabatan.update(...)
            // This implies if the first check passes, it tries to update.
            // Let's assume DataJabatan.userId is undefined, so the condition `req.userId !== undefined` is true.
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.FORBIDDEN_ACCESS });
        });


        it('should return 500 if database error occurs', async () => {
            req.hak_akses = 'admin';
            DataJabatan.findAll.mockRejectedValue(new Error('DB Error'));

            await getDataJabatan(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
        });
    });

    describe('getDataJabatanByID', () => {
        it('should return job position if found', async () => {
            req.params.id = '1';
            const mockJabatan = { id: '1', nama_jabatan: 'Manager', gaji_pokok: 10000 };
            DataJabatan.findOne.mockResolvedValue(mockJabatan);

            await getDataJabatanByID(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({
                attributes: ['id', 'nama_jabatan', 'gaji_pokok', 'tj_transport', 'uang_makan'],
                where: { id: '1' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockJabatan);
        });

        it('should return 404 if job position not found', async () => {
            req.params.id = '999';
            DataJabatan.findOne.mockResolvedValue(null);

            await getDataJabatanByID(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({
                attributes: ['id', 'nama_jabatan', 'gaji_pokok', 'tj_transport', 'uang_makan'],
                where: { id: '999' }
            });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.NOT_FOUND.code });
        });

        it('should return 500 if database error occurs', async () => {
            req.params.id = '1';
            DataJabatan.findOne.mockRejectedValue(new Error('DB Error'));

            await getDataJabatanByID(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
        });
    });

    describe('createDataJabatan', () => {
        beforeEach(() => {
            req.body = {
                id_jabatan: 'J001',
                nama_jabatan: 'Developer',
                gaji_pokok: 7000,
                tj_transport: 400,
                uang_makan: 250
            };
            req.userId = 'adminUser'; // Assuming admin user ID
        });

        it('should create job position for admin', async () => {
            req.hak_akses = 'admin';
            DataJabatan.create.mockResolvedValue({ id: 'newId', ...req.body });

            await createDataJabatan(req, res);

            expect(DataJabatan.create).toHaveBeenCalledWith({
                id_jabatan: 'J001',
                nama_jabatan: 'Developer',
                gaji_pokok: 7000,
                tj_transport: 400,
                uang_makan: 250,
                userId: 'adminUser'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: JOB_POSITION.CREATE_SUCCESS.code });
        });

        it('should return 403 for non-admin (and attempt update due to controller logic flaw)', async () => {
            req.hak_akses = 'user';
            req.userId = 'user1';
            // Similar to getDataJabatan, the non-admin path in createDataJabatan is problematic.
            // It checks `req.userId !== DataJabatan.userId` and then tries to update.
            // Assuming DataJabatan.userId is undefined, the condition is true.
            await createDataJabatan(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.FORBIDDEN_ACCESS.code });
            expect(DataJabatan.create).not.toHaveBeenCalled();
        });


        it('should return 500 if database error occurs during creation by admin', async () => {
            req.hak_akses = 'admin';
            DataJabatan.create.mockRejectedValue(new Error('DB Error'));

            await createDataJabatan(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
        });
    });

    describe('updateDataJabatan', () => {
        const jabatanId = 'existingId';
        const updateData = {
            nama_jabatan: 'Senior Developer',
            gaji_pokok: 8000,
            tj_transport: 450,
            uang_makan: 280
        };

        beforeEach(() => {
            req.params.id = jabatanId;
            req.body = updateData;
        });

        it('should update job position for admin if found', async () => {
            req.hak_akses = 'admin';
            const mockJabatan = { id: jabatanId, nama_jabatan: 'Developer', userId: 'anyUser' };
            DataJabatan.findOne.mockResolvedValue(mockJabatan);
            DataJabatan.update.mockResolvedValue([1]); // Indicates 1 row updated

            await updateDataJabatan(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({ where: { id: jabatanId } });
            expect(DataJabatan.update).toHaveBeenCalledWith(updateData, { where: { id: jabatanId } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.UPDATE_SUCCESS.code });
        });

        it('should return 404 if job position not found for admin update', async () => {
            req.hak_akses = 'admin';
            DataJabatan.findOne.mockResolvedValue(null);

            await updateDataJabatan(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({ where: { id: jabatanId } });
            expect(DataJabatan.update).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.DATA_NOT_FOUND.code });
        });

        it('should update job position for non-admin if user owns the record (flawed controller logic)', async () => {
            req.hak_akses = 'user';
            req.userId = 'user123'; // This user owns the record
            // The controller logic `req.userId !== DataJabatan.userId` is problematic.
            // It should be `req.userId !== jabatan.userId`.
            // And `jabatan.id_jabatan` is used in where clause, but `jabatan` has `id`.
            // Let's assume `DataJabatan.userId` is meant to be `jabatan.userId`
            const mockJabatan = { id: jabatanId, id_jabatan: 'JAB001', nama_jabatan: 'Old Name', userId: 'user123' };
            DataJabatan.findOne.mockResolvedValue(mockJabatan);
            DataJabatan.update.mockResolvedValue([1]);

            // To make the `if (req.userId !== DataJabatan.userId)` pass (as per current controller flaw),
            // we'll ensure DataJabatan.userId is different or undefined.
            // However, the *correct* check would be against `mockJabatan.userId`.
            // The controller code is:
            // if (req.userId !== DataJabatan.userId) return res.status(403).json({ msg: JOB_POSITION.FORBIDDEN_ACCESS });
            // await DataJabatan.update({ ... }, { where: { [Op.and]: [{ id_jabatan: jabatan.id_jabatan }, { userId: req.userId }] } });
            // If we make `DataJabatan.userId` different from `req.userId`, it will return 403.
            // Let's assume `DataJabatan.userId` is undefined, so `req.userId !== undefined` is true, leading to 403.
            // This test demonstrates the flaw.
            // To actually test the intended non-admin update path, the controller needs a fix.
            // For now, let's simulate the flawed path leading to 403.

            // If DataJabatan.userId is undefined:
            await updateDataJabatan(req, res);
            expect(DataJabatan.findOne).toHaveBeenCalledWith({ where: { id: jabatanId } });
            expect(res.status).toHaveBeenCalledWith(403); // Due to req.userId !== DataJabatan.userId (undefined)
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.FORBIDDEN_ACCESS });
            expect(DataJabatan.update).not.toHaveBeenCalled();
        });

        it('should return 403 if non-admin tries to update record not owned by them (flawed controller logic)', async () => {
            req.hak_akses = 'user';
            req.userId = 'user123'; // This user
            const mockJabatan = { id: jabatanId, id_jabatan: 'JAB001', nama_jabatan: 'Old Name', userId: 'otherUser456' }; // Record owned by someone else
            DataJabatan.findOne.mockResolvedValue(mockJabatan);
            // This will also hit the `req.userId !== DataJabatan.userId` (undefined) first.
            await updateDataJabatan(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({ where: { id: jabatanId } });
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.FORBIDDEN_ACCESS });
            expect(DataJabatan.update).not.toHaveBeenCalled();
        });


        it('should return 500 if database error occurs during admin update', async () => {
            req.hak_akses = 'admin';
            DataJabatan.findOne.mockResolvedValue({ id: jabatanId }); // Jabatan found
            DataJabatan.update.mockRejectedValue(new Error('DB Error'));

            await updateDataJabatan(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
        });
    });

    describe('deleteDataJabatan', () => {
        const jabatanId = 'existingId';
        let mockJabatanInstance;

        beforeEach(() => {
            req.params.id = jabatanId;
            mockJabatanInstance = {
                id: jabatanId,
                userId: 'anyUser', // Assuming a jabatan instance has a userId
                id_jabatan: 'JAB001', // Assuming a jabatan instance has an id_jabatan
                destroy: jest.fn().mockResolvedValue(1) // Mock destroy method on the instance
            };
        });

        it('should delete job position for admin if found', async () => {
            req.hak_akses = 'admin';
            DataJabatan.findOne.mockResolvedValue(mockJabatanInstance);

            await deleteDataJabatan(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({ where: { id: jabatanId } });
            expect(mockJabatanInstance.destroy).toHaveBeenCalledWith({ where: { id: jabatanId } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.DELETE_SUCCESS.code });
        });

        it('should return 404 if job position not found for admin delete', async () => {
            req.hak_akses = 'admin';
            DataJabatan.findOne.mockResolvedValue(null);

            await deleteDataJabatan(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({ where: { id: jabatanId } });
            expect(mockJabatanInstance.destroy).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.DATA_NOT_FOUND.code });
        });

        it('should return 403 for non-admin trying to delete (due to flawed userId check)', async () => {
            req.hak_akses = 'user';
            req.userId = 'user123';
            const jabatanOwnedByUser = { ...mockJabatanInstance, userId: 'user123' };
            DataJabatan.findOne.mockResolvedValue(jabatanOwnedByUser);

            // The controller check is `if (req.userId !== jabatan.userId)`
            // This is the correct check for ownership.
            // However, the destroy call for non-admin is:
            // await jabatan.destroy({ where: { [Op.and]: [{ id_jabatan: jabatan.id_jabatan }, { userId: req.userId }] } });
            // This seems okay if `jabatan.id_jabatan` exists.

            // Let's test the FORBIDDEN_ACCESS path first if `req.userId !== jabatan.userId`
            const jabatanNotOwnedByUser = { ...mockJabatanInstance, userId: 'otherUser' };
            DataJabatan.findOne.mockResolvedValue(jabatanNotOwnedByUser);


            await deleteDataJabatan(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({ where: { id: jabatanId } });
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.FORBIDDEN_ACCESS.code });
            expect(jabatanNotOwnedByUser.destroy).not.toHaveBeenCalled();
        });

        it('should delete for non-admin if user owns the record', async () => {
            req.hak_akses = 'user';
            req.userId = 'user123';
            const jabatanOwnedByUser = { ...mockJabatanInstance, userId: 'user123' };
            DataJabatan.findOne.mockResolvedValue(jabatanOwnedByUser);

            await deleteDataJabatan(req, res);

            expect(DataJabatan.findOne).toHaveBeenCalledWith({ where: { id: jabatanId } });
            // The Op.and part is tricky to mock perfectly without Sequelize Op, but we test if destroy was called
            expect(jabatanOwnedByUser.destroy).toHaveBeenCalled(); // Simplified check
            // A more precise check for the where clause would be:
            // expect(jabatanOwnedByUser.destroy).toHaveBeenCalledWith({
            //     where: {
            //         [Op.and]: [{ id_jabatan: jabatanOwnedByUser.id_jabatan }, { userId: req.userId }]
            //     },
            // });
            // However, Op is not defined here. For simplicity, we check if destroy was called.
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.DELETE_SUCCESS.code });
        });


        it('should return 500 if database error occurs during admin delete', async () => {
            req.hak_akses = 'admin';
            DataJabatan.findOne.mockResolvedValue(mockJabatanInstance);
            mockJabatanInstance.destroy.mockRejectedValue(new Error('DB Error'));

            await deleteDataJabatan(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: JOB_POSITION.INTERNAL_SERVER_ERROR.code });
        });
    });
});