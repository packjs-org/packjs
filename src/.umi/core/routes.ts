// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/tage/Documents/workspace/alimekits/pack/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
    const routes = [
        {
            path: '/',
            component: (props) =>
                require('react').createElement(
                    require('../../../node_modules/@umijs/preset-dumi/lib/themes/default/layout.js').default,
                    {
                        ...{
                            menus: {
                                '*': {
                                    '*': [{ path: '/', title: 'packjs', meta: {} }],
                                    '/configs': [{ path: '/configs', title: '配置', meta: {} }],
                                    '/guides': [
                                        { path: '/guides', title: '介绍', meta: { order: 1 } },
                                        { path: '/guides/start', title: '快速开始', meta: { order: 2 } },
                                        { path: '/guides/cli', title: '命令行', meta: { order: 3 } },
                                    ],
                                },
                            },
                            locales: [],
                            navs: {
                                '*': [
                                    { title: '指南', order: 1, path: '/guides' },
                                    { title: '配置', order: 2, path: '/configs' },
                                ],
                            },
                            title: 'packjs',
                            logo: 'https://gw.alicdn.com/tfs/TB1ILY9YUH1gK0jSZSyXXXtlpXa-742-996.png',
                            mode: 'site',
                            repoUrl: 'https://gitlab.alibaba-inc.com/alimekits/pack',
                        },
                        ...props,
                    }
                ),
            routes: [
                {
                    path: '/',
                    component: require('../../../docs/index.md').default,
                    exact: true,
                    meta: {
                        filePath: 'docs/index.md',
                        updatedTime: 1602601516000,
                        title: 'packjs',
                        hero: {
                            title: 'packjs',
                            desc: '<div class="markdown"><p>基于webpack的轻量打包工具</p></div>',
                            actions: [
                                {
                                    text: '开始使用',
                                    link: '/guides',
                                },
                            ],
                        },
                        features: [
                            {
                                icon:
                                    'https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png',
                                title: '提供常用配置开关',
                                desc:
                                    '<div class="markdown"><p>通过几个扩展点快速启用常用的webpack，无需关心底层实现</p></div>',
                            },
                            {
                                icon:
                                    'https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png',
                                title: '接入门槛低',
                                desc: '<div class="markdown"><p>完全基于webpack配置进行扩展，无其他学习成本</p></div>',
                            },
                            {
                                icon:
                                    'https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png',
                                title: '保持最新webpack',
                                desc: '<div class="markdown"><p>提供兼容api，屏蔽不同webpack版本间的配置差异</p></div>',
                            },
                        ],
                        footer: '<div class="markdown"><p>Copyright © 2020<br />Powered by ALIME X-LAB FE</p></div>',
                        slugs: [],
                    },
                    title: 'packjs',
                },
                {
                    path: '/configs',
                    component: require('../../../docs/configs/index.md').default,
                    exact: true,
                    meta: {
                        filePath: 'docs/configs/index.md',
                        updatedTime: 1602601516000,
                        nav: {
                            title: '配置',
                            order: 2,
                            path: '/configs',
                        },
                        toc: 'menu',
                        slugs: [
                            {
                                depth: 1,
                                value: '配置',
                                heading: '配置',
                            },
                            {
                                depth: 2,
                                value: 'entry',
                                heading: 'entry',
                            },
                            {
                                depth: 2,
                                value: 'auto',
                                heading: 'auto',
                            },
                            {
                                depth: 2,
                                value: 'https',
                                heading: 'https',
                            },
                            {
                                depth: 2,
                                value: 'host',
                                heading: 'host',
                            },
                            {
                                depth: 2,
                                value: 'open',
                                heading: 'open',
                            },
                            {
                                depth: 2,
                                value: 'clean',
                                heading: 'clean',
                            },
                            {
                                depth: 2,
                                value: 'html',
                                heading: 'html',
                            },
                            {
                                depth: 2,
                                value: 'ts',
                                heading: 'ts',
                            },
                            {
                                depth: 2,
                                value: 'jsx',
                                heading: 'jsx',
                            },
                            {
                                depth: 2,
                                value: 'tsx',
                                heading: 'tsx',
                            },
                            {
                                depth: 2,
                                value: 'less',
                                heading: 'less',
                            },
                            {
                                depth: 2,
                                value: 'mobile',
                                heading: 'mobile',
                            },
                            {
                                depth: 2,
                                value: 'disableCSSModules',
                                heading: 'disablecssmodules',
                            },
                            {
                                depth: 2,
                                value: 'externals',
                                heading: 'externals',
                            },
                            {
                                depth: 2,
                                value: 'alias',
                                heading: 'alias',
                            },
                            {
                                depth: 2,
                                value: 'outputPath',
                                heading: 'outputpath',
                            },
                            {
                                depth: 2,
                                value: 'publicPath',
                                heading: 'publicpath',
                            },
                            {
                                depth: 2,
                                value: 'postcssPlugins',
                                heading: 'postcssplugins',
                            },
                            {
                                depth: 2,
                                value: 'extraBabelPresets',
                                heading: 'extrababelpresets',
                            },
                            {
                                depth: 2,
                                value: 'extraBabelPlugins',
                                heading: 'extrababelplugins',
                            },
                            {
                                depth: 2,
                                value: 'devServer',
                                heading: 'devserver',
                            },
                            {
                                depth: 2,
                                value: 'webpack',
                                heading: 'webpack',
                            },
                        ],
                        title: '配置',
                    },
                    title: '配置',
                },
                {
                    path: '/guides/cli',
                    component: require('../../../docs/guides/cli.md').default,
                    exact: true,
                    meta: {
                        filePath: 'docs/guides/cli.md',
                        updatedTime: 1603700475197,
                        title: '命令行',
                        order: 3,
                        nav: {
                            title: '指南',
                            order: 1,
                            path: '/guides',
                        },
                        slugs: [
                            {
                                depth: 1,
                                value: '命令',
                                heading: '命令',
                            },
                            {
                                depth: 2,
                                value: 'dev',
                                heading: 'dev',
                            },
                            {
                                depth: 2,
                                value: 'build',
                                heading: 'build',
                            },
                            {
                                depth: 2,
                                value: 'init',
                                heading: 'init',
                            },
                            {
                                depth: 2,
                                value: 'host',
                                heading: 'host',
                            },
                            {
                                depth: 3,
                                value: 'clear',
                                heading: 'clear',
                            },
                            {
                                depth: 3,
                                value: 'add',
                                heading: 'add',
                            },
                        ],
                    },
                    title: '命令行',
                },
                {
                    path: '/guides',
                    component: require('../../../docs/guides/index.md').default,
                    exact: true,
                    meta: {
                        filePath: 'docs/guides/index.md',
                        updatedTime: 1602601516000,
                        title: '介绍',
                        order: 1,
                        nav: {
                            title: '指南',
                            order: 1,
                            path: '/guides',
                        },
                        slugs: [
                            {
                                depth: 3,
                                value: '什么是packjs',
                                heading: '什么是packjs',
                            },
                            {
                                depth: 3,
                                value: '支持的功能',
                                heading: '支持的功能',
                            },
                        ],
                    },
                    title: '介绍',
                },
                {
                    path: '/guides/start',
                    component: require('../../../docs/guides/start.md').default,
                    exact: true,
                    meta: {
                        filePath: 'docs/guides/start.md',
                        updatedTime: 1602601516000,
                        title: '快速开始',
                        order: 2,
                        nav: {
                            title: '指南',
                            order: 1,
                            path: '/guides',
                        },
                        slugs: [
                            {
                                depth: 3,
                                value: '安装',
                                heading: '安装',
                            },
                            {
                                depth: 3,
                                value: '命令',
                                heading: '命令',
                            },
                        ],
                    },
                    title: '快速开始',
                },
            ],
            title: 'packjs',
        },
    ];

    // allow user to extend routes
    plugin.applyPlugins({
        key: 'patchRoutes',
        type: ApplyPluginsType.event,
        args: { routes },
    });

    return routes;
}
