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

asyncTest('Basic Scenario', function () {

	WL.JSONStore.destroy()

	.then(function () {

		var collections = {
				people : {
					searchFields: {name: 'string', age: 'integer'}
				}
		};

		return WL.JSONStore.init(collections);
	})

	.then(function () {

		var data = [{name: 'carlos', age: 20},
		            {name: 'mike', age: 30}];

		return WL.JSONStore.get('people').add(data);
	})

	.then(function () {
		return WL.JSONStore.get('people').findAll();
	})

	.then(function (res) {

		deepEqual(res, [{_id: 1, json: {name: 'carlos', age: 20}}, 
		                {_id: 2, json: {name: 'mike', age: 30}}], 'check find all result');

		start();
	})

	.fail(function (err) {
		ok(false, 'Got failure: ' + err.toString());
		start();
	});

});