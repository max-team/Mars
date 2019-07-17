/**
 * @file image
 * @Date 2019/2/21
 * @author zhaolongfei
 */

import {uploader} from '../file/upload';
import {callback} from '../../lib/utils';

export function chooseImage(options) {
    const {count = 9, sourceType = ['album', 'camera'], success, fail, complete} = options;

    return uploader('image', count, sourceType).then(data => {
        callback(success, data);
        callback(complete, data);
        return data;
    }).catch(e => {
        // 如果是接口异常，执行失败回调；否则抛出异常（用户回调函数内部执行错误）
        if (e.__errType === 0) {
            callback(fail, e);
            callback(complete, e);
            return e;
        }
        throw e;
    });
}

export function getImageInfo(options = {}) {
    const {src, success, fail, complete} = options;
    if (!src) {
        const err = {
            errCode: 904,
            errMsg: 'src is required and must be "string"'
        };
        callback(fail, err);
        return Promise.reject(err);
    }
    return new Promise((resolve, reject) => {
        const types = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'];
        const imgType = src.substr(src.lastIndexOf('.') + 1) || '';
        const img = new Image();
        img.src = src;
        img.onload = e => {
            const info = {
                path: src,
                width: e.target.naturalWidth || e.target.width,
                width: e.target.naturalHeight || e.target.height,
                type: types.includes(imgType) ? imgType : null,
                orientation: null
            };
            callback(success, info);
            resolve(info);
        };
        img.onerror = e => {
            callback(fail, e);
            reject(e);
        };
    });
}

