TestRunner
==========

Platform for running batches of tests.

Project structure
-----------------

    .
    ├── app     		// python backend
    │   ├── api 		// handling of /api/testruns e.g.
	│   └── testrunner  // celery workerks for running tests
    ├── frontend		// frontend sources
    └── README.md


Design
------

In the web console one can:

 - create new Testrun (username, set of tests)
 - view list of Testruns (with statues)
 - view in detail one Testrun (logs)

Backend s written in Flask + SQLAlchemy + Flask-Restless + Celery. When new
Testrun is created, we call Celery defined task (TestRunner) for execting the test.

The TestRunner connects over API to fetch details about the Testrun, set it to RUNNING, then executes the Testrun tests, and stores back the results over API again.

The number of TestRunner workers influences the speed of execution of tests.


Domain
------

Testrun
 - id integer
 - username string
 - status string<CREATED,RUNNING,FAILED,SUCCESS>
 - tests files
 - logs

 

 Web
 ---

 Layout:

     <AppLayout>
       <TopNav />
       <Route {TestrunList} />
       <Route {NewTestrun} />
       <Route {TestrunDetail} />
       <Route {NotFound} />
     </AppLayout>

We use `TestrunStore` which handles connection to remote store and updates it's subscribers. Its subscriber is `AppLayout` which adds props (testrun, testruns, actions) to its children (TestrunDetail, TestrunList,...).

For routing we use React-Router v3. Tooling with babel, npm scripts and webpack. For UI let's try google's material design.

