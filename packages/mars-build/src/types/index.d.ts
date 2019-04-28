/**
 * @file type definitions
 * @author meixuguang
 */

namespace mars {
    interface config {
        assets: string[];
        designWidth: boolean;
        dest: {
            coreDir: string;
            path: string;
        };
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
    
    interface options {
        target: target;
    }

    interface buildOptions extends options {

    }
}
