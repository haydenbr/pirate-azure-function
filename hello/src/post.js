const pirateSpeak = require('pirate-speak');
const error = require('../../common').error;

module.exports = function(req) {
	return new Promise((resolve, reject) => {
		if (req.body && req.body.message) {
			resolve({ message: pirateSpeak.translate(req.body.message) });
		} else {
			reject(error.badRequest('A message must be included on the request body'));
		}
	});
};
