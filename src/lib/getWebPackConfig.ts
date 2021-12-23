import ip from 'ip';
import path from 'path';
import { merge } from 'webpack-merge';
import WebpackBar from 'webpackbar';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { getCSSRules } from './getCSSRules';
import { getJSRules } from './getJSRules';
import { ignoreExtConfiguration } from '../util/util';

function getPort(userConfig) {
    const https = userConfig.https;
    return userConfig.prot || userConfig.devServer?.port || (https ? '443' : '80');
}

export default async (mode, args, userConfig) => {
    const isDev = mode === 'development';
    const protocol = userConfig.https ? 'https' : 'http';
    const host = userConfig.host || userConfig.devServer?.host || '127.0.0.1';
    const port = getPort(userConfig);
    const url1 = `- 本地：${protocol}://${host}:${port}`;
    const url2 = `- 局域网：${protocol}://${ip.address()}:${port}`;

    const moduleRules = userConfig?.module?.rules || [];
    delete userConfig.module?.rules;

    const webpackConfig = ignoreExtConfiguration(
        merge(
            {
                mode,
                bail: isDev,
                entry: userConfig.entry,
                externals: userConfig.externals,
                output: { path: userConfig.outputPath },
                devtool: isDev ? 'cheap-module-source-map' : 'source-map',
                performance: false,
                watch: isDev,
                watchOptions: isDev ? { aggregateTimeout: 1000, ignored: 'node_modules/**' } : undefined,
                resolve: {
                    alias: userConfig.alias,
                    extensions: [
                        '.ts',
                        '.tsx',
                        '.js',
                        '.jsx',
                        '.json',
                        '.css',
                        '.less',
                        ...(userConfig.extensions || []),
                    ],
                },
                optimization: {
                    minimize: !isDev,
                    minimizer: [
                        new TerserPlugin({
                            extractComments: false,
                            terserOptions: { format: { comments: false } },
                        }),
                        new CssMinimizerPlugin({
                            minimizerOptions: { preset: ['default', { discardComments: { removeAll: true } }] },
                        }),
                    ],
                },
                plugins: [
                    new WebpackBar({}),
                    new MiniCssExtractPlugin({ filename: '[name].css' }),
                    new FriendlyErrorsPlugin({
                        compilationSuccessInfo: isDev && {
                            messages: ['本地开发 server 启动完毕，调试入口链接: \n' + '  ' + url1 + '\n  ' + url2],
                        },
                        clearConsole: false,
                    }),
                    userConfig.html &&
                        new (require('html-webpack-plugin'))(userConfig.html !== true && userConfig.html),
                ].filter(Boolean),
                module: {
                    strictExportPresence: true,
                    rules: [
                        {
                            oneOf: [
                                ...moduleRules,
                                {
                                    test: /\.(woff|woff2|eot|ttf|svg|jpg|gif|webp|png)(\?[a-z0-9]+)?$/,
                                    loader: 'url-loader',
                                    options: { limit: 1000 },
                                },
                                ...getCSSRules(isDev, userConfig),
                                ...getJSRules(isDev, userConfig),
                            ],
                        },
                    ],
                },
                devServer: Object.assign(
                    {
                        hot: true,
                        port: 80,
                        quiet: true,
                        inline: true,
                        host: '0.0.0.0',
                        disableHostCheck: true,
                        stats: { colors: true },
                        historyApiFallback: true,
                        overlay: { errors: true },
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
                        },
                        contentBase: path.join(process.cwd(), './public'),
                    },
                    userConfig.devServer,
                    userConfig.host && { host: userConfig.host },
                    userConfig.https && { https: userConfig.https, port: 443 },
                    userConfig.port && { port: userConfig.port }
                ),
            },
            userConfig
        )
    );

    if (typeof userConfig.before === 'function') {
        return userConfig.before(webpackConfig);
    }
    return webpackConfig;
};
