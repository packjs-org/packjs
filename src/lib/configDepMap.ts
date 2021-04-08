export interface IDepMap {
    tip?: string;
    dependencies: string[];
}
export const depMap: { [k: string]: IDepMap } = {
    ts: {
        tip: 'ts编译',
        dependencies: ['@babel/preset-env', '@babel/preset-typescript'],
    },
    jsx: {
        tip: 'jsx编译',
        dependencies: ['@babel/preset-env', '@babel/preset-react'],
    },
    css: {
        tip: 'css编译',
        dependencies: ['style-loader', 'css-loader'],
    },
    less: {
        tip: 'less编译',
        dependencies: ['less', 'less-loader'],
    },
    mobile: {
        tip: '移动端适配',
        dependencies: ['postcss-loader', 'postcss-px-to-viewport'],
    },
    html: {
        tip: 'html插件',
        dependencies: ['html-webpack-plugin'],
    },
};
