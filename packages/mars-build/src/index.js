/**
 * @file build entry
 * @author zhangwentao <winty2013@gmail.com>
 */

const {
    build,
    clean,
    watch
} = require('./scripts/run');

const getConfig = require('./scripts/getConfig');

exports.build = build;
exports.clean = clean;
exports.watch = watch;
exports.getConfig = getConfig;
