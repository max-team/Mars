/**
 * @file change import name to relative path
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */

const path = require('path');

module.exports = function ({types: t}) {
    return {
        visitor: {
            ImportDeclaration(babelPath, state) {
                const {filePath, cwd, modules, usedModules = {}, resolvedPaths = {}} = state.opts;
                const moduleKeys = Object.keys(modules);
                const name = babelPath.node.source.value;

                const key = moduleKeys.find(key => (new RegExp('^' + key + '(/.*)?$')).test(name));
                if (key) {
                    const modulePath = path.join(cwd, modules[key].path);
                    let relativePath = path.relative(path.dirname(filePath), modulePath);
                    if (relativePath[0] !== '.') {
                        relativePath = './' + relativePath;
                    }
                    const resolvedPath = name.replace(key, relativePath);
                    babelPath.node.source.value = resolvedPath;
                    resolvedPaths[name] = resolvedPath;
                    usedModules[name.replace(key, modules[key].path)] = key;
                }
            },
            CallExpression(nodePath, state) {
                const {filePath, cwd, modules, usedModules = {}, resolvedPaths = {}} = state.opts;
                const moduleKeys = Object.keys(modules);
                const node = nodePath.node;
                const callee = node.callee;
                const arg = node.arguments[0];

                if (callee.type !== 'Identifier' || callee.name !== 'require' || !arg || arg.type !== 'StringLiteral') {
                    return;
                }

                const name = arg.value;

                const key = moduleKeys.find(key => (new RegExp('^' + key + '(/.*)?$')).test(name));
                if (key) {
                    const modulePath = path.join(cwd, modules[key].path);
                    let relativePath = path.relative(path.dirname(filePath), modulePath);
                    if (relativePath[0] !== '.') {
                        relativePath = './' + relativePath;
                    }
                    const resolvedPath = name.replace(key, relativePath);
                    nodePath.replaceWith(
                        t.callExpression(callee, [t.stringLiteral(resolvedPath)])
                    );
                    resolvedPaths[name] = resolvedPath;
                    usedModules[name.replace(key, modules[key].path)] = key;
                }
            }
        }
    };
};
