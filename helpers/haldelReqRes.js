/*
    Title: Handle Request and Response
    Description: Handle request and response
    Author: Sourav Singha
    Date: 2026-01-18 
 */
// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const handler = {};
handler.handleReqRes = (req, res) => {
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


module.exports = handler;