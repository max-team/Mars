/**
 * @file 获取包版本
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */

const {request} = require('@vue/cli-shared-utils');
const {defaultConfig} = require('./utils');

module.exports = async function getPackageVersion(id, range = '', registry = defaultConfig.registry) {
    let res;
    try {
        const response = await request.get(`${registry}/${encodeURIComponent(id).replace(/^%40/, '@')}/${range}`);
        if (response.statusCode === 200) {
            res = response.body;
        }
    }
    catch (e) {
        return e;
    }
    return res;
};
