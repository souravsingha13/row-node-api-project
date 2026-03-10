/*
    Title: Notifications Handler
    Description: Handles notifications related operations for the uptime monitoring service.
    Author: Sourav Singha
    Date: 2026-03-01
 */

// Dependencies
const https = require('https');
const { parseJSON } = require('./utilities');
const querystring = require('querystring');
const twilioConfig = require('./environments').twilio;

// Container for the module
const notifications = {};
// Send notification to user if a check goes down
notifications.sendTwilioSms = (phone, msg, callback) => {
    // Validate parameters
    phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
    msg = typeof msg === 'string' && msg.trim().length > 0 ? msg : false;
    if (phone && msg) {
        console.log('Twilio config:', phone, msg, twilioConfig);
        // Configure the request payload
        const payload = {
            'From': twilioConfig.fromPhone,
            'To': phone,
            'Body': msg,
        };
        // Stringify the payload
        const stringPayload = querystring.stringify(payload);
        // Configure the request details
        const requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': `/2010-04-01/Accounts/${twilioConfig.accountSid}/Messages.json`,
            'auth': `${twilioConfig.accountSid}:${twilioConfig.authToken}`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        // Instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // Grab the status of the sent request
            const status = res.statusCode;
            // Callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });
        // Bind to the error event so it doesn't get thrown
        req.on('error', (e) => {
            callback(e);
        });
        // Add the payload
        req.write(stringPayload);
        // End the request
        req.end();
    } else {
        callback('Given parameters were missing or invalid');
    }
};

// Export the module
module.exports = notifications;