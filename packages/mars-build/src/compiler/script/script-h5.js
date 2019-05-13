/**
 * @file gulp plugin
 * @author zhangjingyuan02
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-native-reassign */
/* eslint-disable fecs-min-vars-per-destructure */
const babel = require('babel-core');
const transformScriptPlugin = require('../../h5/transform/plugins/transformScriptPlugin');
const transformMainPlugin = require('../../h5/transform/plugins/transformMainPlugin');
const transformCompPlugin = require('../../h5/transform/plugins/transformCompPlugin');
const transformRouterPlugin = require('../../h5/transform/plugins/transformRouterPlugin');
const transformAppPlugin = require('../../h5/transform/plugins/transformAppPlugin');
const transformGetAppPlugin = require('../../h5/transform/plugins/transformGetAppPlugin');
const MARS_ENV = process.env.MARS_ENV_TARGET || 'h5';

exports.preCompile = function (file) {
};

exports.postCompile = function (file) {
};

exports.compileRouter = function (content, options) {
    const {config = {}, mars} = options;
    const routes = config.pages || [];
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
    const mainRet = babel.transform(content.toString(), {
        plugins: [transformMainPlugin({
            routes: tabBar && tabBar.list || [],
            window,
            mars: {
                navigationBarHomeColor: mars && mars.navigationBarHomeColor || 'dark',
                showNavigationBorder: mars ? !!mars.showNavigationBorder : true,
                useTransition: mars ? !!mars.useTransition : true,
                homePage: `/${tabBar && tabBar.list && tabBar.list.length > 0 ? tabBar.list[0].pagePath : pages[0]}`
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
        target,
        dest,
        path: filePath
    } = options;

    let baseOptions = {}; // 收集 config 和 components
    content = content.replace(
        /process\.env\.MARS_ENV/g,
        JSON.stringify(MARS_ENV)
    ).replace(
        /process\.env\.NODE_ENV/g,
        JSON.stringify(process.env.NODE_ENV || 'development')
    );
    const scriptRet = babel.transform(content, {
        plugins: [
            transformScriptPlugin({
                baseOptions,
                isApp
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
                    modules: uiModules,
                    resolvedPaths
                }
            ]
        ]
    }).code;

    resolveComponentsPath(components, resolvedPaths);
    await compileModules.compileUIModules(uiModules, destPath);

    return {config, components, enableConfig, content};
};

exports.compileApp = function (script) {
    const content = script.content;
    let customExp = {}; // 收集 用户 自定义 数据和方法
    const scriptRet = babel.transform(content, {
        plugins: [
            transformAppPlugin({
                customExp
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
    script.content = new Buffer(scriptStr);
    return customExp;
};

exports.compileGetApp = function (content, api) {
    const scriptRet = babel.transform(content.toString(), {
        plugins: [
            transformGetAppPlugin({
                api
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
    return new Buffer(scriptStr);
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
