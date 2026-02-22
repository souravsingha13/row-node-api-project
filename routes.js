/*
    Title: Routes
    Description: Application Routes
    Author: Sourav Singha
    Date: 2026-02-22 
 */

const sampleHandlers = require('./handlers/routeHandlers/sampleHandlers');
const routes = {
    sample: sampleHandlers.sampleHandler,
};

module.exports = routes;