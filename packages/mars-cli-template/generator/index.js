/**
 * @file mars-cli-template generator
 * @author meixuguang
 */

module.exports = async (api, options) => {


    if (options.isDistH5) {
        api.render('./dist-h5');
        return;
    }

    api.render('./template', {
        doesCompile: api.hasPlugin('babel') || api.hasPlugin('typescript')
    });

    if (!options.noH5) {
        api.render('./template-h5', {
            doesCompile: api.hasPlugin('babel') || api.hasPlugin('typescript')
        });

        // 添加 h5 所需的依赖
        api.extendPackage({
            scripts: {
                'serve-dist-h5': 'mars-cli-service serve',
                'build-dist-h5': 'mars-cli-service build'
            },
            dependencies: {
                'vue': '^2.6.6',
                'vue-router': '^3.0.1',
                '@marsjs/components': '^1.0.10',
                '@marsjs/api': '^1.0.11'
            },
            devDependencies: {
                'atom-web-compiler': '^2.2.0',
                'atom2vue-loader': '^1.0.0',
                '@marsjs/vue-cli-plugin-mars-web': '^0.0.9',
                '@vue/cli-plugin-babel': '^3.0.0',
                '@vue/cli-service': '^3.5.0',
                'less': '^3.0.4',
                'less-loader': '^4.1.0',
                'vue-template-compiler': '^2.6.10'
            }
        });
    }

    api.extendPackage({
        scripts: {
            'serve': 'mars serve',
            'build': 'mars build',
            'build:swan': 'mars build',
            'serve:swan': 'mars serve',
            'build:h5': 'mars build -t h5',
            'serve:h5': 'mars serve -t h5',
            'build:wx': 'mars build -t wx',
            'serve:wx': 'mars serve -t wx'
        },
        dependencies: {
            '@marsjs/build': '^0.2.0',
            '@marsjs/core': '^0.2.0'
        },
        devDependencies: {
            '@vue/cli': '^3.3.0'
        }
    });

    // additional tooling configurations
    if (options.configs) {
        api.extendPackage(options.configs);
    }
};
