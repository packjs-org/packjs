/**
 * file rules
 * @param options packjs配置
 * @param config webpack配置
 */
export const generateFileRules = (options, config) => {
    const customUrlLoader = options.webpack?.module?.rules.find(
        (rule) => rule.use.toString().indexOf('url-loader') > -1
    );
    if (!!customUrlLoader) {
        return;
    }
    // use default url-loader
    config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|svg|jpg|gif|webp|png)(\?[a-z0-9]+)?$/,
        loader: 'url-loader',
        options: { limit: 1000 },
    });
};
