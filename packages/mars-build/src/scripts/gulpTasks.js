/**
 * @file gulpfile
 * @author zhangwentao <winty2013@gmail.com>
 */
/* eslint-disable fecs-min-vars-per-destructure */

/* eslint-disable fecs-no-require */

const path = require('path');
const gulp = require('gulp');
const del = require('del');
const intercept = require('gulp-intercept');
const changed = require('gulp-changed');

const {getPathToCWD} = require('../helper/path');
const {FILE_SUFFIX} = require('../helper/config');
const log = require('../helper/log');

let h5Configs = {
    components: {},
    routes: {},
    configs: {}
};

/**
 * getTaskSFC
 *
 * @param {mars.config} config config
 * @param {mars.options} options options
 * @return {Function}
 */
function getTaskSFC(config, options) {
    const {dest: buildDest, source} = config;
    const dest = config.dest.path;
    const {target} = options;

    let compileOption = config.options.sfc;
    compileOption = Object.assign({
        dest,
        target,
        coreDir: buildDest.coreDir
    }, compileOption);

    compileOption._argv = options;
    compileOption._config = config;

    let compile;
    if (target === 'swan') {
        compile = require('../gulp-mars-swan');
    }

    if (target === 'wx') {
        compile = require('../gulp-mars-wxml');
    }

    if (target === 'h5') {
        compile = require('../gulp-mars-h5');
        compileOption.commit = (type, key, val) => {
            h5Configs[type][key] = val;
        };
        // for packages
        if (config.packages) {
            const {api, components} = config.packages;
            compileOption.devApiPath = api;
            compileOption.devCompPath = components;
        }
    }

    if (!compile) {
        throw new Error('[getTaskSFC] cannot find compiler match target ' + target);
    }

    const changedOptions = target !== 'h5' ? {
        extension: '.js'
    } : {};
    const logger = config.verbose ? log.info : log.write;
    return () => {
        if (!source.sfc || (Array.isArray(source.sfc) && source.sfc.length === 0)) {
            return Promise.resolve('[warning] empty sfc globs');
        }
        return gulp.src(source.sfc, {allowEmpty: true})
            .pipe(changed(dest, changedOptions))
            .pipe(intercept(file => {
                file.isBuffer() && logger('[compile:sfc]:', getPathToCWD(file.path));
                return file;
            }))
            .pipe(compile(compileOption));
    };
}

/**
 * getTaskCompileAssets
 *
 * @param {mars.config} config config
 * @param {mars.options} options options
 * @return {Function}
 */
function getTaskCompileAssets(config, options) {
    const isBinary = require('gulp-is-binary');
    const {source} = config;
    const {target} = options;
    const dest = config.dest.path;
    let {assets = [], h5Template} = source;
    // if (target === 'h5' && h5Template) {
    //     assets = assets.concat([h5Template]);
    // }
    const compileFile = require('../compiler/file/compiler').gulpPlugin;
    options.fileSuffix = FILE_SUFFIX[target];
    options._config = config;
    const logger = config.verbose ? log.info : log.write;

    return () => {
        if (!assets || (Array.isArray(assets) && assets.length === 0)) {
            return Promise.resolve('[warning] empty assets globs');
        }
        return gulp.src(assets, {allowEmpty: true})
            .pipe(changed(dest))
            .pipe(intercept(file => {
                file.isBuffer() && logger('[compile:assets]:', getPathToCWD(file.path));
                return file;
            }))
            .pipe(isBinary())
            .pipe(compileFile(options))
            .pipe(gulp.dest(dest));
    };
}

/**
 * getTaskRuntime
 *
 * @param {mars.config} config config
 * @param {mars.options} options options
 * @return {Function}
 */
function getTaskRuntime(config, options) {
    const {dest: buildDest, source} = config;
    // let dest = buildDest.path + '/' + buildDest.coreDir;
    let framework = JSON.stringify({});
    try {
        framework = JSON.stringify(config.framework || {});
    }
    catch (e) {
        throw new Error('config.framework must be plain Object');
    }

    const compileFile = require('../compiler/runtime/compiler').compile;
    const logger = config.verbose ? log.info : log.write;
    return () => {
        logger('[compile:runtime]:', options.target);
        return compileFile({
            framework,
            target: options.target,
            dest: buildDest
        });
    };
}

/**
 * getTaskClean
 *
 * @param {mars.config} config config
 * @param {mars.options} options options
 * @return {Function}
 */
function getTaskClean(config, options) {
    const {projectFiles} = config;
    // clean servePath for h5
    const dest = config.dest.path;
    // let dest = config.dest.servePath || config.dest.path;
    return callback => {
        let files = [`${dest}/**`, `!${dest}`].concat(projectFiles
            ? (projectFiles.map(item => `!${dest}/${item}`))
            : []);
        return del(files, callback);
    };
}

/**
 * getTaskWatch
 *
 * @param {mars.config} config config
 * @param {mars.options} options options
 * @return {Function}
 */
function getTaskWatch(config, options) {
    const {watch} = config;
    return () => {
        return gulp.watch(watch, ['build']);
    };
}

/**
 * getTasks
 *
 * @param {mars.config} config config
 * @param {mars.options} options options
 * @return {void}
 */
function getTasks(config, options) {
    gulp.task('compile:sfc', getTaskSFC(config, options));
    gulp.task('compile:runtime', getTaskRuntime(config, options));
    gulp.task('copy:assets', getTaskCompileAssets(config, options));

    gulp.task('clean', getTaskClean(config, options));
    gulp.task('watch', ['build'], getTaskWatch(config, options));
    gulp.task('build', [
        'compile:sfc',
        'compile:runtime',
        'copy:assets'
    ]);
}

module.exports = {
    getTasks,
    getTaskSFC,
    getTaskRuntime,
    getTaskCompileAssets,
    getTaskClean,
    getTaskWatch
};
