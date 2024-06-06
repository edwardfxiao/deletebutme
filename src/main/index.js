import klawSync from 'klaw-sync';
import { exec } from 'child_process';
import fs from 'fs';
import * as R from 'ramda';
import chalk from 'chalk';
import boxen from 'boxen';
import path from 'path';
import isValidPath from 'is-valid-path';
const log = chalk.bold.hex('#54c754');
const error = chalk.bold.hex('#c75454');

const getFiles = (pathName, option) => {
  return R.compose(
    R.filter(i => {
      const itemExt = path.extname(i.path);
      if (option.extGoes && option.extGoes.length > 0) {
        return R.any(ext => ext === itemExt)(option.extGoes);
      } else {
        if (option.extStays && option.extStays.length > 0) {
          return !R.any(ext => ext === itemExt)(option.extStays);
        } else {
          return true;
        }
      }
    }),
  )(klawSync(pathName, { nofile: !!option.nofile, nodir: !!option.nodir, depthLimit: option.depthLimit }));
};
const boxenOptionsLog = {
  padding: 0,
  margin: 0,
  color: '#54c754',
  borderColor: '#54c754',
  borderStyle: 'none',
};
const boxenOptionsError = {
  padding: 0,
  margin: 0,
  color: '#c75454',
  borderColor: '#c75454',
  borderStyle: 'none',
};
const renderMyLog = msg => boxen(log(msg), boxenOptionsLog);
const renderMyError = msg => boxen(error(msg), boxenOptionsError);
import * as readline from 'node:readline/promises';

let dir = '';
const handleAllFiles = async props => {
  let rl;
  if (!props.deleteDir) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    dir = await rl.question(renderMyLog('The dir to delete: '));
  } else {
    dir = props.deleteDir;
  }
  if (!dir) {
    rl && rl.close();
    return [];
  }

  if (!isValidPath(dir)) {
    rl && rl.close();
    return [];
  }

  dir = dir.replace(/\\ /g, ' ').trim();

  try {
    const allFiles = getFiles(dir, props);
    if (R.isNil(allFiles) || allFiles.length === 0) {
      console.log(renderMyError('No files found'));
      rl && rl.close();
      return [];
    }
    rl && rl.close();
    return allFiles;
  } catch (err) {
    console.log(renderMyError('Failed to get files'));
  }
  rl && rl.close();
  return [];
};

const handleStaysFiles = async props => {
  let filterFile = '';
  let rl;
  if (!props.filterFileDir) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    filterFile = await rl.question(renderMyLog('The file of list need to stay: '));
  } else {
    filterFile = props.filterFileDir;
  }
  if (!filterFile) {
    rl && rl.close();
  }

  if (!isValidPath(filterFile)) {
    rl && rl.close();
  }

  filterFile = filterFile.replace(/\\ /g, ' ').trim();
  let stays = [];
  try {
    const content = await fs.promises.readFile(filterFile);
    stays = R.filter(R.isNotEmpty())(R.map(i => path.basename(i))(content.toString().split('\n')));
  } catch (err) {
    console.log(renderMyError('Failed to read'));
  }

  rl && rl.close();
  return stays;
};

const handleExec = cmd =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });

const index = async props => {
  const extStays = JSON.parse(props.extStays);
  const extGoes = JSON.parse(props.extGoes);
  const staysFiles = [];
  const allFiles = await handleAllFiles({ ...props, extStays, extGoes });
  if (allFiles && allFiles.length > 0) {
    const stays = await handleStaysFiles(props);
    const folders = [];
    let removedFile = 0;
    for (const file of allFiles) {
      const filename = path.basename(file.path);
      if (props.inverse ? stays.includes(filename) : !stays.includes(filename)) {
        const isDir = fs.lstatSync(file.path).isDirectory();
        if (isDir) {
          folders.push(file.path);
        }
        if (fs.existsSync(file.path) && !isDir) {
          const rmFileCommand = `rm '${file.path}'`;
          console.log('\x1b[40m', '\x1b[32m', `Deleting: ${file.path}`, '\x1b[0m');
          await handleExec(rmFileCommand);
          removedFile += 1;
        }
      } else {
        staysFiles.push(file.path);
      }
    }
    let removedFolder = 0;
    for (const folder of folders) {
      const rmFileCommand = `rm -rf '${folder}'`;
      await handleExec(rmFileCommand);
      removedFolder += 1;
    }

    console.log('');
    console.log('\x1b[40m', '\x1b[32m', `All qualified items: ${allFiles.length}`, '\x1b[0m');
    console.log('\x1b[40m', '\x1b[32m', `Removed files: ${removedFile}`, '\x1b[0m');
    console.log('\x1b[40m', '\x1b[32m', `Removed folders: ${removedFolder}`, '\x1b[0m');
    console.log('\x1b[40m', '\x1b[32m', `Stayed items count: ${allFiles.length - removedFile - removedFolder}`, '\x1b[0m');
    console.log('\x1b[40m', '\x1b[32m', `Stayed items:`, '\x1b[0m');
    console.log(staysFiles);
  } else {
    console.log(renderMyError('Nothing to delete'));
  }
};
export const a = () => {
  console.log('1');
};
export default index;
