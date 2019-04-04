/**
 * @file vuepress config
 * @author zhangwentao <winty2013@gmail.com>
 */

module.exports = {
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
            '/guide/h5',
            '/guide/component',
            '/guide/API',
            '/guide/examples',
            '/CHANGELOG'
        ],
        nav: [
            {text: '文档', link: '/guide/'},
            {text: 'CHANGELOG', link: '/CHANGELOG'},
            {text: 'Github', link: 'https://github.com/max-team/Mars'}
        ],
        lastUpdated: 'Last Updated'
    }
};
