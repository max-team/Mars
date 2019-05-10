/**
 * @file type definitions
 * @author meixuguang
 */

namespace mars {
    interface config {
        assets: string[];
        designWidth: boolean;
        dest: destObj;
        devConfig: {
            buildPath: string;
            corePath: string;
        };
        framework: any;
        modules: {
            [name: string]: any;
        };
        options: any;
        postprocessors: any;
        preprocessors: any;
        projectFiles: string[];
        source: {
            assets: string[];
            h5Template: string;
            runtime: string;
            sfc: string[];
        };
        watch: string[];
    }
    
    enum target {
        swan = 'swan',
        h5 = 'h5',
        wx = 'wx'
    }

    interface destObj {
        coreDir: string;
        path: string;
    }
    
    interface options {
        target: target;
        _config?: config;
    }

    interface buildOptions extends options {

    }
}
