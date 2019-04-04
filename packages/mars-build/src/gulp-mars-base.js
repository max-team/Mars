/**
 * @file 共用编译配置
 * @author meixuguang
 */
/* eslint-disable fecs-no-require */
/* eslint-disable no-native-reassign */
/* eslint-disable fecs-min-vars-per-destructure */

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp-mars';
const path = require('path');
const mkdirp = require('mkdirp');

const {parse: sfcParser} = require('./compiler/sfc/parser');
const {compile: sfcCompiler} = require('./compiler/sfc/compiler');
const log = require('./helper/log');

function compile(file, opt, compilers) {
    const {
        target = 'swan',
        fileSuffix = {
            html: 'swan',
            js: 'js',
            css: 'css',
            json: 'json'
        }
    } = opt;
    const rPath = path.relative(file.base, file.path);
    const fPath = path.resolve(file.cwd, opt.dest, rPath).replace(/\.vue$/, '');
    const baseName = path.basename(fPath);

    let coreRelativePath = path.join(
        path.relative(
            path.parse(fPath).dir,
            path.resolve(file.cwd, opt.dest)
        ) || '.',
        opt.coreDir || 'common'
    );
    coreRelativePath = coreRelativePath[0] === '.' ? coreRelativePath : './' + coreRelativePath;
    coreRelativePath = coreRelativePath + `/${target}/index`;

    try {
        const dirPath = fPath.replace(/[^/]+$/, '');
        mkdirp.sync(dirPath);
    }
    catch (e) {}

    const isApp = path.basename(fPath) === 'app';
    const options = Object.assign({
        isApp,
        coreRelativePath,
        compilers,
        fileSuffix,
        fPath,
        baseName
    }, opt);

    const sfcFile = sfcParser(file, options);
    return sfcCompiler(sfcFile, options);
}

function gulpPlugin(opt = {dest: './dist'}, compilers) {
    const stream = through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
            try {
                compile(file, opt, compilers).then(_ => cb(null, file));
            }
            catch (e) {
                log.error('[COMPILE ERROR]:', e);
            }
        }
    });
    return stream;
}

module.exports = {
    gulpPlugin
};
