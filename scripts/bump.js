#!/usr/bin/env node

const chalk = require('chalk');
const gitUtil = require('./git-utilities');
const syncDockerComposeImageVersion = require('./sync-docker-compose-image-version');
const util = require('./script-util');
const dockerUtil = require('./docker-utilities');

const versionBump = process.argv[2];

function bump() {
	return bumpVersion(versionBump)
		.then(() => syncDockerComposeImageVersion())
		.then(() => commitAndTag())
		.then(() => dockerize())
		.then(() => gitPush())
		.catch(err => console.log(chalk.red(err)));
}

function bumpVersion(versionBump) {
	let nextVersion = util.getNextVersion(versionBump);

	return gitUtil
		.existsTag(nextVersion)
		.then(exists => {
			if (exists) {
				throw `version ${nextVersion} already exists. Get your commit history in line with origin before version bumping`;
			}
		})
		.then(() => util.bumpVersion(versionBump));
}

function commitAndTag() {
	let version = util.getCurrentVersion();
	return gitUtil.commit(version).then(() => gitUtil.tag(version));
}

function dockerize() {
	return dockerUtil.build().then(() => dockerUtil.push());
}

function gitPush() {
	let tag = util.getCurrentVersion();
	return gitUtil.push().then(() => gitUtil.pushTag(tag));
}

bump();
