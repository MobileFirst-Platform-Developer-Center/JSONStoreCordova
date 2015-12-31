/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
 function getPeople() {

 	//Note: In a real application this adapter you would
 	//contact your back-end service to get data

 	//Read the MobileFirst Adapters Getting Started Tutorial for details
 	//and examples regarding contacting a back-end service

 	var data = { peopleList : [{name: 'chevy', age: 23}, {name: 'yoel', age: 23}] };

 	WL.Logger.debug('Adapter: people, procedure: getPeople called.');
 	WL.Logger.debug('Sending data: ' + JSON.stringify(data));

 	return data;
 }

 function pushPeople(data) {

 	//Note: In a real application this adapter you would
 	//contact your back-end service to send this data

 	//Read the MobileFirst Adapters Getting Started Tutorial for details
 	//and examples regarding contacting a back-end service

 	WL.Logger.debug('Adapter: people, procedure: pushPeople called.');
 	WL.Logger.debug('Got data from JSONStore to ADD: ' + data);

 	return;
 }

 function addPerson(data) {

 	//Note: In a real application this adapter you would
 	//contact your back-end service to send this data

 	//Read the MobileFirst Adapters Getting Started Tutorial for details
 	//and examples regarding contacting a back-end service

 	WL.Logger.debug('Adapter: people, procedure: addPerson called.');
 	WL.Logger.debug('Got data from JSONStore to ADD: ' + data);

 	return;
 }

 function removePerson(data) {

 	//Note: In a real application this adapter you would
 	//contact your back-end service to send this data

 	//Read the MobileFirst Adapters Getting Started Tutorial for details
 	//and examples regarding contacting a back-end service

 	WL.Logger.debug('Adapter: people, procedure: removePerson called.');
 	WL.Logger.debug('Got data from JSONStore to REMOVE: ' + data);

 	return;
 }

 function replacePerson(data) {

 	//Note: In a real application this adapter you would
 	//contact your back-end service to send this data

 	//Read the MobileFirst Adapters Getting Started Tutorial for details
 	//and examples regarding contacting a back-end service

 	WL.Logger.debug('Adapter: people, procedure: replacePerson called.');
 	WL.Logger.debug('Got data from JSONStore to REPLACE: ' + data);

 	return;
 }
