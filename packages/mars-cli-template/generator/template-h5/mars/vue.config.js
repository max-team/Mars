/**
 * @file vue config
 */

module.exports = {
    transpileDependencies: [
        '@marsjs/api',
        '@marsjs/components'
    ],
    parallel: false,
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Mars demo';
                return args;
            });
    }
};
