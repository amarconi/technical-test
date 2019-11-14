process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app.js');
const jsonDBService = require('../../jsonDatabaseService');

describe('Functional tests /bikes', () => {

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

    it('Creating one test bike, updating it and checking updated datas', (done) => {
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
                request(app).put('/bikes/idDeTest')
                    .send({
                        "name": "UpdatedName",
                        "brand": "UpdatedMarque",
                        "year": 2020,
                        "type": "UpdatedType"
                    })
                    .then((res) => {
                        expect(res.statusCode).to.equal(204);
                        request(app).get('/bikes/idDeTest')
                            .then((res) => {
                                const body = res.body;
                                expect(body).to.be.an('object');
                                expect(body).to.have.property("id", "idDeTest");
                                expect(body).to.have.property("name", "UpdatedName");
                                expect(body).to.have.property("brand", "UpdatedMarque");
                                expect(body).to.have.property("year", 2020);
                                expect(body).to.have.property("type", "UpdatedType");
                                done();
                            })
                            .catch((err) => done(err));
                    })
                    .catch((err) => done(err));
            })
            .catch((err) => done(err));
    });

    it("Creating one test bike and deleting it and checking it doesn't exist anymore", (done) => {
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
                request(app).delete('/bikes/idDeTest')
                    .then((res) => {
                        expect(res.statusCode).to.equal(204);
                        request(app).get('/bikes/idDeTest')
                            .then((res) => {
                                expect(res.statusCode).to.equal(404);
                                done();
                            })
                            .catch((err) => done(err));
                    })
                    .catch((err) => done(err));
            })
            .catch((err) => done(err));
    });
})