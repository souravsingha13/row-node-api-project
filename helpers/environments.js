/*
    Title: Environments
    Description: Handle different environments (development, staging, production)
    Author: Sourav Singha
    Date: 2026-01-18 
 */

// Dependencies
const environments = {};

environments.development = {
    port: 3001,
    envName: 'development',
};
// environments.staging = {
//     port: 3002,
//     envName: 'staging',
// };
environments.production = {
    port: 3003,
    envName: 'production',
};

const currentEnvironment =
    typeof process.env.NODE_ENV === 'string'
        ? process.env.NODE_ENV.toLowerCase()
        : 'development';

const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.development;

// Export the module
module.exports = environmentToExport;
