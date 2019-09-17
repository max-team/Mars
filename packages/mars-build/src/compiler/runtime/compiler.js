/**
 * @file gulp plugin for runtime compiling
 * @author meixuguang
 */

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-no-require */

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const PLUGIN_NAME = 'file-compiler';
const log = require('../../helper/log');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');

/**
 * compile
 *
 * @param {mars.runtime.runtimeGulpPluginOptions} options options
 * @return {Promise}
 */
function compile(options) {
    const {target, dest, framework} = options;
    const destPath = dest.path;
    let entry;
    const coreDestDir = path.resolve(process.cwd(), destPath + '/' + dest.coreDir);
    if (target === 'wx') {
        entry = require.resolve('@marsjs/core/src/wx', {
            paths: [process.cwd()]
        });
    }
    else if (target === 'swan') {
        entry = require.resolve('@marsjs/core/src/swan', {
            paths: [process.cwd()]
        });
    }
    else if (target === 'h5') {
        // h5 runtime just copy it
        entry = require.resolve('@marsjs/core/src/h5', {
            paths: [process.cwd()]
        });
        const entryDir = path.dirname(entry);
        const files = fs.readdirSync(entryDir);
        return Promise.all(files.map(file => fs.copy(
            path.resolve(entryDir, file),
            path.resolve(process.cwd(), destPath, file)
        )));
    }
    else {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        webpack({
            entry: [entry],
            output: {
                path: coreDestDir,
                filename: 'index.js',
                libraryTarget: 'commonjs'
            },
            devtool: false,
            mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.MARS_CONFIG_FRAMEWORK': framework
                })
            ]
        }, (err, stats) => {
            if (err) {
                log.error(err.stack || err);
                if (err.details) {
                    log.error(err.details);
                }
                return resolve();
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                log.error(info.errors);
            }

            if (stats.hasWarnings()) {
                log.warn(info.warnings);
            }
            resolve();
            // Done processing
        });
    });


    // log.info('[compile:runtime]:', getPathToCWD(file.path));

    // let source = (file.contents && file.contents.toString()) || '';
    // source = source.replace(
    //     /process\.env\.NODE_ENV/g,
    //     JSON.stringify(process.env.NODE_ENV || 'development')
    // ).replace(
    //     /process\.env\.MARS_CONFIG_FRAMEWORK/g,
    //     options.framework
    // );
    // const ret = transform(source, {
    //     plugins: [
    //         'minify-guarded-expressions',
    //         'minify-dead-code-elimination'
    //     ]
    // });
    // file.contents = Buffer.from(ret.code || '');
    // return file;
}

/**
 * 用于编译 runtime 的 gulp 插件
 *
 * @param {mars.runtime.runtimeGulpPluginOptions} options options
 * @return {any}
 */
function gulpPlugin(options) {
    const stream = through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
            try {
                compile(options).then(_ => cb(null, file));
            }
            catch (e) {
                log.error('[COMPILE ERROR]:', e);
            }
            return;
        }
        // for other file type
        cb(null, file);
    });
    return stream;
}

module.exports = {
    gulpPlugin,
    compile
};
