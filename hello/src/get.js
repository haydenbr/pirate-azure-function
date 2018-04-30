const _ = require('lodash');
const error = require('../../common').error;

module.exports = function (req) {
	return new Promise((resolve, reject) => {
		let body = req.body || {};
		let name = req.query.name || body.name;

		if (name) {
			resolve({
				message: `Hello. I don't care if your name is ${req.query.name || req.body.name}. I will call you Bob. Hello Bob.`,
				secret: _.kebabCase('bob is cool')
			});
		} else {
			reject(error.badRequest('A name must be included on either the query string or the request body'));
		}
	});
};
