/*
    Title: Server file
    Description: This service monitors the uptime of specified websites and sends alerts if any site goes down.
    Author: Sourav Singha
    Date: 2026-01-18 
 */

// Dependencies
const http = require('http');

const data = require('./data');

const { handleReqRes } = require('../helpers/haldelReqRes');
const environments = require('../helpers/environments');
const { sendTwilioSms } = require('../helpers/notifications');

// app object - module scaffolding
const server = {};

sendTwilioSms('01325784868', 'Hello from the uptime monitoring service!', (err) => {
    console.log('This was the error:', err);
});
data.delete('test', 'newFile', (err) => {
    console.log('This was the error', err);
});
//create server
server.createServer = () => {
    const httpServer = http.createServer(server.handleReqRes);
    httpServer.listen(environments.port, () => {
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Server listening on port ${environments.port}`);
    });
}

//handle request and response
server.handleReqRes = handleReqRes;
server.init = () => {
    server.createServer();
}

// Export the module
module.exports = server;
