# transform loader for webpack

Use a browserify transforms as webpack-loader

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Pass the module name as query parameter.

``` javascript
var x = require("!transform?brfs!./file.js");
var x = require("!transform/cacheable?brfs!./file.js"); // cacheable version
```

If you pass a number instead it will take the function from `this.options.transforms[number]`.

### Example webpack config

``` javascript
module.exports = {
	module: {
		postLoaders: [
			{
				loader: "transform?brfs"
			}
		]
		loaders: [
			{
				test: /\.coffee$/,
				loader: "transform/cacheable?coffeeify"
			},
			{
				test: /\.weirdjs$/,
				loader: "transform?0"
			}
		]
	},
	transforms: [
		function(file) {
			return through(function(buf) {
				this.queue(buf.split("").map(function(s) {
					return String.fromCharCode(127-s.charCodeAt(0));
				}).join(""));
			}, function() { this.queue(null); });
		}
	]
};
```

### Typical brfs Example

Say you have the following Node source:

```js
var test = require('fs').readFileSync('./test.txt', 'utf8');
```

After `npm install transform-loader brfs --save`, add the following loader to your config:

```js
module.exports = {
    context: __dirname,
    entry: "./index.js",
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "transform?brfs"
            }
        ]
    }
}
```

The loader is applied to all JS files, which can incur a performance hit with watch tasks. So you may want to use `transform/cacheable?brfs` instead. 

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
