/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
import loaderUtils from 'loader-utils';

const baseRegex = '\\s*[@#]\\s*sourceMappingURL=data:[^;\n]+;base64,([^\\s]*)';

const // Matches /* ... */ comments
regex1 = new RegExp(`/\\*${baseRegex}\\s*\\*/$`);

const // Matches // .... comments
regex2 = new RegExp(`//${baseRegex}.*$`);

export default function (input) {
  if (!this.query) throw new Error('Pass a module name as query to the transform-loader.');
  const query = loaderUtils.getOptions(this) || {};
  const callback = this.async();
  const resource = this.resource;
  const loaderContext = this;
  const q = Object.keys(query)[0];
  if (/^[0-9]+$/.test(q)) {
    next(this.options.transforms[+q]);
  } else {
    this.resolve(this.context, q, (err, module) => {
      if (err) return callback(err);
      next(require(module));
    });
  }
  function next(transformFn) {
    const stream = transformFn(resource);
    const bufs = [];
    let done = false;
    stream.on('data', (b) => {
      bufs.push(Buffer.isBuffer(b) ? b : new Buffer(b));
    });
    stream.on('end', () => {
      if (done) return;
      const b = Buffer.concat(bufs).toString();
      const match = b.match(regex1) || b.match(regex2);
      try {
        var map = match && JSON.parse((new Buffer(match[1], 'base64')).toString());
      } catch (e) {
        var map = null;
      }
      done = true;
      callback(null, map ? b.replace(match[0], '') : b, map);
    });
    stream.on('error', (err) => {
      if (done) return;
      done = true;
      callback(err);
    });
    stream.write(input);
    stream.end();
  }
}

export const raw = true;
