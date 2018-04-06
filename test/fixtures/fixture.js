/* eslint-disable */
const fs = require('fs');
const text = fs.readFileSync(__dirname + '/file.txt', 'utf-8');
document.write(text);
document.write(require("./test.coffee"));
