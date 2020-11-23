/**
 * js rules
 * @param userConfig packjs配置
 * @param config webpack配置
 */
export const generateJSRules = (userConfig, config) => {
    const options = userConfig;
    const extraBabelPresets = options.extraBabelPresets || [];
    const extraBabelPlugins = options.extraBabelPlugins || [];
    const babelPresets = [];
    const babelPlugins = [];

    if (extraBabelPresets.toString().indexOf('@babel/preset-env') === -1) {
        babelPresets.push('@babel/preset-env');
    }

    if (extraBabelPlugins.toString().indexOf('@babel/plugin-transform-runtime') === -1) {
        babelPlugins.push(['@babel/plugin-transform-runtime']);
    }

    [].push.apply(babelPresets, extraBabelPresets);
    [].push.apply(babelPlugins, extraBabelPlugins);

    if ((options.ts && options.jsx) || options.tsx) {
        if (babelPresets.toString().indexOf('@babel/preset-react') === -1) {
            babelPresets.push('@babel/preset-react');
        }

        if (babelPresets.toString().indexOf('@babel/preset-typescript') === -1) {
            babelPresets.push('@babel/preset-typescript');
        }

        config.module.rules.push({
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });
        return;
    }
    if (options.ts) {
        if (babelPresets.toString().indexOf('@babel/preset-typescript') === -1) {
            babelPresets.push('@babel/preset-typescript');
        }

        config.module.rules.push({
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });
    }
    if (options.jsx) {
        if (babelPresets.toString().indexOf('@babel/preset-react') === -1) {
            babelPresets.push('@babel/preset-react');
        }

        config.module.rules.push({
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });
    }
};
