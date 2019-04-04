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
const {getPathToCWD} = require('../helper/path');
const {FILE_SUFFIX} = require('../helper/config');
const log = require('../helper/log');

function getDestDir(config, options) {
    const {dest} = config;
    const {target} = options;
    return dest.path.replace('{TARGET}', target);
}

function getTaskSFC(config, options) {
    const {dest: buildDest, source} = config;
    const dest = getDestDir(config, options);

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
        // for dev use local packages
        if (config.devConfig) {
            let absoluteH5Path = path.resolve(process.cwd(), 'dist-h5/src/');
            let absoluteCompPath = path.resolve(__filename, '../../../../mars-components/src/');
            let absoluteApiPath = path.resolve(__filename, '../../../../mars-api/');
            let devCompPath = path.relative(absoluteH5Path, absoluteCompPath);
            let devApiPath = path.relative(absoluteH5Path, absoluteApiPath);

            compileOption.devApiPath = devApiPath;
            compileOption.devCompPath = devCompPath;
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
    const dest = getDestDir(config, options);
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
    let dest = getDestDir(config, options);
    dest = dest + '/' + buildDest.coreDir;
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
    let dest = getDestDir(config, options);
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
