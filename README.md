TestRunner
==========

Platform for running batches of tests.

Project structure
-----------------

    .
    ├── app     		    # python backend
    │   ├── api 	    	# handling of /api/testruns e.g.
    │   └── testrunner  # celery workerks for running tests
    ├── frontend		    # frontend sources
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

Notes
-----

Running celery tasks

    $ env PYTHONPATH=/home/rsmol/Code/git/profitbricks celery -A app.testrunner.celery  worker --loglevel=info

Testrun CRUD with curl

    $ curl -H "Content-Type: application/json" -X POST --data '{"username":"Steve" }' localhost:5000/api/testrun -i

    $ curl localhost:5000/api/testrun
    {
      "num_results": 1,
      "objects": [
        {
          "id": 1,
          "status": "CREATED",
          "username": "Steve"
        }
      ],
      "page": 1,
      "total_pages": 1
    }

    $ curl localhost:5000/api/testrun/1
    {
      "id": 1,
      "status": "CREATED",
      "username": "Steve"
    }

    $ curl -X DELETE localhost:5000/api/testrun/1 -i
    HTTP/1.0 204 NO CONTENT


Installation
------------

 Install libcurl-dev headers:

    $ sudo dnf install redhat-rpm-config libcurl-devel #on Fedora
    $ sudo apt-get install libcurl4-openssl-dev # on Debian

 Install python requirements

    $ mkvirtualenv --python=/usr/bin/python3 profitbricks
    $ workon profitbricks
    $ pip install -r profitbricks/requirements.txt

 Compile binary application.js

    $ npm install -g yarn
    $ yarn install
    $ npm run build

Running
-------

  Start docker composed images (rabbitmq and redis)

    $ docker-compose up

  In another window start celery background tasks

    $ celery -A profitbricks.testrunner.celery  worker --loglevel=info

  Start webapplication

    $ python -m profitbricks.server runserver

  Go to http://localhost:8080
