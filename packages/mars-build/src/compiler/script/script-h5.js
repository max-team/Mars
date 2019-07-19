/**
 * @file gulp plugin
 * @author zhangjingyuan02
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-native-reassign */
/* eslint-disable fecs-min-vars-per-destructure */
const babel = require('babel-core');
const fs = require('fs');
const mkdirp = require('mkdirp');
const transformScriptPlugin = require('../../h5/transform/plugins/transformScriptPlugin');
const transformMainPlugin = require('../../h5/transform/plugins/transformMainPlugin');
const transformCompPlugin = require('../../h5/transform/plugins/transformCompPlugin');
const transformRouterPlugin = require('../../h5/transform/plugins/transformRouterPlugin');
const transformAppPlugin = require('../../h5/transform/plugins/transformAppPlugin');
const transformGetAppPlugin = require('../../h5/transform/plugins/transformGetAppPlugin');
const postTransformScriptPlugin = require('./babel-plugin-script-post');
const MARS_ENV = process.env.MARS_ENV_TARGET || 'h5';

exports.preCompile = function (file) {
};

exports.postCompile = function (file) {
};

exports.compileRouter = function (content, options) {
    const {config = {}, mars} = options;
    const {
        pages = [],
        subPackages = []
    } = config;
    let subPages = [];
    if (subPackages && subPackages.length > 0) {
        subPackages.forEach(item => {
            if (!item.pages) {
                return;
            }
            if (item.pages.length > 0) {
                item.pages.forEach(route => {
                    subPages.push(`${item.root}/${route}`);
                });
            }
            else {
                subPages.push(`${item.root}/${item.pages[0]}`);
            }
        });
    }

    // 判断当前MARS_ENV模式下是否有对应的页面数组
    let envPages = [];
    if (config && config['pages-' + MARS_ENV]) {
        envPages = config['pages-' + MARS_ENV];
    }
    const routes = pages.concat(subPages, envPages);

    const mode = mars && mars.mode ? mars.mode : 'history';
    const routerRet = babel.transform(content.toString(), {
        plugins: [transformRouterPlugin({
            routes,
            mode
        })]
    });

    const routerStr = babel.transformFromAst(routerRet.ast).code;
    content = new Buffer(routerStr);

    return content;
};

exports.compileComponents = function (file, options) {
    let componentSet = file._info_.componentSet;
    // 注册App.vue 里的 回到主页
    Object.assign(componentSet, {
        'mars-navigator': 'MarsNavigator'
    });
    const devCompPath = options.devCompPath;
    file.contents = new Buffer('export default basicComponents;');
    const componentsRet = babel.transform(file.contents.toString(), {
        plugins: [transformCompPlugin({
            componentSet,
            devCompPath
        })]
    });
    const componentsStr = babel.transformFromAst(componentsRet.ast).code;
    file.contents = new Buffer(componentsStr);

    return file;
};

exports.compileMain = function (content, options) {
    let {
        mainOptions,
        mars,
        componentSet // componentSet 决定了main文件是否引入components
    } = options;
    let {
        pages,
        tabBar,
        window = null,
        pagesInfo
    } = mainOptions;
    const {
        backgroundColor,
        borderStyle,
        color,
        selectedColor,
        list = []
    } = tabBar || {};
    const tabBarStyle = {
        backgroundColor,
        borderStyle,
        color,
        selectedColor
    };
    const mainRet = babel.transform(content.toString(), {
        plugins: [transformMainPlugin({
            routes: list,
            tabBarStyle,
            window,
            mars: {
                navigationBarHomeColor: mars.navigationBarHomeColor === undefined
                    ? 'dark'
                    : mars.navigationBarHomeColor,
                showNavigationBorder: !!mars.showNavigationBorder,
                useTransition: mars.useTransition === undefined ? true : mars.useTransition,
                homePage: `/${list.length > 0 ? list[0].pagePath : pages[0]}`,
                supportPWA: !!mars.supportPWA
            },
            componentSet,
            pagesInfo
        })]
    });
    const mainStr = babel.transformFromAst(mainRet.ast).code;
    content = new Buffer(mainStr);
    return content;
};


const path = require('path');
const {getUIModules, resolveComponentsPath} = require('./script');
const compileModules = require('../file/compileModules');

