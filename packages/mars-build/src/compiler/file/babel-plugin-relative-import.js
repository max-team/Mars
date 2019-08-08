/**
 * @file change import name to relative path
 * @author meixuguang
 */

/* eslint-disable fecs-no-require */

const path = require('path');
const {getModuleName} = require('../../helper/path');
const {getModulePath} = require('./compileModules');

module.exports = function ({types: t}) {
    return {
        visitor: {
            ImportDeclaration(babelPath, state) {
                const {rPath, modules, usedModules = {}, compileNPM = false} = state.opts;
                const name = babelPath.node.source.value;
                const modName = getModuleName(name);
                if (modName && (compileNPM || modules[modName])) {
                    let modulePath = getModulePath(name, modules).replace(/\.js$/, '');
                    let relativePath = path.join(rPath, modulePath);
                    if (relativePath[0] !== '.') {
                        relativePath = './' + relativePath;
                    }
                    const resolvedPath = name.replace(modName, relativePath);
                    usedModules[name] = {
                        modName,
                        path: modulePath,
                        resolvedPath
                    };
                    babelPath.node.source.value = resolvedPath;
                }
            },
            CallExpression(nodePath, state) {
                const node = nodePath.node;
                const callee = node.callee;
                const arg = node.arguments[0];

                if (callee.type !== 'Identifier' || callee.name !== 'require' || !arg || arg.type !== 'StringLiteral') {
                    return;
                }

                const {rPath, modules, usedModules = {}, compileNPM = false} = state.opts;
                const name = arg.value;
                const modName = getModuleName(name);
                if (modName && (compileNPM || modules[modName])) {
                    let modulePath = getModulePath(name, modules).replace(/\.js$/, '');
                    let relativePath = path.join(rPath, modulePath);
                    if (relativePath[0] !== '.') {
                        relativePath = './' + relativePath;
                    }
                    const resolvedPath = name.replace(modName, relativePath);
                    usedModules[name] = {
                        modName,
                        path: modulePath,
                        resolvedPath
                    };
                    nodePath.replaceWith(
                        t.callExpression(callee, [t.stringLiteral(resolvedPath)])
                    );
                    // babelPath.node.source.value = resolvedPath;
                }
            }
        }
    };
};
