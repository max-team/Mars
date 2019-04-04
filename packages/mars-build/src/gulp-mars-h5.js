/**
 * @file gulp plugin
 * @author zhangjingyuan02
 */

/* eslint-disable fecs-no-require */
/* eslint-disable no-native-reassign */
/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-camelcase */
const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

// 常量
const PLUGIN_NAME = 'gulp-mars';

const vueCompiler = require('vue-template-compiler');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Vinyl = require('vinyl');
const log = require('./helper/log');

const {
    compileScript,
    compileRouter,
    compileMain,
    compileApp,
    compileComponents,
    compileApi
} = require('./compiler/script/script-h5');
const delToVueTag = require('./h5/transform/tag');
const generate = require('./compiler/template/generate');

let componentSet = {}; // 小程序使用的组件集合
let mainOptions = {}; // 配置集合
let pagesInfo = []; // 页面title集合
let appApi = {}; // app.vue api 集合

Vinyl.prototype.writeFileSync = function () {
    if (!this.contents || !this.path) {
        throw new Error('Vinyl.prototype.writeFileSync() requires path and contents to write');
    }
    fs.writeFileSync(this.path, this.contents.toString());
};


function compile(file, opt) {
    const rPath = path.relative(file.base, file.path);
    const fPath = path.resolve(file.cwd, opt.dest, rPath).replace(/\.vue$/, '');
    const isApp = path.basename(fPath) === 'app';
    try {
        const dirPath = fPath.replace(/[^/]+$/, '');
        mkdirp.sync(dirPath);
    }
    catch (e) {}

    const {
        script,
        template,
        styles
    } = vueCompiler.parseComponent(file.contents.toString(), {});

    // 处理 script
    let scriptRet = null;
    let config = null;
    let enableConfig = null;
    if (script) {
        scriptRet = compileScript(script.content, {
            isApp
        });
        config = scriptRet && scriptRet.config;
        enableConfig = scriptRet && scriptRet.enableConfig;
    }

    // 处理 template
    let templateRet = null;
    let templateFile = null;
    if (template) {
        templateRet = vueCompiler.compile(template.content, {
            compileOptions: {
                preserveWhitespace: false
            },
            modules: [{
                preTransformNode(el, options) {
                    let basicCompMap = {};
                    delToVueTag(el, options, basicCompMap);
                    if (!el.parent) {
                        el.attrsMap['style'] = `backgroundColor: ${config.backgroundColor || null};`;
                    }
                    componentSet = Object.assign(componentSet, basicCompMap);
                }
            }]
        });
        let code = generate(templateRet.ast, {
            target: 'h5'
        });
        templateFile = new Vinyl({
            path: fPath + '.vue',
            contents: new Buffer(code || '')
        });

    }

    // 处理 app.vue 生成 对应 router.js ，处理框架入口App.vue，并合并app.vue的生命周期
    if (isApp) {
        // 生成router.js
        let routerContent = fs.readFileSync(__dirname + '/h5/template/router.js');
        routerContent = compileRouter(routerContent, {
            config,
            mars: opt._config.h5 || null
        });
        fs.writeFileSync(opt.dest + '/router.js', routerContent);

        // 处理框架入口文件APP.vue，合并app.vue中的生命周期
        let appContent = fs.readFileSync(__dirname + '/h5/template/App.vue');
        const {
            template: appTemplate,
            script: appScript,
            styles: appStyle
        } = vueCompiler.parseComponent(appContent.toString(), {});
        appContent = compileApp({
            appStyle: styles && styles[0] // 用户app.vue中的style
                ? {
                    content: styles[0].content,
                    attrs: styles[0].attrs.lang ? styles[0].attrs.lang : ''}
                : null,
            script: appScript && appScript.content || '',
            appScriptApi: scriptRet.pageLifeApi, // 用户app.vue中的生命周期
            template: appTemplate && appTemplate.content || '',
            style: appStyle && appStyle[0].content || '' // 入口文件APP.vue 自带style
        });
        fs.writeFileSync(opt.dest + '/App.vue', appContent);

        // 处理 globalApi
        let apiPluginContent = fs.readFileSync(__dirname + '/h5/template/globalApi.js');
        apiPluginContent = compileApi(apiPluginContent, opt);
        fs.writeFileSync(opt.dest + '/globalApi.js', apiPluginContent);

        // 获取小程序 app.vue里的config eg.onReachBottomDistance
        mainOptions = Object.assign(mainOptions, config);

    }

    // 持续集成 main.js pageTitleMap
    let filePathKey = rPath.replace(/\.vue$/, '');
    config
    && !config.component
    && (!pagesInfo.some(item => item.path === filePathKey))
    && pagesInfo.push({
        path: filePathKey,
        title: config.navigationBarTitleText || '',
        enablePullDownRefresh: config.enablePullDownRefresh,
        enableReachBottom: enableConfig && enableConfig.onReachBottom,
        navigationBarBackgroundColor: config.navigationBarBackgroundColor,
        navigationBarTextStyle: config.navigationBarTextStyle,
        backgroundColor: config.backgroundColor,
        backgroundTextStyle: config.backgroundTextStyle,
        navigationStyle: config.navigationStyle
    });

    appApi = Object.assign(appApi, scriptRet.appApi);
    mainOptions = Object.assign(mainOptions, {
        pagesInfo,
        appApi
    });
    let content = fs.readFileSync(__dirname + '/h5/template/main.js');
    content = compileMain(content, {
        mainOptions,
        componentSet,
        mars: opt._config.h5 || null
    });
    fs.writeFileSync(opt.dest + '/main.js', content);

    // 处理style
    const h5StylesArr = styles.filter(item => !item.attrs || (!item.attrs.target || item.attrs.target === 'h5'));
    const styleContent = h5StylesArr.reduce((styleStr, {attrs, content, lang}) => `${styleStr}
<style ${lang ? `lang="${lang}"` : ''} scoped>
    ${content}
</style>`, '');

    // app.vue has no template & 生成 xxx.vue & 生成 components.js
    if (!isApp) {
        templateFile.contents = new Buffer(`
<template>
    ${!config.component ? '<div>' : ''}
        ${templateFile.contents.toString()}
    ${!config.component ? '</div>' : ''}
</template>
${scriptRet && scriptRet.content ? `
<script>
${scriptRet.content}
</script>` : ''}

${styleContent || ''}
`);

        templateFile.writeFileSync();
        // 持续集成 components.js
        if (Object.keys(componentSet).length > 0) {
            const componentsFile = new Vinyl({
                path: opt.dest + '/components.js',
                _info_: {componentSet}
            });
            compileComponents(componentsFile, opt);
            componentsFile.writeFileSync();
        }
    }

    return file;
}

// 插件级别的函数（处理文件）
function gulpPrefixer(opt) {
    opt = opt || {
        dest: './dist-h5'
    };
    // 创建一个 stream 通道，以让每个文件通过
    const stream = through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            try {
                compile(file, opt);
            } catch (e) {
                log.error('[COMPILE ERROR]:', e);
            }
        }

        // 确保文件进入下一个 gulp 插件
        this.push(file);
        // 告诉 stream 引擎，我们已经处理完了这个文件
        cb();
    });
    // 返回文件 stream
    return stream;
}
// 导出插件主函数
module.exports = gulpPrefixer;
