/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */

/* eslint-disable no-native-reassign */

/* eslint-disable fecs-min-vars-per-destructure */

exports.compile = function compile(source, options) {
    const {config, components = {}} = options;
    Object.keys(components).forEach(k => {
        components[k] = components[k].replace(/\.vue$/, '');
    });

    config.usingComponents = Object.assign(components, config.usingComponents || {});
    return {
        code: JSON.stringify(config)
    };
};
