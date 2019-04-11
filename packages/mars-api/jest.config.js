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
    testEnvironmentOptions: {
        userAgent: 'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 6 Build/N6F26U) AppleWebKit/537.36 (KHTML, like Gecko)'
    },
    testPathIgnorePatterns: [
        '/node_modules/'
    ],
    verbose: true
};
