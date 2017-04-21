#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const cwd = process.cwd();
const minimist = require('minimist');
const minimistOpts = {
  alias: {
    w: 'write',
    l: 'line',
    v: 'version'
  }
}
const argv = minimist(process.argv.slice(2), minimistOpts);
const _writeFile = pify(fs.writeFile);
const readFile = pify(fs.readFile);
const readSync = (filePath, fmt = null) => fs.readFileSync(filePath, fmt);
const writeFile = (filePath, data) => _writeFile(filePath, data, 'utf8')
const pkgInPath = path.resolve(cwd, 'package.json');
const readmeInPath = path.resolve(cwd, 'README.md')
const pkgData = readSync(pkgInPath, 'utf8');
const parsedPkg = JSON.parse(pkgData)
const versionLine = `###### v ${parsedPkg.version}`;
const cliVersion = JSON.parse(readSync('package.json', 'utf8')).version;
const helpTxt = `
  edit-readme v ${cliVersion}

  Usage
    $ edit <cmd> <options>

    Commands
      -w, --write               write to README at current working directory

    Options
      -c, --custom              option to specify custom text to append (default is package.json version at cwd)
      -l, --line                option to specify custom line to append to (default is line 2)
      -v, --version             get cli package version
`



const write = (str = versionLine, line = 3) => {
  readFile(readmeInPath).then(buffer => {
    const readmeLines = buffer.toString().split('\n');
    readmeLines.splice(line - 1, 1, str)
    return Promise.resolve(readmeLines.join('\n'))
  }).then(lines => {
    return writeFile(readmeInPath, lines)
  })
}

if (argv.v) {
  return console.log(cliVersion)
}

if (argv.h) {
  return console.log(helpTxt)
}

if (argv.w) {
  write(argv.c, argv.l)
}
