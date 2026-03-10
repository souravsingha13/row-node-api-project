/*
    Title: Project initialization file
    Description: Project initialization file.
    Author: Sourav Singha
    Date: 2026-03-02 
 */

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');



app = {};

// Init function
app.init = () => {
    // Start the server
    console.log('Server is starting...');
    server.init();

    // Start the workers
    workers.init();

    // // Start the CLI, but make sure it starts last
};

// Execute
app.init();

module.exports = app;