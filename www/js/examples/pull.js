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

asyncTest('Pull', function () {

	var collectionName = 'people';

	//This mock is a way of showing the code working without having to depend on the server.
	//It will print the invocationData to the console and return successfully with a fake response.
	var adapterMock = function (invocationData) {
		var deferred = $.Deferred();

		var fakeAdapterResponse = {
				invocationResult: [{name: 'carlos', ssn: '111-22-3333', age: 10}, 
				                   {name: 'mike', ssn: '444-55-6666', age: 5}]
		};

		WL.Logger.ctx({pretty: true}).debug('Called adapterMock with:', invocationData);

		setTimeout(function () {
			deferred.resolve(fakeAdapterResponse);
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

		var invocationData = {
				adapter : 'people', 
				procedure : 'getPeople', 
				parameters : [],
				compressResponse: true
		};

		//You may want to use: WL.Client.invokeProcedure(invocationData) instead.
		return adapterMock(invocationData);

	})

	.then(function (responseFromAdapter) {

		// Handle invokeProcedure success.

		var data = responseFromAdapter.invocationResult;

		var changeOptions = {

				// Search fields in the input data that make a document unique
				replaceCriteria : ['id', 'ssn'],

				// Data that does not exist in the Collection will be added, default false.
				addNew : true,

				// Mark data as dirty (true = yes, false = no), default false.
				markDirty : false
		};

		return WL.JSONStore.get(collectionName).change(data, changeOptions);

	})

	.then(function (amountOfDataChanged) {

		deepEqual(amountOfDataChanged, 2, 'check amount of documents that got changed');
		start();
	})

	.fail(function (errorObject) {
		// Handle failure.

		ok(false, "Failed with:" + errorObject.toString());
		start();
	});

});
