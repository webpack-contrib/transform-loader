var fs = require("fs");
var filename = "not-exists.txt";
var text = fs.readFileSync(filename, "utf-8");
module.exports = text;
