# PNC Functions

An Azure Function for helping you learn to speak pirate. Kind of like Google Translate for pirate speak. It's the new, popular language to learn.

## Running Locally

1. `yarn start`. This will start up a dockerized dev environment with `docker-compose`

### Versioning

The package.json includes scripts for `major`, `minro`, and `patch`. On each version bump, a docker image is built and tagged with the new version and all refernces to the current version of the app are updated to the new version to ensure that throughout the git history, `yarn start` will automagically start up the right image based on the point at which you are currently checked out.

## Directory Structure

The root level of the app contains several directories. Directories with a `function.json` contain the code for a single function. The `common` directory contains code shared between multiple functions.

## Common

A couple items of interest in the common directory include `error.js` and `standard-handler.js`.

### Request handling

All functions are set up using the `standardHandler` function exported by `stanrd-handler.js`. The function takes three arguments, `context` and `req`, which are provided by the Azure Function runtime whenever a request to a valid function is initiated, and `methodHandlers`, which is a map of the form

```
{
	GET: Function(req),
	POST: Function(req),
	...,
	[HTTP_METHOD]: Function(req)
}
```

Each function in the map should expect the req parameter and should define the result of making a request to the function with the specified http method. When the request is received, if a corresponding function cannot be found for the http method used in the request, then a 405 error is returned. Otherwise, the function is called with the `req` object. The function called is expected to return the result that should be returned to the user. Each method function is also respnsible for handling errors specific to its needs.

When creating a new function, the `index.js` in that function's `src` directory can simply export a function that calls this `standardHandler` method, passing in the `context` and `req` objects provided by the runtime and the map of appropriate http methods to functions.

### Error handling

As of now, the common error handling script includes utilities for handling 400 errors and 405 errors. 404 and 401 errors are handled by the Azure Function runtime itself.

## Functions

#### `function.json`

The `function.json` document contains config data that defines how the Azure Function runtime should start and run each function. Every function has its own `function.json`. Following is an example of how this file might look, taken fromthe `hello` function.

```json
{
	"disabled": false,
	"scriptFile": "src/index.js",
	"bindings": [
		{
			"authLevel": "anonymous",
			"type": "httpTrigger",
			"direction": "in",
			"name": "req",
			"route": "hello"
		},
		{
			"type": "http",
			"direction": "out",
			"name": "res"
		}
	]
}
```

The purpose of each property in the object is rather intuitive.

* `disabled`: controls whether or not the function is active.
* `scriptFile`: defines the function entrypoint.
* `authLevel`: defines what type of authorization, if any, is used for this function. Out of the possible values, we use `anonymous` and `function`. When running locally, all functions are set to `anonymous`. When `function`: is used, an access key is required to access the function.
* `type`: defines the type of trigger that should initiate running the function. As of now, we only use `httpTrigger` to open up the functions to http requests. Other trigger types exist.
* `direction`: for `httpTriggers`, the direction is set to `in`
* `name`: the name of the req object passed into the function from the runtime. Not entirely intuitive, this one.
* `route`: the name of function endpoint. In this example, making a request to `http://<server>/api/hello` would trigger the `hello` function. If not specified, the `route` will be set as the name of the directory in which the `function.json` is contained.

The second object in the `bindings` array is needed to return an http response back to the client.

If more information is needed regarding the `function.json` file, please refer to Microsoft's [`function.json` documentation](https://github.com/Azure/azure-functions-host/wiki/function.json) and their [guidance docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference).

### Hello

The `hello` function is essentially an anonymous hello world function, containing `GET` and `POST` request handlers. It's good for quickly testing new settings and integration issues.
