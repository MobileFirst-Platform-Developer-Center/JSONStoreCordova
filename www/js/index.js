/**
* Copyright 2016 IBM Corp.
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

var Messages = {};
var wlInitOptions = {};

//****************************************************
// JSONStore collection(s) setup
//****************************************************
var collectionName = 'people';
var collections = {};
var options = {};
collections[collectionName] = {};
collections[collectionName].searchFields = {name: 'string', age: 'integer'};
collections[collectionName].adapter = {
   name: 'people',
   add: 'addPerson',
   remove: 'removePerson',
   replace: 'replacePerson',
   load: {
       procedure: 'getPeople',
           params: [],
           key: 'peopleList'
       },
   accept: function (adapterResponse) {
       return (adapterResponse.status === 200);
   },
   timeout: 3000
};

//****************************************************
// wlCommonInit
//****************************************************
function wlCommonInit(){
    document.getElementById("initCollection").addEventListener("click", initCollection, false);
    document.getElementById("initSecuredCollection").addEventListener("click", initSecuredCollection, false);
    document.getElementById("submitNewDocumentData").addEventListener("click", addData, false);
    
    // Retrieve the requested API and calls the appropriate function
    var obj = document.getElementById("api_select");
    obj.addEventListener("change", function(){
        if(obj.selectedIndex == 1){ displayDiv("AddDataDiv", "block"); }
        else if(obj.selectedIndex == 2){ displayDiv("FindDocDiv", "block"); }
    });
}

//*********************************************************************
// buildSelectOptions
// - This function builds the options of the API-select-object 
//   of the API-select-object after initialization of the collection
//*********************************************************************
function buildSelectOptions(obj){
    obj.options[1] = new Option("addData", "Add Data", true, false);
    obj.options[2] = new Option("findDoc", "Find Document", true, false);
    obj.options[3] = new Option("replaceDoc", "Replace Document", true, false);
    obj.options[4] = new Option("removeDoc", "Remove Document", true, false);
    obj.options[4] = new Option("countDocs", "Count Documents", true, false);
    obj.options[4] = new Option("fileInfo", "File Info", true, false);
}

//*********************************************************************
// displayDiv
// - This function shows / hides the divs for the apis that require 
//   additional data. For example: add data requires new name & age
//   for the new document to add. 
//*********************************************************************
function displayDiv(divName, displayStatus){
   document.getElementById(divName).style.display = displayStatus;
}

//****************************************************
// initCollection
//****************************************************
function initCollection(){   
	WL.JSONStore.init(collections, options)
      .then(function () {
            buildSelectOptions(document.getElementById("api_select"));
            document.getElementById("initCollection_screen").style.display = "none";
            document.getElementById("apiCommands_screen").style.display = "block";
	    })
        .fail(function (errorObject) {
		    alert("collection creation failure: "+ JSON.stringify(errorObject));
	});   
} 

//****************************************************
// initSecuredCollection
//****************************************************
function initSecuredCollection(){
    options.username = document.getElementById("initUsername").value;
    options.password = document.getElementById("initPassword").value;
    
    WL.JSONStore.init(collections, options)
      .then(function () {
	        alert("secured collection initialized\nUser Name: "+ document.getElementById("initUsername").value +"\nPassword: "+ document.getElementById("initPassword").value);
            document.getElementById("initCollection_screen").style.display = "none";
            document.getElementById("apiCommands_screen").style.display = "block";
	    })
        .fail(function (errorObject) {
		    alert("collection creation failure: "+ JSON.stringify(errorObject));
	});
}

//****************************************************
// addData (Add Document)
//****************************************************
function addData(){
    //alert("addData called");
    var data = {};
    data.name = document.getElementById("addName").value;
    data.age = document.getElementById("addAge").value;
    
    try {
        WL.JSONStore.get("people").add(data).then(function () {
            document.getElementById("resultsDiv").innerHTML = "New Document Added Successfuly<br>Name: "+data.name+" | Age: "+data.age; 
		}).fail(function (errorObject) {
            document.getElementById("resultsDiv").innerHTML = "Failed to Add Data";
		}); 
    }
    catch(e){
        alert("WL.JSONStore Add Data Failure");  
    }
    displayDiv("AddDataDiv", "none");
}

//****************************************************
// findDoc (Find Document)
//****************************************************
function findDoc(){
    alert("findDoc");
}
