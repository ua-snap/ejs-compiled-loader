const compiler = require('./compiler');
const vm = require('vm');

describe('EJS templates', () => {
  it('compiles a simple template with data', async () => {
    const stats = await compiler('template.ejs');
    const output = run(stats, { noun: 'World' });
    expect(output).toBe('Hello, World!\n');
  });

  it('compiles a template with parent', async () => {
    const stats = await compiler('subdir/parent.ejs');
    const output = run(stats, { foo: 'foo' });
    expect(output).toBe('parent: child: foo\n\n');
  });

  it('minifies HTML', async () => {
    const options = {
      minify: true,
      htmlminOptions: {
        removeComments: true,
      },
    };
    const stats = await compiler('htmlmin.ejs', options);
    const output = run(stats, { test: 123 });
    expect(output).toBe('123\n');
  });

  it('compiles a template with custom EJS options', async () => {
    const options = { delimiter: '?' };
    const stats = await compiler('template2.ejs', options);
    const output = run(stats, { hobbies: ['food', 'code'] });
    expect(output).toBe('  I like food.\n  I like code.\n\n');
  });
});

function run(stats, opts) {
  expect(stats.toJson().errors).toEqual([]);
  const sandbox = { module: {} };
  vm.runInNewContext(stats.toJson().modules[0].source, sandbox);
  return sandbox.module.exports(opts);
}
