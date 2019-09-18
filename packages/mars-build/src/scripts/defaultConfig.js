/**
 * @file config file
 * @author zhangwentao <winty2013@gmail.com>
 */

module.exports = function (target) {
    const CLI_TARGET = process.env.MARS_CLI_TARGET || target;

    const config = {
        verbose: false,
        projectFiles: ['project.swan.json', 'project.config.json'],
        source: ['src/**/*.vue'],
        dest: `./dist-${target}`,
        assets: CLI_TARGET === 'h5' ? [
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
                    targetUnits: CLI_TARGET === 'h5' ? 'rem' : 'rpx'
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
