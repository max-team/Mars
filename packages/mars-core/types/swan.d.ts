declare namespace swan {
    const setPageInfo: (options: swanApiOptionsSetPageInfo) => void;
    const showLoading: (options: swanApiOptionsShowLoading) => void;
    const hideLoading: () => void;
    const showToast: (options: swanApiOptionsShowToast) => void;
    const getSystemInfo: (options: swanApiOptionsGetSystemInfo) => void;
    const showFavoriteGuide: () => void;
    const navigateToSmartProgram: (options: swanApiOptionsNavigateToSmartProgram) => void;
    const getStorage: (options: swanApiOptionsGetStorage) => void;
    
    interface swanApiOptionsBase {
        success?: (res: any) => any;
        fail?: () => {};
        complete?: () => {};
    }
    
    interface swanApiOptionsSetPageInfo extends swanApiOptionsBase {
        title: string;
        keywords: string;
        description: string;
        releaseDate?: string;
        articleTitle?: string;
        image?: string | string[];
        video?: any;
        visit?: any;
        likes?: string;
        comments?: string;
        collects?: string;
        shares?: string;
        followers?: string;
    }
    
    interface swanApiOptionsShowLoading extends swanApiOptionsBase {
        title: string;
        mask?: boolean;
    }
    
    interface swanApiOptionsShowToast extends swanApiOptionsBase {
        title: string;
        icon?: string;
        image?: string;
        duration?: number;
        mask?: boolean;
    }
    
    type swanApiOptionsGetSystemInfo = {
        success: (res: systemInfo) => void;
        fail?: () => {};
        complete?: () => {};
    }
    
    interface swanApiOptionsNavigateToSmartProgram extends swanApiOptionsBase {
        appKey: string;
        path: string;
        extraData: {
            [key: string]: any
        }
    }
    interface swanApiOptionsGetStorage extends swanApiOptionsBase {
        key: string;
    }
    
    interface systemInfo {
        brand: string;
        model: string;
        pixelRatio: string;
        screenWidth: string;
        screenHeight: string;
        windowWidth: string;
        windowHeight: string;
        statusBarHeight: string;
        navigationBarHeight: string;
        language: string;
        version: string;
        system: string;
        platform: string;
        fontSizeSetting: string;
        SDKVersion: string;
        host: string;
        cacheLocation: string;
        swanNativeVersion: string;
        devicePixelRatio: string
    }

    interface backgroundAudioManager {
        onEnded: (res: any) => void;
        onError: (res: any) => void;
        play: () => void;
        pause: () => void;
        src: string;
    }
}

