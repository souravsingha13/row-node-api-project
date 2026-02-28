/*
    Title: Uptime Monitoring Service
    Description: This service monitors the uptime of specified websites and sends alerts if any site goes down.
    Author: Sourav Singha
    Date: 2026-01-18 
 */

// Dependencies
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const data = require('./lib/data');

const { handleReqRes } = require('./helpers/haldelReqRes');
const environments = require('./helpers/environments');

// app object - module scaffolding
const app = {};
// Configuration
// data.create('test', 'newFile', { name: 'Sourav Singha' }, (err) => {
//     console.log('This was the error', err);
// });

// data.read('test', 'newFile',(err, data) => {
//     console.log('This was the error', err);
//     console.log('This was the data', data);
// });

// data.update('test', 'newFile', { name: 'Sourav Singha', job: 'Software Engineer' }, (err) => {
//     console.log('This was the error', err);
// });

data.delete('test', 'newFile', (err) => {
    console.log('This was the error', err);
});
//create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environments.port, () => {
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Server listening on port ${environments.port}`);
    });
}

//handle request and response
app.handleReqRes = handleReqRes;
app.createServer();
