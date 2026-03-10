/*
    Title: Check Handler
    Description: Handler for check-related routes
    Author: Sourav Singha
    Date: 2026-03-01
 */
// Dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandlers');

// Define the handler
const handler = {};


handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method.toLowerCase()) > -1) {
        handler._checks[requestProperties.method.toLowerCase()](requestProperties, callback);
    } else {
        callback(405);
    }
};


handler._checks = {};
handler._checks.post = (requestProperties, callback) => {
    const protocol = typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
        ? requestProperties.body.protocol
        : false;
    const url = typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
        ? requestProperties.body.url
        : false;
    const method = typeof requestProperties.body.method === 'string' &&
        ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
        ? requestProperties.body.method
        : false;
    const successCodes = typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
        ? requestProperties.body.successCodes
        : false;
    const timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5
        ? requestProperties.body.timeoutSeconds
        : false;
    if (protocol && url && method && successCodes && timeoutSeconds) {
        const token = typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        const user = parseJSON(userData);
                        const userChecks = typeof user.checks === 'object' &&
                            user.checks instanceof Array
                            ? user.checks
                            : [];
                        const checkId = hash(`${userPhone}${protocol}${url}${method}${successCodes}${timeoutSeconds}`);
                        userChecks.push(checkId);
                        user.checks = userChecks;
                        data.update('users', userPhone, user, (err) => {
                            if (!err) {
                                data.create('checks', checkId, {
                                    id: checkId,
                                    userPhone,
                                    protocol,
                                    url,
                                    method,
                                    successCodes,
                                    timeoutSeconds
                                }, (err) => {
                                    if (!err) {
                                        callback(200, {
                                            checkId,
                                            protocol,
                                            url,
                                            method,
                                            successCodes,
                                            timeoutSeconds
                                        });
                                    } else {
                                        callback(500, { error: 'There was a server side error' });
                                    }
                                });
                            } else {
                                callback(500, { error: 'There was a server side error' });
                            }
                        });
                    } else {
                        callback(404, { error: 'User not found' });
                    }
                })
            } else {
                callback(403, {
                    message: 'Authentication failure!',
                });
            }
        });
    } else {
        callback(400, { error: 'You have a problem in your request!' });
    }
};
handler._checks.get = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 64
        ? requestProperties.queryStringObject.id
        : false;
    if (id) {
        data.read('checks', id, (err, checkData) => {
            const token = typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

            tokenHandler._tokens.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                if (tokenIsValid) {
                    if (!err && checkData) {
                        callback(200, { check: parseJSON(checkData) });
                    } else {
                        callback(404, { error: 'Check not found' });
                    }
                } else {
                    callback(403, {
                        message: 'Authentication failure!',
                    });
                }
            }
            );
        });
    } else {
        callback(400, { error: 'There was a problem in your request' });
    }

};

handler._checks.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 64
        ? requestProperties.body.id
        : false;
    const protocol = typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
        ? requestProperties.body.protocol
        : false;
    const url = typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0 ? requestProperties.body.url
        : false;
    const method = typeof requestProperties.body.method === 'string' &&
        ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
        ? requestProperties.body.method
        : false;
    const successCodes = typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
        ? requestProperties.body.successCodes
        : false;
    const timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5
        ? requestProperties.body.timeoutSeconds
        : false;
    if (id && protocol && url && method && successCodes && timeoutSeconds) {
        data.read('checks', id, (err, checkData) => {
            const token = typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

            tokenHandler._tokens.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                if (tokenIsValid) {
                    if (!err && checkData) {
                        const checkObject = { ...parseJSON(checkData) };
                        checkObject.protocol = protocol;
                        checkObject.url = url;
                        checkObject.method = method;
                        checkObject.successCodes = successCodes;
                        checkObject.timeoutSeconds = timeoutSeconds;
                        data.update('checks', id, checkObject, (err) => {
                            if (!err) {
                                callback(200);
                            } else {
                                callback(500, { error: 'There was a server side error' });
                            }
                        });
                    } else {
                        callback(404, { error: 'Check not found' });
                    }
                } else {
                    callback(403, {
                        message: 'Authentication failure!',
                    });
                }
            }
            );
        });
    } else {
        callback(400, { error: 'You have a problem in your request!' });
    }
};

handler._checks.delete = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 64
        ? requestProperties.queryStringObject.id
        : false;
    if (id) {
        data.read('checks', id, (err, checkData) => {
            const token = typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;
            tokenHandler._tokens.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                if (tokenIsValid) {
                    if (!err && checkData) {
                        data.delete('checks', id, (err) => {
                            if (!err) {
                                callback(200);
                            } else {
                                callback(500, { error: 'There was a server side error' });
                            }
                        });
                    } else {
                        callback(404, { error: 'Check not found' });
                    }
                } else {
                    callback(403, {
                        message: 'Authentication failure!',
                    });
                }
            }
            );
        });
    } else {
        callback(400, { error: 'You have a problem in your request!' });
    }
};


module.exports = handler;