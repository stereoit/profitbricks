from app import app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

# import sqlite3
# from flask import g

# def get_db():
#     db = getattr(g, '_database', None)
#     if db is None:
#         db = g._database = connect_to_database()
#     return db

# @app.teardown_appcontext
# def teardown_db(exception):
#     db = getattr(g, '_database', None)
#     if db is not None:
#         db.close()

class TestRun(db.Model):
	'''
	Testrun represents sigle test batch
	'''
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=False)
	status = db.Column(db.String(30), unique=False, default='CREATED')
	testrunner_id = db.Column(db.String(150), unique=True)


# ensure all tables exists
db.create_all()
