import { Configuration } from 'webpack';

export interface IPackOptions extends Configuration{
    mode: 'development' | 'production';
    entry: any;
    auto: boolean;
    https: boolean;
    host: string;
    open: boolean;
    clean: boolean;
    html: object | boolean;
    ts: boolean;
    jsx: boolean;
    tsx: boolean;
    less: boolean;
    mobile: boolean | number;
    cssModules: boolean;
    cssLoader: object;
    externals: any;
    alias: any;
    outputPath: string;
    publicPath: string;
    postcssPlugins: any[];
    extraBabelPresets: [];
    extraBabelPlugins: [];
    before: (config: IPackOptions) => Configuration;
}
