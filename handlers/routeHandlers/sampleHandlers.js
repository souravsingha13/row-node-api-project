/*
    Title: Sample Handlers
    Description: Sample Handlers
    Author: Sourav Singha
    Date: 2026-01-18 
 */


const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a sample handler'
    });
}

module.exports = handler;