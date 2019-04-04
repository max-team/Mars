/**
 * @file 脚手架扩展入口
 * @author cxtom(cxtom2008@gmail.com)
 */

module.exports = api => {
    api.extendPackage({
        devDependencies: {
            'atom2vue-loader': '^1.0.0',
            'atom-web-compiler': '^2.2.3'
        },
        vue: {
            parallel: false
        }
    });
};
