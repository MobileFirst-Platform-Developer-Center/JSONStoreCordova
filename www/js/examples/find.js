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

asyncTest('Find', function () {

	var collectionName = 'people';

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
		//Add data
		return WL.JSONStore.get(collectionName).add([{name: 'carlos', age: 10}, {name: 'mike', age: 5}]);
	})

	.then(function () {

		// Find all documents that match the queries.
		var queryPart1 = WL.JSONStore.QueryPart()
		.equal('name', 'carlos')
		.lessOrEqualThan('age', 10);

		var options = {
				// Returns a maximum of 10 documents, default no limit.
				limit: 10,

				// Skip 0 documents, default no offset.
				offset: 0,

				// Search fields to return, default: ['_id', 'json'].
				filter: ['_id', 'json'],

				// How to sort the returned values, default no sort.
				sort: [{name: WL.constant.ASCENDING}, {age: WL.constant.DESCENDING}]
		};

		return WL.JSONStore.get(collectionName)

		// Alternatives:
		// - findById(1, options) which locates documents by their _id field
		// - findAll(options) which returns all documents
		// - find({'name': 'carlos', age: 10}, options) which finds all documents
		// that match the query.
		.advancedFind([queryPart1], options);
	})

	.then(function (arrayResults) {

		deepEqual(arrayResults, [{_id: 1, json: {name: 'carlos', age: 10}}], 'check find results');
		start();
	})

	.fail(function (errorObject) {
		// Handle failure.

		ok(false, "Failed with:" + errorObject.toString());
		start();
	});

});
