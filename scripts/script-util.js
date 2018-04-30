const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

// Just a few functions that are common to mutliple build scripts

function bumpVersion(versionBump) {
	let newVersion = getNextVersion(versionBump);
	let packageJson = getPackageJson();

	packageJson.version = newVersion;

	return writeFile(path.resolve(__dirname, '..', 'package.json'), JSON.stringify(packageJson, null, 4));
}

function convertYamlToJson(data) {
	return yaml.load(data);
}

function convertJsonToYaml(data) {
	return yaml.dump(data);
}

function execFile(command, args) {
	return new Promise((resolve, reject) => {
		childProcess.execFile(command, args, (err, stdout) => (err ? reject(err) : resolve(stdout)));
	});
}

function getCurrentVersion() {
	return getPackageJson().version;
}

function getNextVersion(versionBump) {
	let versionBumpOptions = ['major', 'minor', 'patch'];

	if (!versionBumpOptions.includes(versionBump)) {
		throw `versionBump should be one of ${versionBumpOptions}`;
	}

	let currentVersion = getCurrentVersion().split('.');
	let major = Number(currentVersion[0]);
	let minor = Number(currentVersion[1]);
	let patch = Number(currentVersion[2]);

	return {
		major: `${major + 1}.0.0`,
		minor: `${major}.${minor + 1}.0`,
		patch: `${major}.${minor}.${patch + 1}`,
	}[versionBump];
}

function getDockerHubRepository() {
	return getPackageJson().dockerHubRepository;
}

function getPackageJson() {
	return require(path.resolve(__dirname, '..', 'package.json'));
}

function readFile(filepath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, (err, data) => (err ? reject(err) : resolve(data)));
	});
}

function spawnPromise(command, args) {
	return new Promise((resolve, reject) => {
		let child = childProcess.spawn(command, args);

		child.stdout.on('data', data => process.stdout.write(data));
		child.stderr.on('data', data => process.stderr.write(data));

		child.on('close', code => (code === 0 ? resolve(code) : reject(code)));
	});
}

function writeFile(filepath, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filepath, data, { flag: 'w' }, (err, data) => (err ? reject(err) : resolve(data)));
	});
}

module.exports = {
	bumpVersion,
	convertJsonToYaml,
	convertYamlToJson,
	execFile,
	getCurrentVersion,
	getDockerHubRepository,
	getNextVersion,
	getPackageJson,
	readFile,
	spawnPromise,
	writeFile,
};
