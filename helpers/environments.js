
/*
    Title: Environments
    Description: Handle different environments (development, staging, production)
    Author: Sourav Singha
    Date: 2026-01-18 
 */

// Dependencies
require('dotenv').config();
const environments = {};

environments.development = {
    port: 3001,
    envName: 'development',
    secratekey: 'thisIs a secrate key',
    twilio: {
        fromPhone: process.env.TWILIO_FROM_PHONE_NUMBER,
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
    },
};
// environments.staging = {
//     port: 3002,
//     envName: 'staging',
// };
environments.production = {
    port: 3003,
    envName: 'production',
    secratekey: 'thisIs a secrate key',
    twilio: {
        fromPhone: process.env.TWILIO_FROM_PHONE_NUMBER,
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
    },
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
