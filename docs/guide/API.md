# API

Mars 的 API 规范使用百度智能小程序和微信小程序 API 规范，在 H5 端进行了适配，并支持 Promise 化。为了实现多端兼容，框架会在 App 实例及 Page/Component 实例上通过 `$api` 字段来挂载原生 API，即：可以在实例上通过 `this.$api` 或者在其他 js 文件中通过 `app.$api` (`app = getApp()`) 来访问小程序 API。

## 小程序 API 官方文档

- [百度智能小程序](https://smartprogram.baidu.com/docs/develop/api/net_request/#request/)
- [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/api/)

## API 使用示例

```js
this.$api.request({...params, success, fail, complete})
    .then(res => {
        // TODO
    }).catch(e => {
        // TODO
    });
```

## API 支持列表

### 网络

#### 请求
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| request | ✓ | ✓ | ✓ |

#### 上传
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| upLoadFile | ✓ | ✓ | ✓ |
| downloadFile | ✓ | ✓ | ✗ |

#### WebSocket
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| connectSocket | ✓ | ✓ | ✓ |
| onSocketOpen | ✓ | ✓ | ✓ |
| onSocketError | ✓ | ✓ | ✓ |
| onSocketMessage | ✓ | ✓ | ✓ |
| onSocketClose | ✓ | ✓ | ✓ |
| sendSocketMessage | ✓ | ✓ | ✓ |
| closeSocket | ✓ | ✓ | ✓ |
| SocketTask | ✓ | ✓ | ✓ |

### AI
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| * | ✓ | ✗ | ✗ |

### 媒体

#### 图片
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| chooseImage | ✓ | ✓ | ✓ |
| previewImage | ✓ | ✓ | ✗ |
| getImageInfo | ✓ | ✓ | ✗ |
| saveImageToPhotosAlbum | ✓ | ✓ | ✗ |

#### 录音管理
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| getRecorderManager | ✓ | ✓ | ✗ |

#### 背景音频管理播放
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| getBackgroundAudioManager | ✓ | ✓ | ✗ |

#### 音频组件控制
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createInnerAudioContext | ✓ | ✓ | ✗ |
| setInnerAudioOption | ✓ | ✓ | ✗ |

#### 视频
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| chooseVideo | ✓ | ✓ | ✗ |
| saveVideoToPhotosAlbum | ✓ | ✓ | ✗ |

#### 视频组件控制
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createVideoContext | ✓ | ✓ | ✗ |

#### 直播组件控制
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createLivePlayerContext | ✓ | ✓ | ✗ |

#### 相机组件控制
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createCameraContext | ✓ | ✓ | ✗ |

#### AR 相机组件控制
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createARCameraContext | ✓ | ✓ | ✗ |

### 文件

#### 保存、获取文件
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| saveFile | ✓ | ✓ | ✗ |
| getFileInfo | ✓ | ✓ | ✗ |
| getSavedFileList | ✓ | ✓ | ✗ |
| getSavedFileInfo | ✓ | ✓ | ✗ |

#### 删除文件
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| removeSavedFile | ✓ | ✓ | ✗ |

#### 打开新的文件页面
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| openDocument | ✓ | ✓ | ✗ |

### 数据存储

#### 存储数据
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| setStorage | ✓ | ✓ | ✓ |
| setStorageSync | ✓ | ✓ | ✓ |
| getStorage | ✓ | ✓ | ✓ |
| getStorageSync | ✓ | ✓ | ✓ |
| getStorageInfo | ✓ | ✓ | ✓ |
| getStorageInfoSync | ✓ | ✓ | ✓ |

#### 存储清理
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| removeStorage | ✓ | ✓ | ✓ |
| removeStorageSync | ✓ | ✓ | ✓ |
| clearStorage | ✓ | ✓ | ✓ |
| clearStorageSync | ✓ | ✓ | ✓ |

### 位置

#### 获取位置
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| getLocation | ✓ | ✓ | ✗ |
| chooseLocation | ✓ | ✓ | ✗ |

#### 查看位置
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| openLocation | ✓ | ✓ | ✗ |

#### 地图组件控制
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createMapContext | ✓ | ✓ | ✗ |

### 界面

#### 绘图
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createCanvasContext | ✓ | ✓ | ✓ |
| canvasGetImageData | ✓ | ✓ | ✓ |
| canvasPutImageData | ✓ | ✓ | ✓ |
| canvasToTempFilePath | ✓ | ✓ | ✓ |
| canvasContext.api | ✓ | ✓ | ✓ |

#### 交互反馈
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| showToast | ✓ | ✓ | ✓ |
| showLoading | ✓ | ✓ | ✓ |
| hideToast | ✓ | ✓ | ✓ |
| hideLoading | ✓ | ✓ | ✓ |
| showModal | ✓ | ✓ | ✓ |
| showActionSheet | ✓ | ✓ | ✓ |

#### 导航栏
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| setNavigationBarTitle | ✓ | ✓ | ✓ |
| showNavigationBarLoading | ✓ | ✓ | ✗ |
| hideNavigationBarLoading | ✓ | ✓ | ✗ |
| setNavigationBarColor | ✓ | ✓ | ✓ |

#### 设置tabBar
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| setTabBarBadge | ✓ | ✓ | ✓ |
| removeTabBarBadge | ✓ | ✓ | ✓ |
| showTabBarRedDot | ✓ | ✓ | ✓ |
| hideTabBarRedDot | ✓ | ✓ | ✓ |
| setTabBarStyle | ✓ | ✓ | ✓ |
| setTabBarItem | ✓ | ✓ | ✓ |
| showTabBar | ✓ | ✓ | ✓ |
| hideTabBar | ✓ | ✓ | ✓ |

#### 导航
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| navigateTo | ✓ | ✓ | ✓ |
| redirectTo | ✓ | ✓ | ✓ |
| switchTab | ✓ | ✓ | ✓ |
| navigateBack | ✓ | ✓ | ✓ |
| reLaunch | ✓ | ✓ | ✓ |

#### 动画
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createAnimation | ✓ | ✓ | ✓ |
| animation | ✓ | ✓ | ✗ |

#### 位置
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| pageScrollTo | ✓ | ✓ | ✓ |

#### 背景
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| setBackgroundColor | ✓ | ✓ | ✗ |
| setBackgroundTextStyle | ✓ | ✓ | ✗ |

#### 下拉刷新
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| onPullDownRefresh | ✓ | ✓ | ✓ |
| stopPullDownRefresh | ✓ | ✓ | ✓ |
| startPullDownRefresh | ✓ | ✓ | ✗ |

#### 自定义组件
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| nextTick | ✓ | ✓ | ✗ |

#### 菜单
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| getmenuButtonBoundingClientRect | ✓ | ✓ | ✗ |

#### 节点信息
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| createIntersectionObserver | ✓ | ✓ | ✗ |
| IntersectionObserver | ✓ | ✓ | ✗ |
| IntersectionObserver.api | ✓ | ✓ | ✗ |
| createSelectorQuery | ✓ | ✓ | ✓ |
| selectorQuery | ✓ | ✓ | ✓ |
| selectorQuery.api | ✓ | ✓ | ✓ |

#### 添加到我的小程序引导
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| showFavoriteGuide | ✓ | ✗ | ✗ |

### 设备

#### 系统信息
| API | 百度小程序 | 微信小程序 | H5 | 备注 |
|---|---|---|---|---|
| getSystemInfo | ✓ | ✓ | ✓ | H5暂未支持信息：brand、fontSizeSetting、host、SDKVersion |
| getSystemInfoSync | ✓ | ✓ | ✓ | 同上 |
| getEnvInfoSync | ✓ | ✓ | ✗ | - |
| canIUse | ✓ | ✓ | ✗ | - |

#### 内存
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| onMemoryWarning | ✓ | ✓ | ✗ |

#### 网络状态
| API | 百度小程序 | 微信小程序 | H5 | 备注 |
|---|---|---|---|---|
| getNetworkType | ✓ | ✓ | ✓ | 存在设备差异，iOS下可能不太准确 |
| onNetworkStatusChange | ✓ | ✓ | ✓ | 同上 |

#### 加速度计
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| onAccelerometerChange | ✓ | ✓ | ✗ |
| startAccelerometer | ✓ | ✓ | ✗ |
| stopAccelerometer | ✓ | ✓ | ✗ |

#### 罗盘
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| onCompassChange | ✓ | ✓ | ✗ |
| startCompass | ✓ | ✓ | ✗ |
| stopCompass | ✓ | ✓ | ✗ |

###### 设备方向
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| onDeviceMotionChange | ✓ | ✓ | ✗ |
| startDeviceMotionListening | ✓ | ✓ | ✗ |
| stopDeviceMotionListening | ✓ | ✓ | ✗ |

#### 获取电量信息
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| getBatteryInfo | ✓ | ✓ | ✗ |
| getBatteryInfoSync | ✓ | ✓ | ✗ |

#### 扫码
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| scanCode | ✓ | ✓ | ✗ |

#### 屏幕亮度
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| setScreenBrightness | ✓ | ✓ | ✗ |
| getScreenBrightness | ✓ | ✓ | ✗ |
| setKeepScreenOn | ✓ | ✓ | ✗ |

#### 用户截屏事件
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| onUserCaptureScreen | ✓ | ✓ | ✗ |

#### 振动
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| vibrateLong | ✓ | ✓ | ✗ |
| vibrateShort | ✓ | ✓ | ✗ |

#### 手机联系人
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| addPhoneContact | ✓ | ✓ | ✗ |

#### 拨打电话
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| makePhoneCall | ✓ | ✓ | ✓ |

#### 剪贴板
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| setClipboardData | ✓ | ✓ | ✗ |
| getClipboardData | ✓ | ✓ | ✗ |

### 第三方平台

#### 获取第三方平台数据
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| getExtConfig | ✓ | ✓ | ✗ |
| getExtConfigSync | ✓ | ✓ | ✗ |

### 开放接口

#### 登录
> 请参照各平台详细说明。

#### 授权
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| authorize | ✓ | ✓ | ✗ |

#### 用户信息
> 请参照各平台详细说明。

#### 设置
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| openSetting | ✓ | ✓ | ✗ |
| getSetting | ✓ | ✓ | ✗ |

#### 分享
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| onShareAppMessage | ✓ | ✓ | ✗ |
| openShare | ✓ | ✓ | ✗ |

#### 选择收货地址
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| chooseAddress | ✓ | ✓ | ✗ |

#### 百度收银台支付
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| requestPolymerPayment | ✓ | ✗ | ✗ |

#### 获取发票抬头
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| chooseInvoiceTitle | ✓ | ✓ | ✗ |

#### 打开小程序
| API | 百度小程序 | 微信小程序 | H5 | 备注 |
|---|---|---|---|---|
| navigateToSmartProgram | ✓ | ✓| ✗ | - |
| navigateBackSmartProgram | ✓ | ✗| ✗ | - |
| H5页面打开小程序 | ✓ | ✗| ✓ | [文档](https://smartprogram.baidu.com/docs/develop/api/open_smartprogram/#H5%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%E5%B0%8F%E7%A8%8B%E5%BA%8F/) |

#### 模板消息
> 请参照百度小程序[官方文档](https://smartprogram.baidu.com/docs/develop/api/open_infomation/)。

#### 页面基础信息
> 请参照百度小程序[官方文档](https://smartprogram.baidu.com/docs/develop/api/pageinfo/)。

#### 分包预下载
> 请参照百度小程序[官方文档](https://smartprogram.baidu.com/docs/develop/api/open_preloadsubpackage/)。

#### 信息流资源
> 请参照百度小程序[官方文档](https://smartprogram.baidu.com/docs/develop/api/open_feed/)。

#### 更新
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| getUpdateManager | ✓ | ✓ | ✗ |

#### 调试
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| setEnableDebug | ✓ | ✓ | ✗ |

#### 数据分析
| API | 百度小程序 | 微信小程序 | H5 |
|---|---|---|---|
| reportAnalytics | ✓ | ✓ | ✗ |
