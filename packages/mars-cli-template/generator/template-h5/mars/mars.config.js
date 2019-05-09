/**
 * @file config file
 */

module.exports = function ({target = 'swan', env = undefined}) {
    const config = {
        h5: {
            navigationBarHomeColor: 'light',
            showNavigationBorder: true,
            mode: 'hash'
        }
    };

    return config;
};
