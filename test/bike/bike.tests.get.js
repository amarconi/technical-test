process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app.js');
const jsonDBService = require('../../jsonDatabaseService');

describe('GET /bikes', () => {

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

    it('Getting all bikes returns an array of 6 objects', (done) => {
        request(app).get('/bikes')
            .then((res) => {
                const body = res.body;
                expect(body).to.be.an('array').that.has.lengthOf(6);
                done();
            })
            .catch((err) => done(err));
    });

    it('Getting the S Works bike by ID returns the right object', (done) => {
        request(app).get('/bikes/87beff15-ba80-4449-b9a3-36f0881a1c22')
            .then((res) => {
                const body = res.body;
                expect(body).to.be.an('object');
                expect(body).to.have.property("id", "87beff15-ba80-4449-b9a3-36f0881a1c22");
                expect(body).to.have.property("name", "S Works");
                expect(body).to.have.property("brand", "Specialized");
                expect(body).to.have.property("year", 2019);
                expect(body).to.have.property("type", "racing");
                done();
            })
            .catch((err) => done(err));
    });

    it('Getting a bike with non existing ID returns 404', (done) => {
        request(app).get('/bikes/nonExistingID')
            .then((res) => {
                expect(res.statusCode).to.equal(404);
                done();
            })
            .catch((err) => done(err));
    });
})