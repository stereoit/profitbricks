import flask_restless as restless
from profitbricks import app
from profitbricks.models import db, TestRun
from profitbricks.testrunner import start_testrunner

# This is actually not used, I have another login in uploads module
def testrunner_post(result=None, **kw):
	'''
	When new Testrun is created ('POST') start_testrunner will
	start Celery task for execute the tests themselves.
	'''
	if result == None:
		return

	task = start_testrunner(testrun)

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
