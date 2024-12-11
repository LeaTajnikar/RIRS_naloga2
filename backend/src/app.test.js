const {getAllWorkingHours} = require('./controllers/adminDashboardController'); // Replace with the correct path


// Mocking Firestore
jest.mock('firebase-admin/firestore', () => ({
    getFirestore: jest.fn()
}));

const mockGetFirestoreInstance = require('firebase-admin/firestore').getFirestore;

// Mock Firestore data
const mockCollection = jest.fn();
const mockGet = jest.fn();
const mockDoc = jest.fn();
const mockData = jest.fn();

// Mock the Firestore behavior
mockGetFirestoreInstance.mockImplementation(() => ({
    collection: mockCollection
}));

mockCollection.mockReturnValue({
    get: mockGet
});

mockDoc.mockReturnValue({
    data: mockData
});


describe('Backend tests', () => {
    describe('getAllWorkingHours', () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {}; // Empty request object
            mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            jest.clearAllMocks(); // Reset mocks between tests
        });

        test('should return an empty array when no users exist', async () => {
            mockGet.mockResolvedValueOnce({
                forEach: jest.fn() // No documents
            });

            await getAllWorkingHours(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Internal server error'});
        });

        test('should sum up hours correctly for one user', async () => {
            mockGet.mockResolvedValueOnce({
                forEach: callback => {
                    callback({
                        data: () => ({
                            imePriimek: 'Janez Novak',
                            workHours: [{hours: '5'}, {hours: '2'}]
                        })
                    });
                }
            });

            await getAllWorkingHours(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Internal server error'});
        });

        test('should handle missing workHours gracefully', async () => {
            mockGet.mockResolvedValueOnce({
                forEach: callback => {
                    callback({
                        data: () => ({
                            imePriimek: 'Jane Doe'
                            // Missing workHours field
                        })
                    });
                }
            });

            await getAllWorkingHours(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Internal server error'});
        });

        test('should handle invalid hours as 0', async () => {
            mockGet.mockResolvedValueOnce({
                forEach: callback => {
                    callback({
                        data: () => ({
                            imePriimek: 'Invalid Hours User',
                            workHours: [
                                {hours: 'abc'}, // Invalid string
                                {hours: ''},    // Empty string
                                {hours: '7'}    // Valid number
                            ]
                        })
                    });
                }
            });

            await getAllWorkingHours(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Internal server error'});
        });

        test('should return 500 on database error', async () => {
            mockGet.mockRejectedValueOnce(new Error('Database error'));

            await getAllWorkingHours(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Internal server error'});
        });
    });

    const {getAllHours, addHours, getHours, updateHours, deleteHours} = require('./controllers/workingHoursController');

    describe('Hours Controller', () => {
        const mockRes = () => {
            const res = {};
            res.status = jest.fn().mockReturnThis();
            res.json = jest.fn();
            return res;
        };

        describe('getAllHours', () => {
            it('should return 404 if userId is null or undefined', async () => {
                const req = {query: {userId: null}}; // Invalid userId
                const res = mockRes();

                await getAllHours(req, res);

                // Check for 404 status when userId is null
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({msg: "Invalid user"});
            });

            it('should return 404 if userId is undefined', async () => {
                const req = {query: {userId: undefined}}; // Invalid userId
                const res = mockRes();

                await getAllHours(req, res);

                // Check for 404 status when userId is undefined
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({msg: "Invalid user"});
            });
        });

        describe('addHours', () => {
            it('should return 404 if userId is null or undefined', async () => {
                const req = {
                    query: {userId: null},  // Invalid userId
                    body: {workHours: 8}
                };
                const res = mockRes();

                await addHours(req, res);

                // Expect 404 for null userId
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({msg: "Invalid user"});
            });

            it('should return 404 if workHours is null', async () => {
                const req = {
                    query: {userId: 'validUserId'}, // Valid userId
                    body: {workHours: null}  // Invalid workHours
                };
                const res = mockRes();

                await addHours(req, res);

                // Expect 404 for null workHours
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({msg: "Missing parameters"});
            });

            it('should return 404 if workHours is undefined', async () => {
                const req = {
                    query: {userId: 'validUserId'}, // Valid userId
                    body: {}  // Missing workHours in body
                };
                const res = mockRes();

                await addHours(req, res);

                // Expect 404 for missing workHours
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({msg: "Missing parameters"});
            });
        });
    });
});