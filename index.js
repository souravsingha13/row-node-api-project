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

const { handleReqRes } = require('./helpers/haldelReqRes');
const environments = require('./helpers/environments');

// app object - module scaffolding
const app = {};
// Configuration

console.log(environments);

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
