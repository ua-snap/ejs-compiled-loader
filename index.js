const ejs = require('ejs');
const htmlmin = require('html-minifier');
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    minify: {
      type: 'boolean',
    },
    htmlminOptions: {
      type: 'object',
    },
  },
};

module.exports = function (source) {
  this.cacheable && this.cacheable();

  const options = this.query || {};
  validateOptions(schema, options, 'EJS Loader');

  const filename = loaderUtils.getRemainingRequest(this).replace(/^!/, "");

  const defaults = {
    compileDebug: false,
  };

  const ejsOptions = Object.assign(defaults, options, {
    client: true,
    filename: filename,
    htmlmin: undefined,
    htmlminOptions: undefined,
  });

  try {
    if (options.minify) {
      source = htmlmin.minify(source, options.htmlminOptions);
    }

    // Handle child templates
    if (template.dependencies && template.dependencies.length > 0) {
      template.dependencies.map(dep => this.addDependency(dep));
    }

    var template = ejs.compile(source, ejsOptions);
  } catch (e) {
    this.callback(e);
    return;
  }

  return 'module.exports = ' + template;
};
