//Polyfill Node.js core modules in Webpack. This module is only needed for webpack 5+.
import { Configuration } from 'webpack';

import * as NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

/**
 * Custom angular webpack configuration
 */
module.exports = (config: any, options: any): Configuration => {
  config.target = 'electron-renderer';

  if (options.fileReplacements) {
    for (let fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== 'src/angular/environments/environment.ts') {
        continue;
      }

      let fileReplacementParts = fileReplacement['with'].split('.');

      if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
        config.target = 'web';
      }

      break;
    }
  }

  config.plugins = [...config.plugins, new NodePolyfillPlugin({ excludeAliases: ['console'] })];

  // https://github.com/ryanclark/karma-webpack/issues/497
  config.output.globalObject = 'globalThis';

  return config;
};
