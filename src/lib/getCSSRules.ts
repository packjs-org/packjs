import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * css rules
 */
export const getCSSRules = (isDev, userConfig) => {
    const { cssLoader, cssModules, less } = userConfig;

    // 默认支持node_modules css文件解析
    const loaders: any[] = [
        {
            test: /\.css$/,
            use: [getStyleLoader(isDev), getCSSLoader(false), getPostcssLoader(userConfig)].filter(Boolean),
        },
    ];
    if (cssModules) {
        // filename include global keyword
        loaders.push({
            test: /\.global\.(css|less)$/,
            exclude: /node_modules/,
            use: [getStyleLoader(isDev), getCSSLoader(false), getPostcssLoader(userConfig), lessLoader(less)].filter(
                Boolean
            ),
        });
        // filename exclude global keyword
        loaders.push({
            test: /^((?!\.?global).)*(css|less)$/,
            exclude: /node_modules/,
            use: [
                getStyleLoader(isDev),
                getCSSLoader(cssLoader || true),
                getPostcssLoader(userConfig),
                lessLoader(less),
            ].filter(Boolean),
        });

        return loaders.reverse();
    }
    // filename exclude module keyword
    loaders.push({
        test: /(?<!module)\.(css|less)$/,
        exclude: /node_modules/,
        use: [getStyleLoader(isDev), getCSSLoader(false), getPostcssLoader(userConfig), lessLoader(less)].filter(
            Boolean
        ),
    });
    // filename include module keyword
    loaders.push({
        test: /\.module\.(css|less)$/,
        exclude: /node_modules/,
        use: [
            getStyleLoader(isDev),
            getCSSLoader(cssLoader || true),
            getPostcssLoader(userConfig),
            lessLoader(less),
        ].filter(Boolean),
    });

    return loaders.reverse();
};

export function getStyleLoader(isDev?) {
    return isDev ? 'style-loader' : MiniCssExtractPlugin.loader;
}
export function getCSSLoader(cssLoader) {
    if (cssLoader === true) {
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
    if (typeof cssLoader === 'object') {
        return { loader: 'css-loader', cssLoader };
    }
    return 'css-loader';
}

export function getPostcssLoader(options = {} as any) {
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

export function lessLoader(useLess, options = {}) {
    if (!useLess) return false;
    return {
        loader: 'less-loader',
        options: {
            lessOptions: { javascriptEnabled: true },
            ...options,
        },
    };
}
