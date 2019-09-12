/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */

/* eslint-disable no-native-reassign */

/* eslint-disable fecs-min-vars-per-destructure */

/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */

/* eslint-disable no-native-reassign */

/* eslint-disable fecs-min-vars-per-destructure */
const {gulpPlugin} = require('./gulp-mars-base');
const {
    getCompiler,
    generate,
    mark
} = require('./compiler/template/index');
const {transform} = require('./wx/transform/index');

const templateCompiler = getCompiler(mark, transform, generate, 'wx');
const styleCompiler = require('./compiler/style/style').compile;
const scriptCompiler = require('./compiler/script/script').compile;
const scriptPostCompiler = require('./compiler/script/script').postCompile;
const configCompiler = require('./compiler/script/config').compile;

const {FILE_SUFFIX} = require('./helper/config');

const compilers = {
    templateCompiler,
    styleCompiler,
    scriptCompiler,
    scriptPostCompiler,
    configCompiler
};

// 导出插件主函数
module.exports = function (opt) {
    const target = 'wx';
    opt.fileSuffix = FILE_SUFFIX[target];
    opt.target = target;
    return gulpPlugin(opt, compilers);
};
