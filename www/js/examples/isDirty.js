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

asyncTest('Is Dirty', function () {

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

		var options = {
				markDirty: true
		};

		//Add data
		return WL.JSONStore.get(collectionName).add([{name: 'carlos', age: 10}, {name: 'mike', age: 5}], options);
	})

	.then(function () {

		var doc = [{_id: 1, json: {name: 'carlos', age: 10}}];

		//Check if document is dirty
		return WL.JSONStore.get(collectionName).isDirty(doc);		
	})

	.then(function (isDocumentDirty) {

		ok(isDocumentDirty, 'check if is dirty document result is truthy');
		start();
	})

	.fail(function (errorObject) {
		// Handle failure.

		ok(false, "Failed with:" + errorObject.toString());
		start();
	});

});
