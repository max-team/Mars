/**
 * @file build entry
 * @author zhangwentao <winty2013@gmail.com>
 */

const {
    build,
    clean,
    watch,
    merge
} = require('./scripts/run');

exports.build = build;
exports.clean = clean;
exports.watch = watch;
exports.merge = merge;
