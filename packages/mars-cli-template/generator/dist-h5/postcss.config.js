/* eslint-disable */
const config = require('./src/build.config');
const {designWidth, modules} = config;
const px2unitsOptions = designWidth ? modules.postcss.px2units : false;

module.exports = ({ file, options, env }) => ({
    plugins: {
        autoprefixer: {},
        'postcss-px2units': 
            file.dirname.indexOf('src/app-components') > -1
            || file.basename === 'mars-base.css'
            ? false
            : px2unitsOptions
    }
});
