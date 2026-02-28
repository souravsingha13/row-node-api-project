/*
    Title: Tquote Handler
    Description: Handler for token-related routes
    Author: Sourav Singha
    Date: 2026-01-18 
 */
// Dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');


const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._tokens[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._tokens = {};
handler._tokens.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
            requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                const hashedPassword = hash(password);
                if (hashedPassword === parseJSON(userData).password) {
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        phone,
                        tokenId,
                        expires,
                    };
                    data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                message: 'There was a problem in server side!',
                            });
                        }
                    });
                } else {
                    callback(400, { message: 'Password did not match!' });
                }
            } else {
                callback(400, { message: 'User not found!' });
            }
        });
    } else {
        callback(400, { message: 'There was a problem in your request!' });
    }

};

handler._tokens.get = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                const token = { ...parseJSON(tokenData) };
                callback(200, token);
            } else {
                callback(404, { message: 'Token not found!' });
            }
        });
    } else {
        callback(400, { message: 'There was a problem in your request!' });
    }

}

handler._tokens.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;
    const extend = typeof requestProperties.body.extend === 'boolean' &&
        requestProperties.body.extend === true
        ? true
        : false;
    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                const tokenObject = { ...parseJSON(tokenData) };
                if (tokenObject.expires > Date.now()) {
                    tokenObject.expires = Date.now() + 60 * 60 * 1000;
                    data.update('tokens', id, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                message: 'There was a problem in server side!',
                            });
                        }
                    });
                } else {
                    callback(400, { message: 'Token already expired!' });
                }
            } else {
                callback(400, { message: 'Token not found!' });
            }
        });
    } else {
        callback(400, { message: 'There was a problem in your request!' });
    }
}

handler._tokens.delete = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, { message: 'Token deleted successfully!' });
                    } else {
                        callback(500, {
                            message: 'There was a problem in server side!',
                        });
                    }
                });
            } else {
                callback(400, { message: 'Token not found!' });
            }
        });
    } else {
        callback(400, { message: 'There was a problem in your request!' });
    }

}

handler._tokens.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
}

module.exports = handler;