#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const pify = require("pify");
const cwd = process.cwd();
const minimist = require("minimist");
const minimistOpts = {
  alias: {
    m: "match",
    w: "write",
    l: "line",
    v: "version"
  }
};
const argv = minimist(process.argv.slice(2), minimistOpts);
const _writeFile = pify(fs.writeFile);
const readFile = pify(fs.readFile);
const readSync = (filePath, fmt = null) => fs.readFileSync(filePath, fmt);
const writeFile = (filePath, data) => _writeFile(filePath, data, "utf8");
const pkgInPath = path.resolve(cwd, "package.json");
const readmeInPath = path.resolve(cwd, "README.md");
const pkgData = readSync(pkgInPath, "utf8");
const parsedPkg = JSON.parse(pkgData);
const versionLine = `${parsedPkg.version}`;
const cliVersion = JSON.parse(readSync("package.json", "utf8")).version;
const helpTxt = `
  editme v ${cliVersion}

  Usage
    $ editme <cmd> <options>

    Commands
      -w, --write               write to README at current working directory

    Options
      -m, --match               option to match in parsed text (regex as string to be used in constructor or simple string)
      -c, --custom              option to specify custom text to append (default is package.json version at cwd)
                                use $npm_package_version inside a string in script if you need to interpolate version with a string
      -v, --version             get cli package version
`;

const write = ({ str = versionLine, match }) => {
  readFile(readmeInPath)
    .then(buffer => {
      const readmeLines = buffer.toString();

      const regex = new RegExp(argv.m, "m");
      const matched = regex.test(readmeLines);
      console.log("regex", regex);

      const replaceWith = readmeLines.replace(regex, str);

      if (!matched) {
        return readmeLines;
      }

      return replaceWith;
    })
    .then(lines => {
      return writeFile(readmeInPath, lines).then(() =>
        console.log(`Updated ${readmeInPath} with ${str}`)
      );
    });
};

if (argv.v) {
  return console.log(cliVersion);
}

if (argv.h) {
  return console.log(helpTxt);
}

if (!argv.m) {
  throw new Error(
    "Missing matcher to work on. Please include with -m or --match flag."
  );
}

if (argv.w) {
  write({ str: argv.c, match: argv.m });
}
