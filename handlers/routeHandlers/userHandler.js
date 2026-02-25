/*
    Title: User Handler
    Description: Handler for user-related routes
    Author: Sourav Singha
    Date: 2026-01-18 
 */
// Dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');


const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};
handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
            requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
            requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
    const phone = typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
            requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
            requestProperties.body.tosAgreement === true
            ? true
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err, userData) => {
            if (err) {
                // Next job create new user
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User created successfully!',
                        });
                    } else {
                        callback(500, {
                            message: 'There was a problem in server side!',
                        });
                    }
                });
            } else {
                callback(500, {
                    message: 'There was a problem in server side!',
                });
            }
        });
    } else {
        callback(400, {
            message: 'There was a problem in your request',
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        data.read('users', phone, (err, user) => {
            if (!err && user) {
                const userData = { ...parseJSON(user) };
                delete userData.password;
                callback(200, userData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {
            message: 'There was a problem in your request',
        });
    }
}

handler._users.put = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
            requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
            requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
            requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
            requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    if (phone) {
        if (firstName || lastName || password) {
            data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    const userObject = { ...parseJSON(userData) };
                    if (firstName) {
                        userObject.firstName = firstName;
                    }
                    if (lastName) {
                        userObject.lastName = lastName;
                    }
                    if (password) {
                        userObject.password = hash(password);
                    }
                    data.update('users', phone, userObject, (err) => {
                        if (!err) {
                            callback(200, {
                                message: 'User updated successfully!',
                            });
                        } else {
                            callback(500, {
                                message: 'There was a problem in server side!',
                            });
                        }
                    });
                } else {
                    callback(500, {
                        message: 'There was a problem in server side!',
                    });
                }
            });
        } else {
            callback(400, {
                message: 'There was a problem in your request',
            });
        }
    } else {
        callback(400, {
            message: 'There was a problem in your request',
        });
    }
}

handler._users.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User deleted successfully!',
                        });
                    } else {
                        callback(500, {
                            message: 'There was a problem in server side!',
                        });
                    }
                });
            } else {
                callback(500, {
                    message: 'There was a problem in server side!',
                });
            }
        });

    } else {
        callback(400, {
            message: 'There was a problem in your request',
        });
    }
}

module.exports = handler;