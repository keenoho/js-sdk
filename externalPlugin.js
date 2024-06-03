const fs = require('fs');
const swcCore = require('@swc/core');
const PLUGIN_NAME = 'externalPlugin';

function transformImportSpecifiers(bodyItem, external) {
  const { specifiers, source } = bodyItem;
  let codes = [`const pkg = globalThis["${external[source?.value]}"];`];
  for (const spec of specifiers) {
    if (spec.type === 'ImportDefaultSpecifier') {
      codes.push(`const ${spec?.local?.value} = pkg;`);
    } else if (spec.type === 'ImportSpecifier') {
      codes.push(
        `const {${spec?.imported ? `${spec?.imported?.value} : ${spec?.local?.value}` : spec?.local?.value}} = pkg;`
      );
    }
  }

  return codes.join('\n');
}

module.exports = function externalPlugin(externals) {
  return {
    name: PLUGIN_NAME,
    setup(build) {
      build.onLoad({ filter: /\.js$/ }, (args) => {
        if (!externals || Object.keys(externals).length < 1) {
          return {};
        }
        let contents = fs.readFileSync(args.path, 'utf-8');
        const res = swcCore.parseFileSync(args.path);
        const { span, body } = res;
        for (const i of body) {
          if (i.type === 'ImportDeclaration' && i.source.value in externals) {
            const text = contents.substring(i.span.start - span.start, i.span.end - span.start);
            if (/^import[\s\w\d-_\{\}\n]+from[\s\'\"\w\d-_\/]+\;?/i) {
              const code = transformImportSpecifiers(i, externals);
              contents = contents.replace(text, code);
            }
          }
        }

        return {
          contents,
        };
      });
    },
  };
};
