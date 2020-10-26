import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
/**
 * plugins
 * @param options packjs配置
 * @param config webpack配置
 */
export const generatePlugins = (options, config) => {
    // buildIn plugin
    config.plugins.push(new FriendlyErrorsPlugin({ clearConsole: false }));
    config.plugins.push(new ProgressBarPlugin());
    config.plugins.push(new webpack.BannerPlugin(`made in ${new Date().getFullYear()} by packjs`));
    config.plugins.push(new MiniCssExtractPlugin({ filename: '[name].css' }));

    // optional plugin
    if (options.html) {
        config.plugins.push(new (require('html-webpack-plugin'))(options.html !== true && options.html));
    }
};
