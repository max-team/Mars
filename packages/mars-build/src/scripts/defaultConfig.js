/**
 * @file config file
 * @author zhangwentao <winty2013@gmail.com>
 */

module.exports = function (options = {target: 'swan'}) {
    const {
        target,
        env
    } = options;
    const config = {
        projectFiles: ['project.swan.json', 'project.config.json'],
        source: ['src/**/*.vue'],
        dest: target === 'h5' ? `./dist-${env || 'h5'}/src` : `./dist-${target}`,
        assets: target === 'h5' ? [
            'src/**/*.!(vue|swan|wxml)'
        ]
        : [
            'src/**/*.!(vue)'
        ],
        designWidth: 750,
        watch: ['src/**/*'],
        framework: {},
        modules: {
            postcss: {
                px2units: {
                    targetUnits: target === 'h5' ? 'rem' : 'rpx'
                }
            }
        },
        preprocessors: {
            less: {
                extnames: ['less']
            },
            sass: {
                extnames: ['sass', 'scss']
            },
            stylus: {
                extnames: ['stylus', 'styl']
            },
            typescript: {
                extnames: ['ts']
            }
        },
        postprocessors: {
            postcss: {
                extnames: ['css', 'less', 'sass', 'scss', 'stylus', 'styl'],
                options: {
                    plugins: [require('autoprefixer')]
                }
            }
        }
    };

    return config;
};
