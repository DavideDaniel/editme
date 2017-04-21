### Editme

###### v 1.0.2

Just a simple cli tool to edit the README at cwd. Main purpose was to automate adding package version to markdown in README.

##### Install
```bash
  $ npm i editme --save-dev
```

##### Use
```bash
Usage
  $ editme <cmd> <options>

  Commands
    -w, --write               write to README at current working directory

  Options
    -c, --custom              option to specify custom text to append (default is package.json version at cwd)
    -l, --line                option to specify custom line to append to (default is line 2)
    -v, --version             get cli package version
```