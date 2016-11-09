import flask_restless as restless
from app import app
from models import db, TestRun
from app.testrunner import test_runner

api_manager = restless.APIManager(app, flask_sqlalchemy_db=db)



#https://flask-restless.readthedocs.io/en/stable/customizing.html#request-preprocessors-and-postprocessor
# I need to add POST postprocessor to handle:
# creating new celery task
# updating again the model with the async job ID
# task = my_background_task.apply_async(args=[10, 20], countdown=60)

# one can get task id
#return jsonify({}), 202, {'Location': url_for('taskstatus',
#                                                  task_id=task.id)}
def custom_postprocessor(result=None, **kw):
	#let's add 60 seconds delay to simulate some load
	task = test_runner.apply_async(args=[result["id"]], countdown=60)
	print("postprocessor called", result, " task.id=",task.id)
	#TODO store it on DB
	#patch result to include information about task
	result["task_id"] = task.id

postprocessors = {'POST': [custom_postprocessor]}

api_manager.create_api(
	TestRun,
	collection_name="testrun",
	methods=['GET','POST','DELETE', 'UPDATE'],
	postprocessors=postprocessors,
)
