#!/usr/bin/env node
'use strict';

(async () => {
	
	const program = require('commander');

	const addGlob = (value, globs) => {
		globs.push(value);
		return globs;
	};

	program
		.version(require('./package.json').version)
		.option('-g, --globs [additional globs]', 'Additional patterns to include or exclude (optional)', addGlob, [])
		.option('-n, --creative-name <name of creative>', 'Name of creative')
		.option('-v, --creative-version [value]', 'Version of creative in any format (optional parameter)')
		.option('-d, --add-date', 'Add current date to .zip name')
		.parse(process.argv);

	const fs = require('fs');
	const archiver = require('archiver');
	const path = require('path');
	const { globby } = await import('globby');
	const archive = archiver('zip');

	const packageZip = (creativeName, version = undefined, addDate = false, globs) => {
		const zipName = creativeName + (version ? '-' + version : '') + (addDate ? '-' + new Date().toISOString().substring(0, 10) : '') + '.zip';

		const output  = fs.createWriteStream(zipName);

		archive.pipe(output);

		const defaultGlobs = ['**/*', '!**/node_modules', '!**/sources', '!.*', '!*.zip', '!*.ai', '!**/*.ai', '!*.psd', '!**/*.psd'];

		globby(defaultGlobs.concat(globs)).then(files => {
			files.forEach(file => {
				archive.file(file, {name: path.relative(process.cwd(), file)});
			});
			archive.finalize();
			console.log('Done, saved to ' + zipName);
		});

	};

	if (!program.creativeName || program.creativeName === "$npm_package_name") {  // $npm_package_name is suppoerted only in linux, so this is fallback for windows.
		if (fs.existsSync("../../package.json")) {
			program.creativeName = require("../../package.json").name
			console.log('Name from package.json was used.');
		} 
		console.log("Package name not found.");
	}

	if (program.creativeName) {
		packageZip(program.creativeName, program.creativeVersion, program.addDate, program.globs);
	}

})();
