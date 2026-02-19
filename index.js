/*
    Title: Uptime Monitoring Service
    Description: This service monitors the uptime of specified websites and sends alerts if any site goes down.
    Author: Sourav Singha
    Date: 2026-01-18 
 */
// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { StringDecoder } = require('string_decoder');

// app object - module scaffolding
const app = {};
// Configuration
app.config = {
    port: 3001,
};


//create server
app.createServer = () => {

    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Server listening on port ${app.config.port}`);
    });
}

// habdle request response
app.handleReqRes = (req, res) => {
    // request handling
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const trimmedPath = pathName.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    })

    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
        // response handling
        res.end('Hello World!');
    });
}

app.createServer();
