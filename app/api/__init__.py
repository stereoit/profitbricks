import flask_restless as restless
from app import app
from models import db, TestRun
from app.testrunner import test_runner

def start_testrunner(result=None, **kw):
	'''
	When new Testrun is created ('POST') start_testrunner will
	start Celery task for execute the tests themselves.
	'''
	testrun = TestRun.query.get(result['id'])
	if testrun is None:
		return #something happened, we do not have object in db

	#let's add 20 seconds delay to simulate some load
	task = test_runner.apply_async(args=[result["id"]], countdown=20)

	# store back to DB the session task
	testrun.testrunner_id = task.id
	db.session.add(testrun)
	db.session.commit()

	#patch result to include information about task
	result["testrunner_id"] = task.id


postprocessors = {'POST': [start_testrunner]}

# create the restless route
api_manager = restless.APIManager(app, flask_sqlalchemy_db=db)
api_manager.create_api(
	TestRun,
	collection_name="testruns",
	methods=['GET','POST','DELETE', 'UPDATE'],
	postprocessors=postprocessors,
)
