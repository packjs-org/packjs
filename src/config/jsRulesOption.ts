/**
 * js rules
 * @param userConfig packjs配置
 * @param config webpack配置
 */
export const generateJSRules = (userConfig, config) => {
    const options = userConfig;

    const babelPresets: any = ['@babel/preset-env'];
    const babelPlugins: any = [['@babel/plugin-transform-runtime']];

    [].push.apply(babelPlugins, options.extraBabelPlugins || []);

    if ((options.ts && options.jsx) || options.tsx) {
        [].push.apply(babelPresets, ['@babel/preset-react', '@babel/preset-typescript']);
        config.module.rules.push({
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });
        return;
    }
    if (options.ts) {
        [].push.apply(babelPresets, ['@babel/preset-typescript']);
        config.module.rules.push({
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });
    }
    if (options.jsx) {
        [].push.apply(babelPresets, ['@babel/preset-react']);
        config.module.rules.push({
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: { cacheDirectory: true, presets: babelPresets, plugins: babelPlugins },
        });
    }
};
