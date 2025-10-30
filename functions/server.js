const serverless = require('serverless-http');
const app = require('../app'); // adjust path if app.js is in root

module.exports.handler = serverless(app);