/**
 * @file config file
 */

module.exports = function (target) {
    const config = {
        h5: {
            navigationBarHomeColor: 'light',
            showNavigationBorder: true,
            mode: 'hash',
            useTransition: true,
            supportPWA: true
        }
    };

    return config;
};
