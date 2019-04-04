/**
 * @file CLI 入口
 * @author cxtom(cxtom2008@gmail.com)
 */

module.exports = (api, options) => {

    [
        './lib/config/atom'
    ].forEach(path => {
        require(path)(api, options);
    });

};
