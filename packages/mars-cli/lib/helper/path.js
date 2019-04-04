/**
 * @file path
 * @author zhangwentao
 */
const path = require('path');

function getPathToCWD(p) {
    return path.relative(process.cwd(), p);
}

module.exports = {
    getPathToCWD
};