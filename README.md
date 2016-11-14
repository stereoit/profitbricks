TestRunner
==========

Platform for running batches of tests. Please se Notes for more information.


Installation
------------

 Clone repository

    $ git clone git@github.com:stereoit/profitbricks.git

 Install python requirements

    $ mkvirtualenv --python=/usr/bin/python3 profitbricks
    $ cd profitbricks
    $ workon profitbricks
    $ export PYTHONPATH=`pwd`
    $ pip install -r profitbricks/requirements.txt

 Compile binary application.js

    $ sudo npm install -g yarn
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



Project structure
-----------------

.
├── dist  # compiled frontend part
├── frontend  # fronted app sources
├── profitbricks  # python application
├── sample_test_files #two sample pytest files, one failes another success
├── uploads  # folder for uploads
├── package.json
├── README.md
├── docker-compose.yml
├── webpack.config.js
└── yarn.lock



Design
------

In the web console one can:

- view list of Testruns (with statuses)
 - create new Testrun (username, set of tests)
 - view in detail one Testrun (logs)


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

So, thank you for sharing this task with me. It was actually way harder than I anticipated.

Initially I've done some paper work on how to design this and came to conclusion I either do not understand the test environment or it is too complicated. So I decided to use some distributed queue to resolve this. The good part here is one can scale this up just by starting more workers (even on distributed machines). At the beginning I've tried to design loosely coupled system as much as possible.

During coding I ran into problem with failing to upload files over REST, so I had to refactor quite a bit to used regular POST form via AJAX.

Backend s written in Flask + SQLAlchemy + Flask-Restless + Celery. When new
Testrun is created, we call Celery defined task (TestRunner) for execting the test.

The TestRunner connects over API to fetch details about the Testrun, set it to RUNNING, then executes the Testrun tests, and stores back the results over API again.

The code really reflects my current status. No tests for my app, probably not the cleanest code (but it works and time is up). I would love to improve in this area. I've basically plumbered the components I know about together for a solution. I would need much more time to have something polished and production ready.
