import { debug,  print, warning } from '@aws-cdk/toolchain-common';
import childProcess = require('child_process');
import colors = require('colors/safe');
import process = require('process');
import yargs = require('yargs');
import { CommandOptions } from '../command-api';

export const command = 'docs';
export const describe = 'Opens the reference documentation in a browser';
export const aliases = ['doc'];
export const builder = {
  browser: {
    alias: 'b',
    desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
    type: 'string',
    default: process.platform === 'win32' ? 'start %u' : 'open %u'
  }
};

export interface Arguments extends yargs.Arguments {
  browser: string
}

export function handler(args: yargs.Arguments) {
  args.commandHandler = realHandler;
}

export async function realHandler(options: CommandOptions): Promise<number> {
  const docVersion = require('../../package.json').version;
  const url = `https://awslabs.github.io/aws-cdk/versions/${docVersion}/`;
  print(colors.green(url));
  const browserCommand = options.args.browser.replace(/%u/g, url);
  debug(`Opening documentation ${colors.green(browserCommand)}`);
  return new Promise<number>((resolve, _reject) => {
    childProcess.exec(browserCommand, (err, stdout, stderr) => {
      if (err) {
        debug(`An error occurred when trying to open a browser: ${err.stack || err.message}`);
        return resolve(0);
      }
      if (stdout) { debug(stdout); }
      if (stderr) { warning(stderr); }
      resolve(0);
    });
  });
}
