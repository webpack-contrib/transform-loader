/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var baseRegex = "\s*[@#]\s*sourceMappingURL=data:[^;]+;base64,(.*)",
	// Matches /* ... */ comments
	regex1 = new RegExp("\/\*"+baseRegex+"\*\/.*$"),
	// Matches // .... comments
	regex2 = new RegExp("\/\/"+baseRegex+".*$");
module.exports = function(input) {
	if(!this.query) throw new Error("Pass a module name as query to the transform-loader.");
	var callback = this.async();
	var resource = this.resource;
	var loaderContext = this;
	var q = this.query.substr(1);
	if(/^[0-9]+$/.test(q)) {
		next(this.options.transforms[+q]);
	} else {
		this.resolve(this.context, q, function(err, module) {
			if(err) return callback(err);
			next(require(module));
		});
	}
	function next(transformFn) {
		var stream = transformFn(resource);
		var bufs = [];
		stream.on("data", function(b) {
			bufs.push(b);
		});
		stream.on("end", function() {
			var b = Buffer.concat(bufs).toString(),
				match = b.match(regex1) || b.match(regex2),
				map = match && (new Buffer(match[1], "base64")).toString();
			callback(null, map ? b.replace(match[0], "") : b, map);
		});
		stream.on("error", function(err) {
			callback(err);
		});
		stream.write(input);
		stream.end();
	}
}
module.exports.raw = true;