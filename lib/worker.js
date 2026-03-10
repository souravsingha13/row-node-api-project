/*
    Title: Server file
    Description: This service monitors the uptime of specified websites and sends alerts if any site goes down.
    Author: Sourav Singha
    Date: 2026-01-18 
 */

// Dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { sendTwilioSms } = require('../helpers/notifications');
// app object - module scaffolding
const worker = {};

worker.performCheck = (originalCheckData) => {
    let checkOutcome = {
        error: false,
        responseCode: false,
    };
    let outcomeSent = false;
    let perseURL = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    let hostName = perseURL.hostname;
    let path = perseURL.path; // Using path and not "pathname" because we want the query string

    const requestDetails = {
        protocol: originalCheckData.protocol + ':',
        hostname: hostName,
        method: originalCheckData.method.toUpperCase(),
        path: path,
        timeout: originalCheckData.timeoutSeconds * 1000,
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

    const req = protocolToUse.request(requestDetails, (res) => {
        const status = res.statusCode;
        if (!outcomeSent) {
            checkOutcome.responseCode = status;
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', (e) => {
        if (!outcomeSent) {
            checkOutcome.error = { error: true, value: e };
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout', () => {
        if (!outcomeSent) {
            checkOutcome.error = { error: true, value: 'timeout' };
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.end();

};

worker.processCheckOutcome = (originalCheckData, checkOutcome) => {
    const state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';
    const alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;
    const timeOfCheck = Date.now();
    const checkData = {
        ...originalCheckData,
        state,
        lastChecked: timeOfCheck,
    };
    data.update('checks', originalCheckData.id, checkData, (err) => {
        if (!err) {
            if (alertWarranted) {
                worker.alertUserToStatusChange(checkData);
            } else {
                console.log('Check outcome has not changed, no alert needed');
            }
        } else {
            console.log('Error trying to save updates to one of the checks');
        }
    });
}
worker.alertUserToStatusChange = (checkData) => {
    const msg = `Alert: Your check for ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} is currently ${checkData.state}`;
    sendTwilioSms(checkData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`Success: User was alerted to a status change in their check via SMS: ${msg}`);
        } else {
            console.log('Error: Could not send SMS alert to user who had a state change in their check');
        }
    });
}
worker.validateCheckData = (originalCheckData) => {
    if (originalCheckData && originalCheckData.id) {
        originalCheckData.state = typeof originalCheckData.state === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down'; // default state is down
        originalCheckData.lastChecked = typeof originalCheckData.lastChecked === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;
        worker.performCheck(originalCheckData);
    } else {
        console.log('Error: Check data is not properly formatted');
    }
}

worker.gatherAllChecks = () => {
    data.list('checks', (err, checkData) => {
        if (!err && checkData && checkData.length > 0) {
            checkData.forEach((check) => {
                data.read('checks', check, (err, originalCheckData) => {
                    if (!err && originalCheckData) {
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error reading one of the check\'s data');
                    }
                });
            });
        } else {
            console.log('Error reading checks data');
        }
    });
}

worker.loop = () => {
    setInterval(() => {
        console.log('Background workers are running');
        worker.gatherAllChecks();
    }, 5000);
}
worker.init = () => {
    console.log('Background workers are running');
    worker.gatherAllChecks();

    worker.loop();

}

// Export the module
module.exports = worker;