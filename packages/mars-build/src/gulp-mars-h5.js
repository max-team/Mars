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
// const customTemplate = 'template-mars';

// 常量
const PLUGIN_NAME = 'gulp-mars';

// const vueCompiler = require('vue-template-compiler/build');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Vinyl = require('vinyl');
const log = require('./helper/log');
const slash = require('slash');
const md5 = require('md5');

const {getFileCompilers} = require('./compiler/file/base');

const {
    getCompiler,
    generate,
    transform,
    markH5: mark
} = require('./compiler/template/index');
const templateCompiler = getCompiler(mark, transform, generate, 'h5');

// const {
//     compileScript: scriptCompiler
// } = require('./compiler/script/script-h5');

const {parse: sfcParser} = require('./compiler/sfc/parser');
const {
    compileScript: scriptCompiler,
    // postCompileScript,
    // compileRouter,
    // compileMain,
    // compileApp,
    compileComponents,
    // compileApi,
    compileTabBar
} = require('./compiler/script/script-h5');

const scriptPostCompiler = require('./compiler/script/script').postCompile;

// // const scriptCompiler = require('./compiler/script/script').compile;
// // const scriptPostCompiler = require('./compiler/script/script').postCompile;
const styleCompiler = require('./compiler/style/style').compile;
const configCompiler = require('./compiler/script/config').compile;


const compilers = {
    templateCompiler,
    styleCompiler,
    scriptPostCompiler,
    scriptCompiler,
    configCompiler
};

// const delToVueTag = require('./h5/transform/tag');
// // const generate = require('./compiler/template/generate');

let componentSet = {}; // 小程序使用的组件集合
// let mainOptions = {}; // 配置集合
let pagesInfo = {}; // 页面title集合

Vinyl.prototype.writeFileSync = function () {
    if (!this.contents || !this.path) {
        throw new Error('Vinyl.prototype.writeFileSync() requires path and contents to write');
    }

    fs.writeFileSync(this.path, this.contents.toString());
};


// /**
//  * @file gulp plugin
//  * @author zhangwentao <winty2013@gmail.com>
//  */
// /* eslint-disable fecs-min-vars-per-destructure */
// const renderFunctionName = '__renderFunction';
// const {getFileCompilers} = require('../file/base');

