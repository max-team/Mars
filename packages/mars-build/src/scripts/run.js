/**
 * @file build entry
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */
const gulp = require('gulp');
const {
    getTaskSFC,
    getTaskRuntime,
    getTaskCompileAssets,
    getTaskClean,
    getTaskWatch
} = require('./gulpTasks');

// const getDefaultConf = require('./defaultConfig');
const getConfig = require('./getConfig');

/**
 * getBuildTasks
 *
 * @param {mars.config} config config
 * @param {mars.options} options options
 * @return {string[]}
 */
function getBuildTasks(config = {}, options = {}) {
    const {target} = options;
    // config = formatConfig(config);
    gulp.task('compile:sfc', getTaskSFC(config, options));
    gulp.task('copy:assets', getTaskCompileAssets(config, options));
    let buildTasks = [
        'compile:sfc',
        'copy:assets'
    ];

    // if (target !== 'h5') {
    gulp.task('compile:runtime', getTaskRuntime(config, options));
    buildTasks.push('compile:runtime');
    // }

    return buildTasks;
}

function clean(options = {}) {
    const config = getConfig(options);
    gulp.task('clean', getTaskClean(config, options));

    console.log('[start task] clean');
    return gulp.start('clean');
}

/**
 * build
 *
 * @param {mars.buildOptions} options options
 * @return {Object}
 */
function build(options = {}) {
    const config = getConfig(options);
    const buildTasks = getBuildTasks(config, options);
    gulp.task('build', buildTasks);
    console.log('[start task] build');
    return gulp.start('build');
}

function watch(options = {}) {
    const config = getConfig(options);
    const buildTasks = getBuildTasks(config, options);
    gulp.task('build', buildTasks);
    gulp.task('watch', ['build'], getTaskWatch(config, options));

    console.log('[start task] watch');
    return gulp.start('watch');
}

module.exports = {
    clean,
    build,
    watch
};
