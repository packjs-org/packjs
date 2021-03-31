import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * css rules
 * @param options packjs配置
 * @param config webpack配置
 */
export const generateCSSRules = (options, config) => {
    const getLoaders = (useCssModule) =>
        [
            styleLoader(options.isDev),
            cssLoader(
                useCssModule
                    ? {
                          modules: {
                              exportLocalsConvention: 'camelCase',
                              localIdentName: '[name]__[local]--[hash:base64:5]',
                          },
                      }
                    : {}
            ),
            postcssLoader(options),
            options.less && lessLoader(),
        ].filter(Boolean);

    if (options.cssModules) {
        config.module.rules.push({
            test: /\.(css|less)$/,
            use: getLoaders(true),
        });
    } else {
        // filename exclude module keyword
        config.module.rules.push({
            test: /(?<!module)\.(css|less)$/,
            use: getLoaders(false),
        });
        // filename include module keyword
        config.module.rules.push({
            test: /\.module\.(css|less)$/,
            use: getLoaders(true),
        });
    }
};

export function styleLoader(isDev?) {
    return isDev ? 'style-loader' : MiniCssExtractPlugin.loader;
}
export function cssLoader(options) {
    return { loader: 'css-loader', options };
}

export function postcssLoader(options = {} as any) {
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

export function lessLoader(options = {}) {
    return {
        loader: 'less-loader',
        options: {
            lessOptions: { javascriptEnabled: true },
            ...options,
        },
    };
}
