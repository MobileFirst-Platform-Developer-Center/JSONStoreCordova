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

asyncTest('Change Password', function () {

	var oldPassword = '123';
	var newPassword = '456';

	var clearPasswords = function () {
		oldPassword = null;
		newPassword = null;
	};

	var username = 'carlos';

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

		// Optional options object.
		var options = {

				// Optional username, default 'jsonstore'.
				username : username,

				// Optional password, default no password.
				password : oldPassword,

				// Optional local key generation flag, default false.
				localKeyGen : false
		};

		//Open the collection
		return WL.JSONStore.init(collections, options);
	})

	.then(function () {
		return WL.JSONStore.changePassword(oldPassword, newPassword, username);
	})

	.then(function (changePasswordReturnCode) {

		clearPasswords();

		deepEqual(changePasswordReturnCode, 0, 'check change password return code');
		start();
	})

	.fail(function (errorObject) {
		// Handle failure.

		clearPasswords();

		ok(false, "Failed with:" + errorObject.toString());
		start();
	});

});
