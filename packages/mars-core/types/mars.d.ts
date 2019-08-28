import {
    swan,
    swanApiOptionsNavigateToSmartProgram,
    swanApiOptionsGetStorage,
    backgroundAudioManager,
    swanApiOptionsRecognizeImage,
    swanApiOptionsSetKeepScreenOn,
    systemInfo
} from './swan';
declare global {
    const getApp: () => swanApp;
    const getCurrentPages: () => any[];
    const swan: swan;
}

export interface swanApp {
    $api: marsApis;
}

export {
    backgroundAudioManager
} from './swan';

export interface marsApis {
    navigateToSmartProgram: (options: swanApiOptionsNavigateToSmartProgram) => Promise<void>;
    getStorage: (options: swanApiOptionsGetStorage) => Promise<any>;
    setStorage: (options: any) => Promise<any>;
    getBackgroundAudioManager: () => backgroundAudioManager;
    request: (options: any) => Promise<any>;
    login: (options?: any) => Promise<any>;
    showModal: (options?: any) => Promise<any>;
    uploadFile: (options?: any) => Promise<any>;
    isLoginSync: (options?: any) => {isLogin: boolean};

    redirectTo: (options?: any) => Promise<any>;
    navigateTo: (options?: any) => Promise<any>;
    navigateBack: (options?: any) => Promise<any>;
    chooseImage: (options?: any) => Promise<any>;
    recognizeImage: (options?: swanApiOptionsRecognizeImage) => Promise<{
        barcodeResult: {
            result: string;
            codeType: string;
        },
        imageResult: {
            data: {
                resultUrl: string;
                resultWord: string[];
            }[];
        }
    }>;
    createSelectorQuery: () => {
        select: (options?: any) => {
            boundingClientRect: () => void;
        },
        exec: (options?: any) => void;
    };
    setKeepScreenOn: (options?: swanApiOptionsSetKeepScreenOn) => Promise<any>;
    getSystemInfo: () => Promise<systemInfo>;
}