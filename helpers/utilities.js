/*
    Title: Utility Functions
    Description: Utility functions for the uptime monitoring service.
    Author: Sourav Singha
    Date: 2026-01-18 
 */

// Dependencies
const crypto = require('crypto');
const evnironments = require('./environments');

//Scaffolding
const utilities = {};

utilities.parseJSON = (jsonString) => {
    let output = {};
    try {
        output = JSON.parse(jsonString);
    } catch (err) {
        output = {};
    }
    return output;
}

utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto
            .createHmac('sha256', evnironments.secratekey)
            .update(str)
            .digest('hex');
        return hash;
    } else {
        return false;
    }
}

module.exports = utilities;