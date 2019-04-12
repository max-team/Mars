/* eslint-disable */
// use same build config for vue-cli postcss-loader

const {getConfig} = require('@marsjs/build');
let config = getConfig();

const {postprocessors = {}, designWidth = false, modules = {}} = config;
const postcssOptions = (postprocessors.postcss && postprocessors.postcss.options) || {};
const px2units = modules.postcss && modules.postcss.px2units;
const px2unitsPluin = designWidth && px2units ? require('postcss-px2units')(px2units) : false;

const plugins = postcssOptions.plugins || [];
const pluginsWithPX = plugins.slice();
pluginsWithPX.unshift(px2unitsPluin);

function getPostcssConfig({file, options, env}) {
    const isAppFile = file.dirname.indexOf('src/app-components') > -1
                || file.basename === 'mars-base.css';
    postcssOptions.plugins = isAppFile ? plugins : pluginsWithPX;
    return postcssOptions;
}

module.exports = getPostcssConfig;
