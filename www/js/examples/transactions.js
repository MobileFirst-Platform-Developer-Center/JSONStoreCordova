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

asyncTest('Transactions', function () {

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

		return WL.JSONStore.startTransaction();
	})

	.then(function () {

		// Handle startTransaction success.
		// You can call every JSONStore API method except:
		// init, destroy, removeCollection, and closeAll.

		var data = [{name: 'carlos'}];

		return WL.JSONStore.get(collectionName).add(data);
	})

	.then(function () {

		var docs = [{_id: 1, json: {name: 'carlos'}}];

		return WL.JSONStore.get(collectionName).remove(docs);
	})

	.then(function () {

		return WL.JSONStore.commitTransaction();
	})

	.then(function () {

		return WL.JSONStore.get(collectionName).findAll();
	})

	.then(function (documentsInsideTheCollection) {

		deepEqual(documentsInsideTheCollection, [], 'check documents inside the collection');

		start();
	})

	.fail(function (errorObject) {

		var err = errorObject;

		// Handle failure for any of the previous JSONStore operation.
		//(startTransaction, add, remove).

		WL.JSONStore.rollbackTransaction()

		.always(function () {
			ok(false, "Failed with:" + err.toString());
			start();
		});
	});

});
