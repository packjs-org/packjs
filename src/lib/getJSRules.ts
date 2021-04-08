/**
 * js rules
 */
export const getJSRules = (isDev, userConfig) => {
    const { ts, tsx, jsx } = userConfig;
    const extraBabelPresets = userConfig.extraBabelPresets || [];
    const extraBabelPlugins = userConfig.extraBabelPlugins || [];
    const babelPresets = [];
    const babelPlugins = [];

    const rules = [];

    if (extraBabelPresets.toString().indexOf('@babel/preset-env') === -1) {
        babelPresets.push('@babel/preset-env');
    }

    [].push.apply(babelPresets, extraBabelPresets);
    [].push.apply(babelPlugins, extraBabelPlugins);

    if ((ts && jsx) || tsx) {
        if (babelPresets.toString().indexOf('@babel/preset-react') === -1) {
            babelPresets.push('@babel/preset-react');
        }

        if (babelPresets.toString().indexOf('@babel/preset-typescript') === -1) {
            babelPresets.push('@babel/preset-typescript');
        }

        rules.push({
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });

        return rules;
    }
    if (ts) {
        if (babelPresets.toString().indexOf('@babel/preset-typescript') === -1) {
            babelPresets.push('@babel/preset-typescript');
        }

        rules.push({
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });
    }
    if (jsx) {
        if (babelPresets.toString().indexOf('@babel/preset-react') === -1) {
            babelPresets.push('@babel/preset-react');
        }

        rules.push({
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });
    }

    return rules;
};
