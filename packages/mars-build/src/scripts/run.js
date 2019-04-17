/**
 * @file build entry
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */
/* globals Set */

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

function getBuildTasks(config = {}, options = {}) {
    const {target} = options;
    // config = formatConfig(config);
    gulp.task('compile:sfc:' + target, getTaskSFC(config, options));
    gulp.task('copy:assets:' + target, getTaskCompileAssets(config, options));
    let buildTasks = [
        'compile:sfc:' + target,
        'copy:assets:' + target
    ];

    if (target !== 'h5') {
        gulp.task('compile:runtime:' + target, getTaskRuntime(config, options));
        buildTasks.push('compile:runtime:' + target);
    }

    return buildTasks;
}

function clean(options = {}) {
    const config = getConfig(options);
    gulp.task('clean', getTaskClean(config, options));

    console.log('[start task] clean');
    return gulp.start('clean');
}

function build(options = {}) {
    const config = getConfig(options);
    const buildTasks = getBuildTasks(config, options);
    gulp.task('build', buildTasks);
    console.log('[start task] build');
    return gulp.start('build');
}

function watch(options = {}) {

    const targets = options.target.split(',');
    let watch = new Set();
    targets.forEach(item => {
        options.target = item;
        if (['swan', 'h5', 'wx'].indexOf(item) === -1) {
            return;
        }

        const config = getConfig(options);
        config.watch && config.watch.forEach(item => watch.add(item));
        const buildTasks = getBuildTasks(config, options);
        gulp.task('build:' + item, buildTasks);
    });

    const taskArr = targets.map(item => 'build:' + item);
    const watchArr = Array.from(watch);

    gulp.task('watch', taskArr, getTaskWatch({
        watch: watchArr,
        taskArr
    }, options));

    console.log('[start task] watch');
    return gulp.start('watch');
}

module.exports = {
    clean,
    build,
    watch
};
