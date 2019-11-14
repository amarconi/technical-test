process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app.js');
const jsonDBService = require('../../jsonDatabaseService');

describe('DELETE /bikes', () => {

    // Put the database back in its original state after each test
    afterEach((done) => {
        try {
            let backup = jsonDBService.loadBackup();
            jsonDBService.write(backup);
            done();
        } catch (err) {
            done(err);
        }
    })

    it('Deleting one bike with existing ID returns 204', (done) => {
        request(app).delete('/bikes/31798a9a-9cfc-4c8e-9953-e557e53e1953')
            .then((res) => {
                expect(res.statusCode).to.equal(204);
                done();
            })
            .catch((err) => done(err));
    });

    it('Deleting one bike with non existing ID returns 404', (done) => {
        request(app).delete('/bikes/nonExistingID')
            .then((res) => {
                expect(res.statusCode).to.equal(404);
                done();
            })
            .catch((err) => done(err));
    });
})