exports.compileScript = async function (content, options = {}) {
    if (!content) {
        return null;
    }

    const {
        isApp = false,
        mpConfig,
        target,
        dest,
        path: filePath,
        mars
    } = options;
    let baseOptions = {}; // 收集 config 和 components
    content = content.replace(
        /process\.env\.MARS_ENV/g,
        JSON.stringify(MARS_ENV)
    ).replace(
        /process\.env\.NODE_ENV/g,
        JSON.stringify(process.env.NODE_ENV || 'development')
    );
    const useAOP = mars.useAOP === undefined ? true : mars.useAOP;
    const scriptRet = babel.transform(content, {
        plugins: [
            transformScriptPlugin({
                baseOptions,
                isApp,
                mpConfig,
                useAOP
            })
        ]
    });
    let scriptStr = babel.transformFromAst(scriptRet.ast).code;
    // 处理完再进行minify，发现minify和定制的插件会有坑
    const cleanScriptAst = babel.transform(scriptStr, {
        plugins: [
            'minify-guarded-expressions',
            'minify-dead-code-elimination'
        ]
    });
    scriptStr = babel.transformFromAst(cleanScriptAst.ast).code;
    content = new Buffer(scriptStr);

    const {config = {}, components = {}, enableConfig = null} = baseOptions;
    const destPath = path.resolve(dest.path);
    const uiModules = getUIModules(components, target);
    let resolvedPaths = {};
    content = babel.transform(content, {
        plugins: [
            [
                path.resolve(__dirname, '../file/babel-plugin-relative-import.js'),
                {
                    filePath,
                    cwd: path.resolve(process.cwd(), dest.path),
                    modules: Object.assign(compileModules.H5Modules, uiModules),
                    resolvedPaths
                }
            ]
        ]
    }).code;

    resolveComponentsPath(components, resolvedPaths);
    await compileModules.compileUIModules(uiModules, destPath);

    return {config, components, enableConfig, content};
};

exports.postCompileScript = function (content, options = {}) {
    const {componentsInUsed} = options;
    return babel.transform(content, {
        plugins: [
            postTransformScriptPlugin({
                componentsInUsed
            })
        ]
    }).code;
};

exports.compileApp = function (script) {
    const content = script.content;
    // let customExp = {}; // 收集 用户 自定义 数据和方法
    // console.log(content.toString());
    // const scriptRet = babel.transform(content, {
    //     plugins: [
    //         transformAppPlugin({
    //             customExp
    //         })
    //     ]
    // });
    // let scriptStr = babel.transformFromAst(scriptRet.ast).code;
    // 处理完再进行minify，发现minify和定制的插件会有坑
    const cleanScriptAst = babel.transform(content, {
        plugins: [
            'minify-guarded-expressions',
            'minify-dead-code-elimination'
        ]
    });
    const scriptStr = babel.transformFromAst(cleanScriptAst.ast).code;

    // 更新 APP.vue script
    const newContent = `
import app from './appApi.js';
export default app;    
    `;
    script.content = new Buffer(newContent);

    return scriptStr;
};

exports.compileApi = function (content, options) {
    let apiLibrary = options.devApiPath ? options.devApiPath : '@marsjs/api';
    let contentStr = content.toString();
    contentStr = `
import Mars, {directives} from '${apiLibrary}';
${contentStr}
    `;
    content = new Buffer(contentStr);
    return content;
};

// 处理tabBar iconPath，更改icon目录为默认目录，解决动态require 引发的context为src目录情况
exports.compileTabBar = function (options, {dest, baseDir}) {
    // 处理tabBar iconPath
    function dealIconPath(path) {
        let pathArr = path.split('/');
        let newPath = `${pathArr[pathArr.length - 1]}`;
        let iconContent = fs.readFileSync(`${baseDir}${path}`);
        fs.writeFileSync(process.cwd() + `/${dest}/tabBarIcons/${newPath}`, iconContent);
        return newPath;
    }
    mkdirp.sync(dest + '/tabBarIcons');
    const tabBarList = options && options.tabBar && options.tabBar.list ? options.tabBar.list : [];
    tabBarList.forEach(item => {
        if (item.iconPath && item.selectedIconPath) {
            item.iconPath = dealIconPath(item.iconPath);
            item.selectedIconPath = dealIconPath(item.selectedIconPath);
        }
    });
};
