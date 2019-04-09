/**
 * @file vuepress config
 * @author zhangwentao <winty2013@gmail.com>
 */

module.exports = {
    base: '/mars/',
    title: 'Mars',
    description: 'Vue 驱动的多端开发框架',
    head: [
        ['link', {rel: 'icon', href: '/assets/img/Mars-128.png'}]
    ],
    themeConfig: {
        sidebarDepth: 2,
        sidebar: [
            '/guide/start',
            '/guide/miniprogram',
            '/guide/vue-features',
            '/guide/platforms',
            '/guide/component',
            '/guide/API',
            '/guide/examples',
            '/CHANGELOG'
        ],
        nav: [
            {text: '教程', link: '/guide/start'},
            {text: 'CHANGELOG', link: '/CHANGELOG'},
            {text: 'Github', link: 'https://github.com/max-team/Mars'}
        ],
        lastUpdated: 'Last Updated'
    }
};
