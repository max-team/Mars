/**
 * @file config file
 */

module.exports = function (target) {
    const config = {
        projectFiles: ['project.swan.json', 'project.config.json'],
        source: ['src/**/*.vue'],
        dest: target === 'h5' ? './dist-h5/src' : `./dist-${target}`,
        assets: [
            'src/**/*.!(vue)'
        ],
        watch: ['src/**/*'],
        preprocessors: {
            ts: [
                {
                    name: 'babel',
                    options: {
                        plugins: ['@babel/plugin-transform-typescript']
                    }
                }
            ],
            less: 'less'
        },
        postprocessors: {
            less: {
                name: 'postcss',
                options: {
                    plugins: [
                        require('autoprefixer')({
                            browsers: ['last 2 versions']
                        })
                    ]
                }
            }
        }
    };

    return config;
};
