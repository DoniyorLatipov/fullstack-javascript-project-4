# Page-loader

### Tests and linter status:

[![Actions Status](https://github.com/DoniyorLatipov/fullstack-javascript-project-4/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/DoniyorLatipov/fullstack-javascript-project-4/actions)
[![Node CI](https://github.com/DoniyorLatipov/fullstack-javascript-project-4/actions/workflows/nodejs.yml/badge.svg)](https://github.com/DoniyorLatipov/fullstack-javascript-project-4/actions/workflows/nodejs.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/1653edae9e4615951b42/maintainability)](https://codeclimate.com/github/DoniyorLatipov/fullstack-javascript-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1653edae9e4615951b42/test_coverage)](https://codeclimate.com/github/DoniyorLatipov/fullstack-javascript-project-4/test_coverage)

### Description:

Node.js console utility for downloading web pages with local assets (img, link, script) of a given domain and subdomains

### Installation:

```bash
make build
```

### Usage:

```bash
Usage: page-loader [options] <url>

Downloading web pages with local assets

Options:
  -V, --version       output the version number
  -o, --output [dir]  output dir (default: "/your/current/dir")
  -h, --help          output usage information
```

### Demo video:

[![asciicast](https://asciinema.org/a/2sxY2f88JOTSsUBM2Gt4cafll.svg)](https://asciinema.org/a/2sxY2f88JOTSsUBM2Gt4cafll)

### Example:

**Before**:

web page with URL https://ru.hexlet.io/courses:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Курсы по программированию Хекслет</title>
    <link rel="stylesheet" media="all" href="https://cdn2.hexlet.io/assets/menu.css" />
    <link rel="stylesheet" media="all" href="/assets/application.css" />
    <link href="/courses" rel="canonical" />
  </head>
  <body>
    <img src="/assets/professions/nodejs.png" alt="Иконка профессии Node.js-программист" />
    <h3>
      <a href="/professions/nodejs">Node.js-программист</a>
    </h3>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="https://ru.hexlet.io/packs/js/runtime.js"></script>
  </body>
</html>
```

Your output dir:

```bash
tree
.

0 directories, 0 files
```

**Comand**:

```bash
page-loader https://ru.hexlet.io/courses
```

**After**:

Local file ru-hexlet-io-courses.html:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Курсы по программированию Хекслет</title>
    <link rel="stylesheet" media="all" href="https://cdn2.hexlet.io/assets/menu.css" />
    <link
      rel="stylesheet"
      media="all"
      href="ru-hexlet-io-courses_files/ru-hexlet-io-assets-application.css"
    />
    <link href="ru-hexlet-io-courses_files/ru-hexlet-io-courses.html" rel="canonical" />
  </head>
  <body>
    <img
      src="ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png"
      alt="Иконка профессии Node.js-программист"
    />
    <h3>
      <a href="/professions/nodejs">Node.js-программист</a>
    </h3>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="ru-hexlet-io-courses_files/ru-hexlet-io-packs-js-runtime.js"></script>
  </body>
</html>
```

Your output dir:

```bash
tree
.
├── ru-hexlet-io-courses.html
└── ru-hexlet-io-courses_files
    ├── ru-hexlet-io-assets-application.css
    ├── ru-hexlet-io-assets-professions-nodejs.png
    ├── ru-hexlet-io-courses.html
    └── ru-hexlet-io-packs-js-runtime.js

1 directory, 5 files
```

### Logging:

```bash
#axios debug:
DEBUG=page-loader:axios ...

#nock debug:
DEBUG=page-loader:nock ...
```

[![asciicast](https://asciinema.org/a/EBEuPMWzxnmDNWnSxXtbjvCDJ.svg)](https://asciinema.org/a/EBEuPMWzxnmDNWnSxXtbjvCDJ)