async function compile(file, opt) {
    const rPath = path.relative(file.base, file.path);
    const fPath = slash(path.resolve(file.cwd, opt.dest, rPath).replace(/\.vue$/, ''));
    const isApp = path.basename(fPath).toLowerCase() === 'app';
    let fileDirPath = fPath.replace(/[^/]+$/, '');
    try {
        mkdirp.sync(fileDirPath);
    }
    catch (e) {}

    const fileSuffix = {
        html: 'swan',
        js: 'js',
        css: 'css',
        json: 'json'
    };

    const options = Object.assign({
        isApp,
        fileSuffix,
        fPath
    }, opt);
    const marsConfig = options._config;

    const {
        templateCompiler,
        scriptCompiler,
        scriptPostCompiler,
        styleCompiler,
        configCompiler
    } = getFileCompilers(compilers, options);

    const {
        script,
        template,
        styles,
        config: configFile
    // } = sfcParser(file, opt, false);
    } = sfcParser(file, options);
    const blockConfig = configFile.$options.config;
    const mpConfig = blockConfig && blockConfig.config;
    // const mpConfig = blockConfig && blockConfig.config;
    // 处理 script
    let scriptRet = null;
    let config = null;
    // let enableConfig = null;
    // if (script) {
    scriptRet = await scriptCompiler(script, {
        isApp,
        mpConfig,
        target: options.target,
        path: fPath + '.vue',
        dest: marsConfig.dest,
        mars: marsConfig.h5 || {}
    });
    // use blockConfig first
    config = mpConfig ? mpConfig : (scriptRet && scriptRet.config);
    // prefer appConfig in marsConfig
    if (isApp) {
        const appConfig = marsConfig.appConfig && marsConfig.appConfig.config;
        config = appConfig || config;
    }

    // if (config && config.pages) {
    //     config.pages = config.pages.filter(item => !/\.(swan|mp)$/.test(item));
    // }
    // if (config && config.tabBar && config.tabBar.list) {
    //     config.tabBar.list = config.tabBar.list.filter(item => !/\.(swan|mp)$/.test(item.pagePath));
    // }
    // enableConfig = scriptRet && scriptRet.enableConfig;
    // }
    // 处理 template
    // let templateRet = null;
    let templateCode = '';
    if (!isApp) {

        // let componentsInUsed = {}; // 记录组件是否使用
        // scriptRet.components && Object.keys(scriptRet.components).forEach(name => {
        //     if (!componentsInUsed[name]) {
        //         componentsInUsed[name] = {
        //             using: false,
        //             declaration: scriptRet.components[name]
        //         };
        //     }
        // });

        // templateRet = vueCompiler.compile(template.content, {
        //     compileOptions: {
        //         preserveWhitespace: false
        //     },
        //     modules: [{
        //         preTransformNode(el, options) {
        //             let basicCompMap = {};
        //             delToVueTag(el, {
        //                 basicCompMap,
        //                 componentsInUsed
        //             });
        //             componentSet = Object.assign(componentSet, basicCompMap);
        //         }
        //     }]
        // });
        const {componentsInUsed} = await templateCompiler(template, {
            componentSet,
            components: scriptRet.components,
            target: process.env.MARS_ENV_TARGET || 'h5'
        });

        templateCode = template.contents.toString();
        // templateCode = generate(templateRet.ast, {
        //     target: process.env.MARS_ENV_TARGET || 'h5'
        // });

        await scriptPostCompiler(script, {
            componentsInUsed
        });

        // 处理非H5的引用
        // scriptRet.content = postCompileScript(scriptRet.content, {
        //     componentsInUsed
        // });

        // 持续集成 components.js
        if (Object.keys(componentSet).length > 0) {
            const componentsFile = new Vinyl({
                path: options.dest + '/components.js',
                _info_: {
                    componentSet
                }
            });
            compileComponents(componentsFile, opt);
            componentsFile.writeFileSync();
        }
    }

    // 处理 app.vue 生成 对应 router.js ，处理框架入口App.vue，并合并app.vue的生命周期
    if (isApp) {
        // 获取小程序 app.vue里的config eg.onReachBottomDistance
        // mainOptions = Object.assign(mainOptions, config);

        // 生成router.js
        // let routerContent = fs.readFileSync(__dirname + '/h5/template/router.js');
        // routerContent = compileRouter(routerContent, {
        //     config,
        //     mars: marsConfig.h5 || null
        // });
        // fs.writeFileSync(options.dest + '/router.js', routerContent);

        // 处理入口文件app.vue
        // const appScriptContent = compileApp(scriptRet);

        // 处理 getApp appApi
        // let appApiContent = fs.readFileSync(__dirname + '/h5/template/appApi.js');
        // fs.writeFileSync(options.dest + '/appApi.js', appScriptContent);
        // fs.writeFileSync(options.dest + '/main.js', `import main from './mars-core/template/main'`);
        // 处理 globalApi
        // let apiPluginContent = fs.readFileSync(__dirname + '/h5/template/globalApi.js');
        // apiPluginContent = compileApi(apiPluginContent, opt);
        // fs.writeFileSync(options.dest + '/globalApi.js', apiPluginContent);
        // // 处理 tabBar.vue里的图片引入路径
        // // 认为入口文件的目录为 baseDir 目录
        compileTabBar(config, {
            dest: options.dest,
            baseDir: file.base
        });
    }

    // 持续集成 main.js pageTitleMap
    let filePathKey = rPath.replace(/\.vue$/, '');
    const isComp = config.component;
    if (!isComp) {
        pagesInfo[filePathKey] = config;
        let content = '';

        const buildConfig = options._config;
        const {packages = {}, h5 = {}} = buildConfig;
        const API_LIB = packages.api || '@marsjs/api';
        const mode = h5.mode || 'history';
        content += `import Mars, {directives} from '${API_LIB}';\n`;
        content += 'export {Mars, directives};\n';
        content += `export const mode = '${mode}';\n`;

        if (pagesInfo.app) {
            const {tabBar, pages = [], window: appWin, subPackages} = pagesInfo.app;

            if (tabBar && tabBar.list) {
                const tabBarList = tabBar.list.map(tab => {
                    tab = Object.assign({}, tab);
                    tab.pagePath = `/${tab.pagePath}`;
                    return tab;
                });
                const tabBars = Object.assign({}, tabBar, {
                    list: tabBarList
                });
                content += `export const tabBars = ${JSON.stringify(tabBars)};\n\n`;
            }
            else {
                content += 'export const tabBars = null;\n\n';
            }

            // 将 subPackages 添加到 H5 路由里面
            let subPages = [];
            if (subPackages && subPackages.length > 0) {
                subPackages.forEach(item => {
                    if (item.pages && item.pages.length > 0) {
                        item.pages.forEach(route => {
                            subPages.push(`${item.root}/${route}`);
                        });
                    }
                });
            }
            let routes = [];
            const allPages = pages.concat(subPages);
            allPages.forEach(page => {
                const name = `_${md5(page).substr(0, 8)}`;
                // const name = page.replace(/\//g, '$');
                if (options._config.h5 && options._config.h5.useLazyRoute) {
                    content += `const ${name} = () => import('./${page}.vue');\n`;
                }
                else {
                    content += `import ${name} from './${page}.vue';\n`;
                }
                routes.push({
                    path: '/' + page,
                    name
                });
            });

            content += `export const routes = [${
                routes.map(({path, name}) => `{path: '${path}', component: ${name}}`).join(',\n')
            }];\n\n`;

            let pageTitleMap = {};
            Object.keys(pagesInfo).forEach(key => {
                if (key !== 'app' && allPages.indexOf(key) > -1) {
                    pageTitleMap[`/${key}`] = Object.assign({}, appWin, pagesInfo[key]);
                    pageTitleMap[`/${key}`].title = pageTitleMap[`/${key}`].navigationBarTitleText;
                }
            });

            content += `export const pageTitleMap = ${JSON.stringify(pageTitleMap)};\n\n`;
            content += `export const appWin = ${JSON.stringify(appWin)};\n\n`;
        }

        // const content = `export default ${JSON.stringify(pagesInfo)}`;
        fs.writeFileSync(options.dest + '/config.js', content);
    }
    // config
    // && !config.component
    // && (!pagesInfo.some(item => item.path === filePathKey))
    // && pagesInfo.push({
    //     path: filePathKey,
    //     title: config.navigationBarTitleText || '',
    //     enablePullDownRefresh: config.enablePullDownRefresh,
    //     enableReachBottom: enableConfig && enableConfig.onReachBottom,
    //     navigationBarBackgroundColor: config.navigationBarBackgroundColor,
    //     navigationBarTextStyle: config.navigationBarTextStyle,
    //     backgroundColor: config.backgroundColor,
    //     backgroundTextStyle: config.backgroundTextStyle,
    //     navigationStyle: config.navigationStyle
    // });

    // mainOptions = Object.assign(mainOptions, {
    //     pagesInfo
    // });
    // let content = fs.readFileSync(__dirname + '/h5/template/main.js');
    // content = compileMain(content, {
    //     mainOptions,
    //     componentSet,
    //     mars: marsConfig.h5 || {}
    // });
    // fs.writeFileSync(options.dest + '/main.js', content);

    // 处理style
//     const h5StylesArr = styles.filter(item =>
//         !item.attrs || (!item.attrs.target || item.attrs.target === (process.env.MARS_ENV_TARGET || 'h5')));
//     const styleContent = h5StylesArr.reduce((styleStr, {
//             scoped,
//             content,
//             lang,
//             attrs
//         }) => `${styleStr}
// <style ${lang ? `lang="${lang}"` : ''} ${attrs && !attrs.target ? 'scoped' : scoped ? 'scoped' : ''}>
//     ${content}
// </style>`, '');

    await styleCompiler(styles, options);

    // 生成 xxx.vue
    const sfcContent = `
<template>
    ${!config.component ? '<div>' : ''}
        ${templateCode ? templateCode : '<slot/>' }
    ${!config.component ? '</div>' : ''}
</template>

<script>
${script.contents.toString()}
</script>

<style scoped>
${styles.contents.toString() || ''}
</style>
`;
    const templateFile = new Vinyl({
        path: `${fPath}.vue`,
        contents: Buffer.from(sfcContent || '')
    });
    templateFile.writeFileSync();

    // just compile configFile
    // to involve processors
    await configCompiler(configFile, {components: scriptRet.components, config});
    return file;
}

// 插件级别的函数（处理文件）
function gulpPrefixer(opt = {dest: './dist-h5'}) {
    // 创建一个 stream 通道，以让每个文件通过
    const stream = through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            compile(file, opt)
                .then(_ => cb(null, file))
                .catch(err => {
                    log.error('[COMPILE ERROR]:', err);
                    cb(null, file);
                });
        }
    });
    // 返回文件 stream
    return stream;
}
// 导出插件主函数
module.exports = gulpPrefixer;
