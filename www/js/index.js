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
    // Bind buttons clicks to the appropriate function
    document.getElementById("initCollection").addEventListener("click", initCollection, false);
    document.getElementById("initSecuredCollection").addEventListener("click", function(){ initCollection("secured"); }, false);
    
    document.getElementById("closeCollectionButton").addEventListener("click", closeCollection, false);
    document.getElementById("removeCollectionButton").addEventListener("click", removeCollection, false);
    document.getElementById("destroyAllCollectionsButton").addEventListener("click", destroy, false);
        
    document.getElementById("findById").addEventListener("click", findById, false);
    document.getElementById("findByName").addEventListener("click", findByName, false);
    document.getElementById("findByAge").addEventListener("click", findByAge, false);
    document.getElementById("findAll").addEventListener("click", findAll, false);
    
    document.getElementById("showDocToReplace").addEventListener("click", replaceShowDoc, false);
    document.getElementById("submitReplacedDoc").addEventListener("click", replaceDoc, false);
        
    document.getElementById("submitNewDocumentData").addEventListener("click", addData, false);
    document.getElementById("removeDoc").addEventListener("click", removeDoc, false);
    document.getElementById("submitNewPassword").addEventListener("click", changePassword, false);       
    
    // Get the selected API from the HTML select element and use the displayDiv() function to display the appropriate HTML div
    var obj = document.getElementById("api_select");
    obj.addEventListener("change", function() {
        // Add Document
        if(obj.selectedIndex == 1){
          displayDiv("AddDataDiv");
          obj.selectedIndex = 0;
        }
        // Find Document
        else if(obj.selectedIndex == 2) {
          displayDiv("FindDocDiv");
          obj.selectedIndex = 0;
        }
        // Replace Document
        else if(obj.selectedIndex == 3) {
          displayDiv("ReplaceDocDiv");
          obj.selectedIndex = 0;
        }
        // Remove Document
        else if(obj.selectedIndex == 4) {
          displayDiv("RemoveDocDiv");
          obj.selectedIndex = 0;
        }
        // Count Documents
        else if(obj.selectedIndex == 5) {
             countDocs();
             obj.selectedIndex = 0;
        }
        // Change Password
        else if(obj.selectedIndex == 6) {
            displayDiv("ChangePasswordDiv");
            obj.selectedIndex = 0;
        }
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
    obj.options[5] = new Option("countDocs", "Count Documents", true, false);
    if(options.username != undefined && options.password != undefined){
        obj.options[6] = new Option("changePassword", "Change Password", true, false);
    }    
}

//*********************************************************************
// displayDiv
// - This function shows / hides the divs for the apis that require 
//   additional data. For example: add data requires new name & age
//   for the new document to add. 
//*********************************************************************
function displayDiv(divName){
   var divNames = ["AddDataDiv", "FindDocDiv", "ReplaceDocDiv", "RemoveDocDiv", "ChangePasswordDiv"];
   for(i=0; i<divNames.length; i++){
       document.getElementById(divNames[i]).style.display = "none";
   }
   document.getElementById(divName).style.display = "block";
}

//****************************************************
// initCollection
//****************************************************
function initCollection(isSecured){
    if(isSecured == "secured"){
        options.username = document.getElementById("initUsername").value;
        options.password = document.getElementById("initPassword").value;
    }  
     
	WL.JSONStore.init(collections, options)
      .then(function () {
            buildSelectOptions(document.getElementById("api_select"));
            document.getElementById("initCollection_screen").style.display = "none";
            document.getElementById("apiCommands_screen").style.display = "block";
            if(isSecured == "secured") {
                document.getElementById("resultsDiv").innerHTML = "Secured Collection Initialized Successfuly<br>User Name: "
                                                                    + options.username +" | Password: "+ options.password;
            }
            else {
                document.getElementById("resultsDiv").innerHTML = "Collection Initialized Successfuly";
            }
	    })
        .fail(function (errorObject) {
		    //alert("collection creation failure: "+ JSON.stringify(errorObject));
            document.getElementById("resultsDiv").innerHTML = JSON.stringify(errorObject);
	});   
}

//****************************************************
// closeCollection
// - Log out from the current collection
//****************************************************
function closeCollection(){
    WL.JSONStore.closeAll().then(function () {
         document.getElementById("apiCommands_screen").style.display = "none";
         document.getElementById("initCollection_screen").style.display = "block";
         document.getElementById("resultsDiv").innerHTML = "Collection Closed Successfuly";      		
	}).fail(function (errorObject) {
		alert("Failed to Close collection!");
	});
}

//****************************************************
// removeCollection
// - Deletes all the collection's documents 
//****************************************************
function removeCollection(){
    WL.JSONStore.get(collectionName).removeCollection().then(function () {
         document.getElementById("apiCommands_screen").style.display = "none";
         document.getElementById("initCollection_screen").style.display = "block";
         document.getElementById("resultsDiv").innerHTML = "Collection Removed Successfuly";      		
	}).fail(function (errorObject) {
		alert("Failed to Remove collection!");
	});
}

//****************************************************
// destroy
// - Completely wipes data for all users
//****************************************************
function destroy(){
    WL.JSONStore.destroy().then(function () {
		alert("Collection Destroyed Successfuly!");
         document.getElementById("apiCommands_screen").style.display = "none";
        document.getElementById("initCollection_screen").style.display = "block"; 
        document.getElementById("resultsDiv").innerHTML = "Collection Destroyed Successfuly";     		
	}).fail(function (errorObject) {
		alert("Failed to Destroy collection!");
	});
}

//****************************************************
// addData (Add Document)
//****************************************************
function addData(){
    var data = {};
    data.name = document.getElementById("addName").value;
    data.age = document.getElementById("addAge").value;
    
    try {
        WL.JSONStore.get(collectionName).add(data).then(function () {
            document.getElementById("resultsDiv").innerHTML = "New Document Added Successfuly<br>Name: "+data.name+" | Age: "+data.age; 
		}).fail(function (errorObject) {
            document.getElementById("resultsDiv").innerHTML = "Failed to Add Data";
		}); 
    }
    catch(e){
        alert("WL.JSONStore Add Data Failure");  
    }
    document.getElementById("addName").value = "";
    document.getElementById("addAge").value = "";
}

//****************************************************
// findById
//****************************************************
function findById(){
    var id = parseInt(document.getElementById("findWhat").value, 10) || '';

    try {
        WL.JSONStore.get(collectionName).findById(id).then(function (res) {
	        //alert(JSON.stringify(res));
            document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
		}).fail(function (errorObject) {
            //alert(errorObject.msg);
            document.getElementById("resultsDiv").innerHTML = errorObject.msg;
		});
	} catch (e) {
		alert(e.Messages);
	}
  document.getElementById("findWhat").value = "";
}

//****************************************************
// findByName
//****************************************************
function findByName(){
    var name = document.getElementById("findWhat").value || '';
    var query = {};
    query.name = name;
    if(name != ""){
       try {
        WL.JSONStore.get(collectionName).find(query, options).then(function (res) {
            //alert(JSON.stringify(res));
            document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
        }).fail(function (errorObject) {
            //alert(errorObject.msg);
             document.getElementById("resultsDiv").innerHTML = errorObject.msg;
        });
        } catch (e) {
            alert(e.Messages);
        } 
    }
    else {
        alert("Please enter a name to find");
    }
    
  document.getElementById("findWhat").value = "";
}

//****************************************************
// findByAge
//****************************************************
function findByAge(){
    var age = document.getElementById("findWhat").value || '';
    if(age == "" || isNaN(age)){
        alert("Please enter a valid age to find"); 
    }
    else {
       query = {age: parseInt(age, 10)};
       var options = {
           exact: true,
           limit: 10 //returns a maximum of 10 documents
        }; 

       try {       
        WL.JSONStore.get(collectionName).find(query, options).then(function (res) {
            //alert(JSON.stringify(res));
            document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
        }).fail(function (errorObject) {
            //alert(errorObject.msg);
            document.getElementById("resultsDiv").innerHTML = errorObject.msg;
        });
        } catch (e) {
            alert(e.Messages);
        } 
    }
    
  document.getElementById("findWhat").value = "";
}

//****************************************************
// findAll
//****************************************************
function findAll(){
    options.limit = 10;

    try {
        WL.JSONStore.get(collectionName).findAll(options).then(function (res) {
	        //alert(JSON.stringify(res));
            
          document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
		}).fail(function (errorObject) {
          document.getElementById("resultsDiv").innerHTML = errorObject.msg;
		});
	} catch (e) {
		alert(e.Messages);
	}
  document.getElementById("findWhat").value = "";
}

//****************************************************
// replaceShowDoc
//****************************************************
function replaceShowDoc(){
   var id = parseInt(document.getElementById("replaceDocId").value, 10);
   document.getElementById("DocToReplaceDiv").style.display = "block";
   try {
        WL.JSONStore.get(collectionName).findById(id).then(function (res) {
            document.getElementById("replaceName").value = res[0].json.name;
            document.getElementById("replaceAge").value = res[0].json.age;
        }).fail(function (errorObject) {
            alert(errorObject.msg);
        });
        } catch (e) {
            alert(e.Messages);
        }
}

//****************************************************
// replaceDoc
//****************************************************
function replaceDoc(){
    var doc_id = parseInt(document.getElementById("replaceDocId").value, 10);
    var doc_name = document.getElementById("replaceName").value;
    var doc_age = document.getElementById("replaceAge").value;
    var doc = {_id: doc_id, json: {name: doc_name, age: doc_age}};
    
    var options = {
        push: true
    }
    
    WL.JSONStore.get(collectionName).replace(doc, options)
    .then(function (numberOfDocumentsReplaced) {
        //alert("Document updated successfuly");
        document.getElementById("resultsDiv").innerHTML = "Document updated successfuly";
        document.getElementById("DocToReplaceDiv").style.display = "none";
    })
    .fail(function (errorObject) {
        //alert("Failed to update document: " + errorObject.msg);
        document.getElementById("resultsDiv").innerHTML = "Failed to update document: " + errorObject.msg
    });
}

//****************************************************
// removeDoc
//****************************************************
function removeDoc(){
    var id = parseInt(document.getElementById("docId").value, 10);
    var query = {_id: id};
    var options = {exact: true};
    try {	
	    WL.JSONStore.get(collectionName).remove(query, options).then(function (res) {
		    //alert("Documents removed: " + JSON.stringify(res));
            document.getElementById("resultsDiv").innerHTML = "Documents removed: " + JSON.stringify(res)
		}).fail(function (errorObject) {
			//logErrorMessage(errorObject.msg);
            document.getElementById("resultsDiv").innerHTML = errorObject.msg
		});
    } catch (e) {
		alert(e.Messages);
	}
    document.getElementById("docId").value = "";
}

//****************************************************
// countDocs
//****************************************************
function countDocs(){
    try {	
				WL.JSONStore.get(collectionName).count().then(function (res) {
					//alert("Number of documents in the collection: " + res);
                    document.getElementById("resultsDiv").innerHTML = "Number of documents in the collection: " + res;
				}).fail(function (errorObject) {
					//alert(errorObject.msg);
                    document.getElementById("resultsDiv").innerHTML = errorObject.msg;
				});
	
			} catch (e) {
				alert(e.Messages);
			}
}

//****************************************************
// changePassword
//****************************************************
function changePassword(){
    var newPassword = document.getElementById("newPassword").value;
    if(newPassword == ""){
        alert("Please enter new password");
    }
    else{
        WL.JSONStore.changePassword(options.password, newPassword, options.username).then(function () {
            //alert("Password changed successfuly");
            document.getElementById("resultsDiv").innerHTML = "Password changed successfuly"
        }).fail(function (errorObject) {
            //alert("Failed to change password:\n" + errorObject.msg);
            document.getElementById("resultsDiv").innerHTML = "Failed to change password:\n" + errorObject.msg
        });
    }
}



