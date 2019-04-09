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
const MARS_ENV = 'h5';

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
        pagesInfo,
        appApi // 获取app.vue api，生成getApp方法
    } = mainOptions;
    const mainRet = babel.transform(content.toString(), {
        plugins: [transformMainPlugin({
            routes: tabBar && tabBar.list || [],
            window,
            mars: {
                navigationBarHomeColor: mars && mars.navigationBarHomeColor || 'dark',
                showNavigationBorder: mars && mars.showNavigationBorder || true,
                homePage: `/${tabBar && tabBar.list && tabBar.list.length > 0 ? tabBar.list[0].pagePath : pages[0]}`
            },
            componentSet,
            pagesInfo,
            appApi
        })]
    });
    const mainStr = babel.transformFromAst(mainRet.ast).code;
    content = new Buffer(mainStr);
    return content;
};

exports.compileScript = function (content, {
    isApp = false
}) {
    if (!content) {
        return null;
    }
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

    const {config = {}, components = {}, enableConfig = null, pageLifeApi = null, appApi = null} = baseOptions;
    return {config, components, enableConfig, content, pageLifeApi, appApi};
};

exports.compileApp = function (options) {
    const {
        style,
        script,
        appScriptApi,
        template,
        appStyle
    } = options;
    let scriptStr = script;
    if (appScriptApi) {
        const scriptRet = babel.transform(script, {
            plugins: [
                transformAppPlugin({
                    appScriptApi
                })
            ]
        });
        scriptStr = babel.transformFromAst(scriptRet.ast).code;
    }

    let contentStr = '';

    const {
        content: cssContent,
        attrs
    } = appStyle || {};

    contentStr = `
<template>
${template}
</template>
<script>
${scriptStr}
</script>
<style lang="less" scoped>
${style}
</style>
${cssContent
    ? `
<style ${attrs.lang ? `lang="${attrs.lang}"` : ''}>
    ${cssContent}
</style>`
    : ''}
`;
    return new Buffer(contentStr);
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
