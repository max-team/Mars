/**
 * @file gulp plugin file compiler
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-no-require */

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const PLUGIN_NAME = 'file-compiler';
const path = require('path');

const {transformSync} = require('../../helper/babel');

const {compile: compileStyle} = require('../style/style');
const {getFileCompiler} = require('./base');
const {isCSS, isJS, changeExt} = require('../../helper/path');
const log = require('../../helper/log');
const compileModules = require('./compileModules');
// const modules = compileModules.modules;

/**
 * 编译 JS
 *
 * @param {string} content 文件内容
 * @param {mars.options} options opt
 * @return {babel.BabelFileResult}
 */
async function compileJS(content, options) {
    const {
        target,
        file
    } = options;
    const buildConfig = options._config;

    content = content.replace(
        /process\.env\.MARS_ENV/g,
        JSON.stringify(process.env.MARS_ENV_TARGET || target)
    ).replace(
        /process\.env\.NODE_ENV/g,
        JSON.stringify(process.env.NODE_ENV || 'development')
    );

    const destPath = path.resolve(buildConfig.dest.path);
    const rPath = path.relative(path.dirname(file.path), file.base);
    const modules = target === 'h5' ? compileModules.H5Modules : compileModules.modules;
    let usedModules = {};
    let res = transformSync(content, {
        plugins: [
            [
                path.resolve(__dirname, './babel-plugin-relative-import.js'),
                {
                    rPath,
                    modules,
                    usedModules,
                    compileNPM: process.env.MARS_ENV_TARGET === 'wx'
                }
            ],
            'minify-guarded-expressions',
            'minify-dead-code-elimination'
        ]
    });

    const usedModuleKeys = Object.keys(usedModules);
    for (let i = 0; i < usedModuleKeys.length; i++) {
        const key = usedModuleKeys[i];
        const info = usedModules[key];
        const {path} = info;
        // if (!uiModules[modName]) {
        await compileModules.compile(key, path, destPath);
        // }
    }

    return res;
}

async function compile(file, options) {
    const {fileSuffix, target} = options;
    const buildConfig = options._config || {};
    file.lang = path.extname(file.path).substr(1);

    if (isCSS(file.path)) {
        file.type = 'css';
        file.path = changeExt(file.path, fileSuffix.css);
        const cssCompiler = getFileCompiler(compileStyle, buildConfig);
        await cssCompiler(file, options);
    }
    else if (isJS(file.path)) {
        file.type = 'js';
        // TODO: H5 支持 ts 文件编译
        if (target !== 'h5') {
            file.path = changeExt(file.path, fileSuffix.js);
        }
        const jsCompiler = getFileCompiler(compileJS, buildConfig);
        await jsCompiler(file, options);
    }
    else {
        // for other files, use default compiler
        const compiler = getFileCompiler(null, buildConfig);
        await compiler(file, options);
    }

    return file;
}

exports.gulpPlugin = function (options) {
    const stream = through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
            compile(file, options)
                .then(_ => cb(null, file))
                .catch(err => {
                    log.error('[COMPILE ERROR]:', err);
                    cb(null, file);
                });
            return;
        }
        // for other file type
        cb(null, file);
    });
    return stream;
};
