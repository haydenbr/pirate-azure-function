function badRequest(message) {
	return { status: 400, message }
}

function methodNotAllowed(method, originalUrl) {
	return {
		status: 405,
		message: `method ${method} not allowed on ${originalUrl}`
	};
}

module.exports = {
	methodNotAllowed,
	badRequest
};
