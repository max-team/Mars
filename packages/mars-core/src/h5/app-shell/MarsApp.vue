<template>
    <div>
        <div
            id="mars"
            :class="[transitionStatus === 'enter' ? 'transition-status-enter' : null]"
        >
            <div
                class="swan-app-container"
                :class="[transitionStatus === 'enter' ? 'transition-status-enter' : null]"
                :style="{
                    paddingTop: hasNavigationBar ? '38px': null
                }"
            >
                <navigation-bar
                    :transitionDuration="transitionDuration"
                    :transitionTimingFunc="transitionTimingFunc"
                    :backgroundColor="currentNavigationBarBackgroundColor"
                    :textStyle="currentNavigationBarTextStyle"
                    :showBottomBorder="showNavigationBorder"
                    :homeIconColor="navigationBarHomeColor"
                    :title="currentTitle"
                    :isHomePage="isHomePage"
                    :navigationStyle="currentNavigationStyle"/>
                <div
                    class="swan-app-tab-panel"
                    :class="[transitionStatus === 'enter' ? 'transition-status-enter' : null]"
                >
                    <pull-down-refresh
                        ref="refresherHandler"
                        @pull-down-refresh="handleRefresh"
                        @reach-bottom="handleReachBottom"
                        @page-scroll="handlePageScroll"
                        :enablePullDownRefresh="enablePullDownRefresh"
                        :enableReachBottom="enableReachBottom"
                        :onReachBottomDistance="onReachBottomDistance"
                        class="tab-panel-content"
                        :style="{
                            top: `${pos || 0}px`,
                            height: bodyHeight,
                            position: transitionStatus === 'enter' ? 'relative': 'static'
                        }"
                    >
                        <custom-app 
                            v-if="showRouterView"
                            ref="app"
                        >
                            <transition 
                                :name="useTransition && !tabChange && !browserAction ? 'fold-left' : 'back'"
                                :mode="useTransition && !browserAction ? 'in-out' : null"
                                @before-enter="beforeEnter"
                                @after-enter="afterEnter"
                                @enter="enter"
                                @leave="leave"
                                @before-leave="beforeLeave"
                            >
                                <keep-alive :max="6">
                                    <router-view
                                        :key="routerViewKey"
                                        ref="currentRouter"
                                        :style="{
                                            paddingBottom: tabBarHeight + 'px',
                                            backgroundColor: currentBackgroundColor || '#fff',
                                            top: currentNavigationStyle === 'default' ? '38px': null
                                        }"
                                    />
                                </keep-alive>
                            </transition>
                        </custom-app>
                    </pull-down-refresh>
                </div>
                <tab-bar
                    v-if="tabList.length > 0 && showTabBar ? customShowTabBar : false"
                    @tab-item-tap="handleTabItemTap"
                    :tabList="tabList"
                    :currentPath="currentPath"
                    :color="tabBarColor"
                    :selectedColor="tabBarSelectedColor"
                    :borderStyle="tabBarBorderStyle"
                    :backgroundColor="tabBarBackgroundColor"
                    />
            </div>
        </div>
        <div id="mars-background" ref="marsBackground"></div>
    </div>
</template>

<script>

import TabBar from './app-components/TabBar/TabBar.vue';
import PullDownRefresh from './app-components/PullDownRefresh/PullDownRefresh.vue';
import NavigationBar from './app-components/NavigationBar/NavigationBar.vue';
import {App as customApp} from './export';

