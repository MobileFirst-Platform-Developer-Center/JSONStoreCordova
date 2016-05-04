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
    name: 'JSONStoreAdapter',
    add: 'addPerson',
    remove: 'removePerson',
    replace: 'replacePerson',
    load: {
        procedure: 'getPeople',
        params: [],
        key: 'peopleList'
    }
};

//****************************************************
// wlCommonInit
//****************************************************
function wlCommonInit(){
    // Bind buttons click/inputs focus events to the appropriate function
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
    
    document.getElementById("loadFromAdapter").addEventListener("click", loadFromAdapter, false); 
    document.getElementById("getDirtyDocs").addEventListener("click", getDirtyDocs, false); 
    document.getElementById("pushToAdapter").addEventListener("click", pushToAdapter, false); 
                        
    document.getElementById("initUsername").addEventListener("focus", showHideConsole, false);
    document.getElementById("initPassword").addEventListener("focus", showHideConsole, false);                 
    document.getElementById("addName").addEventListener("focus", showHideConsole, false);
    document.getElementById("addAge").addEventListener("focus", showHideConsole, false); 
    document.getElementById("findWhat").addEventListener("focus", showHideConsole, false); 
    document.getElementById("docId").addEventListener("focus", showHideConsole, false);
    document.getElementById("newPassword").addEventListener("focus", showHideConsole, false);  
    
    // Get the selected API from the HTML select element and use the displayDiv() function to display the appropriate HTML div
    var obj = document.getElementById("api_select");
    obj.addEventListener("change", function() {
        // Add Document
        if(obj.selectedIndex == 1){
            showHideConsole("hide");
            displayDiv("AddDataDiv");
        }
        // Find Document
        else if(obj.selectedIndex == 2) {
            showHideConsole("show"); 
            displayDiv("FindDocDiv");
        }
        // Replace Document
        else if(obj.selectedIndex == 3) {
            showHideConsole("hide");
            displayDiv("ReplaceDocDiv");
        }
        // Remove Document
        else if(obj.selectedIndex == 4) {
            showHideConsole("show");
            displayDiv("RemoveDocDiv");
        }
        // Count Documents
        else if(obj.selectedIndex == 5) {
            showHideConsole("show");
            countDocs();
        }
        // Adapter Integration
        else if(obj.selectedIndex == 6) {
            showHideConsole("show");
            displayDiv("AdapterIntegrationDiv");
        }
        // File Info
        else if(obj.selectedIndex == 7) {
            showHideConsole("show");
            getFileInfo();
        }
        // Change Password
        else if(obj.selectedIndex == 8) {
            displayDiv("ChangePasswordDiv");
        }        
    });
}

//*********************************************************************
// buildSelectOptions
// - This function builds the options of the API-select-object 
//   of the API-select-object after initialization of the collection
//*********************************************************************
function buildSelectOptions(obj){
    //obj.options[1] = new Option("addData", "Add Data", true, false);
    obj.options[1] = new Option("Add Data");
    obj.options[2] = new Option("Find Document");
    obj.options[3] = new Option("Replace Document");
    obj.options[4] = new Option("Remove Document");
    obj.options[5] = new Option("Count Documents");
    obj.options[6] = new Option("Adapter Integration");
    obj.options[7] = new Option("File Info"); 
    if(options.username != undefined && options.password != undefined){
        obj.options[8] = new Option("Change Password");
    }
       
}

//*********************************************************************
// displayDiv
// - This function shows / hides the divs for the apis that require 
//   additional data. For example: add data requires new name & age
//   for the new document to add. 
//*********************************************************************
function displayDiv(divName){
    var divNames = ["AddDataDiv", "FindDocDiv", "ReplaceDocDiv", "RemoveDocDiv", "AdapterIntegrationDiv", "ChangePasswordDiv"];
    for(i=0; i<divNames.length; i++){
        document.getElementById(divNames[i]).style.display = "none";
    }
    document.getElementById(divName).style.display = "block";
}

//****************************************************
// showHideConsole
// - this function hides / displays the console div
//   and adjust the container div height accordingly
//****************************************************
function showHideConsole(displayStatus){
    if(displayStatus == "show"){              
       document.getElementById("container").style.height = "80%";
       document.getElementById("console").style.height = "20%";
       document.getElementById("console").style.display = "block";  
    }
    else{
       document.getElementById("container").style.height = "100%";
       document.getElementById("console").style.display = "none";
    }
}

//****************************************************
// initCollection
//****************************************************
function initCollection(isSecured){
    if(isSecured == "secured"){
        options.username = document.getElementById("initUsername").value;
        options.password = document.getElementById("initPassword").value;
    }  
     
	WL.JSONStore.init(collections, options).then(function () {
        // build the <select> options + hide the init screen + display the second screen
        buildSelectOptions(document.getElementById("api_select"));
        document.getElementById("initCollection_screen").style.display = "none";
        document.getElementById("apiCommands_screen").style.display = "block";
        
        if(isSecured == "secured") {
            showHideConsole("show");
            document.getElementById("resultsDiv").innerHTML = "Secured Collection Initialized Successfuly<br>User Name: "+ options.username +" | Password: "+ options.password;
            // Clear the username & password fields
            document.getElementById("initUsername").value = "";
            document.getElementById("initPassword").value = "";
        }
        else {
            document.getElementById("resultsDiv").innerHTML = "Collection Initialized Successfuly";
        }
    })
    .fail(function (errorObject) {
        alert("Filed to initialize collection\n"+ JSON.stringify(errorObject));
	});   
}

