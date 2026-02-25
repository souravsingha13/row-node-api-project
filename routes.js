/*
    Title: Routes
    Description: Application Routes
    Author: Sourav Singha
    Date: 2026-02-22 
 */

const sampleHandlers = require('./handlers/routeHandlers/sampleHandlers');
const userHandlers = require('./handlers/routeHandlers/userHandler');
const routes = {
    sample: sampleHandlers.sampleHandler,
    user: userHandlers.userHandler,

};

module.exports = routes;