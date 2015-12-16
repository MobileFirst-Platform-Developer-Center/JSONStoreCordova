/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

asyncTest('Push', function () {

	var collectionName = 'people';

	var dirtyDocs = [];

	//This mock is a way of showing the code working without having to depend on the server.
	//It will print the invocationData to the console and return successfully.
	var adapterMock = function (invocationData) {
		var deferred = $.Deferred();

		WL.Logger.ctx({pretty: true}).debug('Called adapterMock with:', invocationData);

		setTimeout(function () {
			deferred.resolve();
		}, 0);

		return deferred.promise();
	};

	//Destroy first to start with no data and get predictable results in the test
	WL.JSONStore.destroy()

	.then(function () {

		// Object that defines all the collections.
		var collections = {

				// Object that defines the 'people' collection.
				people : {

					// Object that defines the Search Fields for the 'people' collection.
					searchFields : {name: 'string', age: 'integer'}
				}
		};

		//Open the collection
		return WL.JSONStore.init(collections);
	})

	.then(function () {

		var options = {
				markDirty: true
		};

		//Add data
		return WL.JSONStore.get(collectionName).add([{name: 'carlos', age: 10}, {name: 'mike', age: 5}], options);
	})

	.then(function () {

		//Returns all dirty documents
		return WL.JSONStore.get(collectionName).getAllDirty();

	})

	.then(function (arrayOfDirtyDocuments) {

		dirtyDocs = arrayOfDirtyDocuments;

		try {
			deepEqual(dirtyDocs[0].json.name, 'carlos', 'check document with name carlos');
			deepEqual(dirtyDocs[1].json.name, 'mike', 'check document with name mike');
		} catch (e) {
			ok(false, 'Exception: ' + e.toString());
		}

		var invocationData = {
				adapter : 'people', 
				procedure : 'updatePeople', 
				parameters : [dirtyDocs],
				compressResponse: true
		};

		//You may want to use: WL.Client.invokeProcedure(invocationData) instead.
		return adapterMock(invocationData);
	})

	.then(function (responseFromAdapter) {
		//Note: The adapterMock won't return a response (responseFromAdapter), but a real adapter will.
		//You may want to check the response when using a real adapter call before you continue to mark documents as clean.

		return WL.JSONStore.get(collectionName).markClean(dirtyDocs);
	})

	.then(function (numberOfDocumentsMarkedClean) {

		deepEqual(numberOfDocumentsMarkedClean, 2, 'check number of documents marked clean');
		start();
	})

	.fail(function (errorObject) {
		// Handle failure.

		ok(false, "Failed with:" + errorObject.toString());
		start();
	});

});
