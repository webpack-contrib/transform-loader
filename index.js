/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var JSON5 = require("json5");
var loaderUtils = require("loader-utils");
var baseRegex = "\\s*[@#]\\s*sourceMappingURL=data:[^;\n]+;base64,(.*)",
	// Matches /* ... */ comments
	regex1 = new RegExp("/\\*"+baseRegex+"\\s*\\*/$"),
	// Matches // .... comments
	regex2 = new RegExp("//"+baseRegex+".*$");
module.exports = function(input) {
	if(!this.query) throw new Error("Pass a module name as query to the transform-loader.");
	var callback = this.async();
	var query = loaderUtils.parseQuery(this.query);
	var resource = this.resource;
	var loaderContext = this;
	Object.keys(query).forEach(function(name) {
		var options = {};
		if(typeof query[name] == "string" && query[name].substr(0, 1) == ">") {
			options = query[name].substr(1);
		} else {
			options = query[name];
		}

		if(typeof options === "string") {
			options = JSON5.parse(options);
		}

		if(/^[0-9]+$/.test(name)) {
			next(this.options.transforms[+name], options);
		} else {
			this.resolve(this.context, name, function(err, module) {
				if(err) return callback(err);
				next(require(module), options);
			});
		}
	}, this);
	function next(transformFn, options) {
		var stream = transformFn(resource, options);
		var bufs = [];
		var done = false;
		stream.on("data", function(b) {
			bufs.push(b);
		});
		stream.on("end", function() {
			if(done) return;
			var b = Buffer.concat(bufs).toString();
			var match = b.match(regex1) || b.match(regex2);
			try {
				var map = match && JSON.parse((new Buffer(match[1], "base64")).toString());
			} catch(e) {
				var map = null;
			}
			done = true;
			callback(null, map ? b.replace(match[0], "") : b, map);
		});
		stream.on("error", function(err) {
			if(done) return;
			done = true;
			callback(err);
		});
		stream.write(input);
		stream.end();
	}
}
module.exports.raw = true;