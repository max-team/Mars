/**
 * @file vuepress config
 * @author zhangwentao <winty2013@gmail.com>
 */

module.exports = {
    base: '/mars/',
    title: 'Mars',
    description: 'Vue 驱动的多端开发框架',
    head: [
        ['link', {rel: 'icon', href: 'https://avatars2.githubusercontent.com/u/48916409?s=96&v=4'}]
    ],
    themeConfig: {
        sidebarDepth: 1,
        sidebar: [
            '/guide/start',
            '/guide/miniprogram',
            '/guide/vue-features',
            '/guide/platforms',
            '/guide/component',
            '/guide/API',
            '/guide/config',
            '/guide/examples',
            '/CHANGELOG'
        ],
        displayAllHeaders: true,
        nav: [
            {text: '教程', link: '/guide/start'},
            {text: 'CHANGELOG', link: '/CHANGELOG'}
        ],
        lastUpdated: 'Last Updated',
        repo: 'max-team/Mars',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页'
    }
};
