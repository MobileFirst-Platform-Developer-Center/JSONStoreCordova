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

var Messages = {
    // Add here your messages for the default language.
    // Generate a similar file with a language suffix containing the translated messages.
    // key1 : message1,
};

var wlInitOptions = {
    // Options to initialize with the WL.Client object.
    // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

// Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
function wlCommonInit(){
    (function (WL, jQuery, lodash) {
	
		'use strict';
	
		//Dependencies
		var $ = jQuery,
			_ = lodash;
	
		//CONSTANTS
		var PEOPLE_COLLECTION_NAME = 'people',
			KEY_VALUE_COLLECTION_NAME = 'keyvalue',
			INIT_FIRST_MSG = 'PERSISTENT_STORE_NOT_OPEN',
			NAME_FIELD_EMPTY_MSG = 'Name field is empty',
			AGE_FIELD_EMPTY_MSG = 'Age field is empty',
			ID_FIELD_EMPTY_MSG = 'Id field is empty',
			EMPTY_TABLE_MSG = 'No documents found',
			DESTROY_MSG = 'Destroy finished succesfully',
			INIT_MSG = 'Collection initialized',
			ADD_MSG = 'Data added to the collection',
			REPLACE_MSG = 'Document replaced succesfully, call find.',
			REMOVE_MSG = 'Documents removed: ',
			COUNT_MSG = 'Documents in the collection: ',
			CLOSE_ALL_MSG = 'JSONStore closed',
			REMOVE_COLLECTION_MSG = 'Removed all data in the collection',
			LOAD_MSG = 'New documents loaded from adapter: ',
			PUSH_MSG_FAILED = 'Could not push some docs, res: ',
			PUSH_MSG = 'Push finished',
			PASS_CHANGED_MSG = 'Password changed succesfully',
			COUNT_QUERY_ERROR_MSG = 'FIND_BY_QUERY_EXPECTED_A_STRING',
			COUNT_QUERY_MSG = "Documents in the collection with name = ";
	
		//Log messages to the console and status field
		var logMessage = function (msg, id) {
			//Get reference to the status field
			var status = _.isUndefined(id) ? $('div#console') : $(id);
			
			status.css("color", "#FFF");
	
			//Put message in the status div
			status.text(msg);
	
			//Log message to the console
			WL.Logger.info(msg);
		};
		
		var logErrorMessage = function (msg, id) {
			//Get reference to the status field
			var status = _.isUndefined(id) ? $('div#console') : $(id);
			
			status.css("color", "#F00");
	
			//Put message in the status div
			status.text(msg);
	
			//Log message to the console
			WL.Logger.info(msg);
		};
	
		//Show JSONStore document in a table
		var showResults = function (arr) {
	
			if (_.isArray(arr) && arr.length < 1) {
				return logMessage(EMPTY_TABLE_MSG);
			}
	
			//Log to the console
			WL.Logger.ctx({stringify: true, pretty: true}).info(arr);
	
			//Get reference to the status field
			var status = $('div#console');
	
			//list HTML template
			var template = '<h2>Results</h2>'
				+'<% _.each(people, function(person) { %>'
					+'<div><%= JSON.stringify(person, null, 2) %></div>'
				+'<% }); %>';
	
			status.css("color", "#FFF");

			//Put the generated HTML table into the DOM
			status.html(_.template(template, {people : arr}));
		};
	
		//Scroll to the top every time a button is clicked
		$('button').on('click', function () {
			$('html, body').animate({scrollTop: 0}, 'slow');
		});
	
		//init
		$('button#init').on('click', function () {
	
			//Get references to the input fields DOM elements
			var usernameField = $('input#init-username'),
				passwordField = $('input#init-password');
	
			//Get values from the input fields
			var	username = usernameField.val() || '',
				password = passwordField.val() || '';
	
			//Create the optional options object passed to init
			var options = {};
	
			//Check if a username was passed
			if (username.length > 0) {
				options.username = username;
			}
	
			//If if a password was passed
			if (password.length > 0) {
				options.password = password;
			}
	
			//JSONStore collections metadata
			var collections = {};
	
			//Define the 'people' collection and list the search fields
			collections[PEOPLE_COLLECTION_NAME] = {
	
				searchFields : {name: 'string', age: 'integer'},
	
				//-- Start optional adapter metadata
				adapter : {
					name: 'People',
					add: 'addPerson',
					remove: 'removePerson',
					replace: 'replacePerson',
					load: {
						procedure: 'getPeople',
						params: [],
						key: 'peopleList'
					}
				}
				//-- End optional adapter metadata
			};
	
			//Define the 'keyvalue' collection and use additional search fields
			collections[KEY_VALUE_COLLECTION_NAME] = {
				searchFields : {},
				additionalSearchFields : { key: 'string' }
			};
	
			//Initialize the people collection
			WL.JSONStore.init(collections, options).then(function () {
				logMessage(INIT_MSG);
				_callEnhanceToAddKeyValueMethods();
			}).fail(function (errorObject) {
				logErrorMessage(errorObject.msg);
			});
		});
	
		//destroy
		$('button#destroy').on('click', function () {
	
			//Destroy removes all documents, all collections, all stores
			//and every piece of JSONStore metadata
			WL.JSONStore.destroy().then(function () {
				logMessage(DESTROY_MSG);
			}).fail(function (errorObject) {
				logErrorMessage(errorObject.msg);
			});
		});
	
		//add
		$('button#add-data').on('click', function () {
	
			//Get references to the input fields DOM elements
			var nameField = $('input#add-name'),
				ageField = $('input#add-age');
	
			//Get values from the input fields
			var	name = nameField.val() || '',
				age = parseInt(ageField.val(), 10) || '';
	
			//Prepare the data object
			var data = {};
	
			//Check if a name was passed
			if (name.length > 0) {
				data.name = name;
			}
	
			//Check if an age was passed
			if(_.isNumber(age)) {
				data.age = age;
			}
	
			try {
	
				//Call add on the JSONStore collection
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).add(data).then(function () {
					logMessage(ADD_MSG);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
				//Clear the input fields
				nameField.val('');
				ageField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
	
		});
	
		//find-name
		$('button#find-name').on('click', function () {
	
			//Get reference to the search field
			var searchFieldDOM = $('input#find-search'),
				limitField = $('input#find-limit'),
				offsetField =$('input#find-offset');
	
			//Get value from the search field
			var searchField = searchFieldDOM.val() || '',
				limit = parseInt(limitField.val(), 10) || '',
				offset = parseInt(offsetField.val(), 10) || '';
	
			//Create the query object
			var query = {};
	
			//Check if a name was passed
			if (searchField.length > 0) {
				query.name = searchField;
			}
	
			//Check if some value was passed
			if (_.isEmpty(query)) {
				return logErrorMessage(NAME_FIELD_EMPTY_MSG);
			}
	
			//Create optional options object
			var options = {};
	
			//Check if limit was passed
			if (_.isNumber(limit)) {
				options.limit = limit;
			}
	
			//Check if offset was passed
			if (_.isNumber(offset)) {
				options.offset = offset;
			}
	
			try {
	
				//Perform the search
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).find(query, options).then (function (res) {
					showResults(res);
				}).fail (function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
				//Clear the input fields
				searchFieldDOM.val('');
				limitField.val('');
				offsetField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//find-age
		$('button#find-age').on('click', function () {
	
			//Get reference to the search field
			var searchFieldDOM = $('input#find-search'),
				limitField = $('input#find-limit'),
				offsetField =$('input#find-offset');
	
			//Get value from the search field
			var searchField = searchFieldDOM.val() || '',
				limit = parseInt(limitField.val(), 10) || '',
				offset = parseInt(offsetField.val(), 10) || '';
	
			//Create the query object
			var query = {};
	
			//Check if a name was passed
			if (searchField.length > 0) {
				query.age = searchField;
			}
	
			//Check if some value was passed
			if (_.isEmpty(query)) {
				return logErrorMessage(AGE_FIELD_EMPTY_MSG);
			}
	
			//Optional options object to do exact match
			var options = {exact: true};
	
			//Check if limit was passed
			if (_.isNumber(limit)) {
				options.limit = limit;
			}
	
			//Check if offset was passed
			if (_.isNumber(offset)) {
				options.offset = offset;
			}
	
			try {
	
				//Perform the search
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).find(query, options).then (function (res) {
					showResults(res);
				}).fail (function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
				//Clear the input fields
				searchFieldDOM.val('');
				limitField.val('');
				offsetField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//find-all
		$('button#find-all').on('click', function () {
	
			//Get reference to the search field
			var limitField = $('input#find-limit'),
				offsetField =$('input#find-offset');
	
			//Get value from the search field
			var limit = parseInt(limitField.val(), 10) || '',
				offset = parseInt(offsetField.val(), 10) || '';
	
			//Create optional options object
			var options = {};
	
			//Check if limit was passed
			if (_.isNumber(limit)) {
				options.limit = limit;
			}
	
			//Check if offset was passed
			if (_.isNumber(offset)) {
				options.offset = offset;
			}
	
			try {
	
				//Alternative syntax:
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).findAll(options).then(function (res) {
					showResults(res);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
	
				});
	
				//Clear the input fields
				limitField.val('');
				offsetField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//find-by-id
		$('button#find-id-btn').on('click', function () {
	
			//Get reference to the id field
			var idField = $('input#find-id');
	
			//Get value from the search field
			var id = parseInt(idField.val(), 10) || '';
	
			//Check if an id was passed
			if (!_.isNumber(id)) {
				return logErrorMessage(ID_FIELD_EMPTY_MSG);
			}
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).findById(id).then(function (res) {
					showResults(res);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
				//Clear the input fields
				idField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//replace
		$('button#replace').on('click', function () {
	
			//Get references to the input fields DOM elements
			var nameField = $('input#replace-name'),
				ageField = $('input#replace-age'),
				idField = $('input#replace-id');
	
			//Get values from the input fields
			var	name = nameField.val() || '',
				age = parseInt(ageField.val(), 10) || '',
				id = parseInt(idField.val(), 10) || '';
	
			//Check if an id was passed
			if (!_.isNumber(id)) {
				return logErrorMessage(ID_FIELD_EMPTY_MSG);
			}
	
			//Create the document object
			var doc = {
				_id : id,
				json : {}
			};
	
			//Check if a name was passed
			if (name.length > 0) {
				doc.json.name = name;
			}
	
			//Check if an age was passed
			if (_.isNumber(age)) {
				doc.json.age = age;
			}
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).replace(doc).then(function () {
					logMessage(REPLACE_MSG);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
				//Clear the input fields
				nameField.val('');
				ageField.val('');
				idField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//remove
		$('button#remove-id-btn').on('click', function () {
	
			//Get reference to the id field
			var idField = $('input#remove-id');
	
			//Get value from the search field
			var id = parseInt(idField.val(), 10) || '';
	
			//Check if an id was passed
			if (!_.isNumber(id)) {
				return logErrorMessage(ID_FIELD_EMPTY_MSG);
			}
	
			//Build the query object
			var query = {_id: id};
	
			//Build the options object, if exact: true
			//is not passed fuzzy searching is enabled
			//that means id: 1 will match 1, 10, 100, ...
			var options = {exact: true};
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).remove(query, options).then(function (res) {
					logMessage(REMOVE_MSG + res);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
				//Clear the input fields
				idField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//count
		$('button#count').on('click', function () {
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).count().then(function (res) {
					logMessage(COUNT_MSG + res);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
		
		//count-with-query
		$('button#count-query-btn').on('click', function () {
			
			//Get reference to the count query field
			var countQueryField = $('input#count-query');
	
			//Get value from the search field
			var queryStr = countQueryField.val() || '';
	
			//Check if an string was passed
			if (!_.isString(queryStr)) {
				return logErrorMessage(COUNT_QUERY_ERROR_MSG);
			}
	
			//Build the query object
			var query = {name: queryStr};
			var options = {exact: true};		
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).count(query, options).then(function (res) {
					logMessage(COUNT_QUERY_MSG + queryStr + ": " + res);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
				
				//Clear fields
				countQueryField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//closeAll
		$('button#close').on('click', function () {
	
			WL.JSONStore.closeAll().then(function () {
				logMessage(CLOSE_ALL_MSG);
			}).fail(function (errorObject) {
				logErrorMessage(errorObject.msg);
			});
		});
	
		//removeCollection
		$('button#remove-collection').on('click', function () {
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).removeCollection().then(function () {
					logMessage(REMOVE_COLLECTION_MSG);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//load
		$('button#load').on('click', function () {
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).load().then(function (res) {
					logMessage(LOAD_MSG + res);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
	
		});
	
		//getAllDirty
		$('button#get-push-required').on('click', function () {
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).getAllDirty().then(function (res) {
					showResults(res);
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
	
		});
	
		//push
		$('button#push').on('click', function () {
	
			try {
	
				WL.JSONStore.get(PEOPLE_COLLECTION_NAME).push().then(function (res) {
	
					if (_.isArray(res) && res.length < 1) {
						//Got no errors pushing the adapter to the server
						logMessage(PUSH_MSG);
					} else {
						//The array contains error responses from the adapter
						logErrorMessage(PUSH_MSG_FAILED + _.first(res).res.errorCode);
					}
	
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		//changePassword
		$('button#change-password').on('click', function () {
	
			//Get references to the input fields DOM elements
			var oldPasswordField = $('input#old-password'),
				newPasswordField = $('input#new-password'),
				userField = $('input#current-username');
	
			//Get values from input fields
			var oldPassword = oldPasswordField.val() || '',
				newPassword = newPasswordField.val() || '',
				user = userField.val() || '';
	
			//If no user was passed let JSONStore use the default user
			if (user.length < 1) {
				user = null;
			}
	
			WL.JSONStore.changePassword(oldPassword, newPassword, user).then(function () {
				logMessage(PASS_CHANGED_MSG);
			}).fail(function (errorObject) {
				logErrorMessage(errorObject.msg);
			});
		});
	
		//Called after WL.JSONStore.init
		var _callEnhanceToAddKeyValueMethods = function () {
	
			//Adds a put method to the keyvalue collection
			//this method takes a key and a value and stores it
			WL.JSONStore.get(KEY_VALUE_COLLECTION_NAME).enhance('put', function (key, value) {
				var deferred = $.Deferred(),
					collection = this;
	
				//To make sure no duplicates exist call remove first
				collection.remove({key: key}).then(function () {
					//add the value to the keyvalue collection
					return collection.add({key: value}, {additionalSearchFields: {key: key}});
				}).then(deferred.resolve, deferred.reject);
	
				return deferred.promise();
			});
	
			//Add a getValue method to the keyvalue collection
			//this method takes a key and returns the value (a document)
			WL.JSONStore.get(KEY_VALUE_COLLECTION_NAME).enhance('getValue', function (key) {
				var deferred = $.Deferred(),
					collection = this;
	
				//Do an exact search for the key
				collection.find({key: key}, {exact: true, limit: 1}).then(deferred.resolve, deferred.reject);
	
				return deferred.promise();
			});
		};
	
		$('button#add-key-value-pair').on('click', function () {
	
			//Get references
			var keyField = $('input#enter-key'),
				valueField =  $('input#enter-value');
	
			//Get values
			var key = keyField.val() || '',
				value = valueField.val() || '';
	
			//Check if the key value pair was passed
			if (key.length < 1 || value.length < 1) {
				return logErrorMessage('Provide a key and a value');
			}
	
			try {
	
				//Put the key value pair inside the collection
				WL.JSONStore.get(KEY_VALUE_COLLECTION_NAME).put(key, value).then(function () {
					logMessage('Done adding a new key value pair');
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
				//clear fields
				keyField.val('');
				valueField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
		$('button#find-value-with-key').on('click', function () {
	
			//Get references
			var keyField = $('input#search-by-key');
	
			//Get values
			var key = keyField.val() || '';
	
			//Check if the key was passed
			if (key.length < 1) {
				return logErrorMessage('Provide a key');
			}
	
			try {
	
				//Put the key value pair inside the collection
				WL.JSONStore.get(KEY_VALUE_COLLECTION_NAME).getValue(key).then(function (res) {
					try {
						logMessage('Found: ' + _.first(res).json.key);
					} catch(e) {
						logErrorMessage('No results found');
					}
				}).fail(function (errorObject) {
					logErrorMessage(errorObject.msg);
				});
	
				//clear fields
				keyField.val('');
	
			} catch (e) {
				logErrorMessage(INIT_FIRST_MSG);
			}
		});
	
	} (WL, WLJQ, WL_));
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, 'app.receivedEvent(...);' must be explicitly called.
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update the DOM on a received event.
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
