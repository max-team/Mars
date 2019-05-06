/**
 * @file change import name to relative path
 * @author meixuguang
 */

const path = require('path');
const compileModules = require('./compileModules');

module.exports = function ({types: t}) {
    return {
        visitor: {
            ImportDeclaration(babelPath, state) {
                const {filePath, cwd, usedModules} = state.opts;
                const moduleKeys = Object.keys(compileModules.modules);
                const name = babelPath.node.source.value;

                const key = moduleKeys.find(key => (new RegExp('^' + key + '(/.*)?$')).test(name));
                if (key) {
                    const modulePath = path.join(cwd, compileModules.modules[key].path);
                    let relativePath = path.relative(path.dirname(filePath), modulePath);
                    if (relativePath[0] !== '.') {
                        relativePath = './' + relativePath;
                    }
                    babelPath.node.source.value = name.replace(key, relativePath);

                    usedModules[name.replace(key, compileModules.modules[key].path)] = key;
                }
            }
        }
    };
};
