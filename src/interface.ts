import { Configuration } from 'webpack';

export interface IPackOptions {
    entry: any;
    auto: boolean;
    https: boolean;
    host: string;
    open: boolean;
    clean: boolean;
    html: object | boolean;
    jsx: boolean;
    ts: boolean;
    tsx: boolean;
    less: boolean;
    mobile: boolean | number;
    disableCSSModules: boolean;
    externals: any;
    alias: object;
    outputPath: string;
    publicPath: string;
    postcssPlugins: any[];
    extraBabelPresets: [];
    extraBabelPlugins: [];
    devServer: { [index: string]: any };
    webpack?: Configuration;
}
