import path from 'path';
export const CONFIG_FILE = 'pack.js';
export const DEFAULT_USER_CONFIG: any = { auto: true, clean: true, devServer: {} };
export const DEFAULT_WEBPACK_CONFIG: any = {
    devtool: 'cheap-module-source-map',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.sass', '.scss', '.less'] },
    plugins: [],
    module: { rules: [] },
};
export const DEFAULT_DEV_SERVER_CONFIG: any = {
    hot: true,
    port: 3000,
    quiet: true,
    inline: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    stats: { colors: true },
    historyApiFallback: true,
    overlay: { errors: true },
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    contentBase: path.join(process.cwd(), './public'),
};
