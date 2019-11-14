process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app.js');
const jsonDBService = require('../../jsonDatabaseService');

describe('POST /bikes', () => {

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

    it('Creating one test bike with valid data returns 201', (done) => {
        request(app).post('/bikes/')
            .send({
                "id": "idDeTest",
                "name": "Velo de test",
                "brand": "MARQUETEST",
                "year": 2019,
                "type": "typeTest"
            })
            .then((res) => {
                expect(res.statusCode).to.equal(201);
                done();
            })
            .catch((err) => done(err));
    });

    it('Creating one test bike with already existing ID returns 409', (done) => {
        request(app).post('/bikes/')
            .send({
                "id": "01228c19-e4aa-4859-84ce-210a9803148f",
                "name": "Velo de test",
                "brand": "MARQUETEST",
                "year": 2019,
                "type": "typeTest"
            })
            .then((res) => {
                expect(res.statusCode).to.equal(409);
                done();
            })
            .catch((err) => done(err));
    });

    it('Creating one test bike with no name returns 422', (done) => {
        request(app).post('/bikes/')
            .send({
                "id": "idDeTest",
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

    it('Creating one test bike with invalid year (wrong length) returns 422', (done) => {
        request(app).post('/bikes/')
            .send({
                "id": "idDeTest",
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

    it('Creating one test bike with invalid year (not an int) returns 422', (done) => {
        request(app).post('/bikes/')
            .send({
                "id": "idDeTest",
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