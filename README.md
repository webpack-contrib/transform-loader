<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# transform-loader

A browserify transformation loader for webpack.

This loader allows use of [browserify transforms](https://github.com/substack/node-browserify/wiki/list-of-transforms) via a webpack loader.

## Getting Started

To begin, you'll need to install `transform-loader`:

```console
$ npm install transform-loader --save-dev
```

_Note: We're using the [coffeeify](https://github.com/jnordberg/coffeeify)
tranform for these examples._

Then invoke the loader through a require like so:

```js
const thing = require('!transform-loader?coffeeify!widget/thing');
```

Or add the loader to your `webpack` config. For example:

```js
// entry.js
import thing from 'widget/thing';
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.coffee?$/,
        loader: `transform-loader?coffeeify`,
        // options: {...}
      },
    ],
  },
};
```

And run `webpack` via your preferred method.

## QueryString Options

When using the loader via a `require` query string you may specify one of two
types; a loader name, or a function index.

### <loder-name>

Type: `String`

The name of the `browserify` transform you wish to use.

_Note: You must install the correct transform manually. Webpack nor this loader
will do that for you._

### <loder-index>

Type: `Number`

The index of a function contained within `options.transforms` which to use to
transform the target file(s).

## Options

### `transforms`

Type: `Array[Function]`
Default: `undefined`

An array of `functions` that can be used to transform a given file matching the
configured loader `test`. For example:

```js
// entry.js
const thing = require('widget/thing');
```

```js
// webpack.config.js
const through = require('through2');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        // NOTE: we've specified an index of 0, which will use the `transform`
        //       function in `transforms` below.
        loader: 'transform-loader?0',
        options: {
          transforms: [
            function transform() {
              return through(
                (buffer) => {
                  const result = buffer
                    .split('')
                    .map((chunk) =>
                      String.fromCharCode(127 - chunk.charCodeAt(0))
                    );
                  return this.queue(result).join('');
                },
                () => this.queue(null)
              );
            },
          ],
        },
      },
    ],
  },
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/transform-loader.svg
[npm-url]: https://npmjs.com/package/transform-loader
[node]: https://img.shields.io/node/v/transform-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/transform-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/transform-loader
[tests]: https://dev.azure.com/webpack-contrib/transform-loader/_apis/build/status/webpack-contrib.transform-loader?branchName=master
[tests-url]: https://dev.azure.com/webpack-contrib/transform-loader/_build/latest?definitionId=19&branchName=master
[cover]: https://codecov.io/gh/webpack-contrib/transform-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/transform-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=transform-loader
[size-url]: https://packagephobia.now.sh/result?p=transform-loader
