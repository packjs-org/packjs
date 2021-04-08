import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { getCSSRules } from './getCSSRules';
import { getJSRules } from './getJSRules';
import { getFormatterDate } from '../util/util';
import WebpackBar from 'webpackbar';

export default async (mode, args, userConfig) => {
    const isDev = mode === 'development';
    return merge(
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
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.less', ...(userConfig.extensions || [])],
            },
            optimization: {
                minimize: !isDev,
                minimizer: [
                    new CssMinimizerPlugin({
                        minimizerOptions: { preset: ['default', { discardComments: { removeAll: true } }] },
                    }),
                ],
            },
            plugins: [
                new WebpackBar({}),
                new FriendlyErrorsPlugin({ clearConsole: false }),
                new webpack.BannerPlugin(`made in ${getFormatterDate()} by packjs`),
                new MiniCssExtractPlugin({ filename: '[name].css' }),
                userConfig.html && new (require('html-webpack-plugin'))(userConfig.html !== true && userConfig.html),
            ].filter(Boolean),
            module: {
                strictExportPresence: true,
                rules: [
                    { parser: { requireEnsure: false } },
                    {
                        oneOf: [
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
                    port: 3000,
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
        userConfig.webpack || {}
    );
};
