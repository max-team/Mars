/**
 * @file config file
 */

module.exports = function (target) {
    const config = {
        h5: {
            navigationBarHomeColor: 'light',
            showNavigationBorder: true,
            mode: 'hash',
            useTransition: true
        },
        postprocessors: {
            postcss: {
                options: {
                    plugins: [
                        require('autoprefixer')({
                            overrideBrowserslist: ['iOS >= 7', 'android >= 2.3']
                        })
                    ]
                }
            }
        }
    };

    return config;
};
