const {app} = require('../server');
const testServer = require('supertest');

describe('Testing /user', () => {
    test('it should protect the /user route', () => {
        testServer(app).get('/api/user')
            .then((res) => {
                expect(res.statusCode).toBe(403)
            })
    })
})