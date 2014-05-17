test:
	@NODE_ENV=test mocha test/test.js
	@NODE_ENV=test mocha lib/index.js
