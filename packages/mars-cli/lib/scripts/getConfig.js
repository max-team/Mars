/**
 * @file 获取 config
 * @author meixuguang
 */
const path = require('path');

// 获取target参数 h5:pc / swan:xx
function getTargetParam(target = 'swan') {
    let params = target.split(':');
    return {
        target: params[0],
        param: params[1]
    };
}

function getConfig(cmd) {
    const {
        target,
        param: env
    } = getTargetParam(cmd.target);
    const buildPath = path.resolve(process.cwd(), 'node_modules/@marsjs/build');
    return {
        target,
        buildPath,
        env
    };
}

module.exports = {
    getConfig
};
