/**
 * @file 获取 config
 * @author meixuguang
 */
const path = require('path');

function getConfig(cmd) {
    const target = cmd.target || 'swan';
    const buildPath = path.resolve(process.cwd(), 'node_modules/@marsjs/build');
    return {
        target,
        buildPath
    };
}

module.exports = {
    getConfig
};
