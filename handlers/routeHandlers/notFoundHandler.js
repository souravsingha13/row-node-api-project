/*
    Title: Not Found Handler
    Description: Not Found Handler
    Author: Sourav Singha
    Date: 2026-01-18 
 */


const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Route not found'
    });
}

module.exports = handler;