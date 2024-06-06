#! /usr/bin/env node
import index from '../src/main/index.js';
import yargs from 'yargs';
import * as R from 'ramda';
import { hideBin } from 'yargs/helpers';
const DEFAULT_OPTIONS = {
  nofile: false,
  nodir: true,
  depthLimit: -1,
  basename: false,
  inverse: false,
  deleteDir: '',
  filterFileDir: '',
  extGoes: '[]',
  extStays: '[]',
};
yargs(hideBin(process.argv))
  .command('delete', '', v => {
    const options = { ...DEFAULT_OPTIONS };
    R.forEach(key => {
      if (R.isNotNil(v.argv[key])) {
        options[key] = v.argv[key];
      }
    })(R.keys(v.argv));
    index({ ...options });
  })
  .example('delete --nofile 0 --nodir 0 --extStays \'[".js", ".gz", ".txt", ".css", ".map", ".html"]\'', '')
  .example('delete --nofile 0 --nodir 0 --extGoes \'[".js", ".gz", ".txt", ".css", ".map", ".html"]\'', '')
  .example('delete --deleteDir /path_to_folder  --filterFileDir /path_to_filter_file', '')
  .example('--inverse', '')
  .example('--nodir check https://github.com/manidlou/node-klaw-sync for more info', '')
  .example('--nofile check https://github.com/manidlou/node-klaw-sync for more info', '')
  .example('--depthLimit check https://github.com/manidlou/node-klaw-sync for more info', '')
  .help()
  .alias('help', 'h')
  .alias('nofile', 'nofile')
  .alias('nodir', 'nodir')
  .alias('depthLimit', 'depthLimit')
  .alias('basename', 'basename')
  .alias('inverse', 'inverse')
  .alias('extGoes', 'extGoes')
  .alias('extStays', 'extStays')
  .alias('d', 'directory').argv;
