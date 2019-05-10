/**
 * @file change import name to relative path
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */

const path = require('path');
const compileModules = require('./compileModules');
const moduleKeys = Object.keys(compileModules.modules);

module.exports = function ({types: t}) {
    return {
        visitor: {
            ImportDeclaration(babelPath, state) {
                const {filePath, cwd, usedModules} = state.opts;
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
            },
            CallExpression(nodePath, state) {
                const {filePath, cwd, usedModules} = state.opts;
                const node = nodePath.node;
                const callee = node.callee;
                const arg = node.arguments[0];

                if (callee.type !== 'Identifier' || callee.name !== 'require' || !arg || arg.type !== 'StringLiteral') {
                    return;
                }

                const name = arg.value;

                const key = moduleKeys.find(key => (new RegExp('^' + key + '(/.*)?$')).test(name));
                if (key) {
                    const modulePath = path.join(cwd, compileModules.modules[key].path);
                    let relativePath = path.relative(path.dirname(filePath), modulePath);
                    if (relativePath[0] !== '.') {
                        relativePath = './' + relativePath;
                    }
                    nodePath.replaceWith(
                        t.callExpression(callee, [t.stringLiteral(name.replace(key, relativePath))])
                    );

                    usedModules[name.replace(key, compileModules.modules[key].path)] = key;
                }
            }
        }
    };
};
