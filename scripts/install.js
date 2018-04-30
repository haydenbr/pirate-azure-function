#!/usr/bin/env node

const fs = require('fs');
const resolve = require('path').resolve;
const join = require('path').join;
const cp = require('child_process');

const projectRoot = resolve(__dirname, '..');
const npmCmd = 'npm';

fs.readdirSync(projectRoot).forEach(functionDirectory => {
	let modPath = join(projectRoot, functionDirectory);

	if (fs.existsSync(join(modPath, 'package.json'))) {
		cp.spawn(npmCmd, ['i'], {
			env: process.env,
			cwd: modPath,
			stdio: 'inherit',
		});
	}
});
