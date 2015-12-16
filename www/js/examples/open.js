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

asyncTest('Open collections', function () {

	var peopleCollectionName = 'people';
	var ordersCollectionName = 'orders';

	// Object that defines all the collections.
	var collections = {

			// Object that defines the 'people' collection.
			people : {

				// Object that defines the Search Fields for the 'people' collection.
				searchFields : {name: 'string', age: 'integer'}
			},
			
			// Object that defines the 'orders' collection.
			orders : {

				// Object that defines the Search Fields for the 'orders' collection.
				searchFields : {item: 'string'}
			},
	};

	// Optional options object.
	var options = {

			// Optional username, default 'jsonstore'.
			username : 'carlos',

			// Optional password, default no password.
			password : '123',

			// Optional local key generation flag, default false.
			localKeyGen : false
	};

	//Destroy first to start with no data and get predictable results in the test
	WL.JSONStore.destroy()

	.then(function () {

		//Open the collection
		return WL.JSONStore.init(collections, options);
	})

	.then(function () {

		deepEqual(WL.JSONStore.get(ordersCollectionName).name, ordersCollectionName, 'check orders collection name');
		deepEqual(WL.JSONStore.get(peopleCollectionName).name, peopleCollectionName, 'check people collection name');
		start();
	})

	.fail(function (errorObject) {
		// Handle failure for any of the previous JSONStore operations (init, add).

		ok(false, "Failed with:" + errorObject.toString());
		start();
	});

});