/**
 * @file jest config file
 * @author zhaolongfei <izhaolongfei@gmail.com>
 */

module.exports = {
    moduleDirectories: [
        'node_modules'
    ],
    setupFiles: [
        'jest-localstorage-mock'
    ],
    testMatch: [
        '<rootDir>/__test__/**/*.js'
    ],
    testEnvironment: 'jest-environment-jsdom-global',
    testPathIgnorePatterns: [
        '/node_modules/'
    ],
    verbose: true
};
