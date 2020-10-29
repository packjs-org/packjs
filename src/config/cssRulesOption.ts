import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * css rules
 * @param options packjs配置
 * @param config webpack配置
 */
export const generateCSSRules = (options, config) => {
    const getLoaders = (useCssModule) =>
        [styleLoader(options), cssLoader(useCssModule), postcssLoader(options), lessLoader(options)].filter(Boolean);

    if (options.disableCSSModules) {
        config.module.rules.push({ test: /\.(css|less)$/, use: getLoaders(false) });
    } else {
        config.module.rules.push({ test: /^((?!\.?global).)*(css|less)$/, use: getLoaders(true) });
        config.module.rules.push({ test: /\.?global.(css|less)$/, use: getLoaders(false) });
    }
};

function styleLoader(options) {
    return options.isDev ? 'style-loader' : MiniCssExtractPlugin.loader;
}
function cssLoader(useCssModule) {
    if (useCssModule) return 'css-loader';
    return {
        loader: 'css-loader',
        options: {
            modules: {
                exportLocalsConvention: 'camelCase',
                localIdentName: '[name]__[local]--[hash:base64:5]',
            },
        },
    };
}

function postcssLoader(options) {
    const postCssLoader = {
        loader: 'postcss-loader',
        options: { postcssOptions: { plugins: options.postcssPlugins || [] } },
    };

    if (options.mobile) {
        postCssLoader.options.postcssOptions.plugins.push([
            'postcss-px-to-viewport',
            {
                unitPrecision: 5,
                viewportUnit: 'vw',
                minPixelValue: 1,
                mediaQuery: false,
                selectorBlackList: ['.ignore'],
                viewportWidth: options.mobile === true ? 750 : options.mobile,
            },
        ]);
    }

    return postCssLoader.options.postcssOptions.plugins.length && postCssLoader;
}

function lessLoader(options) {
    return options.less && 'less-loader';
}
