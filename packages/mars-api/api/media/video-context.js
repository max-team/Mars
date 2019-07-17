/**
 * @file video context
 * @author zhaolongfei
 */

class VideoContext {
    constructor(id) {
        this.video = document.querySelector('#' + id + ' video');
        this.poster = document.querySelector('[class*=mars-video-poster]');
    }

    play() {
        this.poster.click();
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    seek(time) {
        if (this.video.seek) {
            this.video.seek(time);
        } else {
            console.warn('video.seek is not supported');
        }
    }

    requestFullScreen() {
        if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.webkitRequestFullScreen) {
            this.video.webkitRequestFullScreen();
        } else if (this.video.webkitEnterFullScreen) {
            this.video.webkitEnterFullScreen();
        } else if (this.video.mozRequestFullScreen) {
            this.video.mozRequestFullScreen();
        }
    }

    exitFullScreen() {
        if (this.video.exitFullscreen) {
            this.video.exitFullscreen();
        } else if (this.video.webkitExitFullscreen) {
            this.video.webkitExitFullscreen();
        } else if (this.video.cancelFullScrren) {
            this.video.cancelFullScrren();
        } else if (this.video.webkitCancelFullScreen) {
            this.video.webkitCancelFullScreen();
        } else if (this.video.webkitCancelFullScreen) {
            this.video.webkitCancelFullScreen();
        }
    }

    sendDanmu() {
        console.warn('sendDanmu is not supported');
    }

    showStatusBar() {
        console.warn('showStatusBar is not supported');
    }

    hideStatusBar() {
        console.warn('hideStatusBar is not supported');
    }
}

export function createVideoContext(videoId) {
    return new VideoContext(videoId);
}