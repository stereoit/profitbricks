// This module provides store for TestRuns
// It can work with remote and handle view's actions
class TestrunStore  {
	constructor(remoteURL){

		// List of TestRuns
		this.testruns = []

		// api endpoint
		this.remoteURL = remoteURL

		// for observer pattern
		this.subscribers = []

		this.notify = this.notify.bind(this)
		this.fetchTestruns = this.fetchTestruns.bind(this)
		// console.log("TestrunStore initialized")
	}

	subscribe(fn) {
		this.subscribers.push(fn);
	}

	unsubscribe(fn) {
    this.subscribers = this.subscribers.filter( item => {
	    if (item !== fn) {
	        return item;
	    }
    });
   }

  // notify each subscriber about changes to collection
	notify() {
		this.subscribers.forEach( handler => { handler(this.testruns)})
	}

	// loads Testruns from API and notify subscribers
	fetchTestruns() {
		// console.log("fetchTestruns called");
		let store = this
		fetch(this.remoteURL + '/testruns')
			.then( response => {
				response.json().then( json => {
					let testruns = json.objects
					// console.log('getTestruns: ', testruns)
					store.testruns = testruns
					store.notify()
			});
		})
		.catch(function(err) {
			console.log("fetchTestruns error: ", err);
		});
	}

	saveTestrun(testrun) {
		// console.log("saveTestrun: ", testrun);
		let store = this
		  , testruns = this.testruns

		fetch(this.remoteURL + '/testruns', {
			method: 'POST',
			mode: 'cors',
			redirect: 'follow',
			headers: new Headers({'Content-Type': 'application/json'}),
			body: JSON.stringify(testrun)
		}).then( response => {
			response.json().then( testrun => {
				// console.log("Updated, got from server: ", testrun);
				testruns.push(testrun)
				store.notify()
			});
		})
		.catch(function(err) {
			console.log("saveTestruns error: ", err);
		});

	}

	getTestrun(testrunID) {
		return this.testruns.find( testrun => { return testrun.id == testrunID })
	}

}

export default TestrunStore;
