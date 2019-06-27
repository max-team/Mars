/**
 * @file Canvas API
 * @author zhaolongfei
 */
import {callback} from '../../lib/utils';

class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
    }
    /**
     * 小程序目前不支持的H5 API
     * isPointInPath()
     * transform()
     * createImageData()
     * globalCompositeOperation()
     * toDataURL()
     */

    getImageData(x, y, width, height) {
        this.getImageData(x, y, width, height);
    }

    setFillStyle(color) {
        this.context.fillStyle = color;
    }

    setStrokeStyle(color) {
        this.context.strokeStyle = color;
    }

    setShadow(offsetX, offsetY, blur, color) {
        offsetX && (this.context.shadowOffsetX = offsetX);
        offsetY && (this.context.shadowOffsetY = offsetY);
        blur && (this.context.shadowBlur = blur);
        color && (this.context.shadowColor = color);
    }

    ecreateLinearGradient(params) {
        this.context.ecreateLinearGradient(...params);
    }

    createCircularGradient(x, y, r) {
        /**
         * x0渐变的开始圆的 x 坐标
         * y0渐变的开始圆的 y 坐标
         * r0开始圆的半径
         * x1渐变的结束圆的 x 坐标
         * y1渐变的结束圆的 y 坐标
         * r1结束圆的半径
         */
        this.context.createRadialGradient(x, y, 0, x, y, r);
    }

    addColorStop(stop, color) {
        this.context.addColorStop(stop, color);
    }

    setLineWidth(lineWidth) {
        this.context.lineWidth = lineWidth;
    }

    setLineCap(lineCap) {
        this.context.lineCap = lineCap;
    }

    setLineJoin(lineJoin) {
        this.context.lineJoin = lineJoin;
    }

    setLineDash(pattern, offset) {
        this.context.setLineDash(pattern);
        this.context.lineDashOffset = offset;
    }

    setMiterLimit(miterLimit) {
        this.context.miterLimit = miterLimit;
    }

    rect(x, y, width, height) {
        this.context.rect(x, y, width, height);
    }

    fillRect(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
    }

    strokeRect(x, y, width, height) {
        this.context.strokeRect(x, y, width, height);
    }

    clearRect(x, y, width, height) {
        this.context.clearRect(x, y, width, height);
    }

    fill() {
        this.context.fill();
    }

    stroke() {
        this.context.stroke();
    }

    beginPath() {
        this.context.beginPath();
    }

    closePath() {
        this.context.closePath();
    }

    moveTo(x, y) {
        this.context.moveTo(x, y);
    }

    lineTo(x, y) {
        this.context.lineTo(x, y);
    }

    arc(x, y, r, sAngle, eAngle, counterclockwise = false) {
        this.context.arc(x, y, r, sAngle, eAngle, counterclockwise);
    }

    scale(scaleWidth, scaleHeight) {
        this.context.scale(scaleWidth, scaleHeight);
    }

    rotate(rotate) {
        this.context.rotate(rotate);
    }

    translate(x, y) {
        this.context.translate(x, y);
    }

    clip() {
        this.context.clip();
    }

    setFontSize(fontSize) {
        this.context.font = fontSize + 'px normal';
    }

    fillText(text, x, y, maxWidth) {
        this.context.fillText(text, x, y, maxWidth);
    }

    setTextAlign(align) {
        this.context.textAlign = align;
    }

    setTextBaseline(textBaseline) {
        this.context.textBaseline = textBaseline;
    }

    drawImage(imageResource, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight) {
        // 与H5相反
        this.context.drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }

    setGlobalAlpha(alpha) {
        this.context.globalAlpha = alpha;
    }

    measureText(text) {
        this.context.measureText(text);
    }

    arcTo(x1, y1, x2, y2, radius) {
        this.context.arcTo(x1, y1, x2, y2, radius);
    }

    strokeText(text, x, y, maxWidth) {
        this.context.strokeText(text, x, y, maxWidth);
    }

    setLineDashOffset(value) {
        this.context.lineDashOffset = value;
    }

    /**
     * createPattern
     * @param {string} image 重复的图像源，仅支持包内路径和临时路径
     * @param {string} repetition 指定如何重复图像，有效值有: repeat, repeat-x, repeat-y, no-repeat
     */
    createPattern(image, repetition) {
        // 规定要使用的图片元素
        // TODO check params
        this.context.createPattern(image, repetition);
    }

    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    }

    quadraticCurveTo(cpx, cpy, x, y) {
        this.context.quadraticCurveTo(cpx, cpy, x, y);
    }

    save() {
        this.context.save();
    }

    restore() {
        this.context.restore();
    }

    draw(reserve, cb) {
        // H5 不需要通过 draw 方法开发绘制
        cb && cb();
    }

    font(value) {
        this.context.font = value;
    }

    setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY) {
        this.context.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);
    }
}

export function createCanvasContext(canvasId) {
    return new Canvas(canvasId);
}

export function canvasGetImageData(options) {
    const {
        canvasId,
        x,
        y,
        width,
        height,
        success,
        fail,
        complete
    } = options;

    const context = document.getElementById(canvasId).getContext('2d');
    context.getImageData(x, y, width, height);
    callback(success);
    callback(complete);
}

export function canvasPutImageData(options) {
    const {
        canvasId,
        x,
        y,
        width,
        height,
        data,
        success,
        fail,
        complete
    } = options;

    const context = document.getElementById(canvasId).getContext('2d');
    context.putImageData(data, 0, 0, x, y, width, height); // ImageData 对象左上角的 x=0,y=0 坐标(小程序未提供)
    callback(success);
    callback(complete);
}

export function canvasToTempFilePath(options) {
    const {
        canvasId,
        x,
        y,
        width,
        height,
        destWidth,
        destHeight,
        fileType,
        quality,
        success,
        fail,
        complete
    } = options;

    try {
        const context = document.getElementById(canvasId).canvas.getContext('2d');
        const imgData = context.getImageData(x, y, width, height);

        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = destWidth;
        targetCanvas.height = destHeight;
        const targetCtx = targetCanvas.getContext('2d');
        targetCtx.putImageData(imgData, 0, 0, 0, 0, destWidth, destHeight);

        const targetBase64 = targetCanvas.toDataURL('image/' + fileType, quality);

        const res = {
            tempFilePath: targetBase64
        };

        callback(success, res);
        callback(complete, res);
    } catch (e) {
        callback(fail, e);
        callback(complete, e);
    }
}