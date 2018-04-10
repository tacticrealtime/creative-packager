#!/usr/bin/env node
'use strict';

const program = require('commander');

program
	.version(require('./package.json').version)
	.option('-n, --creative-name <name of creative>', 'Name of creative')
	.option('-v, --creative-version [value]', 'Version of creative in any format (optional parameter)')
	.option('-d, --add-date', 'Add current date to .zip name')
	.parse(process.argv);

const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const globby = require('globby');
const archive = archiver('zip');

const packageZip = (creativeName, version = undefined, addDate = false) => {
	const zipName = creativeName + (version ? '-' + version : '') + (addDate ? '-' + new Date().toISOString().substring(0, 10) : '') + '.zip';

	const output  = fs.createWriteStream(zipName);

	archive.pipe(output);

	const globs = ['**/*', '!**/node_modules', '!.*', '!*.zip'];
	globby(globs).then(files => {
		files.forEach(file => {
			archive.file(file, {name: path.relative(process.cwd(), file)});
		});
		archive.finalize();
		console.log('Done, saved to ' + zipName);
	});

};

if (!program.creativeName) {
	console.log('Please specify creative name parameter!');
	program.help();
}
else {
	packageZip(program.creativeName, program.creativeVersion, program.addDate);
}