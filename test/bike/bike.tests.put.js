process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app.js');
const jsonDBService = require('../../jsonDatabaseService');

describe('PUT /bikes', () => {

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

    it('Updating one bike with valid data returns 204', (done) => {
        request(app).put('/bikes/01228c19-e4aa-4859-84ce-210a9803148f')
            .send({
                "name": "Velo de test",
                "brand": "MARQUETEST",
                "year": 2019,
                "type": "typeTest"
            })
            .then((res) => {
                expect(res.statusCode).to.equal(204);
                done();
            })
            .catch((err) => done(err));
    });

    it('Updating one bike with non existing ID returns 404', (done) => {
        request(app).put('/bikes/nonExistingID')
            .send({
                "name": "Velo de test",
                "brand": "MARQUETEST",
                "year": 2019,
                "type": "typeTest"
            })
            .then((res) => {
                expect(res.statusCode).to.equal(404);
                done();
            })
            .catch((err) => done(err));
    });

    it('Updating one bike without a name returns 422', (done) => {
        request(app).put('/bikes/01228c19-e4aa-4859-84ce-210a9803148f')
            .send({
                "brand": "MARQUETEST",
                "year": 2019,
                "type": "typeTest"
            })
            .then((res) => {
                expect(res.statusCode).to.equal(422);
                done();
            })
            .catch((err) => done(err));
    });

    it('Updating one bike with invalid year (wrong length) returns 422', (done) => {
        request(app).put('/bikes/01228c19-e4aa-4859-84ce-210a9803148f')
            .send({
                "name": "Velo de test",
                "brand": "MARQUETEST",
                "year": 20190,
                "type": "typeTest"
            })
            .then((res) => {
                expect(res.statusCode).to.equal(422);
                done();
            })
            .catch((err) => done(err));
    });

    it('Updating one bike with invalid year (not an int) returns 422', (done) => {
        request(app).put('/bikes/01228c19-e4aa-4859-84ce-210a9803148f')
            .send({
                "name": "Velo de test",
                "brand": "MARQUETEST",
                "year": "YEAR2019",
                "type": "typeTest"
            })
            .then((res) => {
                expect(res.statusCode).to.equal(422);
                done();
            })
            .catch((err) => done(err));
    });
})