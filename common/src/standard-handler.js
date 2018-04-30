const error = require('./error');
const http = require('http');

function standardHandler(context, req, methodHandlers) {
	logToContext(context);

	let func = methodHandlers[req.method] || methodNotAllowed;

	return func(req)
		.then(result => (context.res = getNewResponse(result, 200)))
		.catch(err => (context.res = getNewResponse(err, err.status)))
		.then(() => context.done());
}

function logToContext(context) {
	console.log = function() {
		context.log(...arguments);
	};
}

function methodNotAllowed(req) {
	return Promise.reject(error.methodNotAllowed(req.method, req.originalUrl));
}

function getNewResponse(body, status) {
	return Object.assign(
		{
			headers: { 'Content-Type': 'application/json' },
			status,
		},
		{ body }
	);
}

module.exports = standardHandler;
