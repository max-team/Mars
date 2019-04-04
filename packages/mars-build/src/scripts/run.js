/**
 * @file build entry
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */

const merge = require('lodash.merge');
const gulp = require('gulp');
const {
    getTaskSFC,
    getTaskRuntime,
    getTaskCompileAssets,
    getTaskClean,
    getTaskWatch
} = require('./gulpTasks');

const getDefaultConf = require('./defaultConfig');

// 兼容原 Task 的配置格式
function formatConfig(config, options) {
    if (config.__formated__) {
        return config;
    }

    config.__formated__ = true;

    const {target} = options;
    config = merge(getDefaultConf(merge, target), config);
    config.dest = {
        path: config.dest,
        coreDir: 'mars-core'
    };
    config.source = {
        sfc: config.source,
        assets: config.assets
    };
    config.options = {
        sfc: config.options
    };
    config = merge(config, getRuntimeConfig(config.devConfig || {}));

    // init px2units.options.multiple
    // 规定 H5 中 1rem = 100px
    const {designWidth, modules} = config;
    if (designWidth && modules.postcss.px2units) {
        const multiple = target === 'h5' ? .5 / 100 : 1;
        modules.postcss.px2units = Object.assign({
            targetUnits: target === 'h5' ? 'rem' : 'rpx',
            multiple: multiple * 750 / designWidth
        }, modules.postcss.px2units);
    }
    return config;
}

function getRuntimeConfig({
        corePath = './node_modules/@marsjs/core',
        buildPath = './node_modules/@marsjs/build'
    }) {
    return {
        source: {
            runtime: corePath + '/src/**/*.js',
            h5Template: buildPath + '/src/h5/template/**/*.@(vue|js|css)'
        },
        options: {
            sfc: {}
        }
    };
}

function getBuildTasks(config = {}, options = {}) {
    const {target} = options;
    // config = formatConfig(config);
    gulp.task('compile:sfc', getTaskSFC(config, options));
    gulp.task('copy:assets', getTaskCompileAssets(config, options));
    let buildTasks = [
        'compile:sfc',
        'copy:assets'
    ];

    if (target !== 'h5') {
        gulp.task('compile:runtime', getTaskRuntime(config, options));
        buildTasks.push('compile:runtime');
    }

    return buildTasks;
}

function clean(config = {}, options = {}) {
    config = formatConfig(config, options);
    gulp.task('clean', getTaskClean(config, options));

    console.log('[start task] clean');
    return gulp.start('clean');
}

function build(config = {}, options = {}) {
    config = formatConfig(config, options);
    const buildTasks = getBuildTasks(config, options);
    gulp.task('build', buildTasks);
    console.log('[start task] build');
    return gulp.start('build');
}

function watch(config = {}, options = {}) {
    config = formatConfig(config, options);
    const buildTasks = getBuildTasks(config, options);
    gulp.task('build', buildTasks);
    gulp.task('watch', ['build'], getTaskWatch(config, options));

    console.log('[start task] watch');
    return gulp.start('watch');
}

module.exports = {
    clean,
    build,
    watch,
    merge
};
