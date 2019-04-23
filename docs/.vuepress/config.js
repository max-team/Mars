/**
 * @file vuepress config
 * @author zhangwentao <winty2013@gmail.com>
 */

module.exports = {
    base: '/Mars/',
    dest: 'docs/.vuepress/dist/Mars',
    title: 'Mars',
    description: 'Vue 驱动的多端开发框架',
    head: [
        ['link', {rel: 'icon', href: 'https://avatars2.githubusercontent.com/u/48916409?s=96&v=4'}]
    ],
    themeConfig: {
        sidebarDepth: 1,
        sidebar: {
            '/guide/': [
                'start',
                'miniprogram',
                'vue-features',
                'platforms',
                'component',
                'API',
                'config',
                'examples',
                'common-questions'
            ],
            '/CHANGELOGS/': [
                'core',
                'build',
                'api',
                'cli',
                'cli-template'
            ]
        },
        displayAllHeaders: true,
        nav: [
            {text: '教程', link: '/guide/start'},
            {text: 'CHANGELOG', link: '/CHANGELOGS/core'}
        ],
        lastUpdated: 'Last Updated',
        repo: 'max-team/Mars',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页'
    }
};