export default {
    name: 'app',
    props: {
        tabBars: {
            type: Object
        },
        navigationBarBackgroundColor: {
            type: String,
            default: '#000'
        },
        navigationBarTextStyle: {
            type: String,
            default: 'white'
        },
        navigationStyle: {
            type: String,
            default: 'default'
        },
        backgroundTextStyle: {
            type: String,
            default: 'dark'
        },
        backgroundColor: {
            type: String,
            default: '#fff'
        },
        onReachBottomDistance: {
            type: Number,
            default: 50
        },
        navigationBarHomeColor: {
            type: String,
            default: 'dark'
        },
        showNavigationBorder: {
            type: Boolean,
            default: true
        },
        useTransition: {
            type: Boolean,
            default: true
        },
        homePage: {
            type: String
        }
    },
    components: {
        'tab-bar': TabBar,
        'pull-down-refresh': PullDownRefresh,
        'navigation-bar': NavigationBar,
        'custom-app': customApp
    },
    data() {
        return {
            currentTitle: '',
            currentPath: '',
            customShowTabBar: true,
            showTabBar: true,
            enablePullDownRefresh: false,
            enableReachBottom: true,
            tabChange: true,
            showRouterView: false,
            transitionDuration: 0,
            transitionTimingFunc: 'linear',
            tabList: [],
            tabBarColor: '#a2a2a2',
            tabBarSelectedColor: '#000',
            tabBarBackgroundColor: '#fff',
            tabBarBorderStyle: 'white',
            browserAction: false,
            routerViewKey: null,
            currentNavigationBarBackgroundColor: '',
            currentNavigationBarTextStyle: '',
            currentNavigationStyle: 'default',
            transitionStatus: 'end',
            transitionMode: 'in-out',
            pos: 0,
            bodyHeight: 'auto',
            isHomePage: false,
            hasNavigationBar: true
        }
    },
    computed: {
        tabBarHeight() {
            return this.tabList.some(item => item.pagePath === this.$route.path) && this.customShowTabBar ? 45 : 0;
        }
    },
    watch: {
        $route(to, from) {
            this.getPageConfig(to.path);
            this.currentPath = to.path;
            let currentPath = this.tabList.find(item => item.pagePath === to.path);
            this.$refs.refresherHandler.stopPullDownRefresh();
            let fromPathIsTab = this.tabList.some(item => item.pagePath === from.path);
            let toPathIsTab = this.tabList.some(item => item.pagePath === to.path);
            this.tabChange = (fromPathIsTab || toPathIsTab) && (!!currentPath);
            this.browserAction = this.isBack;
            this.isHomePage = to.path === this.homePage;

            to.path !== from.path
            || (to.path === from.path && JSON.stringify(to.query) !== JSON.stringify(from.query))
            ? this.routerViewKey = to.fullPath
            : this.routerViewKey = null;
        }
    },
    mounted() {
        const {
            list: tabBarList = [],
            backgroundColor,
            borderStyle,
            selectedColor,
            color
        } = this.tabBars || {};
        this.tabList = tabBarList;
        color && (this.tabBarColor = color);
        selectedColor && (this.tabBarSelectedColor = selectedColor);
        backgroundColor && (this.tabBarBackgroundColor = backgroundColor);
        borderStyle && (this.tabBarBorderStyle = borderStyle);
        this.currentPath = this.$route.path;
        this.getPageConfig(this.$route.path);
        this.showRouterView = true;
        this.routerViewKey = this.$route.fullPath;
        this.isHomePage = this.$route.path === this.homePage;
        this.$refs.marsBackground.style.backgroundColor = this.currentBackgroundColor || '#fff';
        this.hasNavigationBar = this.currentNavigationStyle === 'default';
    },
    methods: {
        afterEnter() {
            this.transitionStatus = 'end';
            this.pos = 0;
            this.bodyHeight = 'auto';
            this.$refs.currentRouter.$emit('marsTransitionEnterEnd');
            this.$refs.marsBackground.style.backgroundColor = this.currentBackgroundColor || '#fff';
            this.hasNavigationBar = this.currentNavigationStyle === 'default';
            this.$nextTick(() => {
                if (this.isBack) {
                    window.scrollTo(0, this.fromRouterPosY);
                }
            });
        },
        enter() {
            if (this.isBack) {
                window.scrollTo(0, this.fromRouterPosY);
                return;
            }
        },
        beforeEnter() {
            if (this.isBack) {
                window.scrollTo(0, this.fromRouterPosY);
                return;
            }
            this.transitionMode = 'in-out';
            this.pos = -window.pageYOffset;
            !this.isBack && (this.transitionStatus = 'enter');
            this.bodyHeight = screen.height - (this.currentNavigationStyle === 'default' ? 38 : 0) + 'px';
        },
        beforeLeave() {
            this.leavePos = window.pageYOffset;
        },
        leave() {
            window.scrollTo(0, this.leavePos);
        },
        getPageConfig(currentPath) {
            let currentPathIns = this.tabList.find(item => item.pagePath === currentPath);
            this.showTabBar = !!currentPathIns;
            if (!this.$root.$data['pageTitleMap'][currentPath]) {
                return;
            }
            let {
                title,
                enablePullDownRefresh,
                // enableReachBottom,
                backgroundColor,
                navigationBarBackgroundColor,
                navigationBarTextStyle,
                navigationStyle
            } = this.$root.$data['pageTitleMap'][currentPath];
            const {
                backgroundColor: wBackgroundColor,
                navigationBarBackgroundColor: wNavigationBarBackgroundColor,
                navigationBarTextStyle: wNavigationBarTextStyle,
                navigationStyle: wNavigationStyle
            } = this;
            this.currentTitle = title;
            this.enablePullDownRefresh = enablePullDownRefresh;
            // this.enableReachBottom = enableReachBottom;
            this.currentBackgroundColor = backgroundColor || wBackgroundColor;
            this.currentNavigationBarBackgroundColor = navigationBarBackgroundColor || wNavigationBarBackgroundColor;
            this.currentNavigationBarTextStyle = navigationBarTextStyle || wNavigationBarTextStyle;
            this.currentNavigationStyle = navigationStyle || wNavigationStyle;
        },
        handleRefresh() {
            this.transitionStatus === 'end'
            && this.$refs.currentRouter.onPullDownRefresh
            && this.$refs.currentRouter.onPullDownRefresh();
        },

        handleReachBottom() {
            this.transitionStatus === 'end'
            && this.$refs.currentRouter.onReachBottom
            && this.$refs.currentRouter.onReachBottom();
        },

        handlePageScroll(data) {
            this.transitionStatus === 'end'
            && this.$refs.currentRouter.onPageScroll
            && this.$refs.currentRouter.onPageScroll(data);
        },

        handleTabItemTap(item) {
            this.transitionStatus === 'end'
            && this.$refs.currentRouter.onTabItemTap
            && this.$refs.currentRouter.onTabItemTap(item);
        }
    }
}
</script>

<style lang="less" scoped>
// TODO: App.vue 会包含用户的 app.vue 中的 css 代码（需要 px 转换）
// 但是这里的框架 css 不需要经过 px 转换, 
// 先通过注释 POSTCSS_PX2UNITS_COMMENT 来 disable, 后续考虑独立开

#mars {
    width: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    scroll-behavior: smooth;

    .swan-app-container {
        width: 100%;

        .swan-app-tab-panel {
            width: 100%;

            .tab-panel-content {
                position: relative;
            }

            .fold-left-enter-active {
                animation-name: fold-left-in;
                animation-duration: .3s;
                box-sizing: border-box;
                position: fixed;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 700;
                overflow: hidden;
            }

            .fold-left-leave-active {
                height: 0;
                animation-duration: 0s;
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                z-index: -1;
                opacity: 0;
                position: absolute;
            }
            .back-leave-active {
                display: none;
                transform: translate3d(0, 0, 0);
            }
        }
    }
}

#mars-background {
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.transition-status-enter {
    position: absolute !important;
    overflow-x: hidden;
    height: 100%;
}

@keyframes fold-left-in {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
}

</style>