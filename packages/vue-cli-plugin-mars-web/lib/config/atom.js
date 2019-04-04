/**
 * @file tranform atom file to vue
 * @author cxtom(cxtom2008@gmail.com)
 */

module.exports = (api, options) => {

    api.chainWebpack(webpackConfig => {

        webpackConfig
            .context(api.service.context);

        webpackConfig.resolve
            .extensions
            .merge(['.atom'])
            .end()
            .alias
            .set('Atom', 'vue');

        // atom2vue-loader --------------------------------------------------------------
        const loaderCacheConfig = api.genCacheConfig('atom2vue-loader', {
            'atom2vue-loader': require('atom2vue-loader/package.json').version,
            'vue-loader': require('vue-loader/package.json').version,
            /* eslint-disable-next-line node/no-extraneous-require */
            '@vue/component-compiler-utils': require('@vue/component-compiler-utils/package.json').version,
            'vue-template-compiler': require('vue-template-compiler/package.json').version
        });

        webpackConfig.module
            .rule('atom')
            .test(/\.atom$/)
            .use('cache-loader')
            .loader('cache-loader')
            .options(loaderCacheConfig)
            .end()
            .use('vue-loader')
            .loader('vue-loader')
            .options(Object.assign({
                compilerOptions: {
                    preserveWhitespace: false
                }
            }, loaderCacheConfig))
            .end()
            .use('atom2vue-loader')
            .loader('atom2vue-loader')
            .end();

    });

    api.configureWebpack(config => {
        const jsRule = config.module.rules.find(rule => rule.test && rule.test.test('foo.js'));
        // 删掉 thread-loader 否则有问题
        jsRule.use = jsRule.use.filter(({loader}) => loader !== 'thread-loader');
    });
};
