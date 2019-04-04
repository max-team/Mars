/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */
/* eslint-disable fecs-min-vars-per-destructure */
const postcss = require('postcss');
const {changeExt} = require('../../helper/path');
const px2units = require('postcss-px2units');

const importPlugin = postcss.plugin('postcss-import-plugin', function (opts = {}) {
    let {cssExt} = opts;
    cssExt = '.' + cssExt;
    return function (root, result) {
        root.walkAtRules('import', rule => {
            try {
                let params = JSON.parse(rule.params);
                params = changeExt(params, cssExt);
                rule.replaceWith(postcss.atRule({name: 'import', params: JSON.stringify(params)}));
            } catch (e) {
                throw new Error('[postcss] parse import rule fail: ' + e.message);
            }
        });
    };
});

exports.compile = function compile(source, options = {}) {
    /* eslint-disable fecs-camelcase */
    const {fileSuffix, _config: buildConfig} = options;
    /* eslint-enable fecs-camelcase */
    const {designWidth, modules} = buildConfig;
    const px2unitsOptions = modules.postcss.px2units;
    const cssExt = fileSuffix.css;
    let postcssPlugins = [
        importPlugin({cssExt})
    ];
    if (px2unitsOptions !== false && designWidth) {
        postcssPlugins.push(px2units(px2unitsOptions || {}));
    }
    const processor = postcss(postcssPlugins);
    options.from = undefined;
    return processor.process(source, options).then(res => {
        return {
            code: res.css
        };
    }).catch(e => {
        throw new Error(e);
    });
};
