from profitbricks import app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

class TestRun(db.Model):
	'''
	Testrun represents sigle test batch
	'''
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=False)
	status = db.Column(db.String(30), unique=False, default='CREATED')
	testrunner_id = db.Column(db.String(150), unique=True)
	testfiles = db.relationship('TestRunFile', backref='testrun',lazy='dynamic')
	results = db.Column(db.Text, default='')


class TestRunFile(db.Model):
	'''
	TestRunFile has information about actual test file for TestRun
	'''
	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String, unique=True)
	testrun_id = db.Column(db.Integer, db.ForeignKey('test_run.id'))



# ensure all tables exists
db.create_all()
