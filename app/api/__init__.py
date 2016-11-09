import flask.ext.restless
from __main__ import app
from models import db, TestRun


api_manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

api_manager.create_api(
	TestRun,
	collection_name="testrun",
	methods=['GET','POST','DELETE', 'UPDATE'],
)