//****************************************************
// closeCollection
// - Log out from the current collection
//****************************************************
function closeCollection(){
    WL.JSONStore.closeAll().then(function () {
        showHideConsole("show");
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
        showHideConsole("show");
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
        showHideConsole("show");
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
    var options = {};
    data.name = document.getElementById("addName").value;
    data.age = document.getElementById("addAge").value;
    
    try {
        WL.JSONStore.get(collectionName).add(data, options).then(function () {
            showHideConsole("show");
            document.getElementById("resultsDiv").innerHTML = "New Document Added Successfuly<br>Name: "+data.name+" | Age: "+data.age; 
		}).fail(function (errorObject) {
            showHideConsole("show");
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
    showHideConsole("show");
    var id = parseInt(document.getElementById("findWhat").value, 10) || '';

    try {
        WL.JSONStore.get(collectionName).findById(id).then(function (res) {
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
// findByName
//****************************************************
function findByName(){
    showHideConsole("show");
    var name = document.getElementById("findWhat").value || '';
    var query = {};
    query.name = name;
    if(name != ""){
        try {
            WL.JSONStore.get(collectionName).find(query, options).then(function (res) {
            document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
        }).fail(function (errorObject) {
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
    showHideConsole("show");
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
            document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
        }).fail(function (errorObject) {
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
    showHideConsole("show");
    options.limit = 10;

    try {
        WL.JSONStore.get(collectionName).findAll(options).then(function (res) {           
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
   showHideConsole("hide");    
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
// clearAndHideReplaceDiv
//****************************************************
function clearAndHideReplaceDiv(){
    document.getElementById("replaceDocId").value = "";
    document.getElementById("replaceName").value = "";
    document.getElementById("replaceAge").value = "";
    document.getElementById("ReplaceDocDiv").style.display = "none";
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
    
    WL.JSONStore.get(collectionName).replace(doc, options).then(function (numberOfDocumentsReplaced) {
        showHideConsole("show"); 
        document.getElementById("resultsDiv").innerHTML = "Document updated successfuly";
        clearAndHideReplaceDiv();
    })
    .fail(function (errorObject) {
        document.getElementById("resultsDiv").innerHTML = "Failed to update document: " + errorObject.msg
        clearAndHideReplaceDiv();
    });
}

//****************************************************
// removeDoc
//****************************************************
function removeDoc(){
    showHideConsole("show"); 
    var id = parseInt(document.getElementById("docId").value, 10);
    var query = {_id: id};
    var options = {exact: true};
    try {	
	    WL.JSONStore.get(collectionName).remove(query, options).then(function (res) {
            document.getElementById("resultsDiv").innerHTML = "Documents removed: " + JSON.stringify(res)
		}).fail(function (errorObject) {
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
            document.getElementById("resultsDiv").innerHTML = "Number of documents in the collection: " + res;
		}).fail(function (errorObject) {
            document.getElementById("resultsDiv").innerHTML = errorObject.msg;
		});
	} catch (e) {
		alert(e.Messages);
	}
}

//****************************************************
// loadFromAdapter
//****************************************************
function loadFromAdapter(){
    try {	
        WL.JSONStore.get(collectionName).load().then(function (res) {
            document.getElementById("resultsDiv").innerHTML = JSON.stringify(res) + " Documents Loaded From Adapter";
        }).fail(function (errorObject) {
            document.getElementById("resultsDiv").innerHTML = errorObject.msg;
        });	
    } catch (e) {
        alert("Failed to load data from adapter " + e.Messages);
    }
}

//****************************************************
// getDirtyDocs
//****************************************************
function getDirtyDocs(){
    try {	
        WL.JSONStore.get(collectionName).getAllDirty().then(function (res) {
            document.getElementById("resultsDiv").innerHTML = "Dirty Documents:<br>" + JSON.stringify(res);
        }).fail(function (errorObject) {
            alert("Failed to get dirty documents:\n"+ errorObject.msg);
        });
    } catch (e) {
        alert("Failed to get dirty documents");
    }
}

//****************************************************
// pushToAdapter
//****************************************************
function pushToAdapter(){
    alert("pushToAdapter");
    try {
        WL.JSONStore.get(collectionName).push().then(function (res) {
            if(Array.isArray(res) && res.length < 1){
                document.getElementById("resultsDiv").innerHTML = "Documents Pushed Successfuly";
            } else {
                document.getElementById("resultsDiv").innerHTML = "Failed To Push Documents to Adapter: "+ res[0].errorObject;
            }	
        }).fail(function (errorObject) {
            alert(errorObject.msg);
        });
    } catch (e) {
        alert("Failed To Push Documents to Adapter");
    }
}

//****************************************************
// changePassword
//****************************************************
function changePassword(){
    showHideConsole("show");
    var newPassword = document.getElementById("newPassword").value;
    if(newPassword == ""){
        alert("Please enter new password");
    }
    else{
        WL.JSONStore.changePassword(options.password, newPassword, options.username).then(function () {
            document.getElementById("resultsDiv").innerHTML = "Password changed successfuly"
        }).fail(function (errorObject) {
            document.getElementById("resultsDiv").innerHTML = "Failed to change password:\n" + errorObject.msg
        });
    }
}

//****************************************************
// getFileInfo
//****************************************************
function getFileInfo(){
    try {
        WL.JSONStore.fileInfo()
        .then(function (res) {
            document.getElementById("resultsDiv").innerHTML = JSON.stringify(res);
        })
        .fail(function () {
            alert("Failed To Get File Information");
        });
    } catch (e) {
        alert("Failed To Get File Information");
    }
}




