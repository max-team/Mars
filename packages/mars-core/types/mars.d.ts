declare global {
    const getApp: () => app;
    const getCurrentPages: () => any[];
}

export interface swanApp {
    $api: marsApis;
}

export interface marsApis {
    navigateToSmartProgram: (options: swan.swanApiOptionsNavigateToSmartProgram) => Promise<void>;
    getStorage: (options: swan.swanApiOptionsGetStorage) => Promise<any>;
    setStorage: (options: any) => Promise<any>;
    getBackgroundAudioManager: () => Promise<swan.backgroundAudioManager>;
    request: (options: any) => Promise<any>;
    login: (options?: any) => Promise<any>;
    showModal: (options?: any) => Promise<any>;
    uploadFile: (options?: any) => Promise<any>;
    isLoginSync: (options?: any) => {isLogin: boolean};

    redirectTo: (options?: any) => Promise<any>;
    navigateTo: (options?: any) => Promise<any>;
    navigateBack: (options?: any) => Promise<any>;

    chooseImage: (options?: any) => Promise<any>;

    createSelectorQuery: () => {
        select: (options?: any) => {
            boundingClientRect: () => void;
        },
        exec: (options?: any) => void;
    };
}