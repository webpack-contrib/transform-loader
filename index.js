/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(input) {
	if(!this.query) throw new Error("Pass a module name as query to the transform-loader.");
	var callback = this.callback;
	var resource = this.resource;
	var loaderContext = this;
	var q = this.query.substr(1);
	if(/^[0-9]+$/.test(q)) {
		next(this.options.transforms[+q]);
	} else {
		if(this.async()) {
			this.resolve(this.context, q, function(err, module) {
				if(err) return callback(err);
				next(require(module));
			});
		} else {
			var module = this.resolveSync(this.context, q);
			next(require(module));
		}
	}
	function next(transformFn) {
		var stream = transformFn(resource);
		var bufs = [];
		var done = false;
		stream.on("data", function(b) {
			bufs.push(b);
		});
		stream.on("end", function() {
			var b = Buffer.concat(bufs);
			done = true;
			console.log(b);
			callback(null, b);
		});
		console.log("APPLY TRANSFORM TO " + input);
		stream.write(input);
		stream.end();
		if(!done) {
			if(!loaderContext.async()) {
				stream.removeListener("end");
				throw new Error("The module system only accept sync mode, but the stream is not sync");
			}
		}
	}
}
module.exports.raw = true;