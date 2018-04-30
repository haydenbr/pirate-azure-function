#!/usr/bin/env node

const promisify = require('util').promisify;
const readdir = promisify(require('fs').readdir);
const exists = promisify(require('fs').exists);
const writeFile = promisify(require('fs').writeFile);
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

readdir(projectRoot).then(directories => {
	directories.forEach(directory => {
		let dir = path.join(projectRoot, directory);
		anonymizeFunction(dir);
	});
});

function anonymizeFunction(dir) {
	let functionConfigPath = path.join(dir, 'function.json');

	return exists(functionConfigPath).then(exists => {
		if (exists) {
			let functionConfig = require(functionConfigPath);

			functionConfig.bindings = functionConfig.bindings.map(binding => {
				if (binding.authLevel) {
					binding.authLevel = 'anonymous';
				}

				return binding;
			});

			return writeFile(functionConfigPath, JSON.stringify(functionConfig, null, 4));
		}
	});
}
