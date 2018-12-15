# concordia-grades

> command line tool to scrape your grades from myconcordia

#### Syntax

```
ABCD123  A++  2048 Spring
└──┬──┘ └─┬─┘ └────┬────┘
course  grade   semester
```

_The grade may be a letter `D-`, missing `--` or `PASS/FAIL` depending on the course._

## Install

```shell
$ npm install --global concordia-grades
```

_This project has a dependency on `puppeteer` (which downloads/installs Chromium by default)._

## Usage

```
Usage: grades [USER] [PASS]
Command line tool to scrape your grades from myconcordia
```

_WARNING - Your username/password might be stored by your terminal._

_Headless mode is not supported, Chromium will pop up and navigate to the grades page._

The command will output each of your courses on a single line. Since it takes a while for puppeteer to click through the pages, it may be convenient to write this output to a file.

```shell
$ grades "j_doe" "hackmepls" > "grades.txt"
```

You can then use `cat` and `grep` to filter the data for what you are looking for.

```shell
# Filter by year
$ cat "grades.txt" | grep "2018"

# Filter by semester
$ cat "grades.txt" | grep "2018 Fall"

# Filter by department
$ cat "grades.txt" | grep "SOEN"

# Filter by grade
$ cat "grades.txt" | grep -P " A. "
```

## License

[MIT](./LICENSE)
