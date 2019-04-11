/**
 * @file 获取 config
 * @author meixuguang
 */

function getConfig(cmd) {
    const target = cmd.target || 'swan';

    return {
        target
    };
}

module.exports = {
    getConfig
};
