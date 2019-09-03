export interface swan {
    setPageInfo: (options: swanApiOptionsSetPageInfo) => void;
    showLoading: (options: swanApiOptionsShowLoading) => void;
    hideLoading: () => void;
    showToast: (options: swanApiOptionsShowToast) => void;
    getSystemInfo: (options: swanApiOptionsGetSystemInfo) => void;
    showFavoriteGuide: () => void;
    navigateToSmartProgram: (options: swanApiOptionsNavigateToSmartProgram) => void;
    getStorage: (options: swanApiOptionsGetStorage) => void;
    setNavigationBarTitle: (options: swanApiOptionsSetNavigationBarTitle) => void;
    isLoginSync: (options?: any) => {isLogin: boolean};
    reportAnalytics: (str: string, data: any) => void;
}

interface swanApiOptionsBase {
    success?: (res: any) => any;
    fail?: () => {};
    complete?: () => {};
}

export interface swanApiOptionsSetPageInfo extends swanApiOptionsBase {
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

export interface swanApiOptionsShowLoading extends swanApiOptionsBase {
    title: string;
    mask?: boolean;
}

export interface swanApiOptionsSetKeepScreenOn extends swanApiOptionsBase {
    keepScreenOn: boolean;
}

export interface swanApiOptionsShowToast extends swanApiOptionsBase {
    title: string;
    icon?: string;
    image?: string;
    duration?: number;
    mask?: boolean;
}

export interface swanApiOptionsSetNavigationBarTitle extends swanApiOptionsBase {
    title: string;
}

export type swanApiOptionsGetSystemInfo = {
    success: (res: systemInfo) => void;
    fail?: () => {};
    complete?: () => {};
}

export interface swanApiOptionsNavigateToSmartProgram extends swanApiOptionsBase {
    appKey: string;
    path: string;
    extraData: {
        [key: string]: any
    }
}
export interface swanApiOptionsGetStorage extends swanApiOptionsBase {
    key: string;
}

export interface swanApiOptionsRecognizeImage extends swanApiOptionsBase {
    categoryList: string[];
    customTips: {
        BARCODE?: {
            topTip?: string;
            bottomTip?: string;
        },
        AR?: {
            guideTip?: string;
            resultTitle?: string;
        }
    };
    index?: number;
    showTitle?: boolean;
}

export interface systemInfo {
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

export interface backgroundAudioManager {
    onEnded: (res: any) => void;
    onError: (res: any) => void;
    play: () => void;
    pause: () => void;
    src: string;
}
