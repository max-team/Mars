/**
 * @file change import name to relative path
 * @author meixuguang
 */

const path = require('path');

module.exports = function ({types: t}) {
    return {
        visitor: {
            ImportDeclaration(babelPath, state) {
                const {modules, filePath, cwd} = state.opts;
                const moduleKeys = Object.keys(modules);
                const name = babelPath.node.source.value;

                const key = moduleKeys.find(key => name.indexOf(key) === 0);
                if (key) {
                    const modulePath = path.join(cwd, modules[key]);
                    const relativePath = path.relative(path.dirname(filePath), modulePath);
                    babelPath.node.source.value = name.replace(key, relativePath);
                }
            }
        }
    };
};
