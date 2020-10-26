---
nav:
  title: 配置
  order: 2
toc: menu
---

# 配置

支持[webpack 全部配置](https://www.webpackjs.com/configuration/)和扩展配置，以下扩展配置项通过字母排序。

> 注意：本文关联的所有 npm 依赖，无需用户手动安装，packjs 会在项目运行编译时自动按需安装。

## entry

- Type: `object | string`
- Default: `./src`

webpack entry points 配置，详细 [entry points](https://www.webpackjs.com/concepts/entry-points/)。

## auto

- Type: `boolean`
- Default: `true`

自动分析文件依赖，并在运行时执行`npm install`，原理是根据 src 目录下的文件名确定相关依赖。
如当前检查文件后缀名包含`ts`、`tsx`、`css`、`less`，会自动添加 typescript 编译配置、react 编译配置、css 编译配置、less 编译配置

## https

- Type: `boolean`
- Default: `false`

开启 https 后，会自动设置 `webpack-dev-server` 的`port:443`，`https:true`，并以 https 的协议启动 dev 服务

## host

- Type: `string`
- Default: undefined

设置 `webpack-dev-server` 的`host`字段。

当 `https` 设置为 `true` 且配置的 `host` 字段为通用域名时，packjs 会开启 `https 模式`，自动生成该 host 的 https 证书并添加到系统中，且自动创建 host 规则`127.0.0.1 host`添加到系统 hosts 表中。

> 注意：：
>
> - 若运行命令为非 sudo 模式，运行过程中进程会中断等待授权。
> - 若当前 host 规则已存在系统 hosts 表中，packjs 不会做其他操作
> - 开发者可以通过`pack host clear`清空 packjs 自动生成的所有 host 规则

## open

- Type: `boolean`
- Default: false

设置 `webpack-dev-server` 的`open`字段，是否在 dev 服务启动完成后自动打开浏览器

## clean

- Type: `boolean`
- Default: true

是否在构建项目前清空`output>path`文件夹

## html

- Type: `object|boolean`
- Default: `false`

配置 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 插件。
html 若为 boolean 类型，则会使用默认的 html-webpack-plugin 插件配置。html 可以配置[html 插件允许的配置](https://github.com/jantimon/html-webpack-plugin#options)

如：

```js
// pack.js
export default {
  html: {
    title: 'demo',
  },
};
```

则实际运行的配置为：

```js
module.exports = {
  //...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'demo',
    }),
  ],
};
```

## ts

- Type: `boolean`
- Default: `false`

开启 typescript 编译配置，开启后实际运行的配置为：

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [['@babel/preset-env', { modules: 'commonjs' }], '@babel/preset-typescript'],
              plugins: [['@babel/plugin-transform-runtime', { regenerator: true }]],
            },
          },
        ],
      },
    ],
  },
};
```

## jsx

- Type: `boolean`
- Default: `false`

开启 jsx 编译配置，开启后实际运行的配置为：

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [['@babel/preset-env', { modules: 'commonjs' }], '@babel/preset-react'],
              plugins: [['@babel/plugin-transform-runtime', { regenerator: true }]],
            },
          },
        ],
      },
    ],
  },
};
```

> 注意
>
> - 若同时开启`ts`和`jsx`，则会自动合并二者配置，开发者无需关心

## tsx

- Type: `boolean`
- Default: `false`

同时开启 `ts` 和 `jsx` 编译配置，配置详情如上

## less

- Type: `boolean`
- Default: `false`

支持 less 文件编译

## mobile

- Type: `boolean | number`
- Default: `false`

开启移动端适配方案，通过 [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 将 px 转换为 vw。`mobile` 传 `true`, 则默认设计稿为 `750`，如设置 `module:350` 设置设计稿宽度为 `350`。

具体运行时 loader 配置如下

```json
{
  "loader": "postcss-loader",
  "options": {
    "postcssOptions": {
      "plugins": [
        [
          "postcss-px-to-viewport",
          {
            "unitPrecision": 5,
            "viewportUnit": "vw",
            "minPixelValue": 1,
            "mediaQuery": false,
            "selectorBlackList": [".ignore"],
            "viewportWidth": 750 // mobile可覆盖该值
          }
        ]
      ]
    }
  }
}
```

## disableCSSModules

- Type: `boolean`
- Default: `false`

是否禁用[cssModules](https://github.com/css-modules/css-modules)。

注意：通常情况下，packjs 会通过文件名方式选择性的配置 cssModule，规则如下：

- 若样式文件名包含 global，则该样式文件禁用 cssModules
- 若样式文件名不包含 global，则该样式文件默认开启 cssModules

## externals

- Type: `string | array | object | function | regex`
- Default: `[]`

配置 webpack 的 `externals` 字段，[详情](https://www.webpackjs.com/configuration/externals/#externals)

## alias

- Type: `string | array | object | function | regex`
- Default: `[]`

配置 webpack 的 `resolve.alias` 字段，[详情](https://www.webpackjs.com/configuration/resolve/#resolve-alias)

## outputPath

- Type: `string`
- Default: `dist`

配置 webpack 的 `output.path` 字段，[详情](https://www.webpackjs.com/configuration/output/#output-path)

## publicPath

- Type: `string | function`
- Default: `''`

配置 webpack 的 `output.publicPath` 字段，[详情](https://www.webpackjs.com/configuration/output/#output-publicpath)

## postcssPlugins

- Type: `string[]`
- Default: `[]`

配置 postcss 插件，[详情](https://www.npmjs.com/package/postcss#options)

> 注意：
>
> - 若不配置此字段，且 mobile 为 false，不会加载 postcss 相关配置和依赖

## extraBabelPresets

- Type: `string[]`
- Default: `[]`

配置额外的 `babel-loader` 的`options.presets`字段，[详情](https://www.npmjs.com/package/babel-loader)

## extraBabelPlugins

- Type: `string[]`
- Default: `[]`

配置额外的 `babel-loader` 的`options.plugins`字段，[详情](https://www.npmjs.com/package/babel-loader)

## devServer

配置 webpack 的 devServer，会和上文的 packjs 配置进行合并，优先级高于 packjs 配置，[详情](https://www.webpackjs.com/configuration/dev-server/#devserver)

## webpack

webpack 配置，会和上文的 packjs 配置进行合并，优先级高于 packjs 配置，[详情](https://www.webpackjs.com/configuration/)
