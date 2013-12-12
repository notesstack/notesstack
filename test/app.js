var request = require('supertest');
var assert = require('assert');

var server = require('../app');

describe('Server', function() {
	describe('GET /test', function() {
		it('responds with default data', function(done) {
			request(server)
				.get('/test')
				.end(function(err, res) {
					assert.equal(err, null);
					var body = res.body;
					assert.equal(body.RESULT_CODE, '1');
					done();
				});
		});
	});

	describe('POST /signup', function() {
		it('responds with success', function(done) {
			request(server)
				.post('/signup')
				.send({email: 'mranandg@hotmail.com', password:'123456', username:'anandg'})
				.end(function(err, res) {
					assert.equal(err, null);
					var body = res.body;
					assert.equal(body.MESSAGE, 'User registered');
					done();
				});
		});
	});

	describe('POST /signup', function() {
		it('responds with success', function(done) {
			request(server)
				.post('/signup')
				.send({email: 'mranandg@hotmail.com', password:'22256', username:'ananderg'})
				.end(function(err, res) {
					assert.equal(err, null);
					var body = res.body;
					assert.equal(body.MESSAGE, 'User exists');
					done();
				});
		});
	});

	describe('POST /login', function() {
		it('responds with new data', function(done) {
			request(server)
				.post('/login')
				.send({email: 'mranandg@hotmail.com', password:'123456'})
				.end(function(err, res) {
					assert.equal(err, null);
					var body = res.body;
					assert.equal(body.MESSAGE, 'Login successful');
					done();
				});
		});
	});
});
