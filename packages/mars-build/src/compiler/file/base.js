/**
 * @file base file compiler
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-min-vars-per-destructure */
/* eslint-disable fecs-no-require */

const buildInProcessors = require('./processor');

async function process(source, processors) {
    for (const processor of processors) {
        const {name, options = {}, process} = processor;
        if (typeof process === 'function') {
            source = await process(source, options);
        }
        else if (buildInProcessors[name]) {
            source = await buildInProcessors[name](source, options);
        }
        else {
            throw new Error('[processor not found]', processor);
        }
    }
    return source;
}

function getExtProcessors(processors, lang) {
    let ret = [];
    Object.keys(processors).forEach(name => {
        let val = processors[name];
        if (Array.isArray(val)) {
            val = {
                extnames: val
            }
        }
        let {extnames, options = {}, process} = val;
        if (Array.isArray(extnames) && extnames.indexOf(lang) > -1) {
            ret.push({
                name,
                options,
                process
            });
        }
    });

    return ret;
}

function getFileCompiler(compile, config) {
    const {preprocessors = {}, postprocessors = {}} = config;

    return async function fileCompiler(file, options) {
        const fileOptions = file.$options;
        const lang = file.lang || file.type;
        let source = (file.contents && file.contents.toString()) || '';
        // preprocessors
        source = await process(source, getExtProcessors(preprocessors, lang));
        // compile
        options.path = file.path;
        const result =  await compile(source, options, fileOptions);
        // postprocessors
        let {code, ...rest} = result;
        code = await process(code, getExtProcessors(postprocessors, lang));
        // overwrite file contents
        file.contents = new Buffer(code || '');
        return rest;
    };
}

function getFileCompilers(compilers = {}, options) {
    const buildConfig = options._config || {};
    let ret = {};
    Object.keys(compilers).forEach(key => {
        const compiler = compilers[key];
        ret[key] = getFileCompiler(compiler, buildConfig);
    });
    return ret;
}

exports.getFileCompiler = getFileCompiler;
exports.getFileCompilers = getFileCompilers;
