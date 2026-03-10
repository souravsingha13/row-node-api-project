/*
    Title: Routes
    Description: Application Routes
    Author: Sourav Singha
    Date: 2026-02-22 
 */

const sampleHandlers = require('./handlers/routeHandlers/sampleHandlers');
const userHandlers = require('./handlers/routeHandlers/userHandler');
const tokenHandlers = require('./handlers/routeHandlers/tokenHandlers');
const checkHandlers = require('./handlers/routeHandlers/checkHandlers');
const routes = {
    sample: sampleHandlers.sampleHandler,
    user: userHandlers.userHandler,
    token: tokenHandlers.tokenHandler,
    check: checkHandlers.checkHandler,

};

module.exports = routes;