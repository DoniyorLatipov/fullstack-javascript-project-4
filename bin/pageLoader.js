#!/usr/bin/env node

import { program } from 'commander';
import process from 'process';
import loadPage from '../src/index.js';

program
  .description('Downloading web pages with local assets')
  .version('1.0.0', '-V, --version', 'output the version number')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .argument('<url>')
  .action((url, options) => {
    loadPage(url, options.output);
  })
  .helpOption('-h, --help', 'output usage information');

program.parse();
