import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * css rules
 * @param options packjs配置
 * @param config webpack配置
 */
export const generateCSSRules = (options, config) => {
    const getLoader = (useCssModule) => {
        const cssLoader = useCssModule
            ? {
                  loader: 'css-loader',
                  options: {
                      modules: {
                          exportLocalsConvention: 'camelCase',
                          localIdentName: '[path][name]__[local]--[hash:base64:5]',
                      },
                  },
              }
            : 'css-loader';
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

        return [
            options.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            cssLoader,
            postCssLoader.options.postcssOptions.plugins.length && postCssLoader,
            options.less && 'less-loader',
        ].filter(Boolean);
    };

    if (options.disableCSSModules) {
        config.module.rules.push({ test: /\.(css|less)$/, use: getLoader(false) });
    } else {
        config.module.rules.push({
            test: (name) => {
                // 匹配文件名不包含global的样式文件，启用css module
                if (!name.endsWith('.css') && !name.endsWith('.less')) {
                    return false;
                }
                return name.indexOf('global') === -1;
            },
            use: getLoader(true),
        });
        config.module.rules.push({
            test: (name) => {
                // 匹配文件名包含global的样式文件，关闭css module
                if (!name.endsWith('.css') && !name.endsWith('.less')) {
                    return false;
                }
                return name.indexOf('global') !== -1;
            },
            use: getLoader(false),
        });
    }
};
