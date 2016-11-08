from flask import Flask, jsonify, abort, request
from flask_script import Manager


app = Flask(__name__)
app.config.from_pyfile('config.py')

# initialize models
from models import db

# register API endpoints
from api import api_manager

manager = Manager(app)

if __name__ == '__main__':
	manager.run()
