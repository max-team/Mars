/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */
/* eslint-disable fecs-min-vars-per-destructure */
const renderFunctionName = '__renderFunction';
const {getFileCompilers} = require('../file/base');

exports.compile = async function compile(file, options) {
    const {template, script, styles, config: configFile} = file;
    const {compilers, isApp, fPath, target, coreRelativePath, baseName} = options;
    const {
        templateCompiler,
        scriptCompiler,
        scriptPostCompiler,
        styleCompiler,
        configCompiler
    } = getFileCompilers(compilers, options);
    let {components, config, computedKeys, moduleType} = await scriptCompiler(script, {
        isApp,
        coreRelativePath,
        target,
        renderStr: !isApp ? renderFunctionName : null,
        dest: options._config.dest
    });

    // use configFile.$options.config first
    const configOptions = configFile.$options.config;
    config = configOptions && configOptions.config ? configOptions.config : config;
    // app.vue has no template
    if (!isApp) {
        const {render, componentsInUsed} = await templateCompiler(template, {
            components,
            computedKeys,
            target
        });
        await scriptPostCompiler(script, {
            componentsInUsed
        });
        script.appendContent(
            `;\nfunction ${renderFunctionName}() {return ${render + '.render.bind(this)()'};\n}`
        );
        template.writeFileSync();
    }

    if (config.component === true) {
        script.path = fPath + '.vue.js';
        script.writeFileSync();

        script.path = fPath + '.js';
        const emsImport = `import comp from './${baseName}.vue';\n`
            + `import {createComponent} from '${coreRelativePath}';\n`
            + 'Component(createComponent(comp));\n';
        const cmdRequire = `const comp = require('./${baseName}.vue');\n`
            + `const {createComponent} = require('${coreRelativePath}');\n`
            + 'Component(createComponent(comp));\n';
        script.contents = new Buffer(moduleType === 'esm' ? emsImport : cmdRequire);
        script.writeFileSync();
    }
    else {
        script.writeFileSync();
    }

    return Promise.all([
        configCompiler(configFile, {components, config}).then(_ => {
            configFile.writeFileSync();
        }),
        styleCompiler(styles, options).then(_ => {
            styles.writeFileSync();
        })
    ]);
};
