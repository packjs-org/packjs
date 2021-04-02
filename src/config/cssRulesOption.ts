import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * css rules
 * @param options packjs配置
 * @param config webpack配置
 */
export const generateCSSRules = (options, config) => {
    if (options.cssModules) {
        config.module.rules.push({
            test: /\.css$/,
            use: [styleLoader(options.isDev), cssLoader(options.cssModules), postcssLoader(options)],
        });

        if (!options.less) return;

        config.module.rules.push({
            test: /\.less$/,
            use: [styleLoader(options.isDev), cssLoader(options.cssModules), postcssLoader(options), lessLoader()],
        });

        return;
    }

    // filename exclude module keyword
    config.module.rules.push({
        test: /(?<!module)\.css$/,
        use: [styleLoader(options.isDev), cssLoader(false), postcssLoader(options)],
    });
    // filename include module keyword
    config.module.rules.push({
        test: /\.module\.css$/,
        use: [styleLoader(options.isDev), cssLoader(true), postcssLoader(options)],
    });

    if (!options.less) return;

    config.module.rules.push({
        test: /(?<!module)\.less$/,
        use: [styleLoader(options.isDev), cssLoader(false), postcssLoader(options), lessLoader()],
    });
    config.module.rules.push({
        test: /\.module\.less$/,
        use: [styleLoader(options.isDev), cssLoader(true), postcssLoader(options), lessLoader()],
    });
};

export function styleLoader(isDev?) {
    return isDev ? 'style-loader' : MiniCssExtractPlugin.loader;
}
export function cssLoader(useCssModule) {
    const options = {} as any;
    if (useCssModule === true) {
        options.modules = {
            exportLocalsConvention: 'camelCase',
            localIdentName: '[name]__[local]--[hash:base64:5]',
        };
    } else if (typeof useCssModule === 'object') {
        options.modules = useCssModule;
    }
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
