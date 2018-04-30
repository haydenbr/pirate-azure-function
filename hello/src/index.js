if (!process.env.LOCAL_DEVELOPMENT) {
	require('applicationinsights').start();
}

const standardHandler = require('../../common').standardHandler;
const POST = require('./post');
const GET = require('./get');
const methodHandlers = { GET, POST };

function main(context, req) {
	standardHandler(context, req, methodHandlers);
}

module.exports = main;
