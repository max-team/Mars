/**
 * @file gulpfile
 * @author zhangwentao <winty2013@gmail.com>
 */
/* eslint-disable fecs-min-vars-per-destructure */
const path = require('path');
const gulp = require('gulp');
const del = require('del');
const intercept = require('gulp-intercept');
const changed = require('gulp-changed');

const {transform} = require('babel-core');
const {getPathToCWD, getDestDir} = require('../helper/path');
const {FILE_SUFFIX} = require('../helper/config');
const log = require('../helper/log');

function getTaskSFC(config, options) {
    const {dest: buildDest, source} = config;
    const dest = getDestDir(config.dest, options.target);

    let compileOption = config.options.sfc;
    compileOption = Object.assign({
        dest,
        coreDir: buildDest.coreDir
    }, compileOption);

    compileOption._argv = options;
    compileOption._config = config;

    const {target} = options;
    let compile;
    if (target === 'swan') {
        compile = require('../gulp-mars-swan');
    }

    if (target === 'wx') {
        compile = require('../gulp-mars-wxml');
    }

    if (target === 'h5') {
        compile = require('../gulp-mars-h5');
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
    return () => {
        return gulp.src(source.sfc)
            .pipe(changed(dest, changedOptions))
            .pipe(intercept(file => {
                log.info('[compile:sfc]:', getPathToCWD(file.path));
                return file;
            }))
            .pipe(compile(compileOption));
    };
}


function getTaskCompileAssets(config, options) {
    const {source} = config;
    const {target} = options;
    const dest = getDestDir(config.dest, options.target);
    let {assets = [], h5Template} = source;
    if (target === 'h5' && h5Template) {
        assets = assets.concat([h5Template]);
    }
    const compileFile = require('../compiler/file/compiler').gulpPlugin;
    options.fileSuffix = FILE_SUFFIX[target];
    options._config = config;
    return () => {
        return gulp.src(assets)
            .pipe(changed(dest))
            .pipe(intercept(file => {
                log.info('[compile:assets]:', getPathToCWD(file.path));
                return file;
            }))
            .pipe(compileFile(options))
            .pipe(gulp.dest(dest));
    };
}

function getTaskRuntime(config, options) {
    const {dest: buildDest, source} = config;
    let dest = getDestDir(config.dest, options.target);
    dest = dest + '/' + buildDest.coreDir;
    let framework = JSON.stringify({});
    try {
        framework = JSON.stringify(config.framework || {});
    } catch (e) {
        throw new Error('config.framework must be plain Object');
    }

    return () => {
        return gulp.src(source.runtime)
            .pipe(changed(dest))
            .pipe(intercept(file => {
                // TODO: mars-core runtime 的编译先简单写到这里，后续单独拿出来
                log.info('[compile:runtime]:', getPathToCWD(file.path));
                let source = (file.contents && file.contents.toString()) || '';
                source = source.replace(
                    /process\.env\.NODE_ENV/g,
                    JSON.stringify(process.env.NODE_ENV || 'development')
                ).replace(
                    /process\.env\.MARS_CONFIG_FRAMEWORK/g,
                    framework
                );
                const ret = transform(source, {
                    plugins: [
                        'minify-guarded-expressions',
                        'minify-dead-code-elimination'
                    ]
                });
                file.contents = new Buffer(ret.code || '');
                return file;
            }))
            .pipe(gulp.dest(dest));
    };
}

function getTaskClean(config, options) {
    const {projectFiles} = config;
    let dest = getDestDir(config.dest, options.target);
    return callback => {
        let files = [`${dest}/**`, `!${dest}`].concat(projectFiles
            ? (projectFiles.map(item => `!${dest}/${item}`))
            : []);
        return del(files, callback);
    };
}

function getTaskWatch(config, options) {
    const {watch} = config;
    return () => {
        return gulp.watch(watch, ['build']);
    };
}

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