export function previewImage(options = {}) {
    const {
        current,
        urls,
        success,
        fail,
        complete
    } = options;
    if (!urls || !urls.length) {
        const err = {
            errCode: 904,
            errMsg: '[jsNative Argument Error]urls is required.'
        };
        callback(fail, err);
        return Promise.reject(err);
    }

    const swiperStyle = {
        position: 'fixed',
        zIndex: 10000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
        overflow: 'hidden'
    };
    const swiperDom = document.createElement('div');
    swiperDom.className = 'mars-swiper';
    Object.keys(swiperStyle).forEach(key => {
        swiperDom.style[key] = swiperStyle[key];
    });

    const swiperWrapperStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: urls.length + '00%',
        height: '100%'
    };
    const swiperWrapperDom = document.createElement('div');
    swiperWrapperDom.className = 'mars-swiper-wrapper';
    Object.keys(swiperWrapperStyle).forEach(key => {
        swiperWrapperDom.style[key] = swiperWrapperStyle[key];
    });

    const swiperItemSyle = {
        position: 'relative',
        float: 'left',
        width: 100 / urls.length + '%',
        height: '100%',
        display: 'flex',
        background: 'url(https://mms-graph.cdn.bcebos.com/activity/mp_loading.gif) no-repeat center',
        backgroundSize: '30px auto'
    };

    for (const url of urls) {
        const swiperItemDom = document.createElement('div');
        swiperItemDom.className = 'mars-swiper-item';
        Object.keys(swiperItemSyle).forEach(key => {
            swiperItemDom.style[key] = swiperItemSyle[key];
        });

        swiperItemDom.addEventListener('click', e => {
            swiperDom.remove();
        }, false);

        const imgStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'none'
        };
        const img = document.createElement('img');
        img.src = url;
        Object.keys(imgStyle).forEach(key => {
            img.style[key] = imgStyle[key];
        });
        img.onload = e => {
            img.ratio = img.height / img.width;
            swiperDom.ratio = swiperDom.ratio || swiperDom.offsetHeight / swiperDom.offsetWidth;
            if (img.ratio > swiperDom.ratio) {
                img.style.height = swiperDom.offsetHeight + 'px';
                img.realWidth = swiperDom.offsetHeight / img.ratio;
                img.style.width = img.realWidth + 'px';
                img.style.left = (swiperDom.offsetWidth - img.realWidth) / 2 + 'px';
            } else {
                img.style.width = swiperDom.offsetWidth + 'px';
                img.realHeight = swiperDom.offsetWidth * img.ratio;
                img.style.height = img.realHeight + 'px';
                img.style.top = (swiperDom.offsetHeight - img.realHeight) / 2 + 'px';
            }
            img.style.display = 'block';
        };
        swiperItemDom.appendChild(img);
        swiperWrapperDom.appendChild(swiperItemDom);
    }

    // 进度条
    const swiperProgressStyle = {
        position: 'absolute',
        left: '17px',
        bottom: '20px',
        fontSize: '14px',
        color: '#fff',
        'text-shadow': '1px 1px 3px #000'
    };
    const swiperProgress = document.createElement('label');
    swiperProgress.className = 'mars-swiper-progress';
    Object.keys(swiperProgressStyle).forEach(key => {
        swiperProgress.style[key] = swiperProgressStyle[key];
    });

    swiperDom.appendChild(swiperWrapperDom);
    swiperDom.appendChild(swiperProgress);
    document.body.appendChild(swiperDom);

    // 设置初始位置
    let initLoc = 0;
    for (let i = 0; i < urls.length; i++) {
        if (urls[i] === current) {
            initLoc = i;
            break;
        }
    }
    swiperProgress.innerHTML = (initLoc + 1) + '/' + urls.length;
    // 初始偏移位置
    const initOffset = -swiperDom.offsetWidth * initLoc;
    swiperWrapperDom.style.left = initOffset + 'px';

    // 滑动事件
    const touches = {
        startX: 0,
        oriStartX: 0,
        sliding: false,
        transformX: initOffset,
        lastTransformX: 0,
        transition: '0.32s ease-in-out',
        slideLimit: [0, swiperDom.offsetWidth * (urls.length - 1)]
    };

    swiperWrapperDom.addEventListener('touchstart', e => {
        if (touches.sliding) {
            return;
        }
        touches.startX = e.touches[0].pageX || e.touches[0].clientX;
        touches.oriStartX = e.touches[0].pageX || e.touches[0].clientX;
    }, false);

    swiperWrapperDom.addEventListener('touchmove', e => {
        if (touches.sliding) {
            return;
        }
        const moveX = e.touches[0].pageX || e.touches[0].clientX;

        touches.transformX += moveX - touches.startX;

        if (touches.transformX > touches.slideLimit[0]) {
            // 滑到第一个不能再右滑
            touches.transformX = 0;
        } else if (touches.transformX < -touches.slideLimit[1]) {
            // 滑到最后一个不能再左滑
            touches.transformX = -touches.slideLimit[1];
        }
        swiperWrapperDom.style.left = touches.transformX + 'px';
        touches.startX = moveX;
    }, false);

    swiperWrapperDom.addEventListener('touchend', e => {
        if (touches.sliding) {
            return;
        }
        const endX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
        const distX = endX - touches.oriStartX;
        if (Math.abs(distX) < 30) {
            touches.transformX = touches.lastTransformX;
        } else {
            const passX = Math.abs(touches.transformX) / swiperDom.offsetWidth;
            const slideTo = distX < 0 ? Math.ceil(passX) : Math.floor(passX);
            touches.transformX = -swiperDom.offsetWidth * slideTo;
            swiperProgress.innerHTML = (slideTo + 1) + '/' + urls.length;
        }
        swiperWrapperDom.style.left = touches.transformX + 'px';
        swiperWrapperDom.style.transition = touches.transition;
        touches.sliding = true;
        setTimeout(_ => {
            swiperWrapperDom.style.transition = 'none';
            touches.sliding = false;
            touches.lastTransformX = touches.transformX;
        }, 320);
    }, false);

    callback(success, {});
    callback(complete, {});
    return Promise.resolve({});
}

export function saveImageToPhotosAlbum() {
    // TODO
}
