/**
 * @file build entry
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */
const gulp = require('gulp');
const EventEmitter = require('events');

const {
    getTaskSFC,
    getTaskRuntime,
    getTaskCompileAssets,
    getTaskClean,
    getTaskWatch
} = require('./gulpTasks');

// const getDefaultConf = require('./defaultConfig');
const getConfig = require('./getConfig');
const log = require('../helper/log');

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
    // // }

    return gulp.parallel(buildTasks.map(t => gulp.task(t)));
    // return buildTasks;
}

// a wrapper for gulp 3 task
// and act as gulp.start
function taskWrapper(task) {
    const emitter = new EventEmitter();
    return () => {
        const cb = err => {
            emitter.emit(err ? 'error' : 'stop');
        };
        const ret = task(cb);
        ret && ret.then && ret.then(_ => cb());
        return emitter;
    };
}

function clean(options = {}) {
    const config = getConfig(options);
    const taskClean = getTaskClean(config, options);
    // gulp.task('clean', );
    log.info('[start task]', 'clean');
    return taskWrapper(taskClean)();
    // return gulp.start('clean');
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
    // gulp.task('build', buildTasks);
    log.info('[start task]', 'build');
    return taskWrapper(buildTasks)();
    // return gulp.start('build');
}


function watch(options = {}) {
    const config = getConfig(options);
    const {watch: watchConfig} = config;

    const buildTasks = getBuildTasks(config, options);

    log.info('[start task]', 'build && watch');

    gulp.watch(watchConfig, buildTasks);
    return taskWrapper(buildTasks)();
    // return gulp.start('watch');
}

module.exports = {
    clean,
    build,
    watch
};
