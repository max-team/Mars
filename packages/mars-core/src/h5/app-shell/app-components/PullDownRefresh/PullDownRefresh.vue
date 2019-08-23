<template>
    <div 
        class="mars-pull-refresh-wrap"
        ref="scroller"
    >
        <div
            :style="{
                height: `${height}px`
            }"
            :class="{
                'mars-pull-refresh-header-loading': currentStep === 3,
                'mars-pull-refresh-header-loaded': currentStep === 4
            }"
            class="mars-pull-refresh-header"
        >
            <div class="mars-pull-refresh-loading">
                <span class="mars-pull-refresh-pulling-text mars-gap-left-small">松手加载</span>
                <span class="mars-pull-refresh-loading-text mars-gap-left-small">Loading...</span>
            </div>
            <div class="mars-pull-refresh-loaded">
                <span class="mars-pull-refresh-loaded-text mars-gap-left-middle">
                    刷新完毕
                </span>
            </div>
        </div>
        <div class="mars-pull-refresh-content">
            <slot/>
        </div>
    </div>
</template>

<script>
const STATUS_NORMAL = 1;
const STATUS_PULLING = 2;
const STATUS_LOADING = 3;
const STATUS_LOADED = 4;

export default {
    props: {
        offset: {
            type: Number,
            default: 30
        },
        errorTip: {
            type: String,
            default: '暂时没有更新，休息一下吧'
        },
        tipShowTime: {
            type: Number,
            default: 600
        },
        enableReachBottom: {
            type: Boolean,
            default: false
        },
        enablePullDownRefresh: {
            type: Boolean,
            default: false
        },
        onReachBottomDistance: {
            type: Number,
            default: 50
        }
    },
    data() {
        return {
            curY: 0,
            moveY: 0,
            height: 0,
            originY: 0,
            iconPosY: 0,
            loading: false,
            triggerFlag: false,
            scrollTopStart: 0,
            currentStep: 1
        }
    },
    mounted() {
        this.scroller = this.$refs.scroller;
        this.container = window;
        this.enablePullDownRefresh && this.initTouch();
        this.initScroll();
    },
    updated() {
        this.enablePullDownRefresh ? (this.initTouch()) : (this.detachTouch());
        // this.enableReachBottom ? (this.initScroll()) : (this.detachScroll());
    },
    methods: {
        initTouch() {
            let {
                enablePullDownRefresh,
                onTouchStart,
                onTouchMove,
                onTouchEnd,
                onTouchCancel
            } = this;
            if (!enablePullDownRefresh) {
                return;
            }
            window.addEventListener('touchstart', onTouchStart);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onTouchEnd);
            window.addEventListener('touchcancel', onTouchCancel);
        },
        detachTouch() {
            let {
                enablePullDownRefresh,
                onTouchStart,
                onTouchMove,
                onTouchEnd,
                onTouchCancel
            } = this;
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchcancel', onTouchCancel);
        },
        initScroll() {
            this.scrollHandler = null;
            window.addEventListener('scroll', this.onScroll);
        },
        onScroll() {
            this.$emit('page-scroll', {
                scrollTop: window.pageYOffset
            });
            if (!this.enableReachBottom) {
                return;
            }
            this.containerHeight = this.container.offsetHeight;
            
            if (this.scrollHandler) {
                clearTimeout(this.scrollHandler);
                this.scrollHandler = null;
            }
            
            if ((this.scroller.offsetHeight - window.pageYOffset - window.innerHeight) <= this.onReachBottomDistance) {
                this.scrollHandler = setTimeout(() => {
                    this.$emit('reach-bottom');
                }, 50);
            }
        },
        detachScroll() {
            this.scrollHandler = null;
            window.removeEventListener('scroll', this.onScroll);
        },
        onTouchStart(e) {
            if (this.loading) {
                return;
            }
            this.currentStep = STATUS_NORMAL;
            this.originY = e.touches[0].clientY;
            this.scrollTopStart = window.pageYOffset;
        },

        onTouchMove(e) {
            if (this.loading) {
                return;
            }
            let curScrollTop = 0;
            this.curY = e.touches[0].clientY;
            this.moveY = this.curY - this.originY;
            curScrollTop = this.scrollTopStart - this.moveY;
            if (this.moveY > 0 && curScrollTop <= 0 && !this.scrollTopStart) {
                this.height = this.moveY;
                this.currentStep = STATUS_PULLING;
                this.triggerFlag = this.moveY > this.offset;
            }
        },

        onTouchEnd(e) {
            const that = this;
            if (that.loading) {
                return;
            }
            if (!that.triggerFlag) {
                that.reset();
                return;
            }
            that.loading = true;
            this.currentStep = STATUS_LOADING;
            this.height = this.offset;
            that.$emit('pull-down-refresh');
        },

        stopPullDownRefresh() {
            if (!this.loading) {
                return;
            }
            this.currentStep = STATUS_LOADED;
            setTimeout(this.reset, this.tipShowTime);
        },

        reset() {
            this.loading = false;
            this.triggerFlag = false;
            this.height = 0;
            this.iconPosY = 0;
        }
    }
};
</script>

<style lang="less" scoped>
.mars-pull-refresh-wrap {
    font-size: 15px;
}
.mars-pull-refresh-header {
    height: 0;
    text-align: center;
    overflow: hidden;
    background-color: #fff;
}

.mars-pull-refresh-loading-icon {
    display: none;
    margin: 20px 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    vertical-align: middle;
    background-color: #2a2a31;
    opacity: .3;
}
.mars-pull-refresh-loading-text {
    display: none;
    font-size: 12px;
    line-height: 1;
    color: #c6c6c6;
    margin-top: 11px;
    margin-bottom: 11px;
}
.mars-pull-refresh-loaded {
    display: none;
    height: 28px;
    color: #000;

    .mars-pull-refresh-loaded-text {
        display: inline-block;
        font-size: 12px;
        line-height: 1;
        margin-top: 8px;
        margin-bottom: 8px;
    }
}
.mars-pull-refresh-header-loading {
    .mars-pull-refresh-pulling-text {
        display: none;
    }
    .mars-pull-refresh-loading-text {
        display: inline-block;
    }
}
.mars-pull-refresh-header-loaded {
    .mars-pull-refresh-loading {
        display: none;
    }
    .mars-pull-refresh-loaded {
        /* lesslint-disable vendor-prefixes-sort */
        display: inline-block;
        -webkit-transform: translateY(0);
                transform: translateY(0);
        -webkit-transition: -webkit-transform 280ms ease-out;
        transition: -webkit-transform 280ms ease-out;
        transition: transform 280ms ease-out;
        transition: transform 280ms ease-out, -webkit-transform 280ms ease-out;
        /* lesslint-enable vendor-prefixes-sort */
    }
}
.mars-pull-refresh-header-loading,
.mars-pull-refresh-header-loaded {
    will-change: height;
    -webkit-transition: height 300ms ease-out;
            transition: height 300ms ease-out;
}
</style>